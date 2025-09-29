import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { CreateNpcDto, EMPTY_NPC_SKILL, NpcSkill, UpdateNpcDto } from '../../api/npc.dto';
import { fetchSkills } from '../../api/skill';
import { Skill } from '../../api/skill.dto';
import AddButton from '../../shared/buttons/AddButton';
import CancelButton from '../../shared/buttons/CancelButton';
import DeleteButton from '../../shared/buttons/DeleteButton';
import EditButton from '../../shared/buttons/EditButton';
import SaveButton from '../../shared/buttons/SaveButton';
import { NumericInput } from '../../shared/inputs/NumericInput';
import SelectSkill from '../../shared/selects/SelectSkill';

const NpcSkills: FC<{
  formData: CreateNpcDto | UpdateNpcDto;
  setFormData: Dispatch<SetStateAction<CreateNpcDto | UpdateNpcDto>>;
}> = ({ formData, setFormData }) => {
  const { showError } = useError();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<NpcSkill>(EMPTY_NPC_SKILL);
  const [skills, setSkills] = useState<Skill[]>(null);

  const handleAddSkill = () => {
    if (currentSkill.skillId && currentSkill.bonus !== undefined) {
      const updatedSkills = [...formData.skills, currentSkill];
      setFormData({ ...formData, skills: updatedSkills });
      setCurrentSkill(EMPTY_NPC_SKILL);
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
      setCurrentSkill(EMPTY_NPC_SKILL);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setIsAdding(false);
    setCurrentSkill(EMPTY_NPC_SKILL);
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  useEffect(() => {
    fetchSkills()
      .then((data) => setSkills(data))
      .catch((err) => showError(err.message));
  }, [showError]);

  if (!skills) return <p>Loading skills...</p>;

  return (
    <Box sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" color="primary" display="inline">
          {t('skills')}
        </Typography>
        {!isAdding && editingIndex === null && <AddButton onClick={() => setIsAdding(true)} />}
      </Box>

      {formData.skills.length > 0 || (isAdding && editingIndex === null) ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead
              sx={{
                '& .MuiTableCell-root': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
              }}
            >
              <TableRow>
                <TableCell sx={{ width: '40%' }} align="left">
                  {t('skill')}
                </TableCell>
                <TableCell sx={{ width: '20%' }} align="right">
                  {t('ranks')}
                </TableCell>
                <TableCell sx={{ width: '20%' }} align="right">
                  {t('bonus')}
                </TableCell>
                <TableCell sx={{ width: '20%' }} align="center"></TableCell>
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
                        value={currentSkill.ranks}
                        onChange={(value) => setCurrentSkill({ ...currentSkill, ranks: value })}
                      />
                    ) : (
                      skill.ranks
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
                        <SaveButton onClick={handleSaveEdit} />
                        <CancelButton onClick={handleCancelEdit} />
                      </Box>
                    ) : (
                      <Box>
                        <EditButton onClick={() => handleEditSkill(index)} />
                        <DeleteButton onClick={() => handleDeleteSkill(index)} />
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
                      value={currentSkill.ranks}
                      onChange={(value) => setCurrentSkill({ ...currentSkill, ranks: value })}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <NumericInput
                      value={currentSkill.bonus}
                      onChange={(value) => setCurrentSkill({ ...currentSkill, bonus: value })}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <SaveButton onClick={handleAddSkill} />
                    <CancelButton onClick={handleCancelEdit} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No skills added.</p>
      )}
    </Box>
  );
};

export default NpcSkills;
