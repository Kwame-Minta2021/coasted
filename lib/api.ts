'use client';
import { getIdToken } from './auth';

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = await getIdToken();
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers, cache: 'no-store' });
}
