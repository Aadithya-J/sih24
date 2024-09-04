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
  temperature: 0.45,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

function parseRoadmap(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const result = { title: '', topics: [] };
  let currentTopic = null;

  lines.forEach(line => {
    if (line.startsWith('## ')) {
      if (!result.title) {
        result.title = line.slice(3);
      } else {
        if (currentTopic) {
          result.topics.push(currentTopic);
        }
        currentTopic = { name: line.slice(3), subtopics: [] };
      }
    } else if (line.startsWith('-- ') && currentTopic) {
      currentTopic.subtopics.push(line.slice(3));
    }
  });

  if (currentTopic) {
    result.topics.push(currentTopic);
  }

  return result;
}

async function fetchRoadmap(title) {
  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
  });

  const result = await chatSession.sendMessage(`Do not add any other text other than whats asked.Provide a detailed roadmap for ${title} which should not only cover the fundamentals but also all the topics from basics to advanced, things required to become an expert from the basics.Use this format ## for topics of each and -- for each subtopics under that like this # Typescript Master Guide ## Introduction to TypeScript - Basics of the Language - Understanding TypeScript Compiler - Introduction to static types - Understanding TSConfig ## TypeScript Variables and Data Types - Number and String types - Enumerated types - Any and Void types - Null and Undefined types - Array and Tuple types ## TypeScript Interfaces - Understanding Interfaces - Defining and Implementing Interfaces - Optional Properties in Interfaces - Readonly Properties in Interfaces - Function Types in Interfaces - Indexable Types and Class Types in Interfaces - Extending and Hybrid Interfaces ## TypeScript Classes - Introduction to Classes - Understanding Class Inheritance - Static Properties and Methods in Classes - Abstract Classes and Methods - Polymorphism via Classes ## TypeScript Functions - Writing Functions in TypeScript - Default and Optional parameters in Functions - Rest Parameters in Functions - Lambda Functions - Function Overloads ## TypeScript Generics - Understanding Generic Constraints - Generic Interfaces and Classes - Generic Factory Functions - Using Type parameters in Generic constraints ## TypeScript Namespaces - Namespaces and Modules Introduction - Using Namespaces for Code Organization - Multi-file Namespaces - Understanding Namespace Aliases ## TypeScript Decorators - Introduction to Decorators - Class Decorators - Method Decorators - Property Decorators - Parameter Decorators - Decorator Factories ## TypeScript Modules - Understanding Modules - Exporting and Importing Modules - Default Exports - Re-exports and Importing for side-effects ## TypeScript Declaration Files - Introduction to Declaration Files - Writing Declaration Files - Organizing Declaration Files - Consuming Declaration Files - Publishing Declaration Files ## TypeScript With React/JSX - Setting Up TypeScript with React - Type Checking with Prop Types - JSX, Events and Form Handling in TypeScript - State and Lifecycle Methods in TypeScript ## Best Practices in TypeScript - Effective use of Arrow Functions - Type Assertion - Using the Non-null Assertion Operator - Debugging TypeScript - Using linting tools (eg. TSLint, ESLint) for TypeScript - Understanding TypeScript Design Patterns`);
  
  const parsedRoadmap = parseRoadmap(result.response.text());
  return parsedRoadmap;
}

module.exports = fetchRoadmap;
