import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
console.log(API_KEY);
const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = "gemini-pro";

export const model = genAI.getGenerativeModel({ model: MODEL_NAME });
export const generationConfig = {
  temperature: 0,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};
export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];
