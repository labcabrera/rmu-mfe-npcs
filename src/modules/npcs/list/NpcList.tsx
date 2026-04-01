import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { RmuTextCard } from '@labcabrera-rmu/rmu-react-shared-lib';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { fetchNpcs } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import { gridSizeMain, gridSizeResume, gridSizeCard } from '../../services/display';
import NpcListActions from './NpcListActions';

const NpcList: FC = () => {
  const navigate = useNavigate();
  const { showError } = useError();
  const [npcs, setNpcs] = useState<Npc[]>([]);

  const onCardClick = (npc: Npc) => {
    navigate(`/npcs/view/${npc.id}`, { state: { npc } });
  };

  useEffect(() => {
    fetchNpcs('', 0, 20)
      .then((response) => setNpcs(response))
      .catch((err) => showError(err.message));
  }, [showError]);

  return (
    <>
      <NpcListActions setNpcs={setNpcs} />
      <Grid container spacing={1}>
        <Grid size={gridSizeResume}></Grid>
        <Grid size={gridSizeMain}>
          <Grid container spacing={1}>
            {npcs.map((npc, index) => (
              <Grid size={gridSizeCard} key={index}>
                <RmuTextCard
                  value={npc.name}
                  subtitle={t(npc.category)}
                  image={npc.imageUrl || ''}
                  onClick={() => onCardClick(npc)}
                />
              </Grid>
            ))}
          </Grid>
          {npcs.length === 0 ? <p>No npcs found.</p> : null}
        </Grid>
      </Grid>
    </>
  );
};

export default NpcList;
