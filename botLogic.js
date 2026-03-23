import { GoogleGenerativeAI } from "https://esm.run/@google/genai";

const API_KEY = "AIzaSyDCdL0cje_TuG_UFMNS15qRG1Phg5ji1H0";
const genAI = new GoogleGenerativeAI(API_KEY);

export let botPersona = "You are a roleplay assistant.";
export let attachedFile = null;

// The Wiki Ingester
export async function ingestWiki(url, name) {
    const proxy = "https://api.allorigins.win/get?url=";
    const res = await fetch(proxy + encodeURIComponent(url));
    const data = await res.json();
    const text = data.contents.replace(/<[^>]*>/g, ' ').substring(0, 10000);
    
    botPersona = `You are ${name}. Use this wiki: ${text}. Stay in character. If a file is sent, analyze it as ${name}.`;
    return `${name} is synced!`;
}

// File Reader (Converts images for Gemini)
export function processFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            attachedFile = {
                inlineData: { data: e.target.result.split(',')[1], mimeType: file.type }
            };
            resolve(file.name);
        };
        reader.readAsDataURL(file);
    });
}

export async function getResponse(userInput) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const parts = [botPersona, userInput];
    if (attachedFile) parts.push(attachedFile);

    const result = await model.generateContent(parts);
    attachedFile = null; // Clear file after sending
    return result.response.text();
}