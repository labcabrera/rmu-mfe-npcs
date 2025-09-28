import React, { FC } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { t } from 'i18next';
import { Skill } from '../../api/skill.dto';

const SelectSkill: FC<{
  label: string;
  value: string;
  name: string;
  skills: Skill[];
  // eslint-disable-next-line no-unused-vars
  onChange: (skill: Skill | null) => void;
}> = ({ label, value, name, skills, onChange }) => {
  if (!skills) return <p>Loading...</p>;

  const selectedSkill = skills.find((skill) => skill.id === value) || null;

  return (
    <Autocomplete
      options={skills}
      value={selectedSkill}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(option) => t(option.id)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => <TextField {...params} label={label} name={name} variant="standard" fullWidth />}
    />
  );
};

export default SelectSkill;
