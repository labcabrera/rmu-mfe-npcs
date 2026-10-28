import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField } from '@mui/material';
import {
  AddNpcAttack,
  AttackTablePicker,
  EnumPicker,
  FumbleTablePicker,
  NumericInput,
} from '@labcabrera-rmu/rmu-react-shared-lib';

/** Kinds of NPC attack, stored in `attackType` and shown as t(<kind>). */
const ATTACK_TYPES = ['melee', 'ranged'];

const AddAttackDialog: FC<{
  open: boolean;
  onClose: () => void;
  onAttackAdded: (attack: AddNpcAttack) => void;
}> = ({ open, onClose, onAttackAdded }) => {
  const { t } = useTranslation();
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
      <DialogTitle>{t('add-attack')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label={t('attack-name')}
              value={attackName}
              onChange={(e) => setAttackName(e.target.value)}
              fullWidth
              error={!attackName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <EnumPicker
              label={t('attack-type')}
              name="attackType"
              values={ATTACK_TYPES}
              value={attackType || null}
              required
              onChange={(value) => setAttackType(value ?? '')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <AttackTablePicker
              variant="select"
              name="attack-table"
              value={attackTable || null}
              required
              onChange={(table) => setAttackTable(table ?? '')}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FumbleTablePicker
              variant="select"
              name="fumble-table"
              value={fumbleTable || null}
              required
              onChange={(table) => setFumbleTable(table ?? '')}
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
          {t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAttackDialog;
