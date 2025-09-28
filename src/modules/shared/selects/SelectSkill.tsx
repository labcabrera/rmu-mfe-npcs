import React, { FC } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { t } from 'i18next';
import { Skill } from '../../api/skill.dto';

const SelectSkill: FC<{
  label: string;
  value: string;
  name: string;
  skills: Skill[];
  // eslint-disable-next-line no-unused-vars
  onChange: (skills: Skill) => void;
}> = ({ label, value, name, skills, onChange }) => {
  if (!skills) return <p>Loading...</p>;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSkill = skills.find((skill) => skill.id === event.target.value);
    onChange(selectedSkill);
  };

  return (
    <TextField
      select
      label={label}
      name={name}
      value={value === undefined || value === null ? '' : value}
      fullWidth
      variant="standard"
      onChange={handleChange}
    >
      {skills.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {t(option.id)} {option.id}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectSkill;
