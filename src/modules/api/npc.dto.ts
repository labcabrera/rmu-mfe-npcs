export interface Npc {
  id: string;
  realmId: string;
  category: string;
  name: string;
  level: number;
  hp: number;
  bd: number;
  at: number;
  initiative: number;
  skills: NpcSkill[];
  items: NpcItem[];
  attacks: NpcAttack[];
  description: string;
  imageUrl?: string;
  owner: string;
}

export type CreateNpcDto = Omit<Npc, 'id' | 'owner'>;

export type UpdateNpcDto = Partial<Omit<CreateNpcDto, 'id' | 'realmId' | 'owner'>>;

export interface NpcSkill {
  skillId: string;
  ranks: number | undefined;
  bonus: number;
}

export interface NpcItem {
  name: string;
  itemTypeId: string;
  amount: number;
}

export interface NpcAttack {
  name: string;
  attackTable: string;
  bo: number;
  fumble: number;
}

export const CREATE_NPC_TEMPLATE = {
  realmId: null,
  category: null,
  name: null,
  level: 1,
  bd: 0,
  at: 1,
  initiative: 0,
  skills: [],
  items: [],
  attacks: [],
  imageUrl: null,
  description: null,
} as CreateNpcDto;
