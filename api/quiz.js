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

  const { documentId, content, count, difficulty } = req.body;
  console.log(`Generating ${count} ${difficulty} quizzes for document ${documentId}`);

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a multiple-choice quiz with ${count} questions based on the following content. The difficulty should be ${difficulty}. For each question, provide 4 options, the correct answer index (0-3), and a brief explanation. Ensure to preserve any LaTeX formatting.

Content:
${content}

Output format (JSON array of objects):
[
  {
    "question": "Question text with LaTeX if applicable",
    "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
    "correctAnswer": 0,
    "explanation": "Explanation text with LaTeX if applicable"
  }
]`
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

    const quizText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let quiz;
    try {
      let cleanQuizText = quizText.trim();
      if (cleanQuizText.startsWith('```json')) {
        cleanQuizText = cleanQuizText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanQuizText.startsWith('```')) {
        cleanQuizText = cleanQuizText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      quiz = JSON.parse(cleanQuizText);
      quiz.forEach((q, index) => q.id = `q${index + 1}`);
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      throw new Error('Failed to parse quiz response from AI. Please try again.');
    }

    res.json({ success: true, data: { quiz: { questions: quiz } } });
  } catch (error) {
    console.error('Error calling Gemini API for quiz generation:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate quiz using Gemini API.' });
  }
}