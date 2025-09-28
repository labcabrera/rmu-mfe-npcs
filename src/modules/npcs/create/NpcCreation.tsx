import React, { FC, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useError } from '../../../ErrorContext';
import { CREATE_NPC_TEMPLATE, CreateNpcDto } from '../../api/npc.dto';
import { fetchRealms } from '../../api/realm';
import { Realm } from '../../api/realm.dto';
import GenericAvatar from '../../shared/avatars/GenericAvatar';
import NpcCreationActions from './NpcCreationActions';
import NpcCreationAttributes from './NpcCreationAttributes';
import NpcCreationResume from './NpcCreationResume';
import NpcCreationsSkills from './NpcCreationSkills';

const NpcCreation: FC = () => {
  const { showError } = useError();
  const [realms, setRealms] = useState<Realm[]>([]);
  const [formData, setFormData] = useState<CreateNpcDto>(CREATE_NPC_TEMPLATE);
  const [isValid, setIsValid] = useState(false);

  const validateForm = (formData: CreateNpcDto) => {
    if (!formData.name) return false;
    return true;
  };

  useEffect(() => {
    setIsValid(validateForm(formData));
    fetchRealms('', 0, 100)
      .then((realms) => setRealms(realms))
      .catch((err) => showError(err));
  }, [formData, showError]);

  if (!formData) return <div>Loading...</div>;

  return (
    <>
      <NpcCreationActions formData={formData} isValid={isValid} />
      <Grid container spacing={2}>
        <Grid size={2}>
          <GenericAvatar imageUrl="/static/images/generic/realm.png" size={300} />
          <NpcCreationResume formData={formData!} setFormData={setFormData} realms={realms} />
        </Grid>
        <Grid size={8}>
          <NpcCreationAttributes formData={formData} setFormData={setFormData} />
          <NpcCreationsSkills formData={formData} setFormData={setFormData} />
        </Grid>
      </Grid>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </>
  );
};

export default NpcCreation;
