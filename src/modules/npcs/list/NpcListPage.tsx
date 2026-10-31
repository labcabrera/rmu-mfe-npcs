/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate } from 'react-router-dom';
import CasinoIcon from '@mui/icons-material/Casino';
import { Alert, Button, Chip } from '@mui/material';
import {
  EntityCard,
  fetchNpcs,
  fetchRealms,
  ListPage,
  Npc,
  Realm,
  useListFilters,
  useLocalPagedQuery,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { isCatalogNpc, npcImage, npcName, npcTypeLabel } from '../npc-format';
import NpcListFilters, { npcFilters } from './NpcListFilters';

/** The API limit of a catalog page: the list loads every NPC matching the filters at once. */
const NPC_LIST_MAX = 1000;

/**
 * The NPC list (spec 054): the public creature catalog and the user's own NPCs. The RSQL filters go to the API with a
 * catalog-sized page; the translated name is matched, sorted and paged on the client.
 */
export default function NpcListPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const [realms, setRealms] = useState<Realm[]>();
  const [npcs, setNpcs] = useState<Npc[]>();
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState<unknown>();
  const [reloads, setReloads] = useState(0);
  const filters = useListFilters(npcFilters(t, realms));

  useEffect(() => {
    fetchRealms('', 0, 100, auth)
      .then((response) => setRealms(response.content))
      .catch(notify.error);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setNpcs(undefined);
    fetchNpcs(filters.rsql, 0, NPC_LIST_MAX, auth)
      .then((page) => {
        if (cancelled) return;
        setNpcs(page.content);
        setTruncated(page.pagination.totalElements > page.content.length);
        setError(undefined);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        notify.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, [filters.rsql, reloads]);

  // Own NPCs first, then the catalog, each by translated name.
  const visible = useMemo(
    () =>
      npcs
        ?.filter(filters.match)
        .map((npc) => ({ npc, name: npcName(npc, t), catalog: isCatalogNpc(npc) }))
        .sort((a, b) => Number(a.catalog) - Number(b.catalog) || a.name.localeCompare(b.name))
        .map(({ npc }) => npc),
    [npcs, filters.match, t]
  );
  const query = useLocalPagedQuery(visible, {
    pageSize: 48,
    resetKey: filters.key,
    error,
    refresh: () => setReloads((count) => count + 1),
  });

  const open = (npc: Npc) => navigate(`/npcs/view/${npc.id}`, { state: { npc, from: location.search } });

  return (
    <ListPage
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs') }]}
      query={query}
      getKey={(npc) => npc.id}
      onAdd={() => navigate('/npcs/create')}
      actions={[
        <Button key="encounters" size="small" startIcon={<CasinoIcon />} onClick={() => navigate('/npcs/encounters')}>
          {t('encounter-title')}
        </Button>,
      ]}
      filtersLayout="side"
      filterState={filters}
      filtersStorageKey="npcs.list"
      filters={<NpcListFilters filters={filters} realms={realms} />}
      collection={{ modes: ['cards'], storageKey: 'npcs.list' }}
      renderItem={(npc) => {
        const catalog = isCatalogNpc(npc);
        return (
          <EntityCard
            title={npcName(npc, t)}
            subtitle={[t(`npc-category-${npc.category}`), npc.type ? npcTypeLabel(npc.type, t) : null]
              .filter(Boolean)
              .join(' · ')}
            image={npcImage(npc)}
            fallbackImages={['images/npcs/unknown.png']}
            locked={!catalog}
            lockedLabel={t('npc-origin-mine')}
            chips={
              <Chip
                size="small"
                color={catalog ? 'default' : 'primary'}
                variant={catalog ? 'outlined' : 'filled'}
                label={t(catalog ? 'npc-origin-catalog' : 'npc-origin-mine')}
              />
            }
            metrics={[
              { label: t('level'), value: npc.level },
              { label: t('npc-hits'), value: npc.hp },
              { label: t('npc-at-db'), value: `${npc.at}/${npc.db}` },
              { label: t('size'), value: t(`size-${npc.size}`) },
            ]}
            onClick={() => open(npc)}
          />
        );
      }}
    >
      {truncated && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t('npc-list-limit', { max: NPC_LIST_MAX })}
        </Alert>
      )}
    </ListPage>
  );
}
