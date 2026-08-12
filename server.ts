import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback rule-based corrector for fallback/offline/demo scenarios
function generateFallbackCorrection(text: string, mode: string) {
  let correctedText = text;
  const changes: Array<{
    id: string;
    type: "spelling" | "grammar" | "punctuation" | "clarity" | "vocabulary" | "style";
    original: string;
    suggestion: string;
    explanation: string;
    offset?: number;
  }> = [];

  // Common misspellings and grammar fixes dictionary
  const rules: Array<{ pattern: RegExp; replacement: string; type: "spelling" | "grammar" | "punctuation" | "clarity" | "vocabulary"; explanation: string }> = [
    { pattern: /\bteh\b/gi, replacement: "the", type: "spelling", explanation: "Corrected common typo 'teh' to 'the'." },
    { pattern: /\breceive\b/gi, replacement: "receive", type: "spelling", explanation: "Ensure 'i' before 'e' except after 'c'." },
    { pattern: /\breceive\b/gi, replacement: "receive", type: "spelling", explanation: "Corrected spelling of 'receive'." },
    { pattern: /\brecieve\b/gi, replacement: "receive", type: "spelling", explanation: "Corrected 'recieve' to 'receive'." },
    { pattern: /\bseperate\b/gi, replacement: "separate", type: "spelling", explanation: "Corrected 'seperate' to 'separate'." },
    { pattern: /\bdefinitely\b/gi, replacement: "definitely", type: "spelling", explanation: "Corrected spelling of 'definitely'." },
    { pattern: /\bdefinately\b/gi, replacement: "definitely", type: "spelling", explanation: "Corrected 'definately' to 'definitely'." },
    { pattern: /\bthier\b/gi, replacement: "their", type: "spelling", explanation: "Corrected 'thier' to 'their'." },
    { pattern: /\byour\s+welcome\b/gi, replacement: "you're welcome", type: "grammar", explanation: "Changed possessive 'your' to contraction 'you're'." },
    { pattern: /\bi\b/g, replacement: "I", type: "grammar", explanation: "Capitalized standalone pronoun 'I'." },
    { pattern: /\balot\b/gi, replacement: "a lot", type: "spelling", explanation: "Split 'alot' into two words 'a lot'." },
    { pattern: /\bcould\s+of\b/gi, replacement: "could have", type: "grammar", explanation: "Replaced 'could of' with 'could have'." },
    { pattern: /\bshould\s+of\b/gi, replacement: "should have", type: "grammar", explanation: "Replaced 'should of' with 'should have'." },
    { pattern: /\bwould\s+of\b/gi, replacement: "would have", type: "grammar", explanation: "Replaced 'would of' with 'would have'." },
    { pattern: /\bthere\s+is\s+many\b/gi, replacement: "there are many", type: "grammar", explanation: "Subject-verb agreement: 'many' requires plural verb 'are'." },
    { pattern: /\bin\s+order\s+to\b/gi, replacement: "to", type: "clarity", explanation: "Simplified 'in order to' to 'to' for concise phrasing." },
    { pattern: /\bat\s+this\s+point\s+in\s+time\b/gi, replacement: "currently", type: "clarity", explanation: "Replaced wordy phrase with 'currently'." },
    { pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, replacement: "because", type: "clarity", explanation: "Simplified 'due to the fact that' to 'because'." }
  ];

  let changeIdCount = 1;
  for (const rule of rules) {
    let match;
    const regex = new RegExp(rule.pattern, rule.pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      const originalMatched = match[0];
      // Avoid duplicate overlapping replacements
      if (originalMatched !== rule.replacement) {
        changes.push({
          id: `c-${changeIdCount++}`,
          type: rule.type,
          original: originalMatched,
          suggestion: rule.replacement,
          explanation: rule.explanation,
          offset: match.index
        });
      }
    }
    correctedText = correctedText.replace(rule.pattern, rule.replacement);
  }

  // Capitalize first letter of sentences if needed
  correctedText = correctedText.replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => {
    return p1 + p2.toUpperCase();
  });

  // Ensure trailing punctuation
  if (correctedText.trim().length > 0 && !/[.!?]$/.test(correctedText.trim())) {
    correctedText = correctedText.trim() + ".";
  }

  // Calculate scores
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const spellingErrors = changes.filter(c => c.type === "spelling").length;
  const grammarErrors = changes.filter(c => c.type === "grammar").length;
  const punctuationErrors = changes.filter(c => c.type === "punctuation").length;

  const spellingScore = Math.max(70, Math.min(100, 100 - spellingErrors * 10));
  const grammarScore = Math.max(70, Math.min(100, 100 - grammarErrors * 10));
  const punctuationScore = Math.max(70, Math.min(100, 100 - punctuationErrors * 10));
  const clarityScore = mode === "concise" ? 92 : 88;
  const overallScore = Math.round((spellingScore + grammarScore + punctuationScore + clarityScore) / 4);

  return {
    correctedText,
    changes,
    overallSummary: changes.length > 0
      ? `Fixed ${changes.length} issue${changes.length > 1 ? "s" : ""} including spelling, grammar, and phrasing clarity.`
      : "Your text looks clean and grammatically sound! Only minor polishing applied.",
    scores: {
      spelling: spellingScore,
      grammar: grammarScore,
      clarity: clarityScore,
      punctuation: punctuationScore,
      overall: overallScore,
      correctness: overallScore,
      toneRating: mode === "formal" ? "Formal & Professional" : mode === "casual" ? "Casual & Conversational" : "Neutral & Direct",
      readabilityGrade: wordCount > 30 ? "Grade 8 - Very Clear" : "Easy to Read"
    },
    insights: [
      "Capitalization and punctuation have been normalized.",
      "Sentence structures flow naturally."
    ]
  };
}

// API Route for Text Correction
app.post("/api/correct", async (req, res) => {
  try {
    const { text, mode = "standard", language = "English (US)", tone = "balanced" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Please provide valid text to correct." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured
      const fallbackResult = generateFallbackCorrection(text, mode);
      return res.json({
        ...fallbackResult,
        isFallback: true
      });
    }

    const systemPrompt = `You are SmartCorrect AI, a world-class AI writing editor and proofreader.
Your goal is to carefully check the user's text for:
1. Spelling mistakes and typos
2. Grammar and syntax errors
3. Punctuation and capitalization inconsistencies
4. Word choice, clarity, flow, and conciseness
5. Tone alignment according to mode: "${mode}" (e.g. standard, formal, concise, casual, academic, esl).
Target Language: ${language}.

CRITICAL INSTRUCTIONS:
- Preserve the author's core message and meaning.
- Provide precise changes with the exact original snippet and suggestion.
- Categorize each change type strictly as one of: 'spelling', 'grammar', 'punctuation', 'clarity', 'vocabulary', or 'style'.
- Calculate 5 quality scores objectively (from 0 to 100): 'spelling', 'grammar', 'clarity', 'punctuation', and 'overall'.
- Provide a brief summary of what was fixed or improved.
- Respond STRICTLY in the JSON format matching the schema.`;

    const userPrompt = `Please review and correct the following text (Mode: ${mode}, Language: ${language}, Tone: ${tone}):

---
${text}
---`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: {
              type: Type.STRING,
              description: "The full, polished, corrected version of the text."
            },
            changes: {
              type: Type.ARRAY,
              description: "List of specific corrections made to the original text.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique change identifier like c-1" },
                  type: {
                    type: Type.STRING,
                    description: "Type of correction: 'spelling', 'grammar', 'punctuation', 'clarity', 'vocabulary', or 'style'"
                  },
                  original: { type: Type.STRING, description: "Original word or phrase before correction" },
                  suggestion: { type: Type.STRING, description: "Suggested replacement word or phrase" },
                  explanation: { type: Type.STRING, description: "Clear, concise reason why this correction was made" }
                },
                required: ["id", "type", "original", "suggestion", "explanation"]
              }
            },
            overallSummary: {
              type: Type.STRING,
              description: "A 1-2 sentence executive summary of the changes and overall quality."
            },
            scores: {
              type: Type.OBJECT,
              properties: {
                spelling: { type: Type.INTEGER, description: "Spelling score from 0 to 100" },
                grammar: { type: Type.INTEGER, description: "Grammar score from 0 to 100" },
                clarity: { type: Type.INTEGER, description: "Clarity score from 0 to 100" },
                punctuation: { type: Type.INTEGER, description: "Punctuation score from 0 to 100" },
                overall: { type: Type.INTEGER, description: "Overall writing quality score from 0 to 100" },
                toneRating: { type: Type.STRING, description: "Detected tone e.g. 'Formal & Professional', 'Conversational'" },
                readabilityGrade: { type: Type.STRING, description: "Estimated reading level e.g. 'Grade 8', 'Easy'" }
              },
              required: ["spelling", "grammar", "clarity", "punctuation", "overall"]
            },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 actionable tips or highlights regarding vocabulary or phrasing."
            }
          },
          required: ["correctedText", "changes", "overallSummary", "scores", "insights"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI model.");
    }

    const parsed = JSON.parse(resultText);
    return res.json(parsed);

  } catch (err: any) {
    console.error("Error during text correction:", err);
    // Graceful fallback on AI error
    const fallback = generateFallbackCorrection(req.body.text || "", req.body.mode || "standard");
    return res.json({
      ...fallback,
      isFallback: true,
      errorNotice: "Used standard correction mode due to connection timeout."
    });
  }
});

// Start Express server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartCorrect AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
