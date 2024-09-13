import React from "react";
import { useLocation } from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';

import NpcViewActions from './NpcViewActions';
import NpcViewAttributes from './NpcViewAttributes';
import NpcViewItems from './NpcViewItems';
import NpcViewSkills from './NpcViewSkills';

import lotrOrk from '../assets/lotr-ork.jpg';

const NpcView = () => {
    const location = useLocation();
    const npc = location.state?.npc;

    return (
        <div class="tactical-game-view">
            <NpcViewActions />
            <div class="npc-avatar">
                <Avatar sx={{ width: 56, height: 56 }} alt={npc.name} variant="square" src={lotrOrk}></Avatar>
            </div>

            <Grid container spacing={2}>
                <Grid size={4}>
                    <NpcViewAttributes />
                </Grid>
                <Grid size={4}>
                    <NpcViewSkills />
                </Grid>
                <Grid size={4}>
                    <NpcViewItems />
                </Grid>
            </Grid>

            <pre>
                {JSON.stringify(npc, null, 2)}
            </pre>
        </div >
    );
}

export default NpcView;
