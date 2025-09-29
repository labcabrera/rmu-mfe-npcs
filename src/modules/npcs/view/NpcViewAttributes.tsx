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
            <NumericCard value={npc.hp} subtitle={t('hp')} image={`/static/images/generic/hp.png`} applyColor={false} />
            <NumericCard
              value={npc.db}
              subtitle={t('db')}
              image={`/static/images/generic/configuration.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.at}
              subtitle={t('at')}
              image={`/static/images/generic/armor.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.initiative}
              subtitle={t('initiative')}
              image={`/static/images/generic/initiative.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.endurance}
              subtitle={t('endurance')}
              image={`/static/images/generic/endurance.png`}
              applyColor={false}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default NpcViewAttributes;
