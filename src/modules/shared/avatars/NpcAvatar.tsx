import React, { FC, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useError } from '../../../ErrorContext';
import { updateNpc } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import { getGenericImages } from '../../services/image-service';
import ImageSelectorDialog from '../images/ImageSelectorDialog';

const NpcAvatar: FC<{
  npc: Npc;
  size?: number;
  enableImageChange?: boolean;
  onNpcUpdated?: (npc: Npc) => void;
}> = ({ npc, size = 300, enableImageChange = true, onNpcUpdated }) => {
  const { showError } = useError();
  const [dialogOpen, setDialogOpen] = useState(false);

  const onUpdateImage = (imageUrl: string) => {
    const update = {
      imageUrl: imageUrl,
    };
    updateNpc(npc.id, update)
      .then((data) => {
        if (onNpcUpdated) {
          onNpcUpdated(data);
        }
        setDialogOpen(false);
      })
      .catch((err) => showError(err.message));
  };

  if (!npc) return <p>Loading NPC...</p>;

  return (
    <>
      <Avatar
        src={npc.imageUrl || '/static/images/npcs/unknown.png '}
        onClick={() => enableImageChange && setDialogOpen(true)}
        sx={{
          width: size,
          height: size,
          cursor: enableImageChange ? 'pointer' : 'default',
        }}
      />
      <ImageSelectorDialog
        open={dialogOpen}
        images={getGenericImages()}
        onClose={() => setDialogOpen(false)}
        onSelect={(image) => onUpdateImage(image)}
      />
    </>
  );
};

export default NpcAvatar;
