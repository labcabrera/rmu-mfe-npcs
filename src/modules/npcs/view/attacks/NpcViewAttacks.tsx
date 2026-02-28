import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../../ErrorContext';
import { addNpcAttack, removeNpcAttack } from '../../../api/npc';
import { AddNpcAttack, Npc } from '../../../api/npc.dto';
import AddAttackDialog from './AddAttackDialog';
import NpcAttackTable from './NpcAttackTable';

const NpcViewAttacks: FC<{
  npc: Npc;
  setNpc: Dispatch<SetStateAction<Npc | undefined>>;
}> = ({ npc, setNpc }) => {
  const [openAddAttackDialog, setOpenAddAttackDialog] = useState(false);
  const { showError } = useError();

  const onAttackAdded = (attack: AddNpcAttack) => {
    addNpcAttack(npc.id, attack)
      .then((updated) => setNpc(updated))
      .catch((err) => showError(err.message));
  };

  const onAttackDeleted = (attackName: string) => {
    removeNpcAttack(npc.id, attackName)
      .then((updated) => setNpc(updated))
      .catch((err) => showError(err.message));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" color="primary">
            {t('attacks')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <IconButton aria-label="add-attack" color="primary" onClick={() => setOpenAddAttackDialog(true)}>
            <AddCircleIcon />
          </IconButton>
        </Stack>
      </Stack>

      <NpcAttackTable npc={npc} onDeleteAttack={(attackName) => onAttackDeleted(attackName)} />

      <AddAttackDialog
        open={openAddAttackDialog}
        onClose={() => setOpenAddAttackDialog(false)}
        onAttackAdded={(a) => onAttackAdded(a)}
      />
    </Box>
  );
};

export default NpcViewAttacks;
