import React, { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { fetchNpc } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import GenericAvatar from '../../shared/avatars/GenericAvatar';
import NpcAvatar from '../../shared/avatars/NpcAvatar';
import NpcViewActions from './NpcViewActions';
import NpcViewResume from './NpcViewResume';

const NpcView: FC = () => {
  const location = useLocation();
  const { showError } = useError();
  const { npcId } = useParams<{ npcId?: string }>();
  const [npc, setNpc] = useState<Npc | null>(null);

  useEffect(() => {
    if (location.state && location.state.npc) {
      setNpc(location.state.npc);
    } else if (npcId) {
      fetchNpc(npcId)
        .then((response) => setNpc(response))
        .catch((err) => showError(err.message));
    }
  }, [location.state, npcId, showError]);

  if (!npc) return <p>Loading realm...</p>;

  return (
    <>
      <NpcViewActions npc={npc} setNpc={setNpc} />
      <Grid container spacing={2}>
        <Grid size={2}>
          <NpcAvatar npc={npc} />
          <NpcViewResume npc={npc} />
        </Grid>
        <Grid size={9}></Grid>
      </Grid>
    </>
  );
};

export default NpcView;
