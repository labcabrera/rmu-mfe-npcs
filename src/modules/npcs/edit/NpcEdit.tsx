import React, { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useError } from '../../../ErrorContext';
import { fetchRealm } from '../../api/realm';
import { Realm, UpdateRealmDto } from '../../api/realm.dto';
import GenericAvatar from '../../shared/avatars/GenericAvatar';
import NpcEditActions from './NpcEditActions';
import NpcEditAttributes from './NpcEditAttributes';
import NpcEditResume from './NpcEditResume';

const NpcEdit: FC = () => {
  const location = useLocation();
  const { showError } = useError();
  const { realmId } = useParams<{ realmId?: string }>();
  const [realm, setRealm] = useState<Realm | null>(null);
  const [formData, setFormData] = useState<UpdateRealmDto | null>(null);

  useEffect(() => {
    if (realm) {
      setFormData({
        name: realm.name,
        shortDescription: realm.shortDescription,
        description: realm.description,
      });
    }
  }, [realm]);

  useEffect(() => {
    if (location.state && location.state.realm) {
      setRealm(location.state.realm);
    } else if (realmId) {
      fetchRealm(realmId)
        .then((response) => setRealm(response))
        .catch((err) => showError(err.message));
    }
  }, [location.state, realmId, showError]);

  if (!realm || !formData) return <div>Loading realm...</div>;

  return (
    <>
      <NpcEditActions realm={realm} formData={formData} />
      <Grid container spacing={2}>
        <Grid size={2}>
          <GenericAvatar imageUrl="/static/images/generic/realm.png" size={300} />
          <NpcEditResume formData={formData!} setFormData={setFormData} />
        </Grid>
        <Grid size={8}>
          <NpcEditAttributes formData={formData} setFormData={setFormData} />
        </Grid>
      </Grid>
    </>
  );
};

export default NpcEdit;
