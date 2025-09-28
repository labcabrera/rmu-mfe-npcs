import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { ErrorProvider } from './ErrorContext';
import HomePage from './HomePage';
import './i18n';
import NpcCreation from './modules/npcs/create/NpcCreation';
import NpcEdit from './modules/npcs/edit/NpcEdit';
import RealmList from './modules/npcs/list/RealmList';
import RealmView from './modules/npcs/view/RealmView';

const App = () => {
  return (
    <ErrorProvider>
      <Box sx={{ p: 5 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/npcs" element={<RealmList />} />
          <Route path="/npcs/create" element={<NpcCreation />} />
          <Route path="/npcs/view/:npcId" element={<RealmView />} />
          <Route path="/npcs/edit/:npcId" element={<NpcEdit />} />
        </Routes>
      </Box>
    </ErrorProvider>
  );
};

export default App;
