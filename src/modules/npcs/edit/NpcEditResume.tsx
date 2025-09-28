import React, { Dispatch, FC, SetStateAction } from 'react';
import { Grid, TextField } from '@mui/material';
import { t } from 'i18next';
import { UpdateRealmDto } from '../../api/realm.dto';

const NpcEditResume: FC<{
  formData: UpdateRealmDto;
  setFormData: Dispatch<SetStateAction<UpdateRealmDto>>;
}> = ({ formData, setFormData }) => {
  return (
    <Grid container spacing={2} mt={3}>
      <Grid size={12}>
        <TextField
          label={t('name')}
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          variant="standard"
          fullWidth
        />
      </Grid>
      <Grid size={12}>
        <TextField
          label={t('description')}
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          variant="standard"
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default NpcEditResume;
