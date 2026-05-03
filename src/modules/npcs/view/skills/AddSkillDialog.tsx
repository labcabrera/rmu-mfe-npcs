import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { AddNpcSkill, NumericInput, SkillSelector } from '@labcabrera-rmu/rmu-react-shared-lib';
import { useError } from '../../../../ErrorContext';

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
  const { showError } = useError();
  const [formData, setFormData] = useState<AddNpcSkill>({} as AddNpcSkill);

  const handleAdd = () => {
    onSkillAdded(formData);
    setFormData({} as AddNpcSkill);
    onClose();
  };

  const handleClose = () => {
    setFormData({} as AddNpcSkill);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>{t('add-skill')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={12}>
            <SkillSelector
              onSkillChange={(e) => setFormData({ ...formData, skillId: e! })}
              onSpecializationChange={(e) => setFormData({ ...formData, specialization: e! })}
              onError={(e) => showError(e)}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('close')}</Button>
        <Button onClick={handleAdd} variant="contained" disabled={!formData.skillId}>
          {t('add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
