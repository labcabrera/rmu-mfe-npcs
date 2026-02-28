import { getAuthHeaders } from '../services/auth-token-service';
import { buildErrorFromResponse } from './api-errors';

export async function fetchAttackTables(): Promise<string[]> {
  const url = `${process.env.RMU_API_ATTACK_TABLES_URL}/attack-tables`;
  const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  return await response.json();
}

export async function fetchFumbleTables(): Promise<string[]> {
  const url = `${process.env.RMU_API_ATTACK_TABLES_URL}/fumble-tables`;
  const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  return await response.json();
}
