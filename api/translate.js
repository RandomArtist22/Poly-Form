/**
 * Translation API Handler (Vercel Serverless)
 *
 * Translates document content to target language using Google Gemini AI.
 * Preserves LaTeX formatting during translation.
 */

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

// Validate API key
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('Error: GEMINI_API_KEY is not set');
  process.exit(1);
}

const client = new GoogleGenAI({ apiKey: geminiApiKey });

/**
 * Serverless handler for translation requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function handler(req, res) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { documentId, content, targetLanguage } = req.body;
  console.log(`[Translate] Document: ${documentId}, Language: ${targetLanguage}`);

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Translate the following content into ${targetLanguage}. Preserve any LaTeX formatting.

Content:
${content}

Translated Content:`,
            },
          ],
        },
      ],
      config: { thinkingConfig: { thinkingBudget: -1 } },
    });

    const translatedContent = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!translatedContent?.trim()) {
      console.warn(`[Translate] Empty response for document: ${documentId}`);
      return res.status(500).json({
        success: false,
        error: 'Translation returned empty. Try different content or language.',
      });
    }

    res.json({ success: true, data: { translatedContent } });
  } catch (error) {
    console.error('[Translate] Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to translate content.' });
  }
}