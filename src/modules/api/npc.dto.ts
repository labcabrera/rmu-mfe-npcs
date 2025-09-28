export interface Npc {
  id: string;
  realmId: string;
  category: string;
  name: string;
  level: number;
  bd: number;
  at: number;
  description: string;
  imageUrl?: string;
  owner: string;
}

export type CreateNpcDto = Omit<Npc, 'id' | 'realmId' | 'owner'>;

export type UpdateNpcDto = Partial<Omit<CreateNpcDto, 'id' | 'realmId' | 'owner'>>;
