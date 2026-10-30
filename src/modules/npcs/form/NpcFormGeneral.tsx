import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, Grid, Switch, TextField } from '@mui/material';
import {
  EnumPicker,
  NPC_ARCHETYPES,
  NPC_CATEGORIES,
  NPC_LEVEL_SPREADS,
  NPC_OUTLOOK_TYPES,
  NpcArchetype,
  NpcCategory,
  NpcLevelSpread,
  NpcOutlookType,
  NumericInput,
  Panel,
  Realm,
  RealmPicker,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { NPC_TYPES } from '../npc-constants';
import { npcTypeLabel } from '../npc-format';
import { NpcForm, SetNpcForm } from './npc-form';

/** Name, realm, classification and level. Only an admin sees the public switch (the catalog). */
const NpcFormGeneral: FC<{
  form: NpcForm;
  set: SetNpcForm;
  realms: Realm[] | undefined;
  mode: 'create' | 'edit';
  admin: boolean;
}> = ({ form, set, realms, mode, admin }) => {
  const { t } = useTranslation();
  const types: readonly string[] =
    form.type && !NPC_TYPES.includes(form.type as (typeof NPC_TYPES)[number]) ? [...NPC_TYPES, form.type] : NPC_TYPES;
  return (
    <Panel title={t('npc-section-general')}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label={t('name')}
            name="name"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            error={!form.name.trim()}
            required
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RealmPicker
            variant="select"
            name="realm"
            value={form.realmId || null}
            onChange={(realmId) => set({ realmId: realmId ?? '' })}
            realms={realms}
            disabled={mode === 'edit'}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <EnumPicker
            variant="select"
            label={t('category')}
            name="category"
            values={NPC_CATEGORIES}
            labelPrefix="npc-category-"
            value={form.category}
            onChange={(value) => set({ category: (value ?? 'other') as NpcCategory })}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <EnumPicker
            variant="select"
            label={t('type')}
            name="type"
            values={types}
            formatLabel={(value) => npcTypeLabel(value, t)}
            value={form.type}
            onChange={(value) => set({ type: value })}
            clearable
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <TextField
            label={t('group')}
            name="group"
            value={form.group ?? ''}
            onChange={(e) => set({ group: e.target.value || null })}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <NumericInput
            label={t('level')}
            name="level"
            value={form.level}
            onChange={(value) => set({ level: value ?? 0 })}
            integer
            min={0}
            max={200}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 3 }}>
          <EnumPicker
            variant="select"
            label={t('npc-level-spread')}
            name="levelSpread"
            values={NPC_LEVEL_SPREADS}
            labelPrefix="level-spread-"
            value={form.levelSpread}
            onChange={(value) => set({ levelSpread: value as NpcLevelSpread | null })}
            clearable
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EnumPicker
            variant="select"
            label={t('outlook-type')}
            name="outlookType"
            values={NPC_OUTLOOK_TYPES}
            labelPrefix="outlook-"
            value={form.outlookType}
            onChange={(value) => set({ outlookType: value as NpcOutlookType | null })}
            clearable
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <EnumPicker
            variant="select"
            label={t('archetype')}
            name="archetype"
            values={NPC_ARCHETYPES}
            labelPrefix="npc-archetype-"
            value={form.archetype}
            onChange={(value) => set({ archetype: value as NpcArchetype | null })}
            clearable
          />
        </Grid>
        {admin && (
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.accessType === 'public'}
                  onChange={(e) => set({ accessType: e.target.checked ? 'public' : 'private' })}
                />
              }
              label={t('npc-public-catalog')}
            />
          </Grid>
        )}
        <Grid size={12}>
          <TextField
            label={t('description')}
            name="description"
            value={form.description ?? ''}
            onChange={(e) => set({ description: e.target.value || null })}
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>
      </Grid>
    </Panel>
  );
};

export default NpcFormGeneral;
