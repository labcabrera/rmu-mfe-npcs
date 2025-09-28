import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { ErrorProvider } from './ErrorContext';
import './i18n';
import NpcCreation from './modules/npcs/create/NpcCreation';
import NpcEdit from './modules/npcs/edit/NpcEdit';
import NpcList from './modules/npcs/list/NpcList';
import NpcView from './modules/npcs/view/NpcView';

const App = () => {
  return (
    <ErrorProvider>
      <Box sx={{ p: 5 }}>
        <Routes>
          <Route path="/" element={<NpcList />} />
          <Route path="/create" element={<NpcCreation />} />
          <Route path="/view/:npcId" element={<NpcView />} />
          <Route path="/edit/:npcId" element={<NpcEdit />} />
        </Routes>
      </Box>
    </ErrorProvider>
  );
};

export default App;
