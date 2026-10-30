import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, Chip, Stack, Typography } from '@mui/material';
import { KeyValuePanel, KeyValueRow, Npc, Panel, Realm, StatBonusGrid } from '@labcabrera-rmu/rmu-react-shared-lib';
import { npcTypeLabel } from '../npc-format';

const DETAIL_KEYS = ['variants', 'height', 'armorDescription', 'treasure', 'magicRealm', 'misc'] as const;

/** Profile of an NPC: classification, stat bonuses, details of the book and the description. */
export const NpcViewProfile: FC<{ npc: Npc; realm: Realm | undefined }> = ({ npc, realm }) => {
  const { t } = useTranslation();
  const rows: KeyValueRow[] = [
    { label: t('realm'), value: realm ? t(realm.name) : t('loading') },
    { label: t('category'), value: t(`npc-category-${npc.category}`) },
    ...(npc.type ? [{ label: t('type'), value: npcTypeLabel(npc.type, t) }] : []),
    ...(npc.group ? [{ label: t('group'), value: npc.group }] : []),
    { label: t('access-type'), value: t(npc.accessType) },
    ...(npc.source
      ? [
          {
            label: t('npc-source'),
            value: npc.source.page
              ? t('npc-source-page', { book: t(npc.source.book), page: npc.source.page })
              : t(npc.source.book),
          },
        ]
      : []),
  ];
  const details: KeyValueRow[] = DETAIL_KEYS.filter((key) => npc.details?.[key]).map((key) => ({
    label: t(`npc-detail-${key}`),
    value: npc.details![key],
  }));
  return (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}
    >
      <KeyValuePanel title={t('npc-info')} rows={rows} />
      <Panel title={t('stats')}>
        {npc.stats ? (
          <StatBonusGrid stats={npc.stats} dense />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('npc-no-stats')}
          </Typography>
        )}
      </Panel>
      {details.length > 0 && <KeyValuePanel title={t('details')} rows={details} />}
      {npc.description && (
        <Panel title={t('description')}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {npc.description}
          </Typography>
        </Panel>
      )}
    </Box>
  );
};

/** Talents and flaws of an NPC, informational only: no rule applies them yet. */
export const NpcViewTalents: FC<{ npc: Npc }> = ({ npc }) => {
  const { t } = useTranslation();
  return (
    <Panel title={t('talents')}>
      <Alert severity="info" sx={{ mb: 1 }}>
        {t('npc-talents-not-applied')}
      </Alert>
      {npc.talents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('npc-no-talents')}
        </Typography>
      ) : (
        <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
          {npc.talents.map((talent, index) => (
            <Stack
              key={index}
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2, py: 0.75 }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2">{talent.tier ? `${talent.name} ${talent.tier}` : talent.name}</Typography>
                {talent.params && (
                  <Typography variant="caption" color="text.secondary">
                    {talent.params}
                  </Typography>
                )}
              </Box>
              {talent.dp !== null && (
                <Chip
                  size="small"
                  variant="outlined"
                  color={talent.dp < 0 ? 'warning' : 'default'}
                  label={t('npc-talent-dp', { value: talent.dp })}
                />
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </Panel>
  );
};
