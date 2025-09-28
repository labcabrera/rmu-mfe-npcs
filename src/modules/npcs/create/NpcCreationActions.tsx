import React, { FC } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Breadcrumbs, Stack, Link } from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { createNpc } from '../../api/npc';
import { CreateNpcDto } from '../../api/npc.dto';
import CancelButton from '../../shared/buttons/CancelButton';
import SaveButton from '../../shared/buttons/SaveButton';

const NpcCreationActions: FC<{
  formData: CreateNpcDto;
  isValid: boolean;
}> = ({ formData, isValid }) => {
  const navigate = useNavigate();
  const { showError } = useError();

  const onSaveClick = async () => {
    createNpc(formData)
      .then((npc) => navigate(`/npcs/view/${npc.id}`))
      .catch((err) => showError(err.message));
  };

  const onBackClick = () => {
    navigate(`/npcs`);
  };

  return (
    <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center" sx={{ minHeight: 80 }}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="primary" underline="hover" href="/">
            {t('home')}
          </Link>
          <Link component={RouterLink} to="/npcs" color="primary" underline="hover">
            {t('npcs')}
          </Link>
          <span>{t('create')}</span>
        </Breadcrumbs>
      </Box>
      <Stack spacing={1} direction="row">
        <CancelButton onClick={onBackClick} />
        <SaveButton onClick={onSaveClick} disabled={!isValid} />
      </Stack>
    </Stack>
  );
};

export default NpcCreationActions;
