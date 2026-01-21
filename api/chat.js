/**
 * Chat API Handler (Vercel Serverless)
 *
 * Provides AI-powered chat responses about document content.
 * Uses Google Gemini AI for contextual conversations.
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
 * Serverless handler for chat requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function handler(req, res) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { documentId, content, message } = req.body;
  console.log(`[Chat] Document: ${documentId}, Message: "${message.substring(0, 50)}..."`);

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are a helpful AI assistant that answers questions about the following document. Provide accurate, relevant responses based on the document content. If the question cannot be answered from the document, say so politely.

Document Content:
${content}

User Question: ${message}

Please provide a helpful response:`,
            },
          ],
        },
      ],
      config: { thinkingConfig: { thinkingBudget: -1 } },
    });

    const botResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!botResponse?.trim()) {
      console.warn(`[Chat] Empty response for document: ${documentId}`);
      return res.status(500).json({
        success: false,
        error: 'Empty response. Please try again.',
      });
    }

    res.json({ success: true, data: { botResponse } });
  } catch (error) {
    console.error('[Chat] Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to get chat response.' });
  }
}