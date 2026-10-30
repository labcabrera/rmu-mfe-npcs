import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';
import {
  biomeLabel,
  ClearableTextField,
  CREATURE_SIZES,
  EnumPicker,
  FilterSchema,
  FilterSection,
  ListFilters,
  normalizeText,
  Npc,
  NPC_BIOMES,
  NPC_CATEGORIES,
  NumericInput,
  Realm,
  RealmPicker,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { TFunction } from 'i18next';
import { NPC_TYPES } from '../npc-constants';
import { npcName, npcTypeLabel } from '../npc-format';

const list = (value: string | string[]) => (Array.isArray(value) ? value : [value]);
const level = (value: string | string[]) => {
  const number = Number(value);
  return String(value).trim() !== '' && Number.isInteger(number) ? number : null;
};

/**
 * Filters of the NPC list (spec 054), kept in the URL. The name is matched on the client against the translated
 * name; the rest go to the API as RSQL.
 */
export const npcFilters = (t: TFunction, realms: Realm[] | undefined): FilterSchema<Npc> => ({
  q: {
    kind: 'text',
    label: t('name'),
    match: (npc, value) => normalizeText(npcName(npc, t)).includes(normalizeText(String(value).trim())),
  },
  realm: {
    kind: 'single',
    label: t('realm'),
    format: (value) => {
      const realm = realms?.find((each) => each.id === value);
      return realm ? t(realm.name) : value;
    },
    toRsql: (value) => `realmId==${value}`,
  },
  category: {
    kind: 'single',
    label: t('category'),
    options: NPC_CATEGORIES,
    format: (value) => t(`npc-category-${value}`),
    toRsql: (value) => `category==${value}`,
  },
  type: {
    kind: 'multiple',
    label: t('type'),
    options: NPC_TYPES,
    format: (value) => npcTypeLabel(value, t),
    toRsql: (value) => `type=in=(${list(value).join(',')})`,
  },
  size: {
    kind: 'multiple',
    label: t('size'),
    options: CREATURE_SIZES,
    format: (value) => t(`size-${value}`),
    toRsql: (value) => `size=in=(${list(value).join(',')})`,
  },
  levelMin: {
    kind: 'text',
    label: t('npc-level-min'),
    toRsql: (value) => (level(value) !== null ? `level>=${level(value)}` : null),
  },
  levelMax: {
    kind: 'text',
    label: t('npc-level-max'),
    toRsql: (value) => (level(value) !== null ? `level<=${level(value)}` : null),
  },
  biome: {
    kind: 'multiple',
    label: t('npc-biomes'),
    options: NPC_BIOMES,
    format: (value) => biomeLabel(value, t),
    // A biome also finds the creatures of its waters (`F` finds `Fw`).
    toRsql: (value) =>
      `encounter.biomes=in=(${list(value)
        .flatMap((code) => [code, `${code}w`])
        .join(',')})`,
  },
});

/** Sections of the side panel of the NPC list. */
export default function NpcListFilters({
  filters,
  realms,
}: {
  filters: ListFilters<Npc>;
  realms: Realm[] | undefined;
}) {
  const { t } = useTranslation();
  const single = (key: string) => ({
    value: filters.get(key) || null,
    onChange: (id: string | null) => filters.set(key, id),
    allowAll: true,
  });
  const multiple = (key: string) => ({
    mode: 'multiple' as const,
    value: filters.getAll(key),
    onChange: (ids: string[]) => filters.set(key, ids),
  });
  const levelInput = (key: string) => ({
    value: level(filters.get(key)),
    onChange: (value: number | null) => filters.set(key, value === null ? '' : String(value)),
    integer: true,
    min: 0,
    max: 100,
  });
  // Built outside the JSX: the i18n lint reads string arguments there as visible text.
  const bind = {
    realm: single('realm'),
    category: single('category'),
    type: multiple('type'),
    size: multiple('size'),
    biome: multiple('biome'),
    levelMin: levelInput('levelMin'),
    levelMax: levelInput('levelMax'),
  };

  return (
    <>
      <FilterSection title={t('search')} collapsible={false}>
        <ClearableTextField
          label={t('name')}
          name="q"
          value={filters.get('q')}
          onChange={(value) => filters.set('q', value ?? '')}
        />
      </FilterSection>
      <FilterSection title={t('npc-creature')}>
        <EnumPicker {...bind.category} label={t('category')} values={NPC_CATEGORIES} labelPrefix="npc-category-" />
        <EnumPicker
          {...bind.type}
          label={t('type')}
          values={NPC_TYPES}
          formatLabel={(value) => npcTypeLabel(value, t)}
        />
        <Stack direction="row" spacing={1}>
          <NumericInput {...bind.levelMin} name="levelMin" label={t('npc-level-min')} />
          <NumericInput {...bind.levelMax} name="levelMax" label={t('npc-level-max')} />
        </Stack>
        <EnumPicker {...bind.size} variant="select" label={t('size')} values={CREATURE_SIZES} labelPrefix="size-" />
      </FilterSection>
      <FilterSection title={t('npc-habitat')}>
        <EnumPicker
          {...bind.biome}
          variant="select"
          label={t('npc-biomes')}
          values={NPC_BIOMES}
          formatLabel={(value) => biomeLabel(value, t)}
        />
      </FilterSection>
      <FilterSection title={t('realm')}>
        <RealmPicker {...bind.realm} realms={realms} />
      </FilterSection>
    </>
  );
}
