import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Paper } from '@mui/material';
import { DeleteButton, Npc } from '@labcabrera-rmu/rmu-react-shared-lib';

const NpcAttackTable: FC<{
  npc: Npc;
  onDeleteAttack: (attackName: string) => void;
}> = ({ npc, onDeleteAttack }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mt: 2 }}>
      {npc.attacks && npc.attacks.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '20%' }} align="left">
                  {t('attack-name')}
                </TableCell>
                <TableCell sx={{ width: '10%' }} align="left">
                  {t('attack-type')}
                </TableCell>
                <TableCell sx={{ width: '15%' }} align="left">
                  {t('attack-table')}
                </TableCell>
                <TableCell sx={{ width: '15%' }} align="left">
                  {t('fumble-table')}
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
                <TableCell sx={{ width: '10%' }} align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {npc.attacks.map((attack, index) => (
                <TableRow key={index}>
                  <TableCell>{attack.attackName}</TableCell>
                  <TableCell>{t(attack.attackType)}</TableCell>
                  <TableCell>{t(attack.attackTable)}</TableCell>
                  <TableCell>{t(attack.fumbleTable)}</TableCell>
                  <TableCell align="right">{attack.attackSize}</TableCell>
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
