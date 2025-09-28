export interface Npc {
  id: string;
  realmId: string;
  category: string;
  name: string;
  level: number;
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
  bonus: number;
}

export interface NpcItem {
  name: string;
  itemTypeId: string;
  amount: number;
}

export interface NpcAttack {
  name: string;
  bo: number;
}
