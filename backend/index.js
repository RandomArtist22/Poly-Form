require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const app = express();
const PORT = 3001;

// Access your API key as an environment variable
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('GEMINI_API_KEY is not set in the .env file');
  process.exit(1);
}
const client = new GoogleGenAI({ apiKey: geminiApiKey });

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit to 50mb

// Translation Endpoint
app.post('/api/translate', async (req, res) => {
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

    console.log('Gemini API Raw Translation Response:', translatedContent);

    if (!translatedContent || translatedContent.trim() === '') {
      console.warn('Gemini API returned empty translation for document:', documentId);
      return res.status(500).json({ success: false, error: 'Gemini API returned an empty translation. Please try again with different content or language.' });
    }

    res.json({ success: true, data: { translatedContent } });
  } catch (error) {
    console.error('Error calling Gemini API for translation:', error);
    console.error('Gemini API Error Details:', error);
    res.status(500).json({ success: false, error: 'Failed to translate content using Gemini API.' });
  }
});

// Summarization Endpoint
app.post('/api/summarize', async (req, res) => {
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
    console.error('Gemini API Error Details:', error);
    res.status(500).json({ success: false, error: 'Failed to generate summary using Gemini API.' });
  }
});

// Quiz Generation Endpoint
app.post('/api/quiz', async (req, res) => {
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

    // Attempt to parse the JSON response
    let quiz;
    try {
      // Remove markdown code blocks if present
      let cleanQuizText = quizText.trim();
      if (cleanQuizText.startsWith('```json')) {
        cleanQuizText = cleanQuizText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanQuizText.startsWith('```')) {
        cleanQuizText = cleanQuizText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      quiz = JSON.parse(cleanQuizText);
      // Add unique IDs to questions
      quiz.forEach((q, index) => q.id = `q${index + 1}`);
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      console.error('Raw quiz text:', quizText);
      throw new Error('Failed to parse quiz response from AI. Please try again.');
    }

    res.json({ success: true, data: { quiz: { questions: quiz } } });
  } catch (error) {
    console.error('Error calling Gemini API for quiz generation:', error);
    console.error('Gemini API Error Details:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate quiz using Gemini API.' });
  }
});

// Chat with Document Endpoint
app.post('/api/chat', async (req, res) => {
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

    console.log('Gemini API Chat Response:', botResponse);

    if (!botResponse || botResponse.trim() === '') {
      console.warn('Gemini API returned empty chat response for document:', documentId);
      return res.status(500).json({ success: false, error: 'Gemini API returned an empty response. Please try again.' });
    }

    res.json({ success: true, data: { botResponse } });
  } catch (error) {
    console.error('Error calling Gemini API for chat:', error);
    console.error('Gemini API Error Details:', error);
    res.status(500).json({ success: false, error: 'Failed to get chat response using Gemini API.' });
  }
});


app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
