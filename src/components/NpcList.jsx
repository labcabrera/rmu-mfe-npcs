import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import NpcListItem from "./NpcListItem";

const NpcList = () => {
    const navigate = useNavigate();
    const [npcs, setNpcs] = useState([]);

    const getNpcs = async () => {
        const response = await fetch("http://localhost:3002/v1/npc", {
            method: "GET",
        });
        const data = await response.json();
        setNpcs(data);
    };

    const createNewNpc = async () => {
        navigate("/npc/creation");
    }

    useEffect(() => {
        getNpcs();
    }, []);


    return (
        <div>
            <div class="tactical-game-list-actions">
                <Stack spacing={2} direction="row" sx={{
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                }}>
                    <Button variant="contained" onClick={createNewNpc}>New</Button>
                </Stack>
            </div>
            <div class="tactical-game-list">
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {npcs.map((item) => (
                        <NpcListItem key={item.id} npc={item} />
                    ))}
                </List>
            </div>
        </div>
    );
}

export default NpcList;