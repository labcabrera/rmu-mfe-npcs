import React, { ChangeEvent, FC } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { t } from 'i18next';
import { Realm } from '../../api/realm.dto';

const SelectRealm: FC<{
  label: string;
  value: string;
  realms: Realm[];
  required?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (realm: Realm | null) => void;
}> = ({ label, value, realms, required, onChange }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    const selectedRealm = realms.find((realm) => realm.id === selectedValue) || null;
    onChange(selectedRealm);
  };

  if (!realms) return <p>Loading...</p>;

  return (
    <TextField
      select
      label={label}
      value={value === undefined || value === null || realms.length === 0 ? '' : value}
      fullWidth
      variant="standard"
      onChange={handleChange}
      error={required && (value === undefined || value === null || value === '')}
      helperText={required && (value === undefined || value === null || value === '') ? t('realm-is-required') : ''}
    >
      {realms.map((option, index) => (
        <MenuItem key={index} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectRealm;
