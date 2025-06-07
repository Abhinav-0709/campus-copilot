interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { error: error.message || 'An error occurred' };
    }

    const data = await response.json().catch(() => ({}));
    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: 'Network error occurred' };
  }
}

export const databaseApi = {
  getResponse: async (input: string): Promise<string> => {
    const { data, error } = await apiRequest<{ response: string }>('/api/database', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getResponse',
        input,
      }),
    });

    if (error) throw new Error(error);
    return data?.response || 'I apologize, but I could not process your request.';
  },

  saveConversation: async (sessionId: string, userMessage: string, botResponse: string): Promise<void> => {
    const { error } = await apiRequest<void>('/api/database', {
      method: 'POST',
      body: JSON.stringify({
        action: 'saveConversation',
        sessionId,
        userMessage,
        botResponse,
      }),
    });

    if (error) console.error('Failed to save conversation:', error);
  },
};
