import React, { Dispatch, FC, SetStateAction } from 'react';
import { Typography, Grid } from '@mui/material';
import { t } from 'i18next';
import { UpdateNpcDto } from '../../api/npc.dto';
import { NumericInput } from '../../shared/inputs/NumericInput';

const NpcEditAttributes: FC<{
  formData: UpdateNpcDto;
  setFormData: Dispatch<SetStateAction<UpdateNpcDto>>;
}> = ({ formData, setFormData }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Typography variant="h6" color="primary">
          {t('npc-info')}
        </Typography>
      </Grid>
      <Grid size={2}>
        <NumericInput
          label={t('level')}
          name="level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e })}
          integer
          min={0}
          max={1000}
        />
      </Grid>
      <Grid size={2}>
        <NumericInput
          label={t('hp')}
          name="hp"
          value={formData.hp}
          onChange={(e) => setFormData({ ...formData, hp: e })}
          integer
          min={1}
          max={1000}
        />
      </Grid>
      <Grid size={2}>
        <NumericInput
          label={t('at')}
          name="at"
          value={formData.at}
          onChange={(e) => setFormData({ ...formData, at: e })}
          integer
          min={1}
          max={10}
        />
      </Grid>
    </Grid>
  );
};

export default NpcEditAttributes;
