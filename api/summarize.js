/**
 * Summarization API Handler (Vercel Serverless)
 *
 * Generates content summaries using Google Gemini AI.
 * Supports short, medium, and detailed summary lengths.
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
 * Serverless handler for summarization requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function handler(req, res) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { documentId, content, length } = req.body;
  console.log(`[Summarize] Document: ${documentId}, Length: ${length}`);

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Summarize the following content. The desired length is ${length}.

Content:
${content}

Summary:`,
            },
          ],
        },
      ],
      config: { thinkingConfig: { thinkingBudget: -1 } },
    });

    const summary = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.json({ success: true, data: { summary } });
  } catch (error) {
    console.error('[Summarize] Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate summary.' });
  }
}