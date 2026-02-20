'use server';

import { createClient } from '@/lib/supabase/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getServerApiHeaders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  return headers;
}

export async function fetchServerApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await getServerApiHeaders();
  const url = `${API_BASE_URL}${path}`;

  console.log(`[fetchServerApi] Calling: ${url}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    const errorBody = await response.text().catch(() => 'No body');
    console.error(
      `API Error details: [${response.status}] ${response.statusText} - Body: ${errorBody}`,
    );
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
