from flask import Flask, request, jsonify
import google.generativeai as genai
import os
import PyPDF2 as pdf
from dotenv import load_dotenv
import json
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load environment variables
load_dotenv()

# Configure Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Function to get response from Gemini Pro model
def get_gemini_response(input):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input)
    return response.text

# Function to extract text from the uploaded PDF
def input_pdf_text(file):
    try:
        reader = pdf.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += str(page.extract_text())
        return text
    except Exception as e:
        return str(e)

# Prompt Template with Scoring for ATS
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

@app.route('/evaluate_resume', methods=['POST'])
def evaluate_resume():
    if 'resume' not in request.files or 'job_description' not in request.form:
        return jsonify({"error": "Please provide both resume PDF and job description"}), 400

    resume_file = request.files['resume']
    job_description = request.form['job_description']

    # Extract text from the PDF resume
    resume_text = input_pdf_text(resume_file)
    if "Error" in resume_text:
        return jsonify({"error": "Could not extract text from the PDF file"}), 400

    # Prepare the input for the Gemini model
    prompt = input_prompt.format(text=resume_text, jd=job_description)

    # Get the response from the Gemini model
    try:
        response = get_gemini_response(prompt)
        response = response.replace('\n', '').replace('\r', '')

        # Extract JSON response from the Gemini model output
        start_idx = response.find("{")
        end_idx = response.rfind("}") + 1
        json_response = response[start_idx:end_idx]
        response_dict = json.loads(json_response)

        return jsonify(response_dict)

    except (json.JSONDecodeError, ValueError) as e:
        return jsonify({"error": f"Failed to parse the response: {e}"}), 500

if __name__ == '__main__':
    app.run(port=5001)
