/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Autocomplete, TextField } from '@mui/material';
import { fetchEnumerations } from '@labcabrera-rmu/rmu-react-shared-lib';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';

const SelectNpcOutlookType: FC<{
  label: string;
  value: string;
  name: string;
  addAllOption?: boolean;
  required?: boolean;
  onChange: (value: string | null) => void;
}> = ({ label, value, name, onChange, required = false }) => {
  const auth = useAuth();
  const { showError } = useError();
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchEnumerations('category==outlook-type', 0, 100, auth)
      .then((response) => setOptions(response.content.map((e) => e.key)))
      .catch((err) => showError(err.message));
  }, []);

  const hasError = required && (value === undefined || value === null || value === '');

  return (
    <Autocomplete
      options={options}
      value={value === undefined || value === null ? '' : value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(e) => t(e)}
      renderInput={(params) => <TextField {...params} label={label} name={name} fullWidth error={hasError} />}
    />
  );
};

export default SelectNpcOutlookType;
