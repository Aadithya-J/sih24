import streamlit as st
import google.generativeai as genai
import os
import PyPDF2 as pdf
import json
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap
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
jd = st.text_area("Paste the job description")
uploaded_file = st.file_uploader("Upload Your Resume", type=["pdf"], help="Please upload a PDF file")

submit = st.button("Submit")

if submit:
    if uploaded_file is not None:
        text = input_pdf_text(uploaded_file)
        if text:
            response = get_gemini_response(input_prompt.format(text=text, jd=jd))

            # Clean the response to remove problematic characters for JSON parsing
            response = response.replace('\n', '').replace('\r', '')

            # Parse the response from a string to a dictionary
            try:
                start_idx = response.find("{")
                end_idx = response.rfind("}") + 1
                json_response = response[start_idx:end_idx]
                response_dict = json.loads(json_response)

                # Extract scores for each parameter
                scores = response_dict.get("Scores", {})
                parameters = ["Technical skills", "Experience", "Achievements", "Education", "Soft skills", "Projects"]
                values = [scores.get(param, 0) for param in parameters]

                # Display ATS Score separately and highlight it
                st.markdown("<h2 style='color:#4CAF50; text-align:center; margin-top:20px;'>ATS Score: "
                            f"{response_dict.get('JD Match', 'N/A')}</h2>", unsafe_allow_html=True)

                # Display Missing Keywords, Profile Summary, and Recommendations using Streamlit's UI elements
                with st.expander("Missing Keywords"):
                    missing_keywords = response_dict.get("Missing Keywords", ["N/A"])
                    st.write("\n".join(missing_keywords))

                with st.expander("Profile Summary"):
                    profile_summary = response_dict.get("Profile Summary", ["N/A"])
                    st.write("\n".join(profile_summary))

                with st.expander("Recommendations"):
                    recommendations = response_dict.get("Recommendations", ["N/A"])
                    st.write("\n".join(recommendations))

                # Remove inverted quotes from the Detailed Explanation
                detailed_explanation = response_dict.get("Detailed Explanation", "N/A")
                if isinstance(detailed_explanation, str):
                    detailed_explanation = detailed_explanation.replace('"', '')

                with st.expander("Detailed Explanation"):
                    st.write(detailed_explanation)

                # Plotting the Spider Web Graph
                def plot_spider_web(categories, values):
                    values += values[:1]  # Repeat the first value to close the circle
                    angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
                    angles += angles[:1]

                    # Define colors for each region with more transparency
                    colors = ['#FF0000', '#FF7F00', '#00FF00', '#FFFF00', '#40E0D0', '#0000FF']

                    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
                    for i in range(len(categories)):
                        # Fill each region with a different color
                        start_angle = angles[i]
                        end_angle = angles[i + 1]
                        segment_values = [0] + values[i:i + 2]  # Include 0 for the center
                        segment_angles = [angles[i]] + angles[i:i + 2]

                        ax.fill(segment_angles, segment_values, color=colors[i], alpha=0.2)

                    ax.plot(angles, values, color='blue', linewidth=2)  # Line

                    # Set parameters labels outside the circle
                    ax.set_xticks(angles[:-1])
                    ax.set_xticklabels(categories, fontsize=10, color='black')

                    # Set radial labels from 1 to 5 on each axis line
                    ax.set_yticks([1, 2, 3, 4, 5])
                    ax.set_yticklabels([1, 2, 3, 4, 5], fontsize=8, color='gray')
                    ax.yaxis.grid(True)

                    # Label concentric circles 6 times, one for each radial axis
                    for i in range(len(angles) - 1):
                        for y in range(1, 6):
                            ax.text(angles[i], y, str(y), ha='center', va='center', fontsize=8, color='gray')

                    # Display title
                    plt.title('Resume Compatibility Spider Web', pad=20)
                    st.pyplot(fig)

                # Display the spider web graph
                plot_spider_web(parameters, values)

            except (json.JSONDecodeError, ValueError) as e:
                st.error(f"Failed to parse the response: {e}")
        else:
            st.error("Could not extract text from the PDF. Please try uploading a different file.")
    else:
        st.error("Please upload a PDF file.")
