/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Grid, TextField } from '@mui/material';
import {
  EnumPicker,
  fetchRealms,
  Npc,
  NumericInput,
  Realm,
  RealmPicker,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { NPC_CATEGORIES } from '../npc-categories';
import { useOutlookTypes } from '../outlook-types';

const NpcForm: FC<{
  formData: Npc;
  setFormData: (npc: Npc) => void;
}> = ({ formData, setFormData }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const notify = useNotify();
  const [realms, setRealms] = useState<Realm[]>();
  const outlookTypes = useOutlookTypes();

  useEffect(() => {
    fetchRealms('', 0, 100, auth)
      .then((response) => setRealms(response.content))
      .catch((err) => notify.error(err));
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
        <RealmPicker
          variant="select"
          label={t('realm')}
          name="realm"
          value={formData.realmId}
          onChange={(realmId) => setFormData({ ...formData, realmId: realmId ?? '' })}
          realms={realms}
          required
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <EnumPicker
          variant="select"
          label={t('category')}
          values={NPC_CATEGORIES}
          labelPrefix="npc-category-"
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
          onChange={(e) => setFormData({ ...formData, db: e || 0 })}
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
          onChange={(e) => setFormData({ ...formData, at: e || 1 })}
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
          onChange={(e) => setFormData({ ...formData, initiative: e || 0 })}
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
          onChange={(e) => setFormData({ ...formData, endurance: e || 0 })}
          integer
          min={-100}
          max={100}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <EnumPicker
          variant="select"
          label={t('outlook-type')}
          values={outlookTypes ?? []}
          labelPrefix="outlook-"
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
