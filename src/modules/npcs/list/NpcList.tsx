import React, { FC, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useError } from '../../../ErrorContext';
import { fetchRealms } from '../../api/realm';
import { Realm } from '../../api/realm.dto';
import RealmCard from '../../shared/cards/RealmCard';
import NpcListActions from './NpcListActions';

const NpcList: FC = () => {
  const { showError } = useError();
  const [realms, setRealms] = useState<Realm[]>([]);

  useEffect(() => {
    fetchRealms('', 0, 20)
      .then((response) => setRealms(response))
      .catch((err) => showError(err.message));
  }, [showError]);

  return (
    <>
      <NpcListActions setRealms={setRealms} />
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid size={12}>
          <Box mb={2} display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            {realms.map((realm) => (
              <RealmCard key={realm.id} realm={realm} />
            ))}
          </Box>
          {realms.length === 0 ? <p>No realms found.</p> : null}
        </Grid>
      </Grid>
    </>
  );
};

export default NpcList;
