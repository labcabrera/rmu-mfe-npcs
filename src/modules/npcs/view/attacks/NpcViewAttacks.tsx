import React, { FC, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../../ErrorContext';
import { updateNpc } from '../../../api/npc';
import { Npc, NpcAttack } from '../../../api/npc.dto';
import AddAttackDialog from './AddAttackDialog';
import NpcAttackTable from './NpcAttackTable';

const NpcViewAttacks: FC<{
  npc: Npc;
  setNpc: React.Dispatch<React.SetStateAction<Npc | undefined>>;
}> = ({ npc, setNpc }) => {
  const [openAddAttackDialog, setOpenAddAttackDialog] = useState(false);
  const { showError } = useError();

  const onAttackAdded = (attack: NpcAttack) => {
    const newAttacks = [...(npc.attacks || []), attack];
    updateNpc(npc.id, { attacks: newAttacks })
      .then((updated) => setNpc(updated))
      .catch((err) => showError(err.message));
  };

  const onAttackDeleted = (index: number) => {
    const newAttacks = (npc.attacks || []).filter((_, i) => i !== index);
    updateNpc(npc.id, { attacks: newAttacks })
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

      <NpcAttackTable npc={npc} onDeleteAttack={(index) => onAttackDeleted(index)} />

      <AddAttackDialog
        open={openAddAttackDialog}
        onClose={() => setOpenAddAttackDialog(false)}
        onAttackAdded={(a) => onAttackAdded(a)}
      />
    </Box>
  );
};

export default NpcViewAttacks;
