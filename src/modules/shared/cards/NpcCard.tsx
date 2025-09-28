import React, { FC } from 'react';
import { t } from 'i18next';
import { Npc } from '../../api/npc.dto';
import CardListItem from './CardListItem';

const NpcCard: FC<{
  npc: Npc;
  onClick?: () => void;
}> = ({ npc, onClick }) => {
  if (!npc) return <p>Loading...</p>;

  return (
    <CardListItem
      title={npc.name}
      subtitle={t(npc.category)}
      image="/static/images/npcs/unknown.png"
      onClick={onClick}
    />
  );
};

export default NpcCard;
