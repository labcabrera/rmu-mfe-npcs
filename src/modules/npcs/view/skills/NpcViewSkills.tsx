import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, IconButton, Typography, Stack } from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../../ErrorContext';
import { addNpcSkill, removeNpcSkill } from '../../../api/npc';
import { AddSkill, Npc } from '../../../api/npc.dto';
import AddSkillDialog from './AddSkillDialog';
import NpcSkillTable from './NpcSkillTable';

const NpcViewSkills: FC<{
  npc: Npc;
  setNpc: Dispatch<SetStateAction<Npc | undefined>>;
}> = ({ npc, setNpc }) => {
  const [openAddSkillDialog, setOpenAddSkillDialog] = useState(false);
  const { showError } = useError();

  const onSkillAdded = (value: AddSkill) => {
    addNpcSkill(npc.id, value)
      .then((updatedNpc) => {
        setNpc(updatedNpc);
        setOpenAddSkillDialog(false);
      })
      .catch((error: Error) => showError(error.message));
  };

  const onSkillDeleted = (skillId: string) => {
    removeNpcSkill(npc.id, skillId)
      .then((updatedNpc) => setNpc(updatedNpc))
      .catch((error: Error) => showError(error.message));
  };

  return (
    <>
      <Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="primary">
              {t('skills')}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <IconButton aria-label="refresh" color="primary" onClick={() => setOpenAddSkillDialog(true)}>
              <AddCircleIcon />
            </IconButton>
          </Stack>
        </Stack>

        <NpcSkillTable npc={npc} onDeleteSkill={(skillId) => onSkillDeleted(skillId)} />
      </Box>
      <AddSkillDialog
        open={openAddSkillDialog}
        npc={npc}
        onClose={() => setOpenAddSkillDialog(false)}
        onSkillAdded={(value) => onSkillAdded(value)}
      />
    </>
  );
};

export default NpcViewSkills;
