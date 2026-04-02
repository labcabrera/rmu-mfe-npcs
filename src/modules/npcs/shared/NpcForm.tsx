/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import { NumericInput } from '@labcabrera-rmu/rmu-react-shared-lib';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { Npc } from '../../api/npc.dto';
import { fetchRealms } from '../../api/realm';
import { Realm } from '../../api/realm.dto';
import SelectNpcCategory from '../../shared/selects/SelectNpcCategory';
import SelectNpcOutlookType from '../../shared/selects/SelectNpcOutlookType';
import SelectRealm from '../../shared/selects/SelectRealm';

const NpcForm: FC<{
  formData: Npc;
  setFormData: Dispatch<SetStateAction<Npc>>;
}> = ({ formData, setFormData }) => {
  const { showError } = useError();
  const [realms, setRealms] = useState<Realm[]>([]);

  useEffect(() => {
    fetchRealms('', 0, 100)
      .then((realms) => setRealms(realms))
      .catch((err) => showError(err));
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          label={t('name')}
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={!formData.name}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SelectRealm
          label={t('realm')}
          value={formData.realmId}
          onChange={(realm) => setFormData({ ...formData, realmId: realm!.id })}
          realms={realms}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SelectNpcCategory
          label={t('category')}
          value={formData.category}
          name="category"
          onChange={(value) => setFormData({ ...formData, category: value! })}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <NumericInput
          label={t('level')}
          name="level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e || 0 })}
          integer
          min={0}
          max={1000}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <NumericInput
          label={t('hp')}
          name="hp"
          value={formData.hp}
          onChange={(e) => setFormData({ ...formData, hp: e || 1 })}
          integer
          min={1}
          max={10000}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 2 }}>
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
      <Grid size={{ xs: 12, md: 2 }}>
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
      <Grid size={{ xs: 12, md: 2 }}>
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
      <Grid size={{ xs: 12, md: 2 }}>
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
      <Grid size={{ xs: 12, md: 4 }}>
        <SelectNpcOutlookType
          label={t('outlook-type')}
          value={formData.outlookType}
          name="outlookType"
          onChange={(e) => setFormData({ ...formData, outlookType: e! })}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          label={t('description')}
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          fullWidth
          multiline
          rows={4}
        />
      </Grid>
    </Grid>
  );
};

export default NpcForm;
