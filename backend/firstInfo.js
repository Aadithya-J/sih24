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
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
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
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "If I upload a resume I want you to give me 3 roles for which the person and apply based on the resume I want you to give me a list of what are the skill gaps that are there which if they learn then the person can have a better chance of getting selected. I want you to give me both of these as a list of strings. Both of the suitable jobs and skill gaps should be given in 2 different list. Other than the 2 list I don't want you to give me anything else in the response. Got it?"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Got it. Please provide your resume and I will generate the two lists you requested. \n"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage('./test.pdf');
    console.log(result.response.text());
  }
  
  run();