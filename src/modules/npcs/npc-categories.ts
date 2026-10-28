import { TFunction } from 'i18next';

/** Categories of an NPC, the values stored in `category`. */
export const NPC_CATEGORIES: readonly string[] = [
  'humanoid',
  'beast',
  'undead',
  'dragon',
  'giant',
  'construct',
  'elemental',
  'fey',
  'aberration',
  'celestial',
  'monstrosity',
  'ooze',
  'plant',
];

/** Label of a category: `npc-category-<category>`, or the category key as before. */
export const npcCategoryLabel = (category: string, t: TFunction): string =>
  t(`npc-category-${category}`, { defaultValue: t(category) });
