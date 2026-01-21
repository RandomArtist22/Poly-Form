/**
 * Polyform Backend Server
 *
 * Express.js server providing AI-powered content processing API endpoints.
 * Uses Google Gemini AI for translation, summarization, quiz generation, and chat.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

// Configuration
const PORT = 3001;
const JSON_LIMIT = '50mb';

// Validate API key
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('Error: GEMINI_API_KEY is not set in environment');
  process.exit(1);
}

// Initialize Gemini client
const client = new GoogleGenAI({ apiKey: geminiApiKey });

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json({ limit: JSON_LIMIT }));

/**
 * Generates content using Gemini AI
 * @param {string} prompt - The prompt to send to the AI
 * @returns {Promise<string>} - The generated content
 */
async function generateContent(prompt) {
  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { thinkingConfig: { thinkingBudget: -1 } },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Creates an error response object
 * @param {string} message - Error message
 * @returns {Object} - Error response
 */
function errorResponse(message) {
  return { success: false, error: message };
}

/**
 * Creates a success response object
 * @param {Object} data - Response data
 * @returns {Object} - Success response
 */
function successResponse(data) {
  return { success: true, data };
}

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * POST /api/translate
 * Translates document content to a target language
 */
app.post('/api/translate', async (req, res) => {
  const { documentId, content, targetLanguage } = req.body;
  console.log(`[Translate] Document: ${documentId}, Language: ${targetLanguage}`);

  try {
    const prompt = `Translate the following content into ${targetLanguage}. Preserve any LaTeX formatting.

Content:
${content}

Translated Content:`;

    const translatedContent = await generateContent(prompt);

    if (!translatedContent?.trim()) {
      console.warn(`[Translate] Empty response for document: ${documentId}`);
      return res.status(500).json(
        errorResponse('Translation returned empty. Try different content or language.')
      );
    }

    res.json(successResponse({ translatedContent }));
  } catch (error) {
    console.error('[Translate] Error:', error.message);
    res.status(500).json(errorResponse('Failed to translate content.'));
  }
});

/**
 * POST /api/summarize
 * Generates a summary of document content
 */
app.post('/api/summarize', async (req, res) => {
  const { documentId, content, length } = req.body;
  console.log(`[Summarize] Document: ${documentId}, Length: ${length}`);

  try {
    const prompt = `Summarize the following content. The desired length is ${length}.

Content:
${content}

Summary:`;

    const summary = await generateContent(prompt);

    res.json(successResponse({ summary }));
  } catch (error) {
    console.error('[Summarize] Error:', error.message);
    res.status(500).json(errorResponse('Failed to generate summary.'));
  }
});

/**
 * POST /api/quiz
 * Generates a multiple-choice quiz from document content
 */
app.post('/api/quiz', async (req, res) => {
  const { documentId, content, count, difficulty } = req.body;
  console.log(`[Quiz] Document: ${documentId}, Count: ${count}, Difficulty: ${difficulty}`);

  try {
    const prompt = `Generate a multiple-choice quiz with ${count} questions based on the following content. The difficulty should be ${difficulty}. For each question, provide 4 options, the correct answer index (0-3), and a brief explanation. Preserve any LaTeX formatting.

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
]`;

    const quizText = await generateContent(prompt);

    // Parse JSON response
    let quiz;
    try {
      let cleanText = quizText.trim();

      // Remove markdown code blocks if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      quiz = JSON.parse(cleanText);

      // Add unique IDs to questions
      quiz.forEach((q, index) => {
        q.id = `q${index + 1}`;
      });
    } catch (parseError) {
      console.error('[Quiz] Parse error:', parseError.message);
      throw new Error('Failed to parse quiz response. Please try again.');
    }

    res.json(successResponse({ quiz: { questions: quiz } }));
  } catch (error) {
    console.error('[Quiz] Error:', error.message);
    res.status(500).json(errorResponse(error.message || 'Failed to generate quiz.'));
  }
});

/**
 * POST /api/chat
 * Provides AI chat responses about document content
 */
app.post('/api/chat', async (req, res) => {
  const { documentId, content, message } = req.body;
  console.log(`[Chat] Document: ${documentId}, Message: "${message.substring(0, 50)}..."`);

  try {
    const prompt = `You are a helpful AI assistant that answers questions about the following document. Provide accurate, relevant responses based on the document content. If the question cannot be answered from the document, say so politely.

Document Content:
${content}

User Question: ${message}

Please provide a helpful response:`;

    const botResponse = await generateContent(prompt);

    if (!botResponse?.trim()) {
      console.warn(`[Chat] Empty response for document: ${documentId}`);
      return res.status(500).json(errorResponse('Empty response. Please try again.'));
    }

    res.json(successResponse({ botResponse }));
  } catch (error) {
    console.error('[Chat] Error:', error.message);
    res.status(500).json(errorResponse('Failed to get chat response.'));
  }
});

// ============================================================================
// Server Startup
// ============================================================================

app.listen(PORT, () => {
  console.log(`Polyform backend running on http://localhost:${PORT}`);
});
