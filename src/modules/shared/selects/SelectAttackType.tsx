import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, TextField } from '@mui/material';

const SelectAttackTable: FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const { t } = useTranslation();

  const values = ['melee', 'ranged'];

  const getOptionLabel = (option: string) => {
    if (option === '') return '';
    return t(option);
  };

  return (
    <Autocomplete
      options={values}
      value={value === undefined || value === null ? '' : value}
      onChange={(_, newValue) => onChange(newValue ?? '')}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => <TextField {...params} label={label} variant="standard" fullWidth />}
    />
  );
};

export default SelectAttackTable;
