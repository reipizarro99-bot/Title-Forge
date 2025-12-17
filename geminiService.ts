
import { GoogleGenAI, Type } from "@google/genai";
import { Rarity, Title, Word } from "./types";

// Always use the process.env.API_KEY for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateChaosTitle(titles: Title[]): Promise<Title> {
  const prompt = `Act as the "Omniversal Lexicon" from a cosmic fantasy game. I am combining these existing titles into a "Chaos Fusion":
  ${titles.map(t => `${t.words[0].text} ${t.words[1].text} ${t.words[2].text} (${t.rarity})`).join(', ')}

  Generate a new title that belongs to a completely unique, AI-generated rarity level (like "Quantum", "Eldritch", or "Primordial"). 
  Provide:
  1. A new First Word (Adjective/Title)
  2. A new Middle Word (Connector/Verb)
  3. A new End Word (Noun/Epithet)
  4. The name of this unique rarity
  5. A 1-sentence "history" for this title.
  Make it sound incredibly cool and higher than Cosmic tier.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            firstWord: { type: Type.STRING },
            middleWord: { type: Type.STRING },
            endWord: { type: Type.STRING },
            rarityName: { type: Type.STRING },
            history: { type: Type.STRING }
          },
          required: ["firstWord", "middleWord", "endWord", "rarityName", "history"]
        }
      }
    });

    // Ensure response text is safe before parsing
    const text = response.text || "{}";
    const data = JSON.parse(text);
    
    const words: [Word, Word, Word] = [
      { text: data.firstWord, rarity: Rarity.CHAOS, column: 0 },
      { text: data.middleWord, rarity: Rarity.CHAOS, column: 1 },
      { text: data.endWord, rarity: Rarity.CHAOS, column: 2 }
    ];

    return {
      id: Math.random().toString(36).substr(2, 9),
      words,
      rarity: Rarity.CHAOS,
      isPurity: true,
      // Fix: Add missing isSynergy property required by Title interface
      isSynergy: true,
      value: 10000000,
      history: data.history,
      seed: 'AI_GENERATED_' + Date.now(),
      // Fix: Add missing timestamp property required by Title interface
      timestamp: Date.now(),
      // Fix: Add missing world property required by Title interface (Chaos Fusion is world-transcendent, defaulting to input world)
      world: titles[0]?.world || 3
    };
  } catch (error) {
    console.error("Chaos Fusion failed:", error);
    throw error;
  }
}

export async function generateTitleHistory(titleStr: string, rarity: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a 1-sentence lore history for the title "${titleStr}" of ${rarity} rarity.`,
    });
    // Safely access the .text property as a string
    return (response.text || "").trim() || "A title whispered in the halls of eternity.";
  } catch {
    return "A title whispered in the halls of eternity.";
  }
}
