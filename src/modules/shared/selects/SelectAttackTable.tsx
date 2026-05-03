import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { Autocomplete, TextField } from '@mui/material';
import { fetchAttackTables } from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';

const SelectAttackTable: FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const auth = useAuth();
  const { t } = useTranslation();
  const { showError } = useError();
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    fetchAttackTables(auth)
      .then((tables) => setTables(tables))
      .catch((err) => showError(err.message));
  }, []);

  return (
    <Autocomplete
      options={tables}
      value={value === undefined || value === null ? '' : value}
      onChange={(_, newValue) => onChange(newValue ?? '')}
      getOptionLabel={(e) => t(e)}
      renderInput={(params) => <TextField {...params} label={label} fullWidth error={!value} />}
    />
  );
};

export default SelectAttackTable;
