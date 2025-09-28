import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { ErrorProvider } from './ErrorContext';
import './i18n';
import NpcCreation from './modules/npcs/create/NpcCreation';
import NpcEdit from './modules/npcs/edit/NpcEdit';
import NpcView from './modules/npcs/view/NpcView';
import NpcList from './modules/npcs/list/NpcList';

const App = () => {
  return (
    <ErrorProvider>
      <Box sx={{ p: 5 }}>
        <Routes>
          <Route path="/" element={<NpcList />} />
          <Route path="/npcs" element={<NpcList />} />
          <Route path="/npcs/create" element={<NpcCreation />} />
          <Route path="/npcs/view/:npcId" element={<NpcView />} />
          <Route path="/npcs/edit/:npcId" element={<NpcEdit />} />
        </Routes>
      </Box>
    </ErrorProvider>
  );
};

export default App;
