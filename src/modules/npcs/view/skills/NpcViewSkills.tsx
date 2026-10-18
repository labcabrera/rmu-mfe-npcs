import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Grid } from '@mui/material';
import {
  AddButton,
  AddNpcSkill,
  addNpcSkill,
  CategorySeparator,
  Npc,
  removeNpcSkill,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import AddSkillDialog from './AddSkillDialog';
import NpcSkillTable from './NpcSkillTable';

const NpcViewSkills: FC<{
  npc: Npc;
  setNpc: (npc: Npc) => void;
}> = ({ npc, setNpc }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const [openAddSkillDialog, setOpenAddSkillDialog] = useState(false);
  const notify = useNotify();

  const onSkillAdded = (value: AddNpcSkill) => {
    addNpcSkill(npc.id, value, auth)
      .then((response) => {
        setNpc(response);
        setOpenAddSkillDialog(false);
      })
      .catch((error) => notify.error(error));
  };

  const onSkillDeleted = (skillId: string) => {
    removeNpcSkill(npc.id, skillId, auth)
      .then((response) => setNpc(response))
      .catch((error) => notify.error(error));
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid size={12}>
          <CategorySeparator text={t('skills')}>
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
