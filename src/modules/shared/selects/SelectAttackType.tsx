import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, TextField } from '@mui/material';

const values = ['melee', 'ranged'];

const SelectAttackTable: FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const { t } = useTranslation();
  return (
    <Autocomplete
      options={values}
      value={value === undefined || value === null ? '' : value}
      onChange={(_, newValue) => onChange(newValue ?? '')}
      getOptionLabel={(e) => t(e)}
      renderInput={(params) => <TextField {...params} label={label} error={!value} fullWidth />}
    />
  );
};

export default SelectAttackTable;
