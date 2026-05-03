import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ErrorProvider } from './ErrorContext';
import NpcCreation from './modules/npcs/create/NpcCreation';
import NpcEdit from './modules/npcs/edit/NpcEdit';
import NpcList from './modules/npcs/list/NpcList';
import NpcView from './modules/npcs/view/NpcView';

const NotFound: FC = () => (
  <div>
    <h2>Not found</h2>
    <p>The requested route does not exist.</p>
  </div>
);

const App = () => {
  return (
    <ThemeProvider theme={useTheme()}>
      <ErrorProvider>
        <Box>
          <Routes>
            <Route path="/" element={<NpcList />} />
            <Route path="/create" element={<NpcCreation />} />
            <Route path="/view/:npcId" element={<NpcView />} />
            <Route path="/edit/:npcId" element={<NpcEdit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </ErrorProvider>
    </ThemeProvider>
  );
};

export default App;
