import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, TextField } from '@mui/material';
import { EnumPicker, UpdateNpcDto } from '@labcabrera-rmu/rmu-react-shared-lib';
import { NPC_CATEGORIES } from '../npc-categories';

const NpcEditResume: FC<{
  formData: UpdateNpcDto;
  setFormData: (dto: UpdateNpcDto) => void;
}> = ({ formData, setFormData }) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
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
        <EnumPicker
          variant="select"
          label={t('category')}
          values={NPC_CATEGORIES}
          labelPrefix="npc-category-"
          value={formData.category ?? null}
          name="category"
          onChange={(e) => setFormData({ ...formData, category: e ?? undefined })}
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
