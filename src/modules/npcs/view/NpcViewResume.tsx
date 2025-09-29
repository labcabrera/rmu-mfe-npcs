import React, { FC } from 'react';
import { Grid, Link, Typography } from '@mui/material';
import { t } from 'i18next';
import { Npc } from '../../api/npc.dto';
import { Realm } from '../../api/realm.dto';

const NpcViewResume: FC<{
  npc: Npc;
  realm: Realm | null;
}> = ({ npc, realm }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h6" color="primary" gutterBottom>
            {npc.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <Link href={`/core/realms/view/${npc.realmId}`} color="textPrimary">
              {realm?.name || 'Loading realm...'}
            </Link>
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
