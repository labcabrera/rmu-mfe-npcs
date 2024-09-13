import React from "react";
import { Route, Routes } from "react-router-dom";
import NpcList from "./components/NpcList";
import NpcView from "./components/NpcView";
import NpcCreation from "./components/NpcCreation";
import "./index.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NpcList />} />
      <Route path="/view/:npcId" element={<NpcView />} />
      <Route path="/creation" element={<NpcCreation />} />
    </Routes>
  );
};

export default App;
