import React from "react";
import { useLocation } from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import iconNeuron from '../assets/icon-neuron.jpg';
import iconSwork from '../assets/icon-sword.jpg';

const NpcViewSkills = () => {
    const location = useLocation();
    const npc = location.state?.npc;

    const resolveIcon = (item) => {
        if (item.skill.includes("weapon")) {
            return iconSwork;
        }
        return iconNeuron;
    }

    return (
        <div>
            <h3>Skills</h3>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {npc.skills.map((item) => (
                    <ListItemButton alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar src={resolveIcon(item)}>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={item.skill}
                            secondary={item.bonus}
                        />
                    </ListItemButton>
                ))}
            </List>
        </div >
    );
}

export default NpcViewSkills;
