import React, { FC, useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { fetchAttackTables } from '../../api/attack-tables';

const SelectAttackTable: FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const { showError } = useError();
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    fetchAttackTables()
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
