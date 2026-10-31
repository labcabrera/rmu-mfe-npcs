/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import {
  addTacticalGameNpcs,
  ENVIRONMENT_FACTION_ID,
  fetchTacticalGames,
  isAdmin,
  NumericInput,
  TacticalGame,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';

type Props = {
  open: boolean;
  onClose: () => void;
  npcId: string;
  count: number;
  defaultName: string;
};

/**
 * Adds the creatures of an encounter to the environment faction of a tactical game of the user that has not started
 * (spec 061, phase 3; spec 055 for the environment).
 */
export default function AddToTacticalGameDialog({ open, onClose, npcId, count, defaultName }: Props) {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const [games, setGames] = useState<TacticalGame[]>();
  const [gameId, setGameId] = useState('');
  const [amount, setAmount] = useState<number | null>(count);
  const [name, setName] = useState(defaultName);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAmount(count);
    setName(defaultName);
    const sub = auth.user?.profile?.sub;
    fetchTacticalGames('status==created', 0, 100, auth, '-createdAt')
      .then((page) => {
        const own = page.content.filter((game) => isAdmin(auth) || !game.owner || game.owner === sub);
        setGames(own);
        setGameId((current) => (own.some((game) => game.id === current) ? current : (own[0]?.id ?? '')));
      })
      .catch((err) => {
        setGames([]);
        notify.error(err);
      });
  }, [open]);

  const valid = !!gameId && !!amount && amount >= 1;

  const onAdd = () => {
    if (!valid) return;
    setBusy(true);
    addTacticalGameNpcs(
      gameId,
      [{ npcId, factionId: ENVIRONMENT_FACTION_ID, count: amount!, name: name.trim() || undefined }],
      auth
    )
      .then((game) => {
        notify.success(t('encounter-added-to-game', { game: game.name }));
        onClose();
      })
      .catch(notify.error)
      .finally(() => setBusy(false));
  };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('encounter-add-to-game')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {!games && <CircularProgress size={24} aria-label={t('loading')} />}
          {games && games.length === 0 && <Alert severity="info">{t('encounter-no-created-games')}</Alert>}
          {games && games.length > 0 && (
            <>
              <TextField
                select
                fullWidth
                label={t('tactical-game')}
                value={gameId}
                onChange={(event) => setGameId(event.target.value)}
              >
                {games.map((game) => (
                  <MenuItem key={game.id} value={game.id}>
                    {game.name}
                  </MenuItem>
                ))}
              </TextField>
              <NumericInput
                label={t('encounter-number')}
                value={amount}
                onChange={setAmount}
                integer
                min={1}
                error={!amount || amount < 1}
              />
              <TextField fullWidth label={t('name')} value={name} onChange={(event) => setName(event.target.value)} />
              <Alert severity="info">{t('encounter-add-to-game-help')}</Alert>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>
          {t('cancel')}
        </Button>
        <Button variant="contained" onClick={onAdd} disabled={!valid || busy}>
          {t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
