/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  createNpc,
  EditableAvatar,
  fetchNpc,
  FormPage,
  LoadingState,
  Npc,
  TechnicalInfo,
  updateNpc,
  UpdateNpcDto,
  useEntity,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import NpcEditAttributes from './NpcEditAttributes';
import NpcEditResume from './NpcEditResume';
import NpcForm from './NpcForm';

/** Create and edit page of an NPC. Create shows the full form; edit keeps the resume/attributes layout. */
export default function NpcFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const { npcId } = useParams<{ npcId?: string }>();
  const existing = useEntity<Npc>(mode === 'edit' ? npcId : undefined, (id) => fetchNpc(id, auth), {
    initial: location.state?.npc,
    onError: notify.error,
  });
  const [formData, setFormData] = useState<Npc>();
  const [initialData, setInitialData] = useState<string>();

  useEffect(() => {
    if (formData) return;
    let data: Npc | undefined;
    if (mode === 'create') data = {} as Npc;
    else if (existing.entity) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const { id, ...rest } = existing.entity;
      data = rest as Npc;
    }
    if (data) {
      setFormData(data);
      setInitialData(JSON.stringify(data));
    }
  }, [existing.entity]);

  const toView = (npc: Npc) => navigate(`/npcs/view/${npc.id}`, { state: { npc } });

  const onSave = () => {
    if (!formData) return;
    const request = mode === 'create' ? createNpc(formData, auth) : updateNpc(npcId!, formData, auth);
    request.then(toView).catch(notify.error);
  };

  const onCancel = () => {
    if (mode === 'create') navigate('/npcs');
    else navigate(`/npcs/view/${npcId}`, { state: { npc: existing.entity } });
  };

  const setDto = (dto: UpdateNpcDto) => setFormData(dto as Npc);

  const breadcrumbs = [
    { name: t('home'), link: '/' },
    { name: t('npcs'), link: '/npcs' },
    { name: t(mode === 'create' ? 'create' : 'edit') },
  ];

  const avatar = formData && (
    <EditableAvatar
      imageUrl={formData.imageUrl || ''}
      onImageChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
    />
  );

  return (
    <FormPage
      breadcrumbs={breadcrumbs}
      onSave={onSave}
      onCancel={onCancel}
      saveDisabled={!formData || (mode === 'create' && !formData.name)}
      dirty={!!formData && JSON.stringify(formData) !== initialData}
      leftPanel={
        mode === 'create'
          ? avatar
          : formData && (
              <>
                {avatar}
                <NpcEditResume formData={formData} setFormData={setDto} />
              </>
            )
      }
    >
      {formData ? (
        <>
          {mode === 'create' ? (
            <NpcForm formData={formData} setFormData={setFormData} />
          ) : (
            <NpcEditAttributes formData={formData} setFormData={setDto} />
          )}
          <TechnicalInfo>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </TechnicalInfo>
        </>
      ) : (
        <LoadingState variant="detail" />
      )}
    </FormPage>
  );
}
