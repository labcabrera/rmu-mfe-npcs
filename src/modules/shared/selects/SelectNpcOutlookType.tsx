import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, TextField } from '@mui/material';

const SelectNpcOutlookType: FC<{
  label: string;
  value: string;
  name: string;
  addAllOption?: boolean;
  required?: boolean;
  onChange: (value: string | null) => void;
}> = ({ label, value, name, onChange, addAllOption = false, required = false }) => {
  const { t } = useTranslation();

  const values = [
    'aggressive',
    'aloof',
    'altruistic',
    'belligerent',
    'berserk',
    'carefree',
    'considerate',
    'cruel',
    'crusading',
    'dominant',
    'friendly',
    'greedy',
    'helpful',
    'hidden-agenda',
    'hostile',
    'hungry',
    'hunting',
    'inconsiderate',
    'inquisitive',
    'jumpy',
    'normal',
    'obssesive',
    'open',
    'passive',
    'playful',
    'protective',
    'secretive',
    'timid',
  ];

  const options = addAllOption ? ['', ...values] : values;

  const getOptionLabel = (option: string) => {
    if (option === '') return '';
    return t(`outlook-type-${option}`);
  };

  const hasError = required && (value === undefined || value === null || value === '');

  return (
    <Autocomplete
      options={options}
      value={value === undefined || value === null ? '' : value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          name={name}
          variant="standard"
          fullWidth
          error={hasError}
          helperText={hasError ? t('category-is-required') : ''}
        />
      )}
    />
  );
};

export default SelectNpcOutlookType;
