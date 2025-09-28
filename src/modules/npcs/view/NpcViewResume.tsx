import React, { FC } from 'react';
import { Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { Npc } from '../../api/npc.dto';

const NpcViewResume: FC<{
  npc: Npc;
}> = ({ npc }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h6" color="primary" gutterBottom>
            {npc.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {t(npc.category)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {npc.description}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default NpcViewResume;
