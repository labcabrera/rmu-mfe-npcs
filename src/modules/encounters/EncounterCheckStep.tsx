/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import {
  EncounterCheckResult,
  EncounterCode,
  EncounterSettings,
  EncounterSide,
  EncounterTableSummary,
  formatBonus,
  OPEN_D100,
  Panel,
  resolveEncounter,
  RollField,
  RollValue,
  StatPill,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import {
  ENCOUNTER_SIDES,
  EncounterSituation,
  modifierRequests,
  modifierTotal,
  situationRequest,
} from './encounter-situation';

type Props = {
  situation: EncounterSituation;
  tables: EncounterTableSummary[];
  settings: EncounterSettings;
  rolls: Partial<Record<EncounterSide, RollValue>>;
  onRollsChange: (rolls: Partial<Record<EncounterSide, RollValue>>) => void;
  result: EncounterCheckResult | null;
  onResult: (result: EncounterCheckResult | null) => void;
};

/** Text of a Table 15.4b code; null is "--". */
export const useEncounterCode = () => {
  const { t } = useTranslation();
  return (code: EncounterCode | null) => t(code ? `encounter-code-${code}` : 'encounter-code-none');
};

/** Step 2 (spec 061): the avoidance roll (a player) and the activity roll (the GM), and Table 15.4b. */
export default function EncounterCheckStep({
  situation,
  tables,
  settings,
  rolls,
  onRollsChange,
  result,
  onResult,
}: Props) {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const codeText = useEncounterCode();
  const [busy, setBusy] = useState(false);
  const avoidance = rolls.avoidance;
  const activity = rolls.activity;

  useEffect(() => {
    if (!avoidance || !activity) {
      onResult(null);
      return;
    }
    let cancelled = false;
    setBusy(true);
    resolveEncounter(
      {
        ...situationRequest(situation, tables),
        check: {
          population: situation.population,
          avoidance: { roll: avoidance.total, modifiers: modifierRequests(situation, settings.modifiers, 'avoidance') },
          activity: { roll: activity.total, modifiers: modifierRequests(situation, settings.modifiers, 'activity') },
        },
        rolls: [],
      },
      auth
    )
      .then((response) => !cancelled && onResult(response.check))
      .catch((err) => !cancelled && notify.error(err))
      .finally(() => !cancelled && setBusy(false));
    return () => {
      cancelled = true;
    };
  }, [avoidance?.total, activity?.total]);

  const rollPanel = (side: EncounterSide) => {
    const modifier = modifierTotal(situation, settings.modifiers, side);
    return (
      <Panel key={side} title={t(`encounter-${side}-roll`)}>
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            {t(`encounter-${side}-roll-help`)}
          </Typography>
          <RollField
            spec={OPEN_D100}
            label={t(`encounter-${side}-roll`)}
            value={rolls[side]}
            onChange={(value) => onRollsChange({ ...rolls, [side]: value })}
            onClear={() => onRollsChange({ ...rolls, [side]: undefined })}
            helperText={t('encounter-roll-modifier', { modifier: formatBonus(modifier) })}
            fullWidth
          />
        </Stack>
      </Panel>
    );
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
        {ENCOUNTER_SIDES.map(rollPanel)}
      </Box>
      {busy && <CircularProgress size={24} aria-label={t('loading')} />}
      {result && !busy && (
        <Panel title={t('encounter-check-result')}>
          <Stack spacing={1.5}>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <StatPill label={t('encounter-differential')} value={result.differential} signed />
              <StatPill label={t('encounter-avoidance-roll')} value={result.avoidance} />
              <StatPill label={t('encounter-activity-roll')} value={result.activity} />
              <StatPill label={t('population')} value={t(`encounter-population-${situation.population}`)} />
            </Stack>
            {result.encounter ? (
              <Alert severity="warning">
                {t('encounter-check-encounter', {
                  social: codeText(result.social),
                  creature: codeText(result.creature),
                })}
              </Alert>
            ) : (
              <Alert severity="success">{t('encounter-check-none')}</Alert>
            )}
          </Stack>
        </Panel>
      )}
    </Stack>
  );
}
