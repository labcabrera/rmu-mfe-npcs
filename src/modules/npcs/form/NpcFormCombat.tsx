import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';
import {
  CREATURE_SIZES,
  creatureSizeLabel,
  CreatureSize,
  EnumPicker,
  NPC_CRITICAL_IMMUNITIES,
  NPC_SHIELD_TYPE_DB,
  NPC_SHIELD_TYPES,
  NpcCriticalCodes,
  NpcCriticalImmunity,
  NpcShield,
  NpcShieldType,
  NumericInput,
  Panel,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { NpcForm, SetNpcForm } from './npc-form';

const CRITICAL_FLAGS = ['reduceSeverity', 'noKnockdown', 'stunImmune', 'bleedImmune'] as const;
const flagKey: Record<(typeof CRITICAL_FLAGS)[number], string> = {
  reduceSeverity: 'npc-crit-reduce-severity',
  noKnockdown: 'npc-crit-no-knockdown',
  stunImmune: 'npc-crit-stun-immune',
  bleedImmune: 'npc-crit-bleed-immune',
};

/** Size, critical codes, hits, AT/DB with running and shield, initiative, endurance and power points. */
const NpcFormCombat: FC<{ form: NpcForm; set: SetNpcForm }> = ({ form, set }) => {
  const { t } = useTranslation();
  const codes = form.criticalCodes;
  const setCodes = (change: Partial<NpcCriticalCodes>) => set({ criticalCodes: { ...codes, ...change } });
  const optional = (value: number | null | undefined) => value ?? null;
  const setShield = (change: Partial<NpcShield>) => set({ shield: { ...form.shield!, ...change } });
  // A DB left as the one of the old type follows the new type (Table 9-6); a DB typed by hand stays.
  const setShieldType = (type: NpcShieldType) => {
    const db = form.shield!.db;
    const followsType = db === null || db === undefined || db === NPC_SHIELD_TYPE_DB[form.shield!.type];
    setShield({ type, db: followsType ? NPC_SHIELD_TYPE_DB[type] : db });
  };

  return (
    <Panel title={t('npc-section-combat')}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EnumPicker
            variant="select"
            label={t('size')}
            name="size"
            values={CREATURE_SIZES}
            formatLabel={(value) => creatureSizeLabel(value, t)}
            value={form.size}
            onChange={(value) => set({ size: (value ?? 'medium') as CreatureSize })}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <EnumPicker
            variant="select"
            label={t('npc-critical-size')}
            name="criticalSize"
            values={CREATURE_SIZES}
            formatLabel={(value) => creatureSizeLabel(value, t)}
            value={form.criticalSize}
            onChange={(value) => set({ criticalSize: value as CreatureSize | null })}
            clearable
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumericInput
            label={t('npc-hits')}
            name="hp"
            value={form.hp}
            onChange={(value) => set({ hp: value ?? 1 })}
            integer
            min={1}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <NumericInput
            label={t('npc-death-hits')}
            name="deathHits"
            value={form.deathHits}
            onChange={(value) => set({ deathHits: optional(value) })}
            integer
            min={1}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <NumericInput
            label={t('at-short')}
            name="at"
            value={form.at}
            onChange={(value) => set({ at: value ?? 1 })}
            integer
            min={1}
            max={10}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <NumericInput
            label={t('db-short')}
            name="db"
            value={form.db}
            onChange={(value) => set({ db: value ?? 0 })}
            integer
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <NumericInput
            label={t('initiative')}
            name="initiative"
            value={form.initiative}
            onChange={(value) => set({ initiative: value ?? 0 })}
            integer
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <NumericInput
            label={t('endurance')}
            name="endurance"
            value={form.endurance}
            onChange={(value) => set({ endurance: optional(value) })}
            integer
            min={0}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3, md: 2 }}>
          <NumericInput
            label={t('npc-pp')}
            name="powerPoints"
            value={form.powerPoints}
            onChange={(value) => set({ powerPoints: optional(value) })}
            integer
            min={0}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={!!form.running}
                onChange={(e) => set({ running: e.target.checked ? { ranks: 0, bonus: 0 } : null })}
              />
            }
            label={t('npc-running')}
          />
          {form.running && (
            <Grid container spacing={2}>
              <Grid size={6}>
                <NumericInput
                  label={t('ranks')}
                  name="runningRanks"
                  value={form.running.ranks}
                  onChange={(value) => set({ running: { ...form.running!, ranks: value ?? 0 } })}
                  integer
                  min={0}
                />
              </Grid>
              <Grid size={6}>
                <NumericInput
                  label={t('bonus')}
                  name="runningBonus"
                  value={form.running.bonus}
                  onChange={(value) => set({ running: { ...form.running!, bonus: value ?? 0 } })}
                  integer
                />
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={!!form.shield}
                onChange={(e) =>
                  set({
                    shield: e.target.checked
                      ? { type: 'normal', db: NPC_SHIELD_TYPE_DB.normal, ranks: 0, bonus: 0 }
                      : null,
                  })
                }
              />
            }
            label={t('npc-shield')}
          />
          {form.shield && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <EnumPicker
                  variant="select"
                  label={t('type')}
                  name="shieldType"
                  values={NPC_SHIELD_TYPES}
                  formatLabel={(value) => t(`npc-shield-type-${value}`)}
                  value={form.shield.type}
                  onChange={(value) => setShieldType((value ?? 'normal') as NpcShieldType)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <NumericInput
                  label={t('shield-db')}
                  name="shieldDb"
                  value={form.shield.db}
                  onChange={(value) => setShield({ db: optional(value) })}
                  placeholder={String(NPC_SHIELD_TYPE_DB[form.shield.type])}
                  integer
                  min={0}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <NumericInput
                  label={t('npc-shield-ranks')}
                  name="shieldRanks"
                  value={form.shield.ranks}
                  onChange={(value) => setShield({ ranks: optional(value) })}
                  integer
                  min={0}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <NumericInput
                  label={t('npc-shield-bonus')}
                  name="shieldBonus"
                  value={form.shield.bonus}
                  onChange={(value) => setShield({ bonus: optional(value) })}
                  integer
                />
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid size={12}>
          <Typography variant="caption" color="text.secondary" component="div">
            {t('npc-critical-codes')}
          </Typography>
          <FormGroup row>
            {CRITICAL_FLAGS.map((flag) => (
              <FormControlLabel
                key={flag}
                control={<Checkbox checked={codes[flag]} onChange={(e) => setCodes({ [flag]: e.target.checked })} />}
                label={t(flagKey[flag])}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid size={12}>
          <EnumPicker
            mode="multiple"
            variant="select"
            label={t('npc-critical-immunities')}
            name="immunities"
            values={NPC_CRITICAL_IMMUNITIES}
            labelPrefix="npc-immunity-"
            value={codes.immunities}
            onChange={(ids) => setCodes({ immunities: ids as NpcCriticalImmunity[] })}
          />
        </Grid>
      </Grid>
    </Panel>
  );
};

export default NpcFormCombat;
