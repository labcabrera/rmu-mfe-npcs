import React, { FC, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { NumericInput } from '@labcabrera-rmu/rmu-react-shared-lib';
import { t } from 'i18next';
import { AddNpcAttack } from '../../../api/npc.dto';
import SelectAttackTable from '../../../shared/selects/SelectAttackTable';
import SelectAttackType from '../../../shared/selects/SelectAttackType';
import SelectFumbleTable from '../../../shared/selects/SelectFumbleTable';

const AddAttackDialog: FC<{
  open: boolean;
  onClose: () => void;
  onAttackAdded: (attack: AddNpcAttack) => void;
}> = ({ open, onClose, onAttackAdded }) => {
  const [attackName, setAttackName] = useState<string>('');
  const [attackTable, setAttackTable] = useState<string>('');
  const [attackType, setAttackType] = useState<string>('');
  const [fumbleTable, setFumbleTable] = useState<string>('');
  const [attackSize, setAttackSize] = useState<number | null>(0);
  const [bo, setBo] = useState<number | null>(0);
  const [fumble, setFumble] = useState<number | null>(0);

  const handleAdd = () => {
    const attack: AddNpcAttack = {
      attackName: attackName,
      attackTable: attackTable,
      attackType: attackType,
      fumbleTable: fumbleTable,
      attackSize: attackSize ?? 0,
      bo: bo ?? 0,
      fumble: fumble ?? 0,
    };
    onAttackAdded(attack);
    // reset
    setAttackName('');
    setAttackTable('');
    setAttackType('');
    setFumbleTable('');
    setAttackSize(0);
    setBo(0);
    setFumble(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>{t('Add attack')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label={t('Attack name')}
              value={attackName}
              onChange={(e) => setAttackName(e.target.value)}
              fullWidth
              error={!attackName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectAttackType
              label={t('Attack type')}
              value={attackType}
              onChange={(attackType) => setAttackType(attackType)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectAttackTable
              label={t('Attack table')}
              value={attackTable}
              onChange={(attackTable) => setAttackTable(attackTable)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectFumbleTable
              label={t('Fumble table')}
              value={fumbleTable}
              onChange={(fumbleTable) => setFumbleTable(fumbleTable)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <NumericInput label={t('attack-size')} value={attackSize} onChange={(v) => setAttackSize(v)} integer />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <NumericInput label={t('bo')} value={bo} onChange={(v) => setBo(v)} integer />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <NumericInput label={t('fumble')} value={fumble} onChange={(v) => setFumble(v)} integer />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={handleAdd} variant="contained">
          {t('Add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAttackDialog;
