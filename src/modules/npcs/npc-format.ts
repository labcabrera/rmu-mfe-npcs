import type { AuthContextProps } from 'react-oidc-context';
import { isAdmin, Npc } from '@labcabrera-rmu/rmu-react-shared-lib';
import { TFunction } from 'i18next';

/** A creature of the public catalog (imported from a book), as opposed to an NPC of a user. */
export const isCatalogNpc = (npc: Pick<Npc, 'accessType'>): boolean => npc.accessType === 'public';

/** Who can change or delete an NPC: an admin, or the owner of a private one (spec 054). */
export const canChangeNpc = (auth: AuthContextProps, npc: Npc | undefined): boolean =>
  !!npc && (isAdmin(auth) || (!isCatalogNpc(npc) && npc.owner === auth.user?.profile?.sub));

/** Name of an NPC: the translated name of a book creature (`creature-<key>`), the stored name otherwise. */
export const npcName = (npc: Pick<Npc, 'name' | 'source'>, t: TFunction): string =>
  npc.source?.key ? t(`creature-${npc.source.key}`, { defaultValue: npc.name }) : npc.name;

/** Images of `images/npcs/` reused by creature group or key; the rest use the generic one. */
const imageOf = (npc: Pick<Npc, 'group' | 'source' | 'name'>): string => {
  const key = npc.source?.key ?? npc.name.toLowerCase();
  if (key.includes('wolf')) return 'wolf';
  if (key.includes('warg')) return 'warg.alt';
  if (key.startsWith('lion')) return 'lion';
  if (['tiger', 'cheetah', 'smilodon'].some((each) => key.includes(each))) return 'panther';
  if (key.startsWith('horse-war')) return 'war-horse';
  switch (npc.group) {
    case 'bears':
      return 'bear';
    case 'boar':
    case 'elothere':
      return 'boar';
    case 'cats':
      return 'cat';
    case 'dogs':
      return 'dog';
    case 'birds-of-prey':
      return 'eagle';
    case 'horses':
      return 'horse';
    default:
      return 'unknown';
  }
};

/** Image of an NPC (an asset path): its own, or the one of its creature group. */
export const npcImage = (npc: Pick<Npc, 'imageUrl' | 'group' | 'source' | 'name'>): string =>
  npc.imageUrl || `images/npcs/${imageOf(npc)}.png`;

/** Label of a creature type (`carnivore`): `npc-type-<type>`, or the type as stored. */
export const npcTypeLabel = (type: string, t: TFunction): string => t(`npc-type-${type}`, { defaultValue: type });
