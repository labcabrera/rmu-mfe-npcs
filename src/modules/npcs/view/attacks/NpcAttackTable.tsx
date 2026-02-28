import React, { FC } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Paper } from '@mui/material';
import { t } from 'i18next';
import { Npc } from '../../../api/npc.dto';
import DeleteButton from '../../../shared/buttons/DeleteButton';

const NpcAttackTable: FC<{
  npc: Npc;
  onDeleteAttack: (attackName: string) => void;
}> = ({ npc, onDeleteAttack }) => {
  return (
    <Box sx={{ mt: 2 }}>
      {npc.attacks && npc.attacks.length > 0 ? (
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
                <TableCell sx={{ width: '30%' }} align="left">
                  {t('attack-name')}
                </TableCell>
                <TableCell sx={{ width: '20%' }} align="left">
                  {t('attack-table')}
                </TableCell>
                <TableCell sx={{ width: '10%' }} align="right">
                  {t('size')}
                </TableCell>
                <TableCell sx={{ width: '10%' }} align="right">
                  {t('bo')}
                </TableCell>
                <TableCell sx={{ width: '10%' }} align="right">
                  {t('fumble')}
                </TableCell>
                <TableCell sx={{ width: '20%' }} align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {npc.attacks.map((attack, index) => (
                <TableRow key={index}>
                  <TableCell>{attack.attackName}</TableCell>
                  <TableCell>{attack.attackTable}</TableCell>
                  <TableCell align="right">{attack.attakSize}</TableCell>
                  <TableCell align="right">{attack.bo}</TableCell>
                  <TableCell align="right">{attack.fumble}</TableCell>
                  <TableCell align="center">
                    <DeleteButton onClick={() => onDeleteAttack && onDeleteAttack(attack.attackName)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No attacks defined.</p>
      )}
    </Box>
  );
};

export default NpcAttackTable;
