import { getAuthHeaders, mergeJsonHeaders } from '../services/auth-token-service';
import { buildErrorFromResponse } from './api-errors';
import { Page } from './common.dto';
import { AddSkill, CreateNpcDto, Npc, UpdateNpcDto } from './npc.dto';

export async function fetchNpc(NpcId: string): Promise<Npc> {
  const url = `${process.env.RMU_API_NPCS_URL}/npcs/${NpcId}`;
  const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  return await response.json();
}

export async function fetchNpcs(rsql: string, page: number, size: number): Promise<Npc[]> {
  const url = `${process.env.RMU_API_NPCS_URL}/npcs?q=${rsql}&page=${page}&size=${size}`;
  const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  const pageContent = await response.json();
  return pageContent.content;
}

export async function fetchPagedNpcs(rsql: string, page: number, size: number): Promise<Page<Npc>> {
  const url = `${process.env.RMU_API_NPCS_URL}/npcs?q=${rsql}&page=${page}&size=${size}`;
  const response = await fetch(url, { method: 'GET', headers: getAuthHeaders() });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  const pageContent = await response.json();
  return pageContent;
}

export async function createNpc(Npc: CreateNpcDto): Promise<Npc> {
  const url = `${process.env.RMU_API_NPCS_URL}/npcs`;
  const response = await fetch(url, {
    method: 'POST',
    headers: mergeJsonHeaders(),
    body: JSON.stringify(Npc),
  });
  if (response.status !== 201) {
    throw await buildErrorFromResponse(response, url);
  }
  return await response.json();
}

export async function updateNpc(NpcId: string, dto: UpdateNpcDto): Promise<Npc> {
  const url = `${process.env.RMU_API_NPCS_URL}/npcs/${NpcId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: mergeJsonHeaders(),
    body: JSON.stringify(dto),
  });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  return await response.json();
}

export async function addNpcSkill(npcId: string, dto: AddSkill): Promise<Npc> {
  const url = `${process.env.RMU_API_NPCS_URL}/npcs/${npcId}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: mergeJsonHeaders(),
    body: JSON.stringify(dto),
  });
  if (response.status !== 200) {
    throw await buildErrorFromResponse(response, url);
  }
  return await response.json();
}

export async function deleteNpc(realmId: string): Promise<void> {
  const url = `${process.env.RMU_API_NPCS_URL}/npcs/${realmId}`;
  const response = await fetch(url, { method: 'DELETE', headers: getAuthHeaders() });
  if (response.status !== 204) {
    throw await buildErrorFromResponse(response, url);
  }
}
