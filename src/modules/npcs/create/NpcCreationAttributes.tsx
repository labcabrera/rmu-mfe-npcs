import React, { Dispatch, FC, SetStateAction } from 'react';
import { Grid, TextField } from '@mui/material';
import { t } from 'i18next';
import { CreateNpcDto } from '../../api/npc.dto';
import { NumericInput } from '../../shared/inputs/NumericInput';

const NpcCreationAttributes: FC<{
  formData: CreateNpcDto;
  setFormData: Dispatch<SetStateAction<CreateNpcDto>>;
}> = ({ formData, setFormData }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={2}>
        <NumericInput
          label={t('bd')}
          name="bd"
          value={formData.bd}
          onChange={(e) => setFormData({ ...formData, bd: e })}
          integer
          min={-100}
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
      <Grid size={2}>
        <NumericInput
          label={t('initiative')}
          name="initiative"
          value={formData.initiative}
          onChange={(e) => setFormData({ ...formData, initiative: e })}
          integer
          min={-100}
          max={100}
        />
      </Grid>
    </Grid>
  );
};

export default NpcCreationAttributes;
