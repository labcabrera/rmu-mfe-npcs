import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid } from '@mui/material';
import { AddNpcSkill, NumericInput, RmuDialog, SkillSelector, useNotify } from '@labcabrera-rmu/rmu-react-shared-lib';

/** Skill being added; the API also takes the selected specialization. */
type AddSkillForm = AddNpcSkill & { specialization?: string };

export default function AddSkillDialog({
  open,
  onClose,
  onSkillAdded,
}: {
  open: boolean;
  onClose: () => void;
  onSkillAdded: (addSkill: AddNpcSkill) => void;
}) {
  const { t } = useTranslation();
  const notify = useNotify();
  const [formData, setFormData] = useState<AddSkillForm>({} as AddSkillForm);

  const handleAdd = () => {
    onSkillAdded(formData);
    setFormData({} as AddSkillForm);
    onClose();
  };

  const handleClose = () => {
    setFormData({} as AddSkillForm);
    onClose();
  };

  return (
    <RmuDialog
      title={t('add-skill')}
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      buttons={
        <Button onClick={handleAdd} variant="contained" disabled={!formData.skillId}>
          {t('add')}
        </Button>
      }
    >
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={12}>
          <SkillSelector
            onSkillChange={(e) => setFormData({ ...formData, skillId: e! })}
            onSpecializationChange={(e) => setFormData({ ...formData, specialization: e! })}
            onError={(e) => notify.error(e)}
          />
        </Grid>
        <Grid size={12}>
          {formData.skillId && (
            <>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <NumericInput
                    label={t('ranks')}
                    value={formData.ranks}
                    onChange={(e) => setFormData({ ...formData, ranks: e || 0 })}
                    integer
                  />
                </Grid>
                <Grid size={12}>
                  <NumericInput
                    label={t('bonus')}
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e || 0 })}
                    integer
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </RmuDialog>
  );
}
