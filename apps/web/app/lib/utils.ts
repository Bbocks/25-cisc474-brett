import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  const res = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}