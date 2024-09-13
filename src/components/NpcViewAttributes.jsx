import React from "react";
import { useLocation, useParams } from "react-router-dom";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const NpcViewAttributes = () => {
    const { gameId } = useParams();
    const location = useLocation();
    const npc = location.state?.npc;

    return (
        <Box
            component="form"
            _sx={{ flexGrow: 1 }}
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        >
            <div>
                <TextField
                    label="Name"
                    name="name"
                    value={npc.name}
                    slotProps={{
                        input: {
                            readOnly: true,
                        },
                    }} />
            </div>
            <div>
                <TextField
                    label="Realm"
                    name="realm"
                    value={npc.realm} />
            </div>
            <div>
                <TextField
                    label="Race"
                    name="race"
                    value={npc.race} />
            </div>
            <div>
                <TextField
                    label="Level"
                    name="level"
                    value={npc.level} />
            </div>
            <div>
                <TextField
                    label="Armor Type"
                    name="armorType"
                    value={npc.armorType} />
            </div>
            <div>
                <TextField
                    label="Hit points"
                    name="hp"
                    value={npc.hp}
                ></TextField>
            </div>
            <div>
                <TextField
                    label="Description"
                    name="description"
                    value={npc.description} />
            </div>
        </Box >
    );
}

export default NpcViewAttributes;
