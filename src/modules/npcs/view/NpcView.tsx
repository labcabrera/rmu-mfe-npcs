import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { TechnicalInfo } from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { fetchNpc } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import { fetchRealm } from '../../api/realm';
import { Realm } from '../../api/realm.dto';
import { gridSizeMain, gridSizeResume } from '../../services/display';
import NpcAvatar from '../../shared/avatars/NpcAvatar';
import NpcViewActions from './NpcViewActions';
import NpcViewAttributes from './NpcViewAttributes';
import NpcViewResume from './NpcViewResume';
import NpcViewAttacks from './attacks/NpcViewAttacks';
import NpcViewSkills from './skills/NpcViewSkills';

const NpcView: FC = () => {
  const { showError } = useError();
  const { npcId } = useParams<{ npcId: string | undefined }>();
  const [realm, setRealm] = useState<Realm | undefined>(undefined);
  const [npc, setNpc] = useState<Npc>();

  useEffect(() => {
    if (npc) {
      fetchRealm(npc.realmId)
        .then((response) => setRealm(response))
        .catch((err) => showError(err.message));
    }
  }, [npc]);

  useEffect(() => {
    if (npcId) {
      fetchNpc(npcId)
        .then((response) => setNpc(response))
        .catch((err) => showError(err.message));
    }
  }, [npcId, showError]);

  if (!npc) return <p>Loading realm...</p>;

  return (
    <>
      <NpcViewActions npc={npc} setNpc={setNpc} />
      <Grid container spacing={1}>
        <Grid size={gridSizeResume}>
          <NpcAvatar npc={npc} onNpcUpdated={setNpc} />
          <NpcViewResume npc={npc} realm={realm} />
        </Grid>
        <Grid size={gridSizeMain}>
          <NpcViewAttributes npc={npc} />
          <NpcViewAttacks npc={npc} setNpc={setNpc} />
          <NpcViewSkills npc={npc} setNpc={setNpc} />
          <TechnicalInfo>
            <pre>{JSON.stringify(npc, null, 2)}</pre>
          </TechnicalInfo>
        </Grid>
      </Grid>
    </>
  );
};

export default NpcView;
