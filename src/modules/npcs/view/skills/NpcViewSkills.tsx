import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Grid } from '@mui/material';
import {
  AddButton,
  addNpcSkill,
  AddNpcSkill,
  CategorySeparator,
  Npc,
  removeNpcSkill,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../../ErrorContext';
import AddSkillDialog from './AddSkillDialog';
import NpcSkillTable from './NpcSkillTable';

const NpcViewSkills: FC<{
  npc: Npc;
  setNpc: Dispatch<SetStateAction<Npc>>;
}> = ({ npc, setNpc }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const [openAddSkillDialog, setOpenAddSkillDialog] = useState(false);
  const { showError } = useError();

  const onSkillAdded = (value: AddNpcSkill) => {
    addNpcSkill(npc.id, value, auth)
      .then((response) => {
        setNpc(response);
        setOpenAddSkillDialog(false);
      })
      .catch((error) => showError(error.message));
  };

  const onSkillDeleted = (skillId: string) => {
    removeNpcSkill(npc.id, skillId, auth)
      .then((response) => setNpc(response))
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
        onClose={() => setOpenAddSkillDialog(false)}
        onSkillAdded={(value) => onSkillAdded(value)}
      />
    </>
  );
};

export default NpcViewSkills;
