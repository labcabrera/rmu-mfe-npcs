/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Stack } from '@mui/material';
import {
  createNpc,
  EditableAvatar,
  fetchNpc,
  fetchRealms,
  FormPage,
  LoadingState,
  Npc,
  Realm,
  updateNpc,
  useEntity,
  useIsAdmin,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { canChangeNpc, npcImage } from '../npc-format';
import NpcFormAttacks from './NpcFormAttacks';
import NpcFormCombat from './NpcFormCombat';
import NpcFormGeneral from './NpcFormGeneral';
import NpcFormMovement from './NpcFormMovement';
import NpcFormProfile from './NpcFormProfile';
import NpcFormSkills from './NpcFormSkills';
import {
  emptyNpcForm,
  npcCreateRequest,
  NpcForm,
  npcFormError,
  npcToForm,
  npcUpdateRequest,
  SetNpcForm,
} from './npc-form';

/** Create and edit page of an NPC (spec 054): every field of the combat stat block. */
export default function NpcFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const auth = useAuth();
  const admin = useIsAdmin();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const { npcId } = useParams<{ npcId?: string }>();
  const existing = useEntity<Npc>(mode === 'edit' ? npcId : undefined, (id) => fetchNpc(id, auth), {
    initial: location.state?.npc,
    onError: notify.error,
  });
  const [form, setForm] = useState<NpcForm>();
  const [initial, setInitial] = useState<string>();
  const [realms, setRealms] = useState<Realm[]>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRealms('', 0, 100, auth)
      .then((response) => setRealms(response.content))
      .catch(notify.error);
  }, []);

  useEffect(() => {
    if (form) return;
    let data: NpcForm | undefined;
    if (mode === 'create') data = emptyNpcForm();
    else if (existing.entity) data = npcToForm(existing.entity);
    if (data) {
      setForm(data);
      setInitial(JSON.stringify(data));
    }
  }, [existing.entity]);

  const set: SetNpcForm = (change) => setForm((previous) => (previous ? { ...previous, ...change } : previous));

  const toView = (npc: Npc) => navigate(`/npcs/view/${npc.id}`, { state: { npc }, replace: mode === 'edit' });

  const onSave = () => {
    if (!form) return;
    setSaving(true);
    const request =
      mode === 'create'
        ? createNpc(npcCreateRequest(form, admin), auth)
        : updateNpc(npcId!, npcUpdateRequest(form, existing.entity!.version, admin), auth);
    request
      .then(toView)
      .catch(notify.error)
      .finally(() => setSaving(false));
  };

  const onCancel = () => {
    if (mode === 'create') navigate('/npcs');
    else navigate(`/npcs/view/${npcId}`, { state: { npc: existing.entity } });
  };

  const error = form ? npcFormError(form) : null;
  const readOnly = mode === 'edit' && !!existing.entity && !canChangeNpc(auth, existing.entity);

  return (
    <FormPage
      breadcrumbs={[
        { name: t('home'), link: '/' },
        { name: t('npcs'), link: '/npcs' },
        { name: t(mode === 'create' ? 'create' : 'edit') },
      ]}
      entity={mode === 'edit' ? existing : undefined}
      onSave={onSave}
      onCancel={onCancel}
      saveDisabled={!form || !!error || saving || readOnly}
      dirty={!!form && JSON.stringify(form) !== initial}
      leftPanel={
        form && (
          <EditableAvatar
            imageUrl={npcImage({ ...form, source: existing.entity?.source ?? null })}
            onImageChange={(imageUrl) => set({ imageUrl })}
          />
        )
      }
    >
      {form ? (
        <Stack spacing={2}>
          {readOnly && <Alert severity="warning">{t('npc-read-only')}</Alert>}
          {error && <Alert severity="info">{t(error)}</Alert>}
          <NpcFormGeneral form={form} set={set} realms={realms} mode={mode} admin={admin} />
          <NpcFormCombat form={form} set={set} />
          <NpcFormAttacks form={form} set={set} />
          <NpcFormMovement form={form} set={set} />
          <NpcFormSkills form={form} set={set} />
          <NpcFormProfile form={form} set={set} />
        </Stack>
      ) : (
        <LoadingState variant="detail" />
      )}
    </FormPage>
  );
}
