import React, { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useError } from '../../../ErrorContext';
import { fetchNpc } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import { fetchRealm } from '../../api/realm';
import NpcAvatar from '../../shared/avatars/NpcAvatar';
import NpcViewActions from './NpcViewActions';
import NpcViewAttributes from './NpcViewAttributes';
import NpcViewResume from './NpcViewResume';

const NpcView: FC = () => {
  const location = useLocation();
  const { showError } = useError();
  const { npcId } = useParams<{ npcId?: string }>();
  const [npc, setNpc] = useState<Npc | null>(null);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    if (npc) {
      fetchRealm(npc.realmId)
        .then((response) => setRealm(response))
        .catch((err) => showError(err.message));
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

  if (!npc) return <p>Loading realm...</p>;

  return (
    <>
      <NpcViewActions npc={npc} setNpc={setNpc} />
      <Grid container spacing={2}>
        <Grid size={2}>
          <NpcAvatar npc={npc} onNpcUpdated={setNpc} />
          <NpcViewResume npc={npc} realm={realm} />
        </Grid>
        <Grid size={10}>
          <NpcViewAttributes npc={npc} />
        </Grid>
      </Grid>
      <pre>{JSON.stringify(npc, null, 2)}</pre>
    </>
  );
};

export default NpcView;
