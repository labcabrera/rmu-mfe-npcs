import React from "react";
import { useLocation, useParams } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import NpcViewActions from './NpcViewActions';

const NpcView = () => {
    const { gameId } = useParams();
    const location = useLocation();
    const game = location.state?.game;

    return (
        <div class="tactical-game-view">
            <NpcViewActions />
            <Box
                component="form"
                _sx={{ flexGrow: 1 }}
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            >
                <div>
                    <TextField
                        label="Name"
                        name="name"
                        value={game.name}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }} />
                </div>
                <div>
                    <TextField
                        label="Description"
                        name="description"
                        value={game.description}
                    ></TextField>
                </div>
                <div>
                    <TextField
                        label="Realm"
                        name="realm"
                        value={game.realm}
                    ></TextField>
                </div>
                <div>
                    <TextField
                        label="Level"
                        name="level"
                        value={game.level}
                    ></TextField>
                </div>
                <div>
                    <TextField
                        label="Hit points"
                        name="hp"
                        value={game.hp}
                    ></TextField>
                </div>
            </Box >
            <pre>
                {JSON.stringify(game, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(location.state, null, 2)}
            </pre>
        </div >
    );
}

export default NpcView;
