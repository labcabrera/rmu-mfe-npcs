import React, { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import { Npc } from '../../api/npc.dto';

const NpcAvatar: FC<{
  npc: Npc;
  size?: number;
}> = ({ npc, size = 300 }) => {
  if (!npc) return <p>Loading NPC...</p>;

  return (
    <Avatar
      src={npc.imageUrl || '/static/images/races/unknown.png '}
      sx={{
        width: size,
        height: size,
      }}
    />
  );
};

export default NpcAvatar;
