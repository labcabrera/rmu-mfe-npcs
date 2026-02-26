import React, { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { t } from 'i18next';
import { Npc } from '../../api/npc.dto';
import NumericCard from '../../shared/cards/NumericCard';
import TextCard from '../../shared/cards/TextCard';

const imageBaseUrl = process.env.RMU_MFE_ASSETS!;

const NpcViewAttributes: FC<{
  npc: Npc;
}> = ({ npc }) => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            {t('attributes')}
          </Typography>
          <Box mb={2} display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            <NumericCard
              value={npc.level}
              subtitle={t('level')}
              image={`${imageBaseUrl}images/generic/experience.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.hp}
              subtitle={t('hp')}
              image={`${imageBaseUrl}images/generic/hp.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.db}
              subtitle={t('db')}
              image={`${imageBaseUrl}images/generic/configuration.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.at}
              subtitle={t('at')}
              image={`${imageBaseUrl}images/generic/armor.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.initiative}
              subtitle={t('initiative')}
              image={`${imageBaseUrl}images/generic/initiative.png`}
              applyColor={false}
            />
            <NumericCard
              value={npc.endurance}
              subtitle={t('endurance')}
              image={`${imageBaseUrl}images/generic/endurance.png`}
              applyColor={false}
            />
            <TextCard
              value={npc.outlookType}
              subtitle={t('outlook-type')}
              image={`${imageBaseUrl}images/generic/configuration.png`}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default NpcViewAttributes;
