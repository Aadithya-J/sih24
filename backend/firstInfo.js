/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
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

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("Vaibhavi Jaiswal Resume.pdf", "application/pdf"),
    await uploadToGemini("IsabelleToddResume.pdf", "application/pdf"),
    await uploadToGemini("IsabelleToddResume.pdf", "application/pdf"),
    await uploadToGemini("(FREE COPY) Oracle Senior IT Operations Engineer Resume Template.pdf", "application/pdf"),
    await uploadToGemini("(FREE COPY) Microsoft Cloud Program Manager Resume Example.pdf", "application/pdf"),
    await uploadToGemini("Vaibhavi Jaiswal Resume.pdf", "application/pdf"),
    await uploadToGemini("IsabelleToddResume.pdf", "application/pdf"),
    await uploadToGemini("(FREE COPY) Oracle Senior IT Operations Engineer Resume Template.pdf", "application/pdf"),
  ];

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(files);

  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "If I upload a resume I want you to give me 3 roles for which the person and apply based on the resume I want you to give me a list of what are the skill gaps that are there which if they learn then the person can have a better chance of getting selected. I want you to give me both of these as a list of strings. Both of the suitable jobs and skill gaps should be given in 2 different list. Other than the 2 list I don't want you to give me anything else in the response. Got it?\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Got it. Please provide your resume. I will then analyze it and provide you with a list of 3 suitable roles and a list of skill gaps that would increase your chances of getting selected. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "The skill gaps should be in a way that if the user learns all the skills that you have listen he/she should have a better chance at getting the job.\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Please provide your resume. I will then analyze it and provide you with:\n\n* **A list of 3 suitable roles** based on your skills and experience. \n* **A list of skill gaps** that, if addressed, would significantly increase your chances of getting selected for these roles.  \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  \"Junior Software Engineer\",\n  \"Front-End Developer\",\n  \"Full-Stack Developer\"\n]\n```\n\n```json\n[\n  \"Strong understanding of backend development with languages like Python, Node.js or Ruby\",\n  \"Experience with databases like MySQL, PostgreSQL, or MongoDB\",\n  \"Experience with frameworks like Django, Flask, Express.js or Rails\",\n  \"Experience with Version control systems like Git\",\n  \"Experience with Agile development methodologies\",\n  \"Understanding of API design and development\",\n  \"Experience with cloud platforms like AWS, Azure, or GCP\"\n]\n```"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[1].mimeType,
              fileUri: files[1].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  \"Software Engineering Manager\",\n  \"Senior Software Engineer\",\n  \"Lead Software Engineer\"\n]\n```\n\n```json\n[\n  \"Experience with C# or other .NET languages\",\n  \"Familiarity with cloud technologies like Azure or AWS\",\n  \"Experience with Agile project management tools like Jira or Asana\",\n  \"Strong understanding of DevOps principles and practices\",\n  \"Experience with testing frameworks and methodologies\",\n  \"Experience with containerization technologies like Docker\"\n]\n```"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[2].mimeType,
              fileUri: files[2].uri,
            },
          },
          {text: "This is a good example resume you can use as reference"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  \"Software Engineering Manager\",\n  \"Principal Software Engineer\",\n  \"Director of Engineering\"\n]\n```\n\n```json\n[\n  \"Experience with cloud-based development (AWS, Azure, GCP)\",\n  \"Experience with microservices architecture\",\n  \"Strong understanding of CI/CD pipelines\",\n  \"Experience with Agile methodologies (Scrum, Kanban)\",\n  \"Experience with leading and mentoring teams\",\n  \"Experience with product management and roadmapping\"\n]\n```"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[3].mimeType,
              fileUri: files[3].uri,
            },
          },
          {
            fileData: {
              mimeType: files[4].mimeType,
              fileUri: files[4].uri,
            },
          },
          {text: "Now I will provide you with a list of resume I want you to take that as reference okay? I want you to keep these resume as benchmark and then provide the response for others."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Got it. I will use the provided resumes as benchmarks when analyzing other resumes and providing you with a list of suitable roles and skill gaps. Please share the resume you want me to analyze. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[5].mimeType,
              fileUri: files[5].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  \"Junior Software Engineer\",\n  \"Front-End Developer\",\n  \"Full-Stack Developer\"\n]\n```\n\n```json\n[\n  \"Strong understanding of backend development with languages like Python, Node.js or Ruby\",\n  \"Experience with databases like MySQL, PostgreSQL, or MongoDB\",\n  \"Experience with frameworks like Django, Flask, Express.js or Rails\",\n  \"Experience with Version control systems like Git\",\n  \"Experience with Agile development methodologies\",\n  \"Understanding of API design and development\",\n  \"Experience with cloud platforms like AWS, Azure, or GCP\"\n]\n```"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "See I don't just want you to come up with roles like \"Junior Software Engineer\", \"Front-End Developer\", \"Full-Stack Developer\". I want you to be specific like if you find someone with projects related to ML in their resume then I want you to add ML engineer in the suitable roles list and show the skills gaps accordingly. Now if a resume doesn't have specific domain then I want you to give generalised suggestions like \"Junior Software Engineer\", \"Front-End Developer\", \"Full-Stack Developer\". Got it?\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Got it! I understand. I will tailor the suggested roles and skill gaps to the specific domain expertise shown in the resume. For example, if the resume has projects or experience related to machine learning, I will suggest \"ML Engineer\" as a role and provide relevant skill gaps. \n\nPlease share the resume, and I will provide you with the customized lists. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[6].mimeType,
              fileUri: files[6].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  \"Software Engineering Manager\",\n  \"Senior Software Engineer\",\n  \"Lead Software Engineer\",\n  \"Technical Lead\",\n]\n```\n\n```json\n[\n  \"Experience with cloud-based development (AWS, Azure, GCP)\",\n  \"Experience with microservices architecture\",\n  \"Strong understanding of CI/CD pipelines\",\n  \"Experience with Agile methodologies (Scrum, Kanban)\",\n  \"Experience with leading and mentoring teams\",\n  \"Experience with product management and roadmapping\",\n  \"Experience with DevOps principles and practices\"\n]\n```"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "Can you tell me what are the thing I told you to keep in mine while providing response?"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "You asked me to keep the following in mind while providing a response:\n\n1. **Specificity in Roles:** Instead of general roles like \"Junior Software Engineer,\" I should suggest specific roles based on the domain expertise shown in the resume. For example, if the resume highlights machine learning projects, I should suggest \"ML Engineer\" as a potential role.\n2. **Domain-Specific Skill Gaps:** I should provide a list of skill gaps tailored to the specific domain mentioned in the resume. For example, if the resume focuses on ML, the skill gaps should be relevant to ML, such as experience with specific ML libraries or algorithms.\n3. **Generalized Suggestions if No Domain:** If the resume does not have a specific domain expertise, I should provide generalized suggestions like \"Junior Software Engineer,\" \"Front-End Developer,\" and \"Full-Stack Developer.\" \n\nI will make sure to keep these points in mind when analyzing resumes and providing my suggestions. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "if I uplaod a resume give me the response in format of python list give me all 3 list together"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Got it. I will analyze the resume you provide and give you the response in the format of a Python list containing three lists:\n\n1. **Suitable Roles:**  This list will contain specific roles based on the domain expertise shown in the resume or generalized roles if no specific domain is evident.\n\n2. **Skill Gaps:**  This list will include skill gaps tailored to the specific domain mentioned in the resume or generalized skill gaps if no specific domain is evident. \n\n3. **Additional Notes:** (Optional) This list will contain any additional notes or observations that I might find relevant to the resume.\n\nPlease provide your resume, and I will process it accordingly. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "I need additional notes for every resume "},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Got it. I will now provide you with three lists for each resume:\n\n1. **Suitable Roles:**  Specific roles based on the domain expertise shown in the resume or generalized roles if no specific domain is evident.\n2. **Skill Gaps:**  Skill gaps tailored to the specific domain mentioned in the resume or generalized skill gaps if no specific domain is evident. \n3. **Additional Notes:**  Any additional notes or observations that I might find relevant to the resume.\n\nPlease share your resume, and I will process it and give you the response in the format of a Python list containing these three lists. \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: files[7].mimeType,
              fileUri: files[7].uri,
            },
          },
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```python\n[\n  ['DevOps Engineer', 'Systems Administrator', 'Cloud Engineer'],\n  ['Experience with configuration management tools like Ansible or Chef', 'Experience with monitoring and logging tools (e.g., Prometheus, Grafana, ELK)', 'Experience with container orchestration platforms like Kubernetes', 'Experience with Infrastructure as Code (IaC) tools like Terraform or CloudFormation', 'Strong understanding of networking concepts and troubleshooting'],\n  ['The resume highlights a strong background in DevOps, with experience in automating tasks, migrating systems to AWS, and working with CI/CD pipelines. The candidate also has experience with various scripting languages and systems administration, which are valuable skills in the DevOps domain.  The candidate mentions using Agile SCRUM methods, which is a plus for DevOps teams. However, the candidate’s experience in ML is not clear from this resume.  It would be helpful to have more details about the specific ML projects and skills they have.']\n]\n```"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();