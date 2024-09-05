const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
require("dotenv").config();
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

async function fetchRoadmap(jobRole) {
  const chatSession = model.startChat({
    generationConfig,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  });

  const prompt = `Generate a detailed, hierarchical roadmap for ${jobRole}, similar to the visual roadmap on roadmap.sh. The roadmap should be divided into 8 to 12 sections, each with exactly 4 subsections. Each section and subsection must have a brief 30-40 word description. Cover key skills, tools, frameworks, best practices, and advanced topics, guiding the user step-by-step through the learning process. Use the following format strictly, with no additional text or variations:

${jobRole}

Section 1: [Main Concept]
Description: [30-40 word explanation of this section's focus and importance.]

Subsection 1.1: [Detailed Step]
Description: [30-40 word explanation of this step's importance.]

Subsection 1.2: [Detailed Step]
Description: [30-40 word explanation of this step's importance.]

Subsection 1.3: [Detailed Step]
Description: [30-40 word explanation of this step's importance.]

Subsection 1.4: [Detailed Step]
Description: [30-40 word explanation of this step's importance.]

... (continue with additional sections, ensuring a minimum of 8 and a maximum of 12 total sections)

Section N: [Final Main Concept or Advanced Topics]
Description: [30-40 word explanation of this section's focus and importance.]

Subsection N.1: [Detailed Step]
Description: [30-40 word explanation of this step's importance.]

Subsection N.2: [Detailed Step]
Description: [30-40 word explanation of this step's importance.]

Subsection N.3: [Detailed Step]
Description: [30-40 word explanation of this step's importance.]

Subsection N.4: [Detailed Step]
Description: [30-40 word explanation of this step's importance.]`;

  const result = await chatSession.sendMessage(prompt);
  return parseRoadmap(result.response.text());
}

function parseRoadmap(text) {
  const lines = text.split('\n').filter(Boolean);
  const result = { title: '', sections: [] };
  let currentSection = null;
  let currentSubsection = null;

  lines.forEach((line, index) => {
    line = line.trim();
    if (index === 0) {
      result.title = line.replace(/^#+\s*/, '').trim();
    } else if (line.match(/^(Section \d+:|^\*\*Section \d+:)/)) {
      if (currentSection) {
        result.sections.push(currentSection);
      }
      currentSection = { name: line.split(':')[1].trim().replace(/\*+$/, ''), description: '', subsections: [] };
    } else if (line.startsWith('Description:')) {
      if (currentSubsection) {
        currentSubsection.description = line.split(':')[1].trim();
        currentSection.subsections.push(currentSubsection);
        currentSubsection = null;
      } else if (currentSection) {
        currentSection.description = line.split(':')[1].trim();
      }
    } else if (line.match(/^(Subsection \d+\.\d+:|^\*\*Subsection \d+\.\d+:)/)) {
      if (currentSubsection) {
        currentSection.subsections.push(currentSubsection);
      }
      currentSubsection = { name: line.split(':')[1].trim().replace(/\*+$/, ''), description: '' };
    }
  });

  if (currentSection) {
    if (currentSubsection) {
      currentSection.subsections.push(currentSubsection);
    }
    result.sections.push(currentSection);
  }

  return result;
}

module.exports = fetchRoadmap;
