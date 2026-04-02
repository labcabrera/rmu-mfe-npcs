import { getAuthHeaders } from '../services/auth-token-service';
import { apiCoreUrl } from '../services/config';
import { buildErrorFromResponse } from './api-errors';
import { Page } from './common.dto';
import { Enumeration } from './enumerations.dto';

export async function fetchEnumerationCategories(): Promise<string[]> {
  const url = `${apiCoreUrl}/enumeration-categories`;
  const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  return await response.json();
}

export async function fetchEnumeration(id: string): Promise<Enumeration> {
  const url = `${apiCoreUrl}/enumerations/${id}`;
  const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  return await response.json();
}

export async function fetchEnumerations(rsql: string, page: number, size: number): Promise<Page<Enumeration>> {
  const url = `${apiCoreUrl}/enumerations?q=${rsql}&page=${page}&size=${size}`;
  const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  const pageContent = await response.json();
  return pageContent;
}
