import React from "react";
import { useNavigate } from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import lotrOrk from '../assets/lotr-ork.jpg';

const NpcListItem = ({ npc }) => {
    const navigate = useNavigate();

    const handleGameClick = () => {
        navigate(`view/${npc._id}`, { state: { npc: npc } });
    }

    const getDescription = (npc) => {
        return npc.realm + " - " + npc.race + " - " + npc.level;
    }

    return (
        <div>
            <ListItemButton onClick={handleGameClick}>
                <ListItemAvatar>
                    <Avatar src={lotrOrk}>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={npc.name} secondary={getDescription(npc)} />
            </ListItemButton>
        </div>
    );
}

export default NpcListItem;