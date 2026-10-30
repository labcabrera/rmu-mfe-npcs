/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Alert, Stack, TextField } from '@mui/material';
import {
  createNpc,
  CreateNpcDto,
  Npc,
  Realm,
  RealmPicker,
  RmuDialog,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { npcName } from '../npc-format';

/**
 * The fields of a copy of an NPC as a new private NPC of the user: everything but the identity, the owner, the
 * timestamps and the book source (spec 054).
 */
export const npcCopy = (npc: Npc, name: string, realmId: string): CreateNpcDto => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { id, version, owner, source, createdAt, updatedAt, accessType, ...rest } = npc;
  return { ...rest, name, realmId, accessType: 'private' };
};

/** Creates a private copy of an NPC (usually a catalog creature) in a realm the user picks, then opens it. */
const DuplicateNpcDialog: FC<{
  npc: Npc;
  realms: Realm[] | undefined;
  open: boolean;
  onClose: () => void;
  onCreated: (npc: Npc) => void;
}> = ({ npc, realms, open, onClose, onCreated }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const notify = useNotify();
  const [name, setName] = useState('');
  const [realmId, setRealmId] = useState<string | null>(npc.realmId);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(npcName(npc, t));
    setRealmId(npc.realmId);
  }, [open, npc.id]);

  const onConfirm = () => {
    if (!realmId || !name.trim()) return;
    setSaving(true);
    createNpc(npcCopy(npc, name.trim(), realmId), auth)
      .then(onCreated)
      .catch(notify.error)
      .finally(() => setSaving(false));
  };

  return (
    <RmuDialog
      open={open}
      title={t('npc-duplicate')}
      maxWidth="sm"
      onCancel={onClose}
      onConfirm={onConfirm}
      onConfirmDisabled={saving || !realmId || !name.trim()}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <Alert severity="info">{t('npc-duplicate-help')}</Alert>
        <TextField label={t('name')} name="name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <RealmPicker variant="select" value={realmId} onChange={setRealmId} realms={realms} required />
      </Stack>
    </RmuDialog>
  );
};

export default DuplicateNpcDialog;
