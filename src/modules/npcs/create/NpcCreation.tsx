import React, { FC, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { EditableAvatar, TechnicalInfo } from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { emptyNpc, CreateNpcDto, Npc } from '../../api/npc.dto';
import { imageBaseUrl } from '../../services/config';
import { getAvatarImages } from '../../services/image-service';
import NpcCreationActions from './NpcCreationActions';
import NpcCreationAttributes from './NpcCreationAttributes';

const NpcCreation: FC = () => {
  const { showError } = useError();
  const [formData, setFormData] = useState<Npc>(emptyNpc);
  const [isValid, setIsValid] = useState(false);

  const validateForm = (formData: CreateNpcDto) => {
    if (!formData.name) return false;
    return true;
  };

  useEffect(() => {
    setIsValid(validateForm(formData));
  }, [formData, showError]);

  if (!formData) return <div>Loading...</div>;

  return (
    <>
      <NpcCreationActions formData={formData} isValid={isValid} />
      <Grid container spacing={2}>
        <Grid size={2}>
          <EditableAvatar
            imageUrl={`${imageBaseUrl}images/npcs/unknown.png`}
            images={getAvatarImages()}
            onImageChange={(imageUrl) => setFormData({ ...formData, imageUrl: imageUrl })}
          />
        </Grid>
        <Grid size={8}>
          <NpcCreationAttributes formData={formData} setFormData={setFormData} />
          <TechnicalInfo>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </TechnicalInfo>
        </Grid>
      </Grid>
    </>
  );
};

export default NpcCreation;
