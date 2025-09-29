import React, { Dispatch, FC, SetStateAction } from 'react';
import { Grid } from '@mui/material';
import { t } from 'i18next';
import { CreateNpcDto } from '../../api/npc.dto';
import { NumericInput } from '../../shared/inputs/NumericInput';
import SelectNpcOutlookType from '../../shared/selects/SelectNpcOutlookType';

const NpcCreationAttributes: FC<{
  formData: CreateNpcDto;
  setFormData: Dispatch<SetStateAction<CreateNpcDto>>;
}> = ({ formData, setFormData }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={2}>
        <SelectNpcOutlookType
          label={t('outlook-type')}
          value={formData.outlookType}
          name="outlookType"
          onChange={(e) => setFormData({ ...formData, outlookType: e })}
        />
      </Grid>
      <Grid size={2}>
        <NumericInput
          label={t('hp')}
          name="hp"
          value={formData.hp}
          onChange={(e) => setFormData({ ...formData, hp: e })}
          integer
          min={-100}
          max={1000}
        />
      </Grid>
      <Grid size={2}>
        <NumericInput
          label={t('db')}
          name="db"
          value={formData.db}
          onChange={(e) => setFormData({ ...formData, db: e })}
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
      <Grid size={2}>
        <NumericInput
          label={t('endurance')}
          name="endurance"
          value={formData.endurance}
          onChange={(e) => setFormData({ ...formData, endurance: e })}
          integer
          min={-100}
          max={100}
        />
      </Grid>
    </Grid>
  );
};

export default NpcCreationAttributes;
