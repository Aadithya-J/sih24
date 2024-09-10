import streamlit as st
import google.generativeai as genai
import os
import PyPDF2 as pdf
import json
import matplotlib.pyplot as plt
import numpy as np
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Set Streamlit page configuration
st.set_page_config(page_title="Smart ATS", page_icon=":clipboard:", layout="centered", initial_sidebar_state="expanded")

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
        st.error(f"Error reading PDF file: {e}")
        return ""

# Prompt Template with Scoring for Spider Web Graph
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

# Streamlit app
st.title("Smart ATS with Spider Web Graph")
st.text("Improve Your Resume ATS Compatibility and Visualize Your Strengths")

# Category selection
category = st.selectbox("Pick a Category", ["Select", "ATS Analysis", "Compare"])

if category == "ATS Analysis":
    # ATS Analysis with one resume
    jd = st.text_area("Paste the job description")
    uploaded_file = st.file_uploader("Upload Your Resume", type=["pdf"], help="Please upload a PDF file")

    if st.button("Submit"):
        if uploaded_file is not None:
            text = input_pdf_text(uploaded_file)
            if text:
                response = get_gemini_response(input_prompt.format(text=text, jd=jd))
                response = response.replace('\n', '').replace('\r', '')

                try:
                    start_idx = response.find("{")
                    end_idx = response.rfind("}") + 1
                    json_response = response[start_idx:end_idx]
                    response_dict = json.loads(json_response)

                    scores = response_dict.get("Scores", {})
                    parameters = ["Technical skills", "Experience", "Achievements", "Education", "Soft skills", "Projects"]
                    values = [scores.get(param, 0) for param in parameters]

                    st.markdown("<h2 style='color:#4CAF50; text-align:center; margin-top:20px;'>ATS Score: "
                                f"{response_dict.get('JD Match', 'N/A')}</h2>", unsafe_allow_html=True)

                    with st.expander("Missing Keywords"):
                        missing_keywords = response_dict.get("Missing Keywords", ["N/A"])
                        st.write("\n".join(missing_keywords))

                    with st.expander("Profile Summary"):
                        profile_summary = response_dict.get("Profile Summary", ["N/A"])
                        st.write("\n".join(profile_summary))

                    with st.expander("Recommendations"):
                        recommendations = response_dict.get("Recommendations", ["N/A"])
                        st.write("\n".join(recommendations))

                    detailed_explanation = response_dict.get("Detailed Explanation", "N/A")
                    with st.expander("Detailed Explanation"):
                        st.write(detailed_explanation)

                    # Plotting the Spider Web Graph
                    def plot_spider_web(categories, values):
                        values += values[:1]  # Repeat the first value to close the circle
                        angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
                        angles += angles[:1]

                        colors = ['#FF0000', '#FF7F00', '#00FF00', '#FFFF00', '#40E0D0', '#0000FF']
                        fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))

                        for i in range(len(categories)):
                            start_angle = angles[i]
                            end_angle = angles[i + 1]
                            segment_values = [0] + values[i:i + 2]  # Include 0 for the center
                            segment_angles = [angles[i]] + angles[i:i + 2]

                            ax.fill(segment_angles, segment_values, color=colors[i], alpha=0.2)

                        ax.plot(angles, values, color='blue', linewidth=2)

                        ax.set_xticks(angles[:-1])
                        ax.set_xticklabels(categories, fontsize=10, color='black')
                        ax.set_yticks([1, 2, 3, 4, 5])
                        ax.set_yticklabels([1, 2, 3, 4, 5], fontsize=8, color='gray')
                        ax.yaxis.grid(True)

                        for i in range(len(angles) - 1):
                            for y in range(1, 6):
                                ax.text(angles[i], y, str(y), ha='center', va='center', fontsize=8, color='gray')

                        plt.title('Resume Compatibility Spider Web', pad=20)
                        st.pyplot(fig)

                    plot_spider_web(parameters, values)

                except (json.JSONDecodeError, ValueError) as e:
                    st.error(f"Failed to parse the response: {e}")
            else:
                st.error("Could not extract text from the PDF. Please try uploading a different file.")
        else:
            st.error("Please upload a PDF file.")

elif category == "Compare":
    # Comparison between two resumes
    jd = st.text_area("Paste the job description")

    uploaded_file1 = st.file_uploader("Upload Resume 1", type=["pdf"], key="resume1", help="Upload the first resume (PDF format)")
    uploaded_file2 = st.file_uploader("Upload Resume 2", type=["pdf"], key="resume2", help="Upload the second resume (PDF format)")

    if st.button("Compare"):
        if uploaded_file1 is not None and uploaded_file2 is not None:
            text1 = input_pdf_text(uploaded_file1)
            text2 = input_pdf_text(uploaded_file2)

            if text1 and text2:
                response1 = get_gemini_response(input_prompt.format(text=text1, jd=jd))
                response2 = get_gemini_response(input_prompt.format(text=text2, jd=jd))

                try:
                    response1 = response1.replace('\n', '').replace('\r', '')
                    response2 = response2.replace('\n', '').replace('\r', '')

                    start_idx1 = response1.find("{")
                    end_idx1 = response1.rfind("}") + 1
                    json_response1 = response1[start_idx1:end_idx1]
                    response_dict1 = json.loads(json_response1)

                    start_idx2 = response2.find("{")
                    end_idx2 = response2.rfind("}") + 1
                    json_response2 = response2[start_idx2:end_idx2]
                    response_dict2 = json.loads(json_response2)

                    scores1 = response_dict1.get("Scores", {})
                    scores2 = response_dict2.get("Scores", {})
                    parameters = ["Technical skills", "Experience", "Achievements", "Education", "Soft skills", "Projects"]
                    values1 = [scores1.get(param, 0) for param in parameters]
                    values2 = [scores2.get(param, 0) for param in parameters]

                    ats_score1 = response_dict1.get("JD Match", "N/A")
                    ats_score2 = response_dict2.get("JD Match", "N/A")

                    col1, col2 = st.columns(2)
                    with col1:
                        st.markdown(f"<h2 style='color:#4CAF50; text-align:center;'>ATS Score Resume 1: {ats_score1}</h2>", unsafe_allow_html=True)
                        with st.expander("Missing Keywords (Resume 1)"):
                            st.write("\n".join(response_dict1.get("Missing Keywords", ["N/A"])))
                        with st.expander("Profile Summary (Resume 1)"):
                            st.write("\n".join(response_dict1.get("Profile Summary", ["N/A"])))
                        with st.expander("Recommendations (Resume 1)"):
                            st.write("\n".join(response_dict1.get("Recommendations", ["N/A"])))

                    with col2:
                        st.markdown(f"<h2 style='color:#4CAF50; text-align:center;'>ATS Score Resume 2: {ats_score2}</h2>", unsafe_allow_html=True)
                        with st.expander("Missing Keywords (Resume 2)"):
                            st.write("\n".join(response_dict2.get("Missing Keywords", ["N/A"])))
                        with st.expander("Profile Summary (Resume 2)"):
                            st.write("\n".join(response_dict2.get("Profile Summary", ["N/A"])))
                        with st.expander("Recommendations (Resume 2)"):
                            st.write("\n".join(response_dict2.get("Recommendations", ["N/A"])))

                    # Plotting the Spider Web Graph for comparison
                    def plot_combined_spider_web(categories, values1, values2):
                        values1 += values1[:1]  # Repeat the first value to close the circle
                        values2 += values2[:1]  # Repeat the first value to close the circle
                        angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
                        angles += angles[:1]

                        fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))

                        ax.fill(angles, values1, color='green', alpha=0.2, label='Resume 1')
                        ax.fill(angles, values2, color='blue', alpha=0.2, label='Resume 2')

                        ax.plot(angles, values1, color='green', linewidth=2)
                        ax.plot(angles, values2, color='blue', linewidth=2)

                        ax.set_xticks(angles[:-1])
                        ax.set_xticklabels(categories, fontsize=10, color='black')
                        ax.set_yticks([1, 2, 3, 4, 5])
                        ax.set_yticklabels([1, 2, 3, 4, 5], fontsize=8, color='gray')
                        ax.yaxis.grid(True)

                        for i in range(len(angles) - 1):
                            for y in range(1, 6):
                                ax.text(angles[i], y, str(y), ha='center', va='center', fontsize=8, color='gray')

                        plt.title('Comparison of Resume Compatibility', pad=20)
                        plt.legend(loc='upper right')
                        st.pyplot(fig)

                    plot_combined_spider_web(parameters, values1, values2)

                    if ats_score1 > ats_score2:
                        st.markdown("<h3 style='color:#4CAF50; text-align:center;'>Conclusion: Resume 1 is better based on all general parameters.</h3>", unsafe_allow_html=True)
                    else:
                        st.markdown("<h3 style='color:#4CAF50; text-align:center;'>Conclusion: Resume 2 is better based on all general parameters.</h3>", unsafe_allow_html=True)

                except (json.JSONDecodeError, ValueError) as e:
                    st.error(f"Failed to parse one of the responses: {e}")
            else:
                st.error("Could not extract text from one or both PDFs. Please try uploading different files.")
        else:
            st.error("Please upload both PDF files.")
