import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Add, Delete, Edit, Save, Cancel } from '@mui/icons-material';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { CreateNpcDto, NpcSkill } from '../../api/npc.dto';
import { fetchSkills } from '../../api/skill';
import { Skill } from '../../api/skill.dto';
import AddButton from '../../shared/buttons/AddButton';
import { NumericInput } from '../../shared/inputs/NumericInput';
import SelectSkill from '../../shared/selects/SelectSkill';

const NpcCreationSkills: FC<{
  formData: CreateNpcDto;
  setFormData: Dispatch<SetStateAction<CreateNpcDto>>;
}> = ({ formData, setFormData }) => {
  const { showError } = useError();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<NpcSkill>({ skillId: '', bonus: 0 });
  const [skills, setSkills] = useState<Skill[]>(null);

  const handleAddSkill = () => {
    if (currentSkill.skillId && currentSkill.bonus !== undefined) {
      const updatedSkills = [...formData.skills, currentSkill];
      setFormData({ ...formData, skills: updatedSkills });
      setCurrentSkill({ skillId: '', bonus: 0 });
      setIsAdding(false);
    }
  };

  const handleEditSkill = (index: number) => {
    setCurrentSkill(formData.skills[index]);
    setEditingIndex(index);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && currentSkill.skillId && currentSkill.bonus !== undefined) {
      const updatedSkills = [...formData.skills];
      updatedSkills[editingIndex] = currentSkill;
      setFormData({ ...formData, skills: updatedSkills });
      setEditingIndex(null);
      setCurrentSkill({ skillId: '', bonus: 0 });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setCurrentSkill({ skillId: '', bonus: 0 });
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  useEffect(() => {
    fetchSkills()
      .then((data) => setSkills(data))
      .catch((err) => showError(err.message));
  }, []);

  if (!skills) return <p>Loading skills...</p>;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
        {t('skills')}
      </Typography>

      <TableContainer sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('skill')}</TableCell>
              <TableCell align="right">{t('bonus')}</TableCell>
              <TableCell align="center">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.skills.map((skill, index) => (
              <TableRow key={index}>
                <TableCell>
                  {editingIndex === index ? (
                    <SelectSkill
                      label={t('skill')}
                      name="skillId"
                      value={currentSkill.skillId}
                      skills={skills}
                      onChange={(skill) => setCurrentSkill({ ...currentSkill, skillId: skill.id })}
                    />
                  ) : (
                    t(skill.skillId)
                  )}
                </TableCell>
                <TableCell align="right">
                  {editingIndex === index ? (
                    <NumericInput
                      value={currentSkill.bonus}
                      onChange={(value) => setCurrentSkill({ ...currentSkill, bonus: value })}
                    />
                  ) : (
                    skill.bonus
                  )}
                </TableCell>
                <TableCell align="center">
                  {editingIndex === index ? (
                    <Box>
                      <IconButton onClick={handleSaveEdit} color="primary">
                        <Save />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit}>
                        <Cancel />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box>
                      <IconButton onClick={() => handleEditSkill(index)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteSkill(index)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {isAdding && (
              <TableRow>
                <TableCell>
                  <SelectSkill
                    label={t('skill')}
                    value={currentSkill.skillId}
                    name="skillId"
                    skills={skills}
                    onChange={(skill) => setCurrentSkill({ ...currentSkill, skillId: skill.id })}
                  />
                </TableCell>
                <TableCell align="right">
                  <NumericInput
                    value={currentSkill.bonus}
                    onChange={(value) => setCurrentSkill({ ...currentSkill, bonus: value })}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={handleAddSkill} color="primary">
                    <Save />
                  </IconButton>
                  <IconButton onClick={handleCancelEdit}>
                    <Cancel />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!isAdding && editingIndex === null && <AddButton onClick={() => setIsAdding(true)} />}
    </Box>
  );
};

export default NpcCreationSkills;
