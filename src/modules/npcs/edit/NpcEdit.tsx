import React, { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useError } from '../../../ErrorContext';
import { fetchNpc } from '../../api/npc';
import { Npc, UpdateNpcDto } from '../../api/npc.dto';
import NpcAvatar from '../../shared/avatars/NpcAvatar';
import NpcSkills from '../shared/NpcSkills';
import NpcEditActions from './NpcEditActions';
import NpcEditAttributes from './NpcEditAttributes';
import NpcEditResume from './NpcEditResume';

const NpcEdit: FC = () => {
  const location = useLocation();
  const { showError } = useError();
  const { npcId } = useParams<{ npcId?: string }>();
  const [npc, setNpc] = useState<Npc | null>(null);
  const [formData, setFormData] = useState<UpdateNpcDto | null>(null);

  const onImageUpdated = (updatedNpc: Npc) => {
    setNpc(updatedNpc);
    setFormData({ ...formData, imageUrl: updatedNpc.imageUrl });
  };

  useEffect(() => {
    if (npc) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const { id, imageUrl, realmId, ...rest } = npc;
      setFormData({
        ...rest,
      });
    }
  }, [npc]);

  useEffect(() => {
    if (location.state && location.state.npc) {
      setNpc(location.state.npc);
    } else if (npcId) {
      fetchNpc(npcId)
        .then((response) => setNpc(response))
        .catch((err) => showError(err.message));
    }
  }, [location.state, npcId, showError]);

  if (!npc || !formData) return <div>Loading npc...</div>;

  return (
    <>
      <NpcEditActions npc={npc} formData={formData} />
      <Grid container spacing={2}>
        <Grid size={2}>
          <NpcAvatar npc={npc} onNpcUpdated={onImageUpdated} />
          <NpcEditResume formData={formData!} setFormData={setFormData} />
        </Grid>
        <Grid size={8}>
          <NpcEditAttributes formData={formData} setFormData={setFormData} />
          <NpcSkills formData={formData} setFormData={setFormData} />
        </Grid>
      </Grid>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </>
  );
};

export default NpcEdit;
