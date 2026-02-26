import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Breadcrumbs, Link, Stack } from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { deleteNpc, fetchNpc } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import DeleteButton from '../../shared/buttons/DeleteButton';
import EditButton from '../../shared/buttons/EditButton';
import RefreshButton from '../../shared/buttons/RefreshButton';
import DeleteDialog from '../../shared/dialogs/DeleteDialog';

const NpcViewActions: FC<{
  npc: Npc;
  setNpc: Dispatch<SetStateAction<Npc | undefined>>;
}> = ({ npc, setNpc }) => {
  const navigate = useNavigate();
  const { showError } = useError();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const onDeleteNpc = () => {
    deleteNpc(npc.id)
      .then(() => navigate('/npcs'))
      .catch((err) => showError(err.message));
  };

  const onRefreshButtonClick = () => {
    fetchNpc(npc.id)
      .then((response) => setNpc(response))
      .catch((err) => showError(err.message));
  };

  const onEditButtonClick = () => {
    navigate(`/npcs/edit/${npc.id}`, { state: { npc } });
  };

  const onDeleteButtonClick = () => {
    setDeleteDialogOpen(true);
  };

  const onCloseDialogClick = () => {
    setDeleteDialogOpen(false);
  };

  const onDeleteDialogClick = () => {
    onDeleteNpc();
    setDeleteDialogOpen(false);
  };

  if (!npc) return <p>Loading NPC...</p>;

  return (
    <>
      <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center" sx={{ minHeight: 80 }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="primary" underline="hover" href="/">
              {t('home')}
            </Link>
            <Link component={RouterLink} color="primary" underline="hover" to="/npcs">
              {t('npcs')}
            </Link>
            <span>{npc.name}</span>
          </Breadcrumbs>
        </Box>
        <Stack direction="row" spacing={1}>
          <RefreshButton onClick={() => onRefreshButtonClick()} />
          <EditButton onClick={() => onEditButtonClick()} />
          <DeleteButton onClick={() => onDeleteButtonClick()} />
        </Stack>
      </Stack>
      <DeleteDialog
        open={deleteDialogOpen}
        message={`Are you sure you want to delete ${npc.name} NPC? This action cannot be undone.`}
        onDelete={() => onDeleteDialogClick()}
        onClose={() => onCloseDialogClick()}
      />
    </>
  );
};

export default NpcViewActions;
