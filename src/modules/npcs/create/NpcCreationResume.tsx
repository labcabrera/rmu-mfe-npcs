import React, { Dispatch, FC, SetStateAction } from 'react';
import { Grid, TextField } from '@mui/material';
import { t } from 'i18next';
import { CreateNpcDto } from '../../api/npc.dto';
import { Realm } from '../../api/realm.dto';
import { NumericInput } from '../../shared/inputs/NumericInput';
import SelectNpcCategory from '../../shared/selects/SelectNpcCategory';
import SelectRealm from '../../shared/selects/SelectRealm';

const NpcCreationResume: FC<{
  formData: CreateNpcDto;
  setFormData: Dispatch<SetStateAction<CreateNpcDto>>;
  realms: Realm[];
}> = ({ formData, setFormData, realms }) => {
  return (
    <Grid container spacing={2} mt={2}>
      <Grid size={12}>
        <TextField
          label={t('name')}
          variant="standard"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={!formData.name}
          helperText={!formData.name ? t('name-is-required') : ''}
          fullWidth
        />
      </Grid>
      <Grid size={12}>
        <SelectRealm
          label={t('realm')}
          value={formData.realmId}
          onChange={(realm) => setFormData({ ...formData, realmId: realm?.id || null })}
          realms={realms}
          required
        />
      </Grid>
      <Grid size={12}>
        <SelectNpcCategory
          label={t('category')}
          value={formData.category}
          name="category"
          onChange={(value) => setFormData({ ...formData, category: value })}
          required
        />
      </Grid>
      <Grid size={12}>
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
      <Grid size={12}>
        <TextField
          label={t('description')}
          variant="standard"
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          fullWidth
          multiline
          rows={10}
        />
      </Grid>
    </Grid>
  );
};

export default NpcCreationResume;
