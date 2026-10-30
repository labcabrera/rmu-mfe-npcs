import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, Grid, Switch, TextField } from '@mui/material';
import {
  biomeLabel,
  EnumPicker,
  NPC_BIOME_CODES,
  NPC_RESISTANCES,
  NpcBiome,
  NpcDetails,
  NpcEncounter,
  NpcResistances,
  NpcStats,
  NumericInput,
  Panel,
  statKeys,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { NpcForm, SetNpcForm } from './npc-form';

const DETAIL_KEYS = ['variants', 'height', 'armorDescription', 'treasure', 'magicRealm', 'misc'] as const;

const zeroResistances = (): NpcResistances => ({ channeling: 0, essence: 0, mentalism: 0, physical: 0, fear: 0 });
const zeroStats = (): NpcStats => ({ ag: 0, co: 0, em: 0, in: 0, me: 0, pr: 0, qu: 0, re: 0, sd: 0, st: 0 });
const emptyEncounter = (): NpcEncounter => ({ group: '', dice: null, biomes: [], frequency: null });
const emptyDetails = (): NpcDetails => ({
  variants: null,
  height: null,
  armorDescription: null,
  treasure: null,
  magicRealm: null,
  misc: null,
});

/** RRs, stat bonuses, where and how the creature is found, and the short details. Each block can be left empty. */
const NpcFormProfile: FC<{ form: NpcForm; set: SetNpcForm }> = ({ form, set }) => {
  const { t } = useTranslation();
  const toggle = (label: string, checked: boolean, onChange: (checked: boolean) => void) => (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={label}
    />
  );
  const encounter = form.encounter;
  const setEncounter = (change: Partial<NpcEncounter>) => set({ encounter: { ...encounter!, ...change } });

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Panel title={t('resistances')}>
          {toggle(t('npc-has-resistances'), !!form.resistances, (checked) =>
            set({ resistances: checked ? zeroResistances() : null })
          )}
          {form.resistances && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {NPC_RESISTANCES.map((key) => (
                <Grid key={key} size={{ xs: 6, sm: 4 }}>
                  <NumericInput
                    label={t(key)}
                    name={`rr-${key}`}
                    value={form.resistances![key]}
                    onChange={(value) => set({ resistances: { ...form.resistances!, [key]: value ?? 0 } })}
                    integer
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Panel>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Panel title={t('stats')}>
          {toggle(t('npc-has-stats'), !!form.stats, (checked) => set({ stats: checked ? zeroStats() : null }))}
          {form.stats && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {statKeys.map((key) => (
                <Grid key={key} size={{ xs: 6, sm: 4, md: 6, lg: 4 }}>
                  <NumericInput
                    label={t(key)}
                    name={`stat-${key}`}
                    value={form.stats![key]}
                    onChange={(value) => set({ stats: { ...form.stats!, [key]: value ?? 0 } })}
                    integer
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Panel>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Panel title={t('npc-encounter')}>
          {toggle(t('npc-has-encounter'), !!encounter, (checked) =>
            set({ encounter: checked ? emptyEncounter() : null })
          )}
          {encounter && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label={t('npc-encounter-group')}
                  name="encounterGroup"
                  value={encounter.group}
                  onChange={(e) => setEncounter({ group: e.target.value })}
                  error={!encounter.group.trim()}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField
                  label={t('npc-encounter-dice')}
                  name="encounterDice"
                  value={encounter.dice ?? ''}
                  onChange={(e) => setEncounter({ dice: e.target.value || null })}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <NumericInput
                  label={t('npc-frequency')}
                  name="frequency"
                  value={encounter.frequency}
                  onChange={(value) => setEncounter({ frequency: value ?? null })}
                  integer
                />
              </Grid>
              <Grid size={12}>
                <EnumPicker
                  mode="multiple"
                  variant="select"
                  label={t('npc-biomes')}
                  name="biomes"
                  values={NPC_BIOME_CODES}
                  formatLabel={(value) => `${value} · ${biomeLabel(value, t)}`}
                  value={encounter.biomes}
                  onChange={(ids) => setEncounter({ biomes: ids as NpcBiome[] })}
                />
              </Grid>
            </Grid>
          )}
        </Panel>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Panel title={t('details')}>
          {toggle(t('npc-has-details'), !!form.details, (checked) => set({ details: checked ? emptyDetails() : null }))}
          {form.details && (
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {DETAIL_KEYS.map((key) => (
                <Grid key={key} size={12}>
                  <TextField
                    label={t(`npc-detail-${key}`)}
                    name={`detail-${key}`}
                    value={form.details![key] ?? ''}
                    onChange={(e) => set({ details: { ...form.details!, [key]: e.target.value || null } })}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Panel>
      </Grid>
    </Grid>
  );
};

export default NpcFormProfile;
