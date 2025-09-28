import React, { Dispatch, FC, SetStateAction } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Stack } from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { fetchNpcs } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import AddButton from '../../shared/buttons/AddButton';
import RefreshButton from '../../shared/buttons/RefreshButton';

const NpcListActions: FC<{ setNpcs: Dispatch<SetStateAction<Npc[]>> }> = ({ setNpcs }) => {
  const navigate = useNavigate();
  const { showError } = useError();

  const onAddNpcClick = () => {
    navigate('/npcs/create');
  };

  const onRefreshButtonClick = () => {
    fetchNpcs('', 0, 20)
      .then((response) => setNpcs(response))
      .catch((err) => showError(err.message));
  };

  return (
    <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center" sx={{ minHeight: 80 }}>
      <Box>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="primary" underline="hover" href="/">
            {t('home')}
          </Link>
          <Link component={RouterLink} color="primary" underline="hover" to="/npcs">
            {t('npcs')}
          </Link>
          <span>{t('list')}</span>
        </Breadcrumbs>
      </Box>
      <Stack spacing={1} direction="row">
        <RefreshButton onClick={() => onRefreshButtonClick()} />
        <AddButton onClick={() => onAddNpcClick()} />
      </Stack>
    </Stack>
  );
};

export default NpcListActions;
