import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { NpcSkill, NumericInput, Panel, useSpecializationLabel } from '@labcabrera-rmu/rmu-react-shared-lib';
import AddSkillDialog from './AddSkillDialog';
import { newSkill, NpcForm, SetNpcForm } from './npc-form';

/** Skills with their total bonus, optional ranks and a note. */
const NpcFormSkills: FC<{ form: NpcForm; set: SetNpcForm }> = ({ form, set }) => {
  const { t } = useTranslation();
  const specializationLabel = useSpecializationLabel();
  const [dialogOpen, setDialogOpen] = useState(false);
  const skills = form.skills;
  const change = (index: number, patch: Partial<NpcSkill>) =>
    set({ skills: skills.map((each, i) => (i === index ? { ...each, ...patch } : each)) });

  return (
    <Panel
      title={t('skills')}
      extra={
        <Button size="small" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          {t('add')}
        </Button>
      }
    >
      <Stack spacing={2}>
        {skills.map((skill, index) => (
          <Stack key={index} direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Grid container spacing={2} sx={{ flex: 1, alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {skill.specialization
                    ? `${t(skill.skillId)} (${specializationLabel(skill.specialization)})`
                    : t(skill.skillId)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <NumericInput
                  label={t('bonus')}
                  name={`bonus-${index}`}
                  value={skill.bonus}
                  onChange={(value) => change(index, { bonus: value ?? 0 })}
                  integer
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <NumericInput
                  label={t('ranks')}
                  name={`ranks-${index}`}
                  value={skill.ranks}
                  onChange={(value) => change(index, { ranks: value ?? null })}
                  integer
                  min={0}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  label={t('note')}
                  name={`note-${index}`}
                  value={skill.note ?? ''}
                  onChange={(e) => change(index, { note: e.target.value || null })}
                  fullWidth
                />
              </Grid>
            </Grid>
            <IconButton aria-label={t('remove')} onClick={() => set({ skills: skills.filter((_, i) => i !== index) })}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
        {skills.length === 0 && <Box sx={{ color: 'text.secondary', typography: 'body2' }}>{t('npc-no-skills')}</Box>}
      </Stack>
      <AddSkillDialog
        open={dialogOpen}
        owned={skills.map((skill) => ({ skillId: skill.skillId, specialization: skill.specialization }))}
        onClose={() => setDialogOpen(false)}
        onAdd={(skillId, specialization) => set({ skills: [...skills, newSkill(skillId, specialization)] })}
      />
    </Panel>
  );
};

export default NpcFormSkills;
