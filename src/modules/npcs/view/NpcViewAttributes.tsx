import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import { CategorySeparator, imageBaseUrl, Npc, RmuTextCard } from '@labcabrera-rmu/rmu-react-shared-lib';
import { gridSizeCard } from '../../services/display';

const NpcViewAttributes: FC<{
  npc: Npc;
}> = ({ npc }) => {
  const { t } = useTranslation();
  return (
    <>
      <Grid container spacing={1}>
        <Grid size={12}>
          <CategorySeparator text={t('Attributes')} />
        </Grid>
        <Grid size={gridSizeCard}>
          <RmuTextCard
            value={npc.level}
            subtitle={t('level')}
            image={`${imageBaseUrl}images/generic/experience.png`}
            applyColor={false}
          />
        </Grid>
        <Grid size={gridSizeCard}>
          <RmuTextCard
            value={npc.hp}
            subtitle={t('hp')}
            image={`${imageBaseUrl}images/generic/hp.png`}
            applyColor={false}
          />
        </Grid>
        <Grid size={gridSizeCard}>
          <RmuTextCard
            value={npc.db}
            subtitle={t('db')}
            image={`${imageBaseUrl}images/generic/configuration.png`}
            applyColor={false}
          />
        </Grid>
        <Grid size={gridSizeCard}>
          <RmuTextCard
            value={npc.at}
            subtitle={t('at')}
            image={`${imageBaseUrl}images/generic/armor.png`}
            applyColor={false}
          />
        </Grid>
        <Grid size={gridSizeCard}>
          <RmuTextCard
            value={npc.initiative}
            subtitle={t('initiative')}
            image={`${imageBaseUrl}images/generic/initiative.png`}
            applyColor={false}
          />
        </Grid>
        <Grid size={gridSizeCard}>
          <RmuTextCard
            value={npc.endurance}
            subtitle={t('endurance')}
            image={`${imageBaseUrl}images/generic/endurance.png`}
            applyColor={false}
          />
        </Grid>
        <Grid size={gridSizeCard}>
          <RmuTextCard
            value={npc.outlookType}
            subtitle={t('outlook-type')}
            image={`${imageBaseUrl}images/generic/configuration.png`}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default NpcViewAttributes;
