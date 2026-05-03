/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DeleteButton,
  DeleteDialog,
  deleteNpc,
  EditableAvatar,
  EditButton,
  fetchNpc,
  fetchRealm,
  LayoutBase,
  Npc,
  Realm,
  RefreshButton,
  TechnicalInfo,
  updateNpc,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { getAvatarImages } from '../../services/image-service';
import NpcViewAttributes from './NpcViewAttributes';
import NpcViewResume from './NpcViewResume';
import NpcViewAttacks from './attacks/NpcViewAttacks';
import NpcViewSkills from './skills/NpcViewSkills';

export default function NpcView() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError } = useError();
  const { npcId } = useParams<{ npcId: string | undefined }>();
  const [realm, setRealm] = useState<Realm>();
  const [npc, setNpc] = useState<Npc>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const updateImage = (imageUrl: string) => {
    const dto = { imageUrl };
    updateNpc(npc!.id, dto, auth)
      .then((response) => setNpc(response))
      .catch((err) => showError(err.message));
  };

  const bindNpc = (npcId: string) => {
    fetchNpc(npcId, auth)
      .then((response) => setNpc(response))
      .catch((err) => showError(err.message));
  };

  const onDelete = () => {
    deleteNpc(npc!.id, auth)
      .then(() => navigate('/npcs'))
      .catch((err) => showError(err.message));
  };

  useEffect(() => {
    if (!npc) return;
    fetchRealm(npc.realmId, auth)
      .then((response) => setRealm(response))
      .catch((err) => showError(err.message));
  }, [npc]);

  useEffect(() => {
    if (!npcId) return;
    fetchNpc(npcId, auth)
      .then((response) => setNpc(response))
      .catch((err) => showError(err.message));
  }, [npcId]);

  if (!npc) return <p>Loading realm...</p>;

  return (
    <LayoutBase
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs'), link: '/npcs' }, { name: t('view') }]}
      actions={[
        <RefreshButton onClick={() => bindNpc(npc.id)} />,
        <EditButton onClick={() => navigate(`/npcs/edit/${npc.id}`, { state: { npc } })} />,
        <DeleteButton onClick={() => setDeleteDialogOpen(true)} />,
      ]}
      leftPanel={
        <>
          <EditableAvatar
            imageUrl={npc.imageUrl || ''}
            images={getAvatarImages()}
            onImageChange={(e) => updateImage(e)}
          />
          <NpcViewResume npc={npc} realm={realm} />
        </>
      }
    >
      <NpcViewAttributes npc={npc} />
      <NpcViewAttacks npc={npc} setNpc={setNpc} />
      <NpcViewSkills npc={npc} setNpc={setNpc} />
      <DeleteDialog
        open={deleteDialogOpen}
        message={`Are you sure you want to delete ${npc.name} NPC? This action cannot be undone.`}
        onDelete={() => onDelete()}
        onClose={() => setDeleteDialogOpen(false)}
      />
      <TechnicalInfo>
        <pre>{JSON.stringify(npc, null, 2)}</pre>
      </TechnicalInfo>
    </LayoutBase>
  );
}
