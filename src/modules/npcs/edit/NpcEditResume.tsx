import React, { Dispatch, FC, SetStateAction } from 'react';
import { Grid, TextField } from '@mui/material';
import { t } from 'i18next';
import { UpdateNpcDto } from '../../api/npc.dto';
import SelectNpcCategory from '../../shared/selects/SelectNpcCategory';

const NpcEditResume: FC<{
  formData: UpdateNpcDto;
  setFormData: Dispatch<SetStateAction<UpdateNpcDto>>;
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
        <SelectNpcCategory
          label={t('category')}
          value={formData.category}
          name="category"
          onChange={(e) => setFormData({ ...formData, category: e })}
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
