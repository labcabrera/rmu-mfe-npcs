/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
import {
  AddButton,
  LayoutBase,
  Page,
  RefreshButton,
  RmuPagination,
  RmuTextCard,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../ErrorContext';
import { fetchNpcs } from '../../api/npc';
import { Npc } from '../../api/npc.dto';
import { gridSizeCard } from '../../services/display';

export default function NpcList() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showError } = useError();
  const [pageData, setPageData] = useState<Page<Npc>>();
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(24);

  const onCardClick = (npc: Npc) => {
    navigate(`/npcs/view/${npc.id}`, { state: { npc } });
  };

  const bindNpcs = () => {
    fetchNpcs('', page, pageSize, auth)
      .then((response) => setPageData(response))
      .catch((err) => showError(err.message));
  };

  useEffect(() => {
    fetchNpcs('', 0, 20, auth)
      .then((response) => setPageData(response))
      .catch((err) => showError(err.message));
  }, []);

  return (
    <LayoutBase
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs') }]}
      actions={[<RefreshButton onClick={() => bindNpcs()} />, <AddButton onClick={() => navigate('/npcs/create')} />]}
    >
      {!pageData ? (
        <CircularProgress />
      ) : (
        <>
          <Grid container spacing={1}>
            {pageData.content.map((npc, index) => (
              <Grid size={gridSizeCard} key={index}>
                <RmuTextCard
                  value={npc.name}
                  subtitle={t(npc.category)}
                  image={npc.imageUrl || ''}
                  onClick={() => onCardClick(npc)}
                />
              </Grid>
            ))}
          </Grid>
          {pageData?.content.length === 0 ? <p>No npcs found.</p> : null}
          <RmuPagination
            page={page}
            pageSize={pageSize}
            totalPages={pageData.pagination.totalPages}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </>
      )}
    </LayoutBase>
  );
}
