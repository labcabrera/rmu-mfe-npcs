/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  deleteNpc,
  DetailPage,
  EditableAvatar,
  fetchNpc,
  fetchRealm,
  Npc,
  Realm,
  updateNpc,
  useEntity,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import NpcViewAttributes from './NpcViewAttributes';
import NpcViewResume from './NpcViewResume';
import NpcViewAttacks from './attacks/NpcViewAttacks';
import NpcViewSkills from './skills/NpcViewSkills';

export default function NpcViewPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const { npcId } = useParams<{ npcId?: string }>();
  const state = useEntity<Npc>(npcId, (id) => fetchNpc(id, auth), {
    initial: location.state?.npc,
    onError: notify.error,
  });
  const [realm, setRealm] = useState<Realm>();
  const realmId = state.entity?.realmId;

  useEffect(() => {
    if (!realmId) return;
    fetchRealm(realmId, auth).then(setRealm).catch(notify.error);
  }, [realmId]);

  const updateImage = (npc: Npc, imageUrl: string) =>
    updateNpc(npc.id, { imageUrl }, auth).then(state.setEntity).catch(notify.error);

  const onDelete = (npc: Npc) =>
    deleteNpc(npc.id, auth)
      .then(() => navigate('/npcs'))
      .catch(notify.error);

  return (
    <DetailPage
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs'), link: '/npcs' }, { name: t('view') }]}
      entity={state}
      summaryTitle={(entity) => t(entity.name)}
      onEdit={(npc) => navigate(`/npcs/edit/${npc.id}`, { state: { npc } })}
      onDelete={onDelete}
      leftPanel={(npc) => (
        <>
          <EditableAvatar imageUrl={npc.imageUrl || ''} onImageChange={(imageUrl) => updateImage(npc, imageUrl)} />
          <NpcViewResume npc={npc} realm={realm} />
        </>
      )}
    >
      {(npc) => (
        <>
          <NpcViewAttributes npc={npc} />
          <NpcViewAttacks npc={npc} setNpc={state.setEntity} />
          <NpcViewSkills npc={npc} setNpc={state.setEntity} />
        </>
      )}
    </DetailPage>
  );
}
