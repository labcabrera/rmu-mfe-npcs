import {
  CreateNpcDto,
  Npc,
  NpcAttack,
  NpcMovement,
  npcAttackNotation,
  NpcSkill,
  UpdateNpcDto,
} from '@labcabrera-rmu/rmu-react-shared-lib';

/** The editable fields of an NPC: the identity, owner, book source and timestamps are not sent. */
export type NpcForm = Omit<Npc, 'id' | 'version' | 'owner' | 'source' | 'createdAt' | 'updatedAt'>;

export type SetNpcForm = (change: Partial<NpcForm>) => void;

export const emptyCriticalCodes = (): NpcForm['criticalCodes'] => ({
  reduceSeverity: false,
  noKnockdown: false,
  stunImmune: false,
  bleedImmune: false,
  immunities: [],
});

export const emptyNpcForm = (): NpcForm => ({
  realmId: '',
  accessType: 'private',
  name: '',
  category: 'animal',
  type: null,
  group: null,
  level: 1,
  levelSpread: null,
  outlookType: null,
  archetype: null,
  movement: [],
  endurance: null,
  size: 'medium',
  criticalSize: null,
  criticalCodes: emptyCriticalCodes(),
  hp: 10,
  deathHits: null,
  at: 1,
  db: 0,
  running: null,
  shield: null,
  initiative: 0,
  attacks: [],
  powerPoints: null,
  resistances: null,
  skills: [],
  encounter: null,
  stats: null,
  details: null,
  talents: [],
  items: [],
  description: null,
  imageUrl: null,
});

/** The form of a stored NPC. */
export const npcToForm = (npc: Npc): NpcForm => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { id, version, owner, source, createdAt, updatedAt, ...rest } = npc;
  return { ...emptyNpcForm(), ...rest, criticalCodes: rest.criticalCodes ?? emptyCriticalCodes() };
};

export const newAttack = (): NpcAttack => ({
  ob: 0,
  size: 5,
  attackTable: '',
  fumbleTable: null,
  additionalCritical: null,
  sequence: null,
  cooperation: null,
  kata: null,
  alternativeTo: null,
  poison: null,
  hand: null,
  notation: null,
});

export const newMovement = (): NpcMovement => ({ mode: 'walk', tier: null, baseRate: 20, maxPace: 'dash', note: null });

export const newSkill = (skillId: string, specialization: string | null): NpcSkill => ({
  skillId,
  specialization,
  ranks: null,
  bonus: 0,
  note: null,
});

/** The first problem of the form, as an i18n key, or null when it can be saved. */
export const npcFormError = (form: NpcForm): string | null => {
  if (!form.name.trim()) return 'npc-error-name';
  if (!form.realmId) return 'npc-error-realm';
  if (form.attacks.some((attack) => !attack.attackTable)) return 'npc-error-attack-table';
  if (form.encounter && !form.encounter.group.trim()) return 'npc-error-encounter-group';
  if (form.shield && !form.shield.type.trim()) return 'npc-error-shield-type';
  return null;
};

// An attack changed in the form has no printed notation: it gets the one built from its fields.
const withNotations = (form: NpcForm): NpcForm => ({
  ...form,
  attacks: form.attacks.map((attack) =>
    attack.notation ? attack : { ...attack, notation: npcAttackNotation(attack) }
  ),
});

export const npcCreateRequest = (form: NpcForm, admin: boolean): CreateNpcDto => {
  const request = withNotations(form);
  return admin ? request : { ...request, accessType: 'private' };
};

/** The PATCH of a stored NPC: everything but the realm, with the version read so a stale change is a 409. */
export const npcUpdateRequest = (form: NpcForm, version: number, admin: boolean): UpdateNpcDto => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { realmId, accessType, ...rest } = withNotations(form);
  return { ...rest, ...(admin ? { accessType } : {}), version };
};
