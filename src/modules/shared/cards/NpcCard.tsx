import React, { FC } from 'react';
import { t } from 'i18next';
import CardListItem from './CardListItem';
import { Npc } from '../../api/npc.dto';

const NpcCard: FC<{
  npc: Npc;
  onClick?: () => void;
}> = ({ npc, onClick }) => {  
  if (!npc) return <p>Loading...</p>;

  return <CardListItem title={npc.name} subtitle={t(npc.category)} image="/static/images/generic/configuration.png" onClick={onClick} />;
};

export default NpcCard;
