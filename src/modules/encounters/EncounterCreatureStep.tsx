/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import CasinoIcon from '@mui/icons-material/Casino';
import ReplayIcon from '@mui/icons-material/Replay';
import UndoIcon from '@mui/icons-material/Undo';
import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import {
  D100,
  EncounterNextRoll,
  EncounterPathStep,
  EncounterTableSummary,
  formatBonus,
  OPEN_D100,
  Panel,
  resolveEncounter,
  ResolveEncounterResponse,
  RollField,
  RollValue,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import EncounterResultCard from './EncounterResultCard';
import { useTableLabel } from './EncounterSituationStep';
import { EncounterSituation, situationRequest } from './encounter-situation';

type Props = {
  situation: EncounterSituation;
  tables: EncounterTableSummary[];
  onNewEncounter: () => void;
};

const rangeText = (range: { min: number | null; max: number | null } | null | undefined) => {
  if (!range || range.min === null) return null;
  const pad = (value: number) => String(value).padStart(2, '0');
  return range.max === null || range.max === range.min ? pad(range.min) : `${pad(range.min)}-${pad(range.max)}`;
};

/**
 * Step 3 (spec 061): the subtable and creature rolls, one at a time. Every roll goes to the stateless resolve with the
 * ones before it, and the API says which roll comes next (a subtable, the creature, a universal table) or the result.
 */
export default function EncounterCreatureStep({ situation, tables, onNewEncounter }: Props) {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const tableLabel = useTableLabel();
  const [rolls, setRolls] = useState<RollValue[]>([]);
  const [response, setResponse] = useState<ResolveEncounterResponse>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!situation.tableId) return;
    let cancelled = false;
    setBusy(true);
    resolveEncounter(
      {
        ...situationRequest(situation, tables),
        rolls: rolls.map((roll) => roll.total),
        unmodified: rolls.map((roll) => roll.unmodified),
      },
      auth
    )
      .then((data) => {
        if (cancelled) return;
        setResponse(data);
        setError(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(true);
        notify.error(err);
      })
      .finally(() => !cancelled && setBusy(false));
    return () => {
      cancelled = true;
    };
  }, [rolls]);

  const next = response?.next ?? null;
  const result = response?.result ?? null;
  const clamped = response?.path.some((step) => step.clamped);

  const nextLabel = (roll: EncounterNextRoll) =>
    t(roll.step === 'subtable' ? 'encounter-roll-subtable' : 'encounter-roll-creature', {
      table: tableLabel(roll.tableId, tables),
    });
  const nextHelper = (roll: EncounterNextRoll) => {
    if (roll.roll === 'straight') return t('encounter-roll-straight');
    const bonus = (roll.step === 'creature' ? situation.creatureModifier : 0) + roll.bonus;
    return t('encounter-roll-open', { bonus: formatBonus(bonus) });
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 2fr) minmax(0, 3fr)' } }}>
        <Panel
          title={t('encounter-rolls')}
          extra={
            rolls.length > 0 && (
              <Button
                size="small"
                startIcon={<UndoIcon />}
                onClick={() => setRolls(rolls.slice(0, -1))}
                disabled={busy}
              >
                {t('encounter-undo-roll')}
              </Button>
            )
          }
        >
          <Stack spacing={2}>
            {response && response.path.length > 0 && <EncounterPath path={response.path} tables={tables} />}
            {rolls.length > 0 && (
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                  {t('encounter-rolls-made')}
                </Typography>
                {rolls.map((roll, index) => (
                  <Chip key={index} size="small" variant="outlined" label={roll.total} />
                ))}
              </Stack>
            )}
            {next && (
              <RollField
                key={rolls.length}
                spec={next.roll === 'open' ? OPEN_D100 : D100}
                label={nextLabel(next)}
                helperText={nextHelper(next)}
                value={null}
                onChange={(value) => setRolls([...rolls, value])}
                disabled={busy}
                fullWidth
              />
            )}
            {busy && <CircularProgress size={24} aria-label={t('loading')} />}
            {error && !busy && <Alert severity="error">{t('encounter-resolve-error')}</Alert>}
            {clamped && <Alert severity="info">{t('encounter-clamped')}</Alert>}
          </Stack>
        </Panel>
        <Box>
          {result ? (
            <EncounterResultCard result={result} partyLevels={situation.partyLevels} />
          ) : (
            <Panel title={t('encounter-result')}>
              <Typography variant="body2" color="text.secondary">
                {t('encounter-result-pending')}
              </Typography>
            </Panel>
          )}
        </Box>
      </Box>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'flex-end' }}>
        <Button startIcon={<CasinoIcon />} onClick={() => setRolls([])} disabled={busy || rolls.length === 0}>
          {t('encounter-reroll-creature')}
        </Button>
        <Button variant="contained" startIcon={<ReplayIcon />} onClick={onNewEncounter}>
          {t('encounter-new')}
        </Button>
      </Stack>
    </Stack>
  );
}

/** The tables walked, with the roll used on each, the adjusted roll and the row it fell on. */
function EncounterPath({ path, tables }: { path: EncounterPathStep[]; tables: EncounterTableSummary[] }) {
  const { t } = useTranslation();
  const tableLabel = useTableLabel();
  return (
    <Stack component="ol" spacing={1} sx={{ m: 0, pl: 2.5 }}>
      {path.map((step, index) => {
        const subtable =
          step.subtable && !(step.subtable.min === 1 && step.subtable.max === 100) ? step.subtable : null;
        return (
          <Box component="li" key={index}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {tableLabel(step.tableId, tables)}
              {subtable && ` · ${t('encounter-subtable', { range: rangeText(subtable) })}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {step.adjustedRoll === step.roll
                ? t('encounter-path-roll', { roll: step.roll, row: rangeText(step.row) ?? '66' })
                : t('encounter-path-roll-adjusted', {
                    roll: step.roll,
                    adjusted: step.adjustedRoll,
                    row: rangeText(step.row) ?? '66',
                  })}
              {step.clamped && ` · ${t(`encounter-clamped-${step.clamped}`)}`}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
