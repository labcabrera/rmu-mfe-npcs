import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { fetchNpcs, ListPage, Npc, RmuTextCard, useNotify, usePagedQuery } from '@labcabrera-rmu/rmu-react-shared-lib';

export default function NpcListPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const notify = useNotify();
  const query = usePagedQuery<Npc>({
    fetcher: (rsql, page, size) => fetchNpcs(rsql, page, size, auth),
    onError: notify.error,
  });

  return (
    <ListPage
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs') }]}
      query={query}
      onAdd={() => navigate('/npcs/create')}
      renderItem={(npc) => (
        <RmuTextCard
          value={npc.name}
          subtitle={t(npc.category)}
          image={npc.imageUrl || ''}
          onClick={() => navigate(`/npcs/view/${npc.id}`, { state: { npc } })}
        />
      )}
    />
  );
}
