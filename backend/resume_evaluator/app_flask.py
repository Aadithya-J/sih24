import os
import json
import numpy as np
import google.generativeai as genai
import PyPDF2 as pdf
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from matplotlib.figure import Figure
from io import BytesIO
import base64
from flask_cors import CORS

load_dotenv()

# Configure the Gemini Pro model
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)
CORS(app)

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

# Function to plot and return the Spider Web Graph as base64
def plot_spider_web(parameters, values):
    values += values[:1]  # Repeat the first value to close the circle
    angles = np.linspace(0, 2 * np.pi, len(parameters), endpoint=False).tolist()
    angles += angles[:1]

    fig = Figure(figsize=(6, 6))
    ax = fig.add_subplot(111, polar=True)
    
    colors = ['#FF0000', '#FF7F00', '#00FF00', '#FFFF00', '#40E0D0', '#0000FF']

    for i in range(len(parameters)):
        ax.fill(angles, [0] + values[i:i + 2], color=colors[i], alpha=0.2)

    ax.plot(angles, values, color='blue', linewidth=2)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(parameters, fontsize=10, color='black')
    ax.set_yticks([1, 2, 3, 4, 5])
    ax.set_yticklabels([1, 2, 3, 4, 5], fontsize=8, color='gray')
    ax.yaxis.grid(True)

    # Convert plot to base64 string to send via API
    buf = BytesIO()
    fig.savefig(buf, format="png")
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    buf.close()

    return img_base64

# API route for ATS analysis
@app.route('/ats_analysis', methods=['POST'])
def ats_analysis():
    if 'resume' not in request.files or 'job_description' not in request.form:
        return jsonify({'error': 'Please provide both resume and job description.'}), 400

    uploaded_file = request.files['resume']
    jd = request.form['job_description']

    # Extract text from the PDF
    text = input_pdf_text(uploaded_file)
    if "Error" in text:
        return jsonify({'error': text}), 500

    # Call the Gemini API
    prompt = f"""
    Act like a skilled ATS with a deep understanding of tech fields, software engineering, data science, and big data engineering.
    Evaluate the resume based on the given job description and assign scores out of 5 for:
    1. Technical skills
    2. Experience
    3. Achievements
    4. Education
    5. Soft skills
    6. Projects

    Provide scores in JSON format.

    resume: {text}
    description: {jd}
    """
    response = get_gemini_response(prompt)
    response = response.replace('\n', '').replace('\r', '')

    try:
        start_idx = response.find("{")
        end_idx = response.rfind("}") + 1
        json_response = response[start_idx:end_idx]
        response_dict = json.loads(json_response)

        scores = response_dict.get("Scores", {})
        parameters = ["Technical skills", "Experience", "Achievements", "Education", "Soft skills", "Projects"]
        values = [scores.get(param, 0) for param in parameters]

        # Generate spider web graph as base64
        spider_web_img = plot_spider_web(parameters, values)

        return jsonify({
            'JD Match': response_dict.get('JD Match', 'N/A'),
            'Missing Keywords': response_dict.get('Missing Keywords', []),
            'Profile Summary': response_dict.get('Profile Summary', []),
            'Recommendations': response_dict.get('Recommendations', []),
            'Scores': scores,
            'Detailed Explanation': response_dict.get('Detailed Explanation', 'N/A'),
            'Spider Web Graph': spider_web_img
        })
    except (json.JSONDecodeError, ValueError) as e:
        return jsonify({'error': f"Failed to parse response: {e}"}), 500

if __name__ == '__main__':
    app.run(port=5001)
