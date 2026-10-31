import {
  ENCOUNTER_POPULATIONS,
  EncounterModifierRequest,
  EncounterModifierSetting,
  EncounterPopulation,
  EncounterSide,
  EncounterTableSummary,
  ResolveEncounterRequest,
} from '@labcabrera-rmu/rmu-react-shared-lib';

/**
 * Where the party is (spec 061, step 1), kept in the URL query so a refresh or a repeated encounter in the same zone
 * keeps it: `table`, `region`, `water`, `land`, `population`, `mods` (`key` or `key:value`, comma separated), `cmod`,
 * `skip` and `party`.
 */
export interface EncounterSituation {
  tableId: string | null;
  /** Biome table for "Roll on Biome Table" when the table is a location or a universal one. */
  regionTableId: string | null;
  water: boolean;
  land: boolean;
  population: EncounterPopulation;
  /** Checked Table 15.4a modifiers: the value entered for a variable one, null for a fixed one or one not entered. */
  modifiers: Record<string, number | null>;
  /** GM bonus to open creature rolls. */
  creatureModifier: number;
  /** Go straight to the creature roll. */
  skipCheck: boolean;
  /** Total levels of the party, for the 15.1 balance hint. */
  partyLevels: number | null;
}

/** The two rolls of the encounter check, in the order they are shown. */
export const ENCOUNTER_SIDES: EncounterSide[] = ['avoidance', 'activity'];

const DEFAULT_POPULATION: EncounterPopulation = 'light';

const toInt = (text: string | null): number | null => {
  if (text === null || text.trim() === '') return null;
  const value = Number(text);
  return Number.isFinite(value) ? Math.trunc(value) : null;
};

export function readSituation(params: URLSearchParams): EncounterSituation {
  const population = params.get('population') as EncounterPopulation | null;
  const modifiers: Record<string, number | null> = {};
  for (const token of (params.get('mods') ?? '').split(',')) {
    if (!token) continue;
    const [key, value] = token.split(':');
    if (key) modifiers[key] = toInt(value ?? null);
  }
  return {
    tableId: params.get('table') || null,
    regionTableId: params.get('region') || null,
    water: params.get('water') === '1',
    land: params.get('land') !== '0',
    population: population && ENCOUNTER_POPULATIONS.includes(population) ? population : DEFAULT_POPULATION,
    modifiers,
    creatureModifier: toInt(params.get('cmod')) ?? 0,
    skipCheck: params.get('skip') === '1',
    partyLevels: toInt(params.get('party')),
  };
}

export function writeSituation(situation: EncounterSituation): URLSearchParams {
  const params = new URLSearchParams();
  if (situation.tableId) params.set('table', situation.tableId);
  if (situation.regionTableId) params.set('region', situation.regionTableId);
  if (situation.water) params.set('water', '1');
  if (!situation.land) params.set('land', '0');
  if (situation.population !== DEFAULT_POPULATION) params.set('population', situation.population);
  const mods = Object.entries(situation.modifiers).map(([key, value]) => (value === null ? key : `${key}:${value}`));
  if (mods.length > 0) params.set('mods', mods.join(','));
  if (situation.creatureModifier) params.set('cmod', String(situation.creatureModifier));
  if (situation.skipCheck) params.set('skip', '1');
  if (situation.partyLevels !== null) params.set('party', String(situation.partyLevels));
  return params;
}

/** Checks or unchecks a modifier; checking one of a group unchecks the rest of that group. */
export function toggleModifier(
  situation: EncounterSituation,
  settings: EncounterModifierSetting[],
  key: string,
  checked: boolean,
  value: number | null = null
): EncounterSituation {
  const setting = settings.find((each) => each.key === key);
  const modifiers = { ...situation.modifiers };
  if (setting?.group) {
    for (const other of settings) if (other.group === setting.group) delete modifiers[other.key];
  }
  if (checked) modifiers[key] = value;
  else delete modifiers[key];
  return { ...situation, modifiers };
}

/** The checked modifiers of one side, known to the settings. */
export const checkedModifiers = (
  situation: EncounterSituation,
  settings: EncounterModifierSetting[],
  side: EncounterSide
): EncounterModifierSetting[] =>
  settings.filter((setting) => setting.side === side && setting.key in situation.modifiers);

/** The modifiers of one side as the API takes them: a value only for the variable ones. */
export const modifierRequests = (
  situation: EncounterSituation,
  settings: EncounterModifierSetting[],
  side: EncounterSide
): EncounterModifierRequest[] =>
  checkedModifiers(situation, settings, side).map((setting) =>
    setting.value === null ? { key: setting.key, value: situation.modifiers[setting.key] ?? 0 } : { key: setting.key }
  );

/** Sum of the checked modifiers of one side. */
export const modifierTotal = (
  situation: EncounterSituation,
  settings: EncounterModifierSetting[],
  side: EncounterSide
): number =>
  checkedModifiers(situation, settings, side).reduce(
    (sum, setting) => sum + (setting.value ?? situation.modifiers[setting.key] ?? 0),
    0
  );

/** Checked variable modifiers with no value yet: the API rejects them. */
export const missingValues = (situation: EncounterSituation, settings: EncounterModifierSetting[]): string[] =>
  settings
    .filter((setting) => setting.value === null && setting.key in situation.modifiers)
    .filter((setting) => situation.modifiers[setting.key] === null)
    .map((setting) => setting.key);

/** The fields of a resolve request that come from the situation. */
export const situationRequest = (
  situation: EncounterSituation,
  tables: EncounterTableSummary[]
): Omit<ResolveEncounterRequest, 'rolls' | 'unmodified' | 'check'> => {
  const table = tables.find((each) => each.id === situation.tableId);
  const regionTableId = table?.kind === 'biome' ? table.id : situation.regionTableId;
  return {
    tableId: situation.tableId ?? '',
    ...(regionTableId ? { regionTableId } : {}),
    water: situation.water,
    land: situation.land,
    creatureModifier: situation.creatureModifier,
  };
};
