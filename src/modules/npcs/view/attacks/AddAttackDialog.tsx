import React, { FC, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import { t } from 'i18next';
import { NpcAttack } from '../../../api/npc.dto';
import { NumericInput } from '../../../shared/inputs/NumericInput';

const AddAttackDialog: FC<{
  open: boolean;
  onClose: () => void;
  onAttackAdded: (attack: NpcAttack) => void;
}> = ({ open, onClose, onAttackAdded }) => {
  const [attackName, setAttackName] = useState<string>('');
  const [attackTable, setAttackTable] = useState<string>('');
  const [attackType, setAttackType] = useState<string>('');
  const [fumbleTable, setFumbleTable] = useState<string>('');
  const [attakSize, setAttakSize] = useState<number | null>(0);
  const [bo, setBo] = useState<number | null>(0);
  const [fumble, setFumble] = useState<number | null>(0);

  const handleAdd = () => {
    const attack: NpcAttack = {
      attackName: attackName,
      attackTable: attackTable,
      attackType: attackType,
      fumbleTable: fumbleTable,
      attakSize: attakSize ?? 0,
      bo: bo ?? 0,
      fumble: fumble ?? 0,
    };
    onAttackAdded(attack);
    // reset
    setAttackName('');
    setAttackTable('');
    setAttackType('');
    setFumbleTable('');
    setAttakSize(0);
    setBo(0);
    setFumble(0);
    onClose();
  };

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
            <TextField
              label={t('attack-table')}
              value={attackTable}
              onChange={(e) => setAttackTable(e.target.value)}
              fullWidth
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
            <NumericInput label={t('attack-size')} value={attakSize} onChange={(v) => setAttakSize(v)} integer />
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
