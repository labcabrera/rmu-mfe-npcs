import React from "react";
import { useLocation } from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import iconNeuron from '../assets/icon-neuron.jpg';
import iconShield from '../assets/icon-shield.jpg';
import iconSword from '../assets/icon-sword.jpg';
import iconArmor from '../assets/icon-armor.jpg';

const NpcViewItems = () => {
    const location = useLocation();
    const npc = location.state?.npc;

    const resolveIcon = (item) => {
        switch (item.type) {
            case "weapon": return iconSword;
            case "shield": return iconShield;
            case "armor": return iconArmor;
            default: return iconNeuron;
        }
    }

    return (
        <div>
            <h3>Items</h3>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {npc.items.map((item) => (
                    <ListItemButton alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar src={resolveIcon(item)}>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={item.name}
                            secondary={item.type}
                        />
                    </ListItemButton>
                ))}
            </List>
        </div >
    );
}

export default NpcViewItems;
