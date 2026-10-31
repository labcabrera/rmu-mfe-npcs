/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  AttackTablePicker,
  CREATURE_SIZES,
  creatureSizeLabel,
  EnumPicker,
  fetchAttackTables,
  fetchFumbleTables,
  FumbleTablePicker,
  NPC_ADDITIONAL_CRITICALS,
  NpcAttack,
  npcAttackNotation,
  NumericInput,
  Panel,
  additionalCriticalLabel,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { newAttack, NpcForm, SetNpcForm } from './npc-form';

const SIZE_CLASSES = CREATURE_SIZES.map((_, index) => String(index + 1));
const SEQUENCES = ['single', 'double'];
const ADDITIONAL_CRITICALS = Object.keys(NPC_ADDITIONAL_CRITICALS);

/**
 * The attacks as structured fields, each with a preview of its stat block notation. Changing an attack drops its
 * printed notation: the saved one is built from the fields. The table may be left empty for an attack with no table of
 * its own (`we`, `rw`, special attacks; spec 060): it is saved as null.
 */
const NpcFormAttacks: FC<{ form: NpcForm; set: SetNpcForm }> = ({ form, set }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const notify = useNotify();
  const [attackTables, setAttackTables] = useState<string[]>();
  const [fumbleTables, setFumbleTables] = useState<string[]>();
  const attacks = form.attacks;

  useEffect(() => {
    fetchAttackTables(auth).then(setAttackTables).catch(notify.error);
    fetchFumbleTables(auth).then(setFumbleTables).catch(notify.error);
  }, []);

  const change = (index: number, patch: Partial<NpcAttack>) =>
    set({ attacks: attacks.map((attack, i) => (i === index ? { ...attack, ...patch, notation: null } : attack)) });
  const remove = (index: number) =>
    set({
      attacks: attacks
        .filter((_, i) => i !== index)
        .map((attack) => {
          if (attack.alternativeTo === null) return attack;
          if (attack.alternativeTo === index) return { ...attack, alternativeTo: null, notation: null };
          return attack.alternativeTo > index ? { ...attack, alternativeTo: attack.alternativeTo - 1 } : attack;
        }),
    });
  const optional = (value: number | null | undefined) => value ?? null;

  return (
    <Panel
      title={t('attacks')}
      extra={
        <Button size="small" startIcon={<AddIcon />} onClick={() => set({ attacks: [...attacks, newAttack()] })}>
          {t('add')}
        </Button>
      }
    >
      <Stack spacing={2} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
        {attacks.map((attack, index) => (
          <Box key={index} data-testid="npc-attack-form">
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
              <Tooltip title={t('npc-notation-preview')}>
                <Chip
                  color="primary"
                  variant="outlined"
                  label={attack.notation || npcAttackNotation(attack)}
                  sx={{ fontFamily: 'monospace', maxWidth: '100%' }}
                />
              </Tooltip>
              <IconButton aria-label={t('remove')} onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <NumericInput
                  label={t('npc-ob')}
                  name={`ob-${index}`}
                  value={attack.ob}
                  onChange={(value) => change(index, { ob: value ?? 0 })}
                  integer
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <EnumPicker
                  variant="select"
                  label={t('size')}
                  name={`size-${index}`}
                  values={SIZE_CLASSES}
                  formatLabel={(value) => creatureSizeLabel(CREATURE_SIZES[Number(value) - 1], t)}
                  value={String(attack.size)}
                  onChange={(value) => change(index, { size: Number(value ?? 5) })}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <AttackTablePicker
                  tables={attackTables ?? []}
                  variant="select"
                  name={`attackTable-${index}`}
                  value={attack.attackTable || null}
                  onChange={(value) => change(index, { attackTable: value || null })}
                  helperText={attack.attackTable ? undefined : t('npc-attack-no-table')}
                  clearable
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FumbleTablePicker
                  tables={fumbleTables ?? []}
                  variant="select"
                  name={`fumbleTable-${index}`}
                  value={attack.fumbleTable}
                  onChange={(value) => change(index, { fumbleTable: value })}
                  clearable
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <EnumPicker
                  variant="select"
                  label={t('npc-additional-critical')}
                  name={`additionalCritical-${index}`}
                  values={ADDITIONAL_CRITICALS}
                  formatLabel={(value) => additionalCriticalLabel(value, t)}
                  value={attack.additionalCritical}
                  onChange={(value) => change(index, { additionalCritical: value })}
                  clearable
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <EnumPicker
                  variant="select"
                  label={t('npc-attack-sequence')}
                  name={`sequence-${index}`}
                  values={SEQUENCES}
                  labelPrefix="npc-attack-sequence-"
                  value={attack.sequence}
                  onChange={(value) => change(index, { sequence: value as NpcAttack['sequence'] })}
                  clearable
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <EnumPicker
                  variant="select"
                  label={t('npc-alternative-to')}
                  name={`alternativeTo-${index}`}
                  values={attacks.map((_, i) => String(i)).filter((i) => Number(i) < index)}
                  formatLabel={(value) => t('npc-attack-n', { index: Number(value) + 1 })}
                  value={attack.alternativeTo === null ? null : String(attack.alternativeTo)}
                  onChange={(value) => change(index, { alternativeTo: value === null ? null : Number(value) })}
                  disabled={index === 0}
                  clearable
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <NumericInput
                  label={t('npc-cooperation')}
                  name={`cooperation-${index}`}
                  value={attack.cooperation}
                  onChange={(value) => change(index, { cooperation: optional(value) })}
                  integer
                  min={1}
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <NumericInput
                  label={t('npc-kata')}
                  name={`kata-${index}`}
                  value={attack.kata}
                  onChange={(value) => change(index, { kata: optional(value) })}
                  integer
                  min={1}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={attack.hand === 'left'}
                      onChange={(e) => change(index, { hand: e.target.checked ? 'left' : null })}
                    />
                  }
                  label={t('npc-attack-left-hand')}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!attack.poison}
                      onChange={(e) =>
                        change(index, { poison: e.target.checked ? { type: null, rrModifier: null } : null })
                      }
                    />
                  }
                  label={t('npc-attack-poison')}
                />
              </Grid>
              {attack.poison && (
                <>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <TextField
                      label={t('npc-poison-type')}
                      name={`poisonType-${index}`}
                      value={attack.poison.type ?? ''}
                      onChange={(e) => change(index, { poison: { ...attack.poison!, type: e.target.value || null } })}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 4 }}>
                    <NumericInput
                      label={t('npc-poison-rr-modifier')}
                      name={`poisonRr-${index}`}
                      value={attack.poison.rrModifier}
                      onChange={(value) =>
                        change(index, { poison: { ...attack.poison!, rrModifier: optional(value) } })
                      }
                      integer
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        ))}
        {attacks.length === 0 && <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{t('npc-no-attacks')}</Box>}
      </Stack>
    </Panel>
  );
};

export default NpcFormAttacks;
