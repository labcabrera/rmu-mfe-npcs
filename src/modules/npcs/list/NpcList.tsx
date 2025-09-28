import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { useError } from '../../../ErrorContext';
import { fetchNpcs } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import NpcCard from '../../shared/cards/NpcCard';
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
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid size={12}>
          <Box mb={2} display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            {npcs.map((npc) => (
              <NpcCard key={npc.id} onClick={() => onCardClick(npc)} npc={npc} />
            ))}
          </Box>
          {npcs.length === 0 ? <p>No npcs found.</p> : null}
        </Grid>
      </Grid>
    </>
  );
};

export default NpcList;
