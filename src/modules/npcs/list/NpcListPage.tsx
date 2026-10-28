import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import {
  defaultImages,
  EntityCard,
  fetchNpcs,
  gridSizeShowcase,
  ListPage,
  Npc,
  useListFilters,
  useNotify,
  usePagedQuery,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { npcCategoryLabel } from '../npc-categories';
import { useOutlookTypes } from '../outlook-types';
import NpcListFilters, { npcFilters } from './NpcListFilters';

export default function NpcListPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const notify = useNotify();
  const outlookTypes = useOutlookTypes();
  const filters = useListFilters(npcFilters(t));
  const query = usePagedQuery<Npc>({
    fetcher: (rsql, page, size) => fetchNpcs(rsql, page, size, auth),
    rsql: filters.rsql,
    onError: notify.error,
  });

  return (
    <ListPage
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs') }]}
      query={query}
      onAdd={() => navigate('/npcs/create')}
      filterState={filters}
      filters={<NpcListFilters filters={filters} outlookTypes={outlookTypes} />}
      collection={{ modes: ['cards'], storageKey: 'npcs.list', cardSize: gridSizeShowcase }}
      renderItem={(npc) => (
        <EntityCard
          title={npc.name}
          subtitle={npc.category ? npcCategoryLabel(npc.category, t) : undefined}
          image={npc.imageUrl || defaultImages.npc}
          fallbackImages={[defaultImages.npc]}
          imageRatio="portrait"
          metrics={[
            { label: t('level'), value: npc.level },
            { label: t('hp'), value: npc.hp },
            { label: t('db'), value: npc.db },
            { label: t('at'), value: npc.at },
          ]}
          onClick={() => navigate(`/npcs/view/${npc.id}`, { state: { npc } })}
        />
      )}
    />
  );
}
