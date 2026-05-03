/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  CancelButton,
  EditableAvatar,
  fetchNpc,
  LayoutBase,
  Npc,
  SaveButton,
  TechnicalInfo,
  updateNpc,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { getAvatarImages } from '../../services/image-service';
import NpcEditAttributes from './NpcEditAttributes';
import NpcEditResume from './NpcEditResume';

const NpcEdit: FC = () => {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError } = useError();
  const { npcId } = useParams<{ npcId?: string }>();
  const [npc, setNpc] = useState<Npc>();
  const [formData, setFormData] = useState<Npc>({} as Npc);

  const onUpdate = async () => {
    updateNpc(npc!.id, formData, auth)
      .then((data) => {
        navigate(`/npcs/view/${data.id}`, { state: { npc: data } });
      })
      .catch((err: unknown) => {
        if (err instanceof Error) showError(err.message);
        else showError('An unknown error occurred');
      });
  };

  useEffect(() => {
    if (npc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const { id, ...rest } = npc;
      setFormData({ ...rest } as Npc);
    }
  }, [npc]);

  useEffect(() => {
    if (location.state && location.state.npc) {
      setNpc(location.state.npc);
    } else if (npcId) {
      fetchNpc(npcId, auth)
        .then((response) => setNpc(response))
        .catch((err) => showError(err.message));
    }
  }, [location.state, npcId]);

  if (!npc || !formData) return <div>Loading npc...</div>;

  return (
    <>
      <LayoutBase
        breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs'), link: '/npcs' }, { name: t('edit') }]}
        actions={[
          <CancelButton onClick={() => navigate(`/npcs/view/${npc.id}`, { state: { npc } })} />,
          <SaveButton onClick={() => onUpdate()} />,
        ]}
        leftPanel={
          <>
            <EditableAvatar
              imageUrl={formData.imageUrl!}
              images={getAvatarImages()}
              onImageChange={(e) => setFormData({ ...formData, imageUrl: e })}
            />
            <NpcEditResume formData={formData!} setFormData={setFormData} />
          </>
        }
      >
        <NpcEditAttributes formData={formData} setFormData={setFormData} />
        <TechnicalInfo>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </TechnicalInfo>
      </LayoutBase>
    </>
  );
};

export default NpcEdit;
