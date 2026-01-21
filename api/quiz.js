/**
 * Quiz Generation API Handler (Vercel Serverless)
 *
 * Generates multiple-choice quizzes using Google Gemini AI.
 * Supports customizable question counts and difficulty levels.
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
 * Cleans markdown code blocks from AI response
 * @param {string} text - Raw response text
 * @returns {string} - Cleaned text
 */
function cleanJsonResponse(text) {
  let cleaned = text.trim();

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  return cleaned;
}

/**
 * Serverless handler for quiz generation requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function handler(req, res) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { documentId, content, count, difficulty } = req.body;
  console.log(`[Quiz] Document: ${documentId}, Count: ${count}, Difficulty: ${difficulty}`);

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate a multiple-choice quiz with ${count} questions based on the following content. The difficulty should be ${difficulty}. For each question, provide 4 options, the correct answer index (0-3), and a brief explanation. Preserve any LaTeX formatting.

Content:
${content}

Output format (JSON array):
[
  {
    "question": "Question text with LaTeX if applicable",
    "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
    "correctAnswer": 0,
    "explanation": "Explanation text with LaTeX if applicable"
  }
]`,
            },
          ],
        },
      ],
      config: { thinkingConfig: { thinkingBudget: -1 } },
    });

    const quizText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse and validate JSON
    let quiz;
    try {
      const cleanedText = cleanJsonResponse(quizText);
      quiz = JSON.parse(cleanedText);

      // Add unique IDs
      quiz.forEach((q, index) => {
        q.id = `q${index + 1}`;
      });
    } catch (parseError) {
      console.error('[Quiz] Parse error:', parseError.message);
      throw new Error('Failed to parse quiz response. Please try again.');
    }

    res.json({ success: true, data: { quiz: { questions: quiz } } });
  } catch (error) {
    console.error('[Quiz] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate quiz.',
    });
  }
}