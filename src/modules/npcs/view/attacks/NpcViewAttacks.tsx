import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Grid } from '@mui/material';
import {
  AddButton,
  AddNpcAttack,
  addNpcAttack,
  CategorySeparator,
  Npc,
  removeNpcAttack,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import AddAttackDialog from './AddAttackDialog';
import NpcAttackTable from './NpcAttackTable';

const NpcViewAttacks: FC<{
  npc: Npc;
  setNpc: (npc: Npc) => void;
}> = ({ npc, setNpc }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const [openAddAttackDialog, setOpenAddAttackDialog] = useState(false);
  const notify = useNotify();

  const onAttackAdded = (attack: AddNpcAttack) => {
    addNpcAttack(npc.id, attack, auth)
      .then((updated) => setNpc(updated))
      .catch((err) => notify.error(err));
  };

  const onAttackDeleted = (attackName: string) => {
    removeNpcAttack(npc.id, attackName, auth)
      .then((updated) => setNpc(updated))
      .catch((err) => notify.error(err));
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid size={12}>
          <CategorySeparator text={t('attacks')}>
            <AddButton onClick={() => setOpenAddAttackDialog(true)} />
          </CategorySeparator>
        </Grid>
        <Grid size={12}>
          <NpcAttackTable npc={npc} onDeleteAttack={(attackName) => onAttackDeleted(attackName)} />
        </Grid>
      </Grid>

      <AddAttackDialog
        open={openAddAttackDialog}
        onClose={() => setOpenAddAttackDialog(false)}
        onAttackAdded={(a) => onAttackAdded(a)}
      />
    </>
  );
};

export default NpcViewAttacks;
