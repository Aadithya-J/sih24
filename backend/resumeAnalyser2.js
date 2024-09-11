const express = require('express');
const multer = require('multer');
const path = require('path');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs');
const pdf = require('pdf-parse');

const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const upload = multer({ dest: 'uploads/' });

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const generationConfig = {
    temperature: 0.2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
};

async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
        mimeType,
        displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
}

async function waitForFilesActive(files) {
    console.log("Waiting for file processing...");
    for (const name of files.map((file) => file.name)) {
        let file = await fileManager.getFile(name);
        while (file.state === "PROCESSING") {
            process.stdout.write(".")
            await new Promise((resolve) => setTimeout(resolve, 10_000));
            file = await fileManager.getFile(name)
        }
        if (file.state !== "ACTIVE") {
            throw Error(`File ${file.name} failed to process`);
        }
    }
    console.log("...all files ready\n");
}

async function extractTextFromPDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
}

async function analyzeResume(file, jobDescription) {
    const resumeText = await extractTextFromPDF(file.path);

    const prompt = `
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

resume: ${resumeText}
description: ${jobDescription}

I want the response in JSON format:
{
    "JD Match": "%",
    "Missing Keywords": ["keyword1", "keyword2", ...],
    "Profile Summary": ["summary point1", "summary point2", ...],
    "Recommendations": ["recommendation1", "recommendation2", ...],
    "Scores": {
        "Technical skills": 0-5,
        "Experience": 0-5,
        "Achievements": 0-5,
        "Education": 0-5,
        "Soft skills": 0-5,
        "Projects": 0-5
    },
    "Detailed Explanation": "Detailed explanations of the scores."
}
Ensure that the response is in the exact JSON format without any additional text or comments.
  `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
}

router.post('/', upload.single('resume'), async (req, res) => {
    console.log("Uploading resume...");
    try {
        const file = req.file;
        const jobDescription = req.body.jobDescription;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        console.log('File received:', file);
        console.log('Job description:', jobDescription);

        const analysisResult = await analyzeResume(file, jobDescription);
        console.log('Analysis result:', analysisResult);

        // Delete the uploaded file
        fs.unlink(file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted successfully');
            }
        });

        res.json(analysisResult);
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'An error occurred while analyzing the resume: ' + error.message });
    }
});

// // Add a route for comparing two resumes
// router.post('/compare', upload.fields([{ name: 'resume1', maxCount: 1 }, { name: 'resume2', maxCount: 1 }]), async (req, res) => {
//     try {
//         const files = req.files;
//         const jobDescription = req.body.jobDescription;

//         if (!files.resume1 || !files.resume2) {
//             return res.status(400).json({ error: 'Two resume files are required' });
//         }

//         if (!jobDescription) {
//             return res.status(400).json({ error: 'Job description is required' });
//         }

//         console.log('Files received:', files);
//         console.log('Job description:', jobDescription);

//         const analysisResult1 = await analyzeResume(files.resume1[0], jobDescription);
//         const analysisResult2 = await analyzeResume(files.resume2[0], jobDescription);

//         const comparisonResult = {
//             resume1: analysisResult1,
//             resume2: analysisResult2
//         };

//         // Delete the uploaded files
//         [files.resume1[0], files.resume2[0]].forEach(file => {
//             fs.unlink(file.path, (err) => {
//                 if (err) {
//                     console.error('Error deleting file:', err);
//                 } else {
//                     console.log('File deleted successfully');
//                 }
//             });
//         });

//         res.json(comparisonResult);
//     } catch (error) {
//         console.error('Error comparing resumes:', error);
//         res.status(500).json({ error: 'An error occurred while comparing the resumes: ' + error.message });
//     }
// });

module.exports = router;