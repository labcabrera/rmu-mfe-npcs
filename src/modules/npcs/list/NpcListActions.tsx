import React, { Dispatch, FC, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { RmuBreadcrumbs } from '@labcabrera-rmu/rmu-react-shared-lib';
import { t } from 'i18next';
import { useError } from '../../../ErrorContext';
import { fetchNpcs } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import AddButton from '../../shared/buttons/AddButton';
import RefreshButton from '../../shared/buttons/RefreshButton';

const NpcListActions: FC<{ setNpcs: Dispatch<SetStateAction<Npc[]>> }> = ({ setNpcs }) => {
  const navigate = useNavigate();
  const { showError } = useError();
  const breadcrumbs = [{ name: t('Npcs') }];

  const onAddNpcClick = () => {
    navigate('/npcs/create');
  };

  const onRefreshButtonClick = () => {
    fetchNpcs('', 0, 200)
      .then((response) => setNpcs(response))
      .catch((err) => showError(err.message));
  };

  return (
    <RmuBreadcrumbs items={breadcrumbs}>
      <RefreshButton onClick={() => onRefreshButtonClick()} />
      <AddButton onClick={() => onAddNpcClick()} />
    </RmuBreadcrumbs>
  );
};

export default NpcListActions;
