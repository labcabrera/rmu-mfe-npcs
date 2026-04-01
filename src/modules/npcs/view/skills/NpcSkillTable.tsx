import React, { FC } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DeleteButton } from '@labcabrera-rmu/rmu-react-shared-lib';
import { t } from 'i18next';
import { Npc } from '../../../api/npc.dto';

const NpcSkillTable: FC<{
  npc: Npc;
  onDeleteSkill?: (skillId: string) => void;
}> = ({ npc, onDeleteSkill }) => {
  return (
    <TableContainer component={Paper}>
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
