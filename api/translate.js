require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('GEMINI_API_KEY is not set');
  process.exit(1);
}
const client = new GoogleGenAI({ apiKey: geminiApiKey });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { documentId, content, targetLanguage } = req.body;
  console.log(`Translating document ${documentId} to ${targetLanguage}`);

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Translate the following content into ${targetLanguage}. Preserve any LaTeX formatting.

Content:
${content}

Translated Content:`
            }
          ]
        }
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: -1
        }
      }
    });

    const translatedContent = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!translatedContent || translatedContent.trim() === '') {
      console.warn('Gemini API returned empty translation for document:', documentId);
      return res.status(500).json({ success: false, error: 'Gemini API returned an empty translation. Please try again with different content or language.' });
    }

    res.json({ success: true, data: { translatedContent } });
  } catch (error) {
    console.error('Error calling Gemini API for translation:', error);
    res.status(500).json({ success: false, error: 'Failed to translate content using Gemini API.' });
  }
}