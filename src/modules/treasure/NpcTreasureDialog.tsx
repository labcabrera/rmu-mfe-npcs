/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Stack } from '@mui/material';
import {
  EntityOption,
  EntityPicker,
  Faction,
  fetchFactions,
  fetchStrategicGames,
  isAdmin,
  ItemHolder,
  StrategicGame,
  TreasureDialog,
  useNotify,
  fetchFullPage,
} from '@labcabrera-rmu/rmu-react-shared-lib';

type Props = {
  open: boolean;
  onClose: () => void;
  /** The treasure codes of the stat block ("c, n, x"). */
  codes: string | null;
};

/** The treasure codes of a stat block worth rolling: "-" means none. */
export const npcTreasureCodes = (treasure: string | null | undefined): string | null => {
  const codes = treasure?.trim();
  return codes && codes !== '-' ? codes : null;
};

/**
 * The random treasure of a creature (spec 067): the codes of its stat block, awarded to a faction of a campaign of
 * the user chosen in the dialog.
 */
export default function NpcTreasureDialog({ open, onClose, codes }: Props) {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const [games, setGames] = useState<StrategicGame[]>();
  const [gameId, setGameId] = useState<string | null>(null);
  const [factions, setFactions] = useState<Faction[]>();
  const [factionId, setFactionId] = useState<string | null>(null);

  useEffect(() => {
    if (!open || games) return;
    const sub = auth.user?.profile?.sub;
    fetchFullPage((rsql, page, size) => fetchStrategicGames(rsql, page, size, auth), '')
      .then((page) => {
        const own = page.content.filter((game) => isAdmin(auth) || !game.owner || game.owner === sub);
        setGames(own);
        if (own.length === 1) setGameId(own[0].id);
      })
      .catch((err) => {
        setGames([]);
        notify.error(err);
      });
  }, [open]);

  useEffect(() => {
    setFactions(undefined);
    setFactionId(null);
    if (!gameId) return;
    let cancelled = false;
    fetchFullPage((rsql, page, size) => fetchFactions(rsql, page, size, auth), `gameId==${gameId}`)
      .then((page) => {
        if (cancelled) return;
        setFactions(page.content);
        if (page.content.length === 1) setFactionId(page.content[0].id);
      })
      .catch((err) => {
        if (cancelled) return;
        setFactions([]);
        notify.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, [gameId]);

  const gameOptions: EntityOption<StrategicGame>[] | undefined = games?.map((game) => ({
    id: game.id,
    label: game.name,
    imageUrl: game.imageUrl,
    entity: game,
  }));
  const factionOptions: EntityOption<Faction>[] | undefined = factions?.map((faction) => ({
    id: faction.id,
    label: faction.name,
    imageUrl: faction.imageUrl,
    entity: faction,
  }));
  const holder: ItemHolder | null = factionId ? { kind: 'faction', id: factionId } : null;
  const factionName = factions?.find((faction) => faction.id === factionId)?.name ?? '';

  const picker = (
    <Stack spacing={1.5}>
      <EntityPicker<StrategicGame>
        variant="select"
        kind="strategic-game"
        label={t('strategic-game')}
        options={gameOptions}
        value={gameId}
        onChange={(id) => setGameId(id)}
        emptyText={t('no-strategic-games')}
        required
      />
      {gameId && (
        <EntityPicker<Faction>
          variant="select"
          kind="faction"
          label={t('faction')}
          options={factionOptions}
          value={factionId}
          onChange={(id) => setFactionId(id)}
          emptyText={t('no-factions-have-been-created')}
          required
        />
      )}
    </Stack>
  );

  return (
    <TreasureDialog
      open={open}
      onClose={onClose}
      codes={codes}
      gameId={gameId}
      holder={holder}
      holderPicker={picker}
      onAwarded={() => notify.success(t('treasure-awarded', { faction: factionName }))}
    />
  );
}
