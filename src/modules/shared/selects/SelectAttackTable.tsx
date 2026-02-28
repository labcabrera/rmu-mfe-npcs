import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, TextField } from '@mui/material';

const SelectAttackTable: FC<{
  label: string;
  value: string;
  attackTables: string[];
  onChange: (value: string) => void;
}> = ({ label, value, attackTables, onChange }) => {
  const { t } = useTranslation();

  const getOptionLabel = (option: string) => {
    if (option === '') return '';
    return t(option);
  };

  return (
    <Autocomplete
      options={attackTables}
      value={value === undefined || value === null ? '' : value}
      onChange={(_, newValue) => onChange(newValue ?? '')}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          // name={name}
          variant="standard"
          fullWidth
          // error={hasError}
          // helperText={hasError ? t('attack-table-is-required') : ''}
        />
      )}
    />
  );
};

export default SelectAttackTable;
