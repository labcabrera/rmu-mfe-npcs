import React, { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { Npc } from '../../api/npc.dto';
import NumericCard from '../../shared/cards/NumericCard';

const NpcViewAttributes: FC<{
  npc: Npc;
}> = ({ npc }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            {t('strategic-game-options')}
          </Typography>
          <Box mb={2} display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            <NumericCard
              value={npc.hp}
              subtitle={t('hp')}
              image={`/static/images/generic/experience.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.hp}
              subtitle={t('hp')}
              image={`/static/images/generic/experience.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.bd}
              subtitle={t('bd')}
              image={`/static/images/generic/configuration.png`}
              applyColor={false}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default NpcViewAttributes;
