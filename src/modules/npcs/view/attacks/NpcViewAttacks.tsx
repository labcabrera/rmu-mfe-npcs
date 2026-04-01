import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Grid } from '@mui/material';
import { AddButton, CategorySeparator } from '@labcabrera-rmu/rmu-react-shared-lib';
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
    <>
      <Grid container spacing={1}>
        <Grid size={12}>
          <CategorySeparator text={t('Attacks')}>
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
