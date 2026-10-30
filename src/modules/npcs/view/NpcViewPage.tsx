/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import PersonIcon from '@mui/icons-material/Person';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import { Box, Chip, Stack } from '@mui/material';
import {
  CreatureStatBlock,
  deleteNpc,
  DetailPage,
  fetchNpc,
  fetchRealm,
  fetchRealms,
  ImageSelectorDialog,
  Npc,
  Realm,
  RmuIconButton,
  SectionNav,
  StatPill,
  updateNpc,
  useEntity,
  useNotify,
  useSectionParam,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { canChangeNpc, isCatalogNpc, npcImage, npcName, npcTypeLabel } from '../npc-format';
import DuplicateNpcDialog from './DuplicateNpcDialog';
import { NpcViewProfile, NpcViewTalents } from './NpcViewSections';

const SECTIONS = ['combat', 'profile', 'talents'];

const sectionIcons: Record<string, ReactElement> = {
  combat: <SportsMmaIcon />,
  profile: <PersonIcon />,
  talents: <EmojiObjectsIcon />,
};

/**
 * View of an NPC (spec 054): the combat stat block, the profile and the talents. Catalog creatures can only be
 * changed by an admin; anyone can duplicate one as an NPC of their own.
 */
export default function NpcViewPage() {
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotify();
  const { npcId } = useParams<{ npcId?: string }>();
  const state = useEntity<Npc>(npcId, (id) => fetchNpc(id, auth), {
    initial: location.state?.npc,
    onError: notify.error,
  });
  const npc = state.entity;
  const [realm, setRealm] = useState<Realm>();
  const [realms, setRealms] = useState<Realm[]>();
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [section, setSection] = useSectionParam(SECTIONS);
  const canChange = canChangeNpc(auth, npc);
  // The filters of the list it was opened from.
  const listUrl = `/npcs${typeof location.state?.from === 'string' ? location.state.from : ''}`;

  useEffect(() => {
    if (!npc?.realmId) return;
    fetchRealm(npc.realmId, auth).then(setRealm).catch(notify.error);
  }, [npc?.realmId]);

  useEffect(() => {
    if (!duplicateOpen || realms) return;
    fetchRealms('', 0, 100, auth)
      .then((response) => setRealms(response.content))
      .catch(notify.error);
  }, [duplicateOpen]);

  const onImageSelected = (entity: Npc, imageUrl: string) =>
    updateNpc(entity.id, { imageUrl, version: entity.version }, auth).then(state.setEntity).catch(notify.error);

  const onDelete = (entity: Npc) =>
    deleteNpc(entity.id, auth)
      .then(() => navigate(listUrl, { replace: true }))
      .catch(notify.error);

  const onDuplicated = (created: Npc) => {
    setDuplicateOpen(false);
    navigate(`/npcs/view/${created.id}`, { state: { npc: created } });
  };

  return (
    <DetailPage
      breadcrumbs={[
        { name: t('home'), link: '/' },
        { name: t('npcs'), link: listUrl },
        { name: npc ? npcName(npc, t) : t('view') },
      ]}
      entity={state}
      technicalInfo={false}
      actions={() => [
        <RmuIconButton
          key="duplicate"
          Icon={ContentCopyIcon}
          tooltip="npc-duplicate"
          ariaLabel="npc-duplicate"
          onClick={() => setDuplicateOpen(true)}
        />,
      ]}
      onEdit={canChange ? (entity) => navigate(`/npcs/edit/${entity.id}`, { state: { npc: entity } }) : undefined}
      onDelete={canChange ? onDelete : undefined}
      deleteMessage={(entity) => t('npc-delete-message', { name: npcName(entity, t) })}
      hero={(entity) => ({
        title: npcName(entity, t),
        overline: [
          t('npc-level-value', { level: entity.level }),
          t(`npc-category-${entity.category}`),
          entity.type ? npcTypeLabel(entity.type, t) : null,
          realm ? t(realm.name) : null,
        ]
          .filter(Boolean)
          .join(' · '),
        image: npcImage(entity),
        ...(canChange ? { onImageClick: () => setImageDialogOpen(true), imageActionLabel: t('change-image') } : {}),
        chips: [
          <Chip
            key="origin"
            color={isCatalogNpc(entity) ? 'default' : 'primary'}
            variant={isCatalogNpc(entity) ? 'outlined' : 'filled'}
            label={t(isCatalogNpc(entity) ? 'npc-origin-catalog' : 'npc-origin-mine')}
          />,
          ...(entity.outlookType
            ? [<Chip key="outlook" variant="outlined" label={t(`outlook-${entity.outlookType}`)} />]
            : []),
        ],
        pills: [
          <StatPill key="hits" label={t('npc-hits')} value={entity.hp} />,
          <StatPill key="at" label={t('at-short')} hint={t('at')} value={entity.at} />,
          <StatPill key="db" label={t('db-short')} hint={t('db')} value={entity.db} />,
          <StatPill key="ini" label={t('initiative-short')} hint={t('initiative')} value={entity.initiative} signed />,
        ],
      })}
    >
      {(entity) => (
        <Stack spacing={2}>
          <SectionNav
            label={t('npc-sections')}
            value={section}
            onChange={setSection}
            sections={SECTIONS.map((id) => ({ id, label: t(`npc-section-${id}`), icon: sectionIcons[id] }))}
          />
          <Box key={section}>
            {section === SECTIONS[0] && <CreatureStatBlock npc={entity} />}
            {section === SECTIONS[1] && <NpcViewProfile npc={entity} realm={realm} />}
            {section === SECTIONS[2] && <NpcViewTalents npc={entity} />}
          </Box>
          {canChange && (
            <ImageSelectorDialog
              value={entity.imageUrl || npcImage(entity)}
              open={imageDialogOpen}
              onClose={() => setImageDialogOpen(false)}
              onSelect={(selected) => onImageSelected(entity, selected)}
            />
          )}
          <DuplicateNpcDialog
            npc={entity}
            realms={realms}
            open={duplicateOpen}
            onClose={() => setDuplicateOpen(false)}
            onCreated={onDuplicated}
          />
        </Stack>
      )}
    </DetailPage>
  );
}
