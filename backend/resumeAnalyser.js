/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

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

const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const upload = multer({ dest: 'uploads/' });

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
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

async function analyzeResume(file, jobRole) {
  const uploadedFile = await uploadToGemini(file.path, file.mimetype);
  await waitForFilesActive([uploadedFile]);

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Analyze the uploaded resume for a " + jobRole + " position. Provide the response in the following format:\n\n[score1,score2,score3,score4,score5,score6]\n\nRecommendations:\n[Your detailed recommendations here]\n\nWhere the scores are integers from 1 to 5 for:\n1. Relevance to Job Role\n2. Clarity and Formatting\n3. Work Experience and Projects\n4. Technical and Soft Skills\n5. Education and Certifications\n6. Achievements and Impact"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage([
    {
      fileData: {
        mimeType: uploadedFile.mimeType,
        fileUri: uploadedFile.uri,
      },
    },
  ]);

  const responseText = result.response.text();
  console.log('Raw AI response:', responseText);
  return responseText;
}

function parseAnalysis(analysisText) {
  const [scoresStr, ...recommendationsParts] = analysisText.split('\n\n');
  const scoreArray = JSON.parse(scoresStr);
  const recommendations = recommendationsParts.join('\n\n').replace('Recommendations:', '').trim();
  return { score: scoreArray, recommendations };
}

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    const jobRole = req.body.jobRole;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', file);
    console.log('Job role:', jobRole);

    const analysisResult = await analyzeResume(file, jobRole);
    console.log('Analysis result:', analysisResult);

    const parsedResult = parseAnalysis(analysisResult);
    console.log('Parsed result:', parsedResult);

    // Delete the uploaded file
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully');
      }
    });

    res.json(parsedResult);
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the resume: ' + error.message });
  }
});

module.exports = router;