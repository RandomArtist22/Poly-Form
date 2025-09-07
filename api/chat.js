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

  const { documentId, content, message } = req.body;
  console.log(`Chatting about document ${documentId}. User message: "${message}"`);

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a helpful AI assistant that can answer questions about the following document content. Provide accurate, relevant responses based on the document. If the question cannot be answered from the document, say so politely.

Document Content:
${content}

User Question: ${message}

Please provide a helpful response:`
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

    const botResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!botResponse || botResponse.trim() === '') {
      console.warn('Gemini API returned empty chat response for document:', documentId);
      return res.status(500).json({ success: false, error: 'Gemini API returned an empty response. Please try again.' });
    }

    res.json({ success: true, data: { botResponse } });
  } catch (error) {
    console.error('Error calling Gemini API for chat:', error);
    res.status(500).json({ success: false, error: 'Failed to get chat response using Gemini API.' });
  }
}