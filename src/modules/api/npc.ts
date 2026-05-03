import { AuthContextProps } from 'react-oidc-context';
import { callApi, Page } from '@labcabrera-rmu/rmu-react-shared-lib';
import { apiNpcUrl } from '../services/config';
import { AddNpcAttack, AddSkill, CreateNpcDto, Npc, UpdateNpcDto } from './npc.dto';

export async function fetchNpc(NpcId: string, auth: AuthContextProps): Promise<Npc> {
  const url = `${apiNpcUrl}/npcs/${NpcId}`;
  return await callApi(auth, url, { method: 'GET' });
}

export async function fetchNpcs(rsql: string, page: number, size: number, auth: AuthContextProps): Promise<Page<Npc>> {
  const url = `${apiNpcUrl}/npcs?q=${rsql}&page=${page}&size=${size}`;
  return await callApi(auth, url, { method: 'GET' });
}

export async function createNpc(Npc: CreateNpcDto, auth: AuthContextProps): Promise<Npc> {
  const url = `${apiNpcUrl}/npcs`;
  return await callApi(auth, url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Npc),
  });
}

export async function updateNpc(NpcId: string, dto: UpdateNpcDto, auth: AuthContextProps): Promise<Npc> {
  const url = `${apiNpcUrl}/npcs/${NpcId}`;
  return await callApi(auth, url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}

export async function addNpcSkill(npcId: string, dto: AddSkill, auth: AuthContextProps): Promise<Npc> {
  const url = `${apiNpcUrl}/npcs/${npcId}/skills`;
  return await callApi(auth, url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}

export async function removeNpcSkill(npcId: string, skillId: string, auth: AuthContextProps): Promise<Npc> {
  const url = `${apiNpcUrl}/npcs/${npcId}/skills/${skillId}`;
  return await callApi(auth, url, { method: 'DELETE' });
}

export async function addNpcAttack(npcId: string, dto: AddNpcAttack, auth: AuthContextProps): Promise<Npc> {
  const url = `${apiNpcUrl}/npcs/${npcId}/attacks`;
  return await callApi(auth, url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}

export async function removeNpcAttack(npcId: string, attackName: string, auth: AuthContextProps): Promise<Npc> {
  const url = `${apiNpcUrl}/npcs/${npcId}/attacks/${attackName}`;
  return await callApi(auth, url, { method: 'DELETE' });
}

export async function deleteNpc(npcId: string, auth: AuthContextProps): Promise<void> {
  const url = `${apiNpcUrl}/npcs/${npcId}`;
  return await callApi(auth, url, { method: 'DELETE' });
}
