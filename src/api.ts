// src/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin + '/api' : 'http://localhost:3001/api'); // Use environment variable or same origin for Vercel

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const callApi = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    console.log('Making API call to:', url, 'with data:', data);
    const response = await fetch(url, config);
    console.log('API response status:', response.status);
    console.log('API response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('API error response:', errorData);
      return { success: false, error: errorData.message || `HTTP error! status: ${response.status}` };
    }

    const rawResponse = await response.json();
    console.log('Raw backend response:', rawResponse);

    // The backend already returns { success, data, error }, so we return it as-is
    return rawResponse as ApiResponse<T>;
  } catch (error: any) {
    console.log('API call error:', error);
    return { success: false, error: error.message || 'Network error' };
  }
};

// Define specific API functions for each feature
export const translateContent = async (documentId: string, content: string, targetLanguage: string) => {
  return callApi<{ translatedContent: string }>('/translate', 'POST', { documentId, content, targetLanguage });
};

export const summarizeContent = async (documentId: string, content: string, length: 'short' | 'medium' | 'detailed') => {
  return callApi<{ summary: string }>('/summarize', 'POST', { documentId, content, length });
};

export const generateQuiz = async (documentId: string, content: string, count: number, difficulty: 'easy' | 'medium' | 'hard') => {
  return callApi<{ quiz: any }>('/quiz', 'POST', { documentId, content, count, difficulty });
};

export const chatWithDocument = async (documentId: string, content: string, message: string) => {
  return callApi<{ botResponse: string }>('/chat', 'POST', { documentId, content, message });
};
