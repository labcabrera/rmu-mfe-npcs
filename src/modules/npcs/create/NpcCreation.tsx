import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import {
  CancelButton,
  createNpc,
  CreateNpcDto,
  EditableAvatar,
  LayoutBase,
  Npc,
  SaveButton,
  TechnicalInfo,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { getAvatarImages } from '../../services/image-service';
import NpcForm from './../shared/NpcForm';

export default function NpcCreation() {
  const auth = useAuth();
  const { t } = useTranslation();
  const { showError } = useError();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Npc>({} as Npc);
  const [isValid, setIsValid] = useState(false);

  const onSave = () => {
    createNpc(formData, auth)
      .then((response) => navigate(`/npcs/view/${response.id}`))
      .catch((err) => showError(err.message));
  };

  const validateForm = (formData: CreateNpcDto) => {
    if (!formData.name) return false;
    return true;
  };

  useEffect(() => {
    setIsValid(validateForm(formData));
  }, [formData, showError]);

  if (!formData) return <div>Loading...</div>;

  return (
    <LayoutBase
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs'), link: '/npcs' }, { name: t('create') }]}
      actions={[
        <CancelButton onClick={() => navigate(`/npcs`)} />,
        <SaveButton onClick={() => onSave()} disabled={!isValid} />,
      ]}
      leftPanel={
        <EditableAvatar
          imageUrl={formData.imageUrl || ''}
          images={getAvatarImages()}
          onImageChange={(imageUrl) => setFormData({ ...formData, imageUrl: imageUrl })}
        />
      }
    >
      <NpcForm formData={formData} setFormData={setFormData} />
      <TechnicalInfo>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </TechnicalInfo>
    </LayoutBase>
  );
}
