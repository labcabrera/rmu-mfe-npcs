import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';

import NpcListItem from "./NpcListItem";

import { API_NPC_URL } from "../constants/environment";

const NpcList = () => {

    const navigate = useNavigate();
    const [npcs, setNpcs] = useState([]);

    const getNpcs = async () => {
        const url = `${API_NPC_URL}/npc`;
        const response = await fetch(url, { method: "GET" });
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
                    <Button variant="outlined" onClick={createNewNpc}>New</Button>
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