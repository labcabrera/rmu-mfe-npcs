import React, { FC, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { t } from 'i18next';
import { fetchAttackTables } from '../../../api/attack-tables';
import { AddNpcAttack } from '../../../api/npc.dto';
import { NumericInput } from '../../../shared/inputs/NumericInput';
import SelectAttackTable from '../../../shared/selects/SelectAttackTable';

const AddAttackDialog: FC<{
  open: boolean;
  onClose: () => void;
  onAttackAdded: (attack: AddNpcAttack) => void;
}> = ({ open, onClose, onAttackAdded }) => {
  // const attackTables = fetchAttackTables();
  const [attackTables, setAttackTables] = useState<string[]>([]);

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

  useEffect(() => {
    fetchAttackTables().then((tables) => setAttackTables(tables));
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('add-attack')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={12}>
            <TextField
              label={t('attack-name')}
              value={attackName}
              onChange={(e) => setAttackName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <SelectAttackTable
              label={t('attack-table')}
              value={attackTable}
              attackTables={attackTables}
              onChange={(attackTable) => setAttackTable(attackTable)}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label={t('attack-type')}
              value={attackType}
              onChange={(e) => setAttackType(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label={t('fumble-table')}
              value={fumbleTable}
              onChange={(e) => setFumbleTable(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={6}>
            <NumericInput label={t('attack-size')} value={attackSize} onChange={(v) => setAttackSize(v)} integer />
          </Grid>
          <Grid size={6}>
            <NumericInput label={t('bo')} value={bo} onChange={(v) => setBo(v)} integer />
          </Grid>
          <Grid size={6}>
            <NumericInput label={t('fumble')} value={fumble} onChange={(v) => setFumble(v)} integer />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={handleAdd} variant="contained">
          {t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAttackDialog;
