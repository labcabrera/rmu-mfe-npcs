/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CasinoIcon from '@mui/icons-material/Casino';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Link,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  EncounterResult,
  EntityImage,
  fetchNpc,
  Npc,
  NumericInput,
  rollEncounterDice,
  StatPill,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { npcImage, npcName, npcTypeLabel } from '../npcs/npc-format';
import AddToTacticalGameDialog from './AddToTacticalGameDialog';

type Props = {
  result: EncounterResult;
  /** Total levels of the party, for the 15.1 balance hint. */
  partyLevels: number | null;
};

/** The outcome of the creature roll (spec 061, step 3): a creature of the catalog, a core race, an event or a text. */
export default function EncounterResultCard({ result, partyLevels }: Props) {
  const { t } = useTranslation();
  const entry = result.entry;

  let body: React.ReactNode;
  switch (entry.type) {
    case 'npc':
      body = <NpcResult npcIds={entry.npcIds} label={entry.label} partyLevels={partyLevels} />;
      break;
    case 'race':
      body = (
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {t('race')}
          </Typography>
          {entry.raceId ? (
            <Link component={RouterLink} to={`/core/races/view/${entry.raceId}`} variant="h6">
              {entry.label}
            </Link>
          ) : (
            <Typography variant="h6">{entry.label}</Typography>
          )}
        </Stack>
      );
      break;
    case 'event':
      body = (
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {t('encounter-result-event')}
          </Typography>
          <Typography variant="h6">{t(`encounter-event-${entry.key}`, { defaultValue: entry.label })}</Typography>
        </Stack>
      );
      break;
    case 'text':
      body = (
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {t('encounter-result-text')}
          </Typography>
          <Typography variant="h6">{entry.label}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('encounter-result-text-help')}
          </Typography>
        </Stack>
      );
      break;
    case 'special':
      body = (
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {t('encounter-result-special')}
          </Typography>
          <Typography variant="body1">
            {result.special ? t(`encounter-special-${result.special.key}`) : t('encounter-result-special-help')}
          </Typography>
        </Stack>
      );
      break;
    default:
      body = null;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          {result.conditionUnmet && (
            <Alert severity="warning">{t(`encounter-condition-unmet-${result.conditionUnmet}`)}</Alert>
          )}
          {body}
        </Stack>
      </CardContent>
    </Card>
  );
}

/** A creature of the catalog: the variant (for a family), its card, the number appearing and the balance. */
function NpcResult({ npcIds, label, partyLevels }: { npcIds: string[]; label: string; partyLevels: number | null }) {
  const { t } = useTranslation();
  const auth = useAuth();
  const [npcs, setNpcs] = useState<Record<string, Npc | null>>({});
  const [npcId, setNpcId] = useState(npcIds[0]);
  const [count, setCount] = useState<number | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const npc = npcs[npcId];
  const key = npcIds.join(',');

  useEffect(() => {
    setNpcId(npcIds[0]);
    let cancelled = false;
    Promise.all(
      npcIds.map((id) =>
        fetchNpc(id, auth)
          .then((found): [string, Npc | null] => [id, found])
          .catch((): [string, Npc | null] => [id, null])
      )
    ).then((found) => !cancelled && setNpcs(Object.fromEntries(found)));
    return () => {
      cancelled = true;
    };
  }, [key]);

  const roll = () => setCount(rollEncounterDice(npc?.encounter?.dice) ?? 1);

  useEffect(() => {
    if (npc) roll();
  }, [npc?.id]);

  const balance = useMemo(() => {
    if (!npc || !count || !partyLevels) return undefined;
    const creatures = npc.level * count;
    let severity: 'info' | 'warning' | 'success' = 'success';
    let key = 'encounter-balance-even';
    if (creatures > partyLevels * 1.25) {
      severity = 'warning';
      key = 'encounter-balance-hard';
    } else if (creatures < partyLevels * 0.75) {
      severity = 'info';
      key = 'encounter-balance-easy';
    }
    return { severity, text: t(key, { creatures, party: partyLevels }) };
  }, [npc, count, partyLevels]);

  const loading = !(npcId in npcs);
  const name = npc ? npcName(npc, t) : label;

  return (
    <Stack spacing={2}>
      {npcIds.length > 1 && (
        <TextField
          select
          fullWidth
          label={t('encounter-variant')}
          helperText={t('encounter-variant-help')}
          value={npcId}
          onChange={(event) => setNpcId(event.target.value)}
        >
          {npcIds.map((id) => (
            <MenuItem key={id} value={id}>
              {npcs[id] ? `${npcName(npcs[id]!, t)} · ${t('level')} ${npcs[id]!.level}` : id}
            </MenuItem>
          ))}
        </TextField>
      )}
      {loading && <CircularProgress size={24} aria-label={t('loading')} />}
      {!loading && !npc && <Alert severity="warning">{t('encounter-npc-not-found', { name: label })}</Alert>}
      {npc && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'flex-start' } }}>
          <Box sx={{ flex: 'none' }}>
            <EntityImage image={npcImage(npc)} fallbackImages={['images/npcs/unknown.png']} size="md" alt={name} />
          </Box>
          <Stack spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
            <Box>
              <Link component={RouterLink} to={`/npcs/view/${npc.id}`} variant="h6" state={{ npc }}>
                {name}
              </Link>
              <Typography variant="body2" color="text.secondary">
                {[t(`npc-category-${npc.category}`), npc.type ? npcTypeLabel(npc.type, t) : null]
                  .filter(Boolean)
                  .join(' · ')}
              </Typography>
            </Box>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <StatPill label={t('level')} value={npc.level} />
              <StatPill label={t('npc-hits')} value={npc.hp} />
              <StatPill label={t('at-short')} hint={t('at')} value={npc.at} />
              <StatPill label={t('db-short')} hint={t('db')} value={npc.db} />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box sx={{ width: 140 }}>
                <NumericInput
                  label={t('encounter-number')}
                  value={count}
                  onChange={setCount}
                  integer
                  min={1}
                  error={!count || count < 1}
                />
              </Box>
              <Tooltip title={t('encounter-number-reroll')}>
                <IconButton aria-label={t('encounter-number-reroll')} onClick={roll}>
                  <CasinoIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0 }}>
                {npc.encounter
                  ? t('encounter-group-dice', {
                      group: npc.encounter.group,
                      dice: npc.encounter.dice ?? t('encounter-dice-none'),
                    })
                  : t('encounter-no-group')}
              </Typography>
            </Stack>
            {balance && <Alert severity={balance.severity}>{balance.text}</Alert>}
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                size="small"
                startIcon={<OpenInNewIcon />}
                component={RouterLink}
                to={`/npcs/view/${npc.id}`}
                state={{ npc }}
              >
                {t('encounter-open-sheet')}
              </Button>
              {auth.isAuthenticated && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={!count || count < 1}
                  onClick={() => setAddOpen(true)}
                >
                  {t('encounter-add-to-game')}
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
      {npc && !!count && (
        <AddToTacticalGameDialog
          open={addOpen}
          onClose={() => setAddOpen(false)}
          npcId={npc.id}
          count={count}
          defaultName={name}
        />
      )}
    </Stack>
  );
}
