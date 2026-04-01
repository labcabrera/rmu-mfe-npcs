import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Grid } from '@mui/material';
import { CategorySeparator } from '@labcabrera-rmu/rmu-react-shared-lib';
import { t } from 'i18next';
import { useError } from '../../../../ErrorContext';
import { addNpcSkill, removeNpcSkill } from '../../../api/npc';
import { AddSkill, Npc } from '../../../api/npc.dto';
import AddButton from '../../../shared/buttons/AddButton';
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
      .catch((error) => showError(error.message));
  };

  const onSkillDeleted = (skillId: string) => {
    removeNpcSkill(npc.id, skillId)
      .then((updatedNpc) => setNpc(updatedNpc))
      .catch((error) => showError(error.message));
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid size={12}>
          <CategorySeparator text={t('Skills')}>
            <AddButton onClick={() => setOpenAddSkillDialog(true)} />
          </CategorySeparator>
        </Grid>
        <Grid size={12}>
          <NpcSkillTable npc={npc} onDeleteSkill={(skillId) => onSkillDeleted(skillId)} />
        </Grid>
      </Grid>
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
