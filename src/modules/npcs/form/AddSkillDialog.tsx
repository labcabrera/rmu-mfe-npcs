import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { OwnedSkill, RmuDialog, SkillSelector, useNotify } from '@labcabrera-rmu/rmu-react-shared-lib';

/** Picks a skill (and its specialization) to add to the form; ranks and bonus are typed in the list. */
export default function AddSkillDialog({
  open,
  owned,
  onClose,
  onAdd,
}: {
  open: boolean;
  owned: OwnedSkill[];
  onClose: () => void;
  onAdd: (skillId: string, specialization: string | null) => void;
}) {
  const { t } = useTranslation();
  const notify = useNotify();
  const [skillId, setSkillId] = useState<string | null>(null);
  const [specialization, setSpecialization] = useState<string | null>(null);

  const close = () => {
    setSkillId(null);
    setSpecialization(null);
    onClose();
  };

  return (
    <RmuDialog
      title={t('add-skill')}
      open={open}
      onClose={close}
      maxWidth="lg"
      buttons={
        <Button
          variant="contained"
          disabled={!skillId}
          onClick={() => {
            onAdd(skillId!, specialization);
            close();
          }}
        >
          {t('add')}
        </Button>
      }
    >
      {open && (
        <SkillSelector
          owned={owned}
          onSkillChange={setSkillId}
          onSpecializationChange={setSpecialization}
          onError={notify.error}
        />
      )}
    </RmuDialog>
  );
}
