import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MfeRoot, NotFound } from '@labcabrera-rmu/rmu-react-shared-lib';
import NpcFormPage from './modules/npcs/form/NpcFormPage';
import NpcListPage from './modules/npcs/list/NpcListPage';
import NpcViewPage from './modules/npcs/view/NpcViewPage';

const App = () => (
  <MfeRoot>
    <Routes>
      <Route path="/" element={<NpcListPage />} />
      <Route path="/create" element={<NpcFormPage mode="create" />} />
      <Route path="/view/:npcId" element={<NpcViewPage />} />
      <Route path="/edit/:npcId" element={<NpcFormPage mode="edit" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </MfeRoot>
);

export default App;
