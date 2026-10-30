import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Grid, IconButton, Stack, TextField } from '@mui/material';
import {
  EnumPicker,
  NPC_MOVEMENT_MODES,
  NPC_PACES,
  NPC_TIERS,
  NpcMovement,
  NpcMovementMode,
  NpcPace,
  NpcTier,
  NumericInput,
  Panel,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { newMovement, NpcForm, SetNpcForm } from './npc-form';

/** Modes of movement: mode and tier, base movement rate and maximum pace. */
const NpcFormMovement: FC<{ form: NpcForm; set: SetNpcForm }> = ({ form, set }) => {
  const { t } = useTranslation();
  const movement = form.movement;
  const change = (index: number, patch: Partial<NpcMovement>) =>
    set({ movement: movement.map((each, i) => (i === index ? { ...each, ...patch } : each)) });

  return (
    <Panel
      title={t('movement')}
      extra={
        <Button size="small" startIcon={<AddIcon />} onClick={() => set({ movement: [...movement, newMovement()] })}>
          {t('add')}
        </Button>
      }
    >
      <Stack spacing={2}>
        {movement.map((each, index) => (
          <Stack key={index} direction="row" sx={{ alignItems: 'flex-start', gap: 1 }}>
            <Grid container spacing={2} sx={{ flex: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <EnumPicker
                  variant="select"
                  label={t('npc-movement-mode')}
                  name={`mode-${index}`}
                  values={NPC_MOVEMENT_MODES}
                  labelPrefix="npc-movement-"
                  value={each.mode}
                  onChange={(value) => change(index, { mode: (value ?? 'walk') as NpcMovementMode })}
                  required
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <EnumPicker
                  variant="select"
                  label={t('tier')}
                  name={`tier-${index}`}
                  values={NPC_TIERS}
                  formatLabel={(value) => value}
                  value={each.tier}
                  onChange={(value) => change(index, { tier: value as NpcTier | null })}
                  clearable
                />
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <NumericInput
                  label={t('base-movement-rate')}
                  name={`baseRate-${index}`}
                  value={each.baseRate}
                  onChange={(value) => change(index, { baseRate: value ?? 0 })}
                  integer
                  min={0}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <EnumPicker
                  variant="select"
                  label={t('max-pace')}
                  name={`maxPace-${index}`}
                  values={NPC_PACES}
                  value={each.maxPace}
                  onChange={(value) => change(index, { maxPace: (value ?? 'walk') as NpcPace })}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  label={t('note')}
                  name={`note-${index}`}
                  value={each.note ?? ''}
                  onChange={(e) => change(index, { note: e.target.value || null })}
                  fullWidth
                />
              </Grid>
            </Grid>
            <IconButton
              aria-label={t('remove')}
              onClick={() => set({ movement: movement.filter((_, i) => i !== index) })}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        {movement.length === 0 && (
          <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{t('npc-no-movement')}</Box>
        )}
      </Stack>
    </Panel>
  );
};

export default NpcFormMovement;
