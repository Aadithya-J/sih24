from flask import Flask, request, jsonify
import google.generativeai as genai
import os
import PyPDF2 as pdf
import json
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure the Gemini Pro API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Function to get response from Gemini Pro model
def get_gemini_response(input):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input)
    return response.text

# Function to extract text from the uploaded PDF
def input_pdf_text(uploaded_file):
    try:
        reader = pdf.PdfReader(uploaded_file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += str(page.extract_text())
        return text
    except Exception as e:
        return f"Error reading PDF file: {e}"

# Prompt template with scoring for the evaluation
input_prompt = """
Act like a skilled ATS (Application Tracking System) with a deep understanding of tech fields,
software engineering, data science, data analysis, and big data engineering. Your task is to evaluate the resume
based on the given job description and assign scores out of 5 for the following parameters:
1. Technical skills
2. Experience
3. Achievements
4. Education
5. Soft skills
6. Projects

Provide scores with a detailed explanation of each score based on the compatibility between the resume and the job description.

resume: {text}
description: {jd}

I want the response in JSON format:
{{
    "JD Match": "%",
    "Missing Keywords": ["keyword1", "keyword2", ...],
    "Profile Summary": ["summary point1", "summary point2", ...],
    "Recommendations": ["recommendation1", "recommendation2", ...],
    "Scores": {{
        "Technical skills": 0-5,
        "Experience": 0-5,
        "Achievements": 0-5,
        "Education": 0-5,
        "Soft skills": 0-5,
        "Projects": 0-5
    }},
    "Detailed Explanation": "Detailed explanations of the scores."
}}
Ensure that the response is in the exact JSON format without any additional text or comments.
"""

@app.route('/compare_resumes', methods=['POST'])
def compare_resumes():
    try:
        # Get job description from the request
        jd = request.form.get('jd')
        if not jd:
            return jsonify({"error": "Job description is required"}), 400

        # Get the uploaded PDF files from the request
        file1 = request.files.get('resume1')
        file2 = request.files.get('resume2')

        if not file1 or not file2:
            return jsonify({"error": "Both resumes must be provided"}), 400

        # Extract text from the resumes
        text1 = input_pdf_text(file1)
        text2 = input_pdf_text(file2)

        if "Error" in text1 or "Error" in text2:
            return jsonify({"error": f"Could not read one of the resumes. Error details: {text1 if 'Error' in text1 else text2}"}), 500

        # Get responses from the Gemini Pro model
        response1 = get_gemini_response(input_prompt.format(text=text1, jd=jd))
        response2 = get_gemini_response(input_prompt.format(text=text2, jd=jd))

        # Parse the responses into JSON format
        response1 = response1.replace('\n', '').replace('\r', '')
        response2 = response2.replace('\n', '').replace('\r', '')

        start_idx1 = response1.find("{")
        end_idx1 = response1.rfind("}") + 1
        json_response1 = response1[start_idx1:end_idx1]

        start_idx2 = response2.find("{")
        end_idx2 = response2.rfind("}") + 1
        json_response2 = response2[start_idx2:end_idx2]

        response_dict1 = json.loads(json_response1)
        response_dict2 = json.loads(json_response2)

        # Return the parsed response in JSON format
        return jsonify({
            "resume1": response_dict1,
            "resume2": response_dict2
        }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=5002)
