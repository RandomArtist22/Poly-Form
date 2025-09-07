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

  const { documentId, content, length } = req.body;
  console.log(`Summarizing document ${documentId} with length ${length}`);

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Summarize the following content. The desired length is ${length}.

Content:
${content}

Summary:`
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

    const summary = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.json({ success: true, data: { summary } });
  } catch (error) {
    console.error('Error calling Gemini API for summarization:', error);
    res.status(500).json({ success: false, error: 'Failed to generate summary using Gemini API.' });
  }
}