import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DeleteButton, Npc } from '@labcabrera-rmu/rmu-react-shared-lib';

const NpcSkillTable: FC<{
  npc: Npc;
  onDeleteSkill?: (skillId: string) => void;
}> = ({ npc, onDeleteSkill }) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '70%' }} align="left">
              {t('skill')}
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="right">
              {t('ranks')}
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="right">
              {t('bonus')}
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {npc.skills.map((skill, index) => (
            <TableRow key={index}>
              <TableCell>{t(skill.skillId)}</TableCell>
              <TableCell align="right">{skill.ranks}</TableCell>
              <TableCell align="right">{skill.bonus}</TableCell>
              <TableCell align="center">
                <DeleteButton onClick={() => onDeleteSkill && onDeleteSkill(skill.skillId)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NpcSkillTable;
