const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la petición API');
  }

  // Si la respuesta es un PDF u otro blob
  if (response.headers.get('Content-Type')?.includes('application/pdf')) {
    return (await response.blob()) as unknown as T;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}
