import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClearableTextField,
  EnumPicker,
  FilterBar,
  FilterSchema,
  ListFilters,
  Npc,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { TFunction } from 'i18next';
import { NPC_CATEGORIES, npcCategoryLabel } from '../npc-categories';

/** Filters of the NPC list (spec 046): name, category and outlook, kept in the URL. */
export const npcFilters = (t: TFunction): FilterSchema<Npc> => ({
  q: { kind: 'text', label: t('name'), toRsql: (value) => `name=re=${value}` },
  category: {
    kind: 'single',
    label: t('category'),
    options: NPC_CATEGORIES,
    format: (value) => npcCategoryLabel(value, t),
    toRsql: (value) => `category==${value}`,
  },
  outlook: {
    kind: 'single',
    label: t('outlook-type'),
    format: (value) => t(`outlook-${value}`),
    toRsql: (value) => `outlookType==${value}`,
  },
});

/** Filter row of the NPC list. */
export default function NpcListFilters({
  filters,
  outlookTypes,
}: {
  filters: ListFilters<Npc>;
  outlookTypes: string[] | undefined;
}) {
  const { t } = useTranslation();
  const single = (key: string) => ({
    value: filters.get(key) || null,
    onChange: (id: string | null) => filters.set(key, id),
    allowAll: true,
    variant: 'select' as const,
  });
  // Built outside the JSX: the i18n lint reads string arguments there as visible text.
  const bind = { category: single('category'), outlook: single('outlook') };

  return (
    <FilterBar>
      <ClearableTextField
        label={t('name')}
        name="q"
        value={filters.get('q')}
        onChange={(value) => filters.set('q', value ?? '')}
      />
      <EnumPicker {...bind.category} label={t('category')} values={NPC_CATEGORIES} labelPrefix="npc-category-" />
      <EnumPicker {...bind.outlook} label={t('outlook-type')} values={outlookTypes ?? []} labelPrefix="outlook-" />
    </FilterBar>
  );
}
