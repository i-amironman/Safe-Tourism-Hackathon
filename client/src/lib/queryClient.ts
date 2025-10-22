import { QueryClient } from "@tanstack/react-query";

async function defaultFetcher<T = any>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }

    const message = await res.text();
    throw new Error(message);
  }

  return res.json();
}

export async function apiRequest<T = any>(
  url: string,
  method: string,
  data?: any
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }

    const message = await res.text();
    throw new Error(message);
  }

  return res.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        return defaultFetcher(url);
      },
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});
