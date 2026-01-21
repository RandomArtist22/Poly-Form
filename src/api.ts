/**
 * API Client Module
 *
 * Handles all communication with the backend API endpoints.
 * Provides type-safe wrappers for translation, summarization, quiz, and chat operations.
 */

/** Base URL for API requests - uses environment variable or falls back to current origin */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:3001/api');

/** Generic API response structure */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Translation response data */
interface TranslationData {
  translatedContent: string;
}

/** Summarization response data */
interface SummaryData {
  summary: string;
}

/** Quiz response data */
interface QuizData {
  quiz: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
}

/** Chat response data */
interface ChatData {
  botResponse: string;
}

/**
 * Makes an API request to the backend
 * @param endpoint - API endpoint path
 * @param method - HTTP method (default: GET)
 * @param data - Request body data
 * @returns Promise with typed API response
 */
async function callApi<T>(
  endpoint: string,
  method: string = 'GET',
  data?: unknown
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || `HTTP error: ${response.status}`,
      };
    }

    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    return { success: false, error: message };
  }
}

/**
 * Translates document content to the specified language
 * @param documentId - Unique document identifier
 * @param content - Content to translate
 * @param targetLanguage - Target language code
 */
export function translateContent(
  documentId: string,
  content: string,
  targetLanguage: string
): Promise<ApiResponse<TranslationData>> {
  return callApi<TranslationData>('/translate', 'POST', {
    documentId,
    content,
    targetLanguage,
  });
}

/**
 * Generates a summary of document content
 * @param documentId - Unique document identifier
 * @param content - Content to summarize
 * @param length - Desired summary length
 */
export function summarizeContent(
  documentId: string,
  content: string,
  length: 'short' | 'medium' | 'detailed'
): Promise<ApiResponse<SummaryData>> {
  return callApi<SummaryData>('/summarize', 'POST', {
    documentId,
    content,
    length,
  });
}

/**
 * Generates a quiz from document content
 * @param documentId - Unique document identifier
 * @param content - Content to generate quiz from
 * @param count - Number of questions
 * @param difficulty - Quiz difficulty level
 */
export function generateQuiz(
  documentId: string,
  content: string,
  count: number,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<ApiResponse<QuizData>> {
  return callApi<QuizData>('/quiz', 'POST', {
    documentId,
    content,
    count,
    difficulty,
  });
}

/**
 * Sends a chat message about document content
 * @param documentId - Unique document identifier
 * @param content - Document content for context
 * @param message - User's chat message
 */
export function chatWithDocument(
  documentId: string,
  content: string,
  message: string
): Promise<ApiResponse<ChatData>> {
  return callApi<ChatData>('/chat', 'POST', {
    documentId,
    content,
    message,
  });
}
