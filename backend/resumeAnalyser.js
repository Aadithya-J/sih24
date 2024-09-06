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
    temperature: 0.25,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    // TODO Make these files available on the local file system
    // You may need to update the file paths
    const files = [
      await uploadToGemini("Resume", "application/vnd.google-apps.document"),
      await uploadToGemini("Vaibhavi Jaiswal Resume.pdf", "application/pdf"),
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
            {text: "If I upload a resume and I give you a input that for which post that resume is for then I want you to give me the response in this way:\na array of 6 intergers \nfirst one should be Relevance to the Job Role, this should be out of 5 points \nsecond one should be Clarity and Formatting, this should be out of 5 points \nthird one should be Work Experience and Projects , this should be out of 5 points \nfourth one should be  Technical and Soft Skills, this should be out of 5 points \nfifth one should be Education and Certifications, this should be out of 5 points \nsixth one should be Achievements and Impact, this should be out of 5 points \nFollowed by this I want you to give me a paragraph, that says how to improve this resume furths and the things that are lacking."},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. I can help you evaluate resumes and provide feedback in the format you've requested. \n\n**Please provide me with:**\n\n1. **The resume file** (you can upload it directly, paste the text, or provide a link).\n2. **The job role or position** the resume is intended for.\n\n**Once I have this information, I will:**\n\n1. Analyze the resume based on the criteria you provided.\n2.  Generate a 6-integer array, representing the scores (out of 5) for each category:\n    * **[Relevance, Clarity, Work Experience, Skills, Education, Achievements]**\n3. Write a paragraph explaining areas for improvement and suggestions for enhancing the resume.\n\n**Example:**\n\nLet's say you upload a resume for a Software Engineer role. I might provide feedback like this:\n\n**[4, 3, 4, 5, 4, 3]**\n\n**Feedback:** This resume is well-structured and highlights relevant technical skills for a Software Engineer role. However, the \"Achievements\" section could be strengthened by quantifying the impact of your accomplishments. Consider adding specific metrics to showcase the value you brought to previous roles. Additionally, tailoring the resume to the specific requirements of the targeted position could further enhance its effectiveness.  \n\n**Please note:** My analysis will be based on the information provided and my understanding of general resume best practices. I am still under development, and my feedback may not be exhaustive or cover all aspects of resume writing. \n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Remember that you shoukd not use bold in any of your responses from here on "},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. I will avoid using bold in my responses from now on. Please provide me with the resume and the job role you want to evaluate, and I will give you the feedback in the format you requested. \n"},
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
            {text: "Software Engineer "},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "[3, 2, 3, 4, 4, 2]\n\nThis resume demonstrates a strong foundation in technical skills and extracurricular activities, but it could be improved by focusing on quantifiable achievements and tailoring the content to the specific requirements of a Software Engineer role. \n\nThe \"Technical Skills\" section is well-organized, but it lacks specific examples of projects or accomplishments that showcase your proficiency.  Instead of stating \"Proficient in fundamental data structures and algorithms,\" consider mentioning a project where you applied these skills to solve a specific problem. Similarly, for \"Machine Learning\" and \"Artificial Intelligence,\" highlight specific projects or coursework that demonstrate your understanding and practical application of these concepts.\n\nThe \"Experience\" section highlights your leadership roles, but it could be strengthened by quantifying your achievements. For example, instead of stating \"Organized and led workshops and seminars,\" mention the number of workshops conducted, the number of participants, or the specific skills covered.  \n\nThe \"Achievements\" section lists awards and accolades, but it lacks context.  For example, \"Top 100, Google's Competitive Programming Rounds\" would be more impactful if you mentioned the specific competition and the number of participants. \n\nThe \"Hobbies and Interests\" section is repetitive and could be condensed.  Consider merging it with the \"Achievements\" section to create a more concise and impactful section. \n\nFinally, the \"Education\" section is well-structured, but it could be enhanced by mentioning relevant coursework or projects related to software engineering. \n\nBy focusing on quantifiable achievements, tailoring the content to the specific requirements of a Software Engineer role, and providing more context for your accomplishments, you can create a more compelling and effective resume. \n"},
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
            {text: "Software Engineer "},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "[4, 3, 4, 4, 4, 3]\n\nThis resume showcases a strong foundation in technical skills and relevant experience, but it could be further enhanced by providing more specific details and quantifying achievements.\n\nThe \"Skills\" section effectively lists a wide range of programming languages and technologies, demonstrating a solid technical foundation. However, it could be strengthened by mentioning specific frameworks or libraries you're proficient in, such as React libraries or specific machine learning libraries.\n\nThe \"Education\" section clearly outlines your academic background, but it could be enhanced by mentioning relevant coursework or projects related to software engineering. For example, you could highlight projects where you applied your programming skills to solve real-world problems or courses that focused on specific software development methodologies.\n\nThe \"Projects\" section effectively describes your experience with the \"Cout\" project, highlighting your leadership role and the project's outcome. However, consider adding more details about the project's scope, the technologies used, and the specific challenges you faced. Quantifying your contributions, such as the number of features implemented or the impact of the project on users, would further strengthen this section.\n\nThe \"Activities\" section effectively describes your participation in the \"Byte Battles\" competition, highlighting your achievements and the skills developed. However, consider adding more details about the competition, such as the number of participants or the specific problems you solved.\n\nOverall, the resume demonstrates a strong foundation in technical skills and relevant experience. By providing more specific details, quantifying achievements, and highlighting relevant coursework or projects, you can create a more compelling and effective resume that showcases your skills and experience to potential employers. \n"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  
  run();