import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MfeRoot, NotFound } from '@labcabrera-rmu/rmu-react-shared-lib';

// Workspace spec 091, E1: every page is its own chunk; the Suspense is in MfeRoot / the shell layout.
const EncounterPage = lazy(() => import('./modules/encounters/EncounterPage'));
const NpcFormPage = lazy(() => import('./modules/npcs/form/NpcFormPage'));
const NpcListPage = lazy(() => import('./modules/npcs/list/NpcListPage'));
const NpcViewPage = lazy(() => import('./modules/npcs/view/NpcViewPage'));

const App = () => (
  <MfeRoot namespace="npcs">
    <Routes>
      <Route path="/" element={<NpcListPage />} />
      <Route path="/encounters" element={<EncounterPage />} />
      <Route path="/create" element={<NpcFormPage mode="create" />} />
      <Route path="/view/:npcId" element={<NpcViewPage />} />
      <Route path="/edit/:npcId" element={<NpcFormPage mode="edit" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </MfeRoot>
);

export default App;
