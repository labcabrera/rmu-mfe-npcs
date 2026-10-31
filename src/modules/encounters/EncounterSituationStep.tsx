import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import {
  ENCOUNTER_POPULATIONS,
  ENCOUNTER_TABLE_KINDS,
  EncounterModifierSetting,
  EncounterPopulation,
  EncounterSettings,
  EncounterSide,
  EncounterTableSummary,
  formatBonus,
  NumericInput,
  Panel,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import { ENCOUNTER_SIDES, EncounterSituation, modifierTotal, toggleModifier } from './encounter-situation';

type Props = {
  situation: EncounterSituation;
  onChange: (situation: EncounterSituation) => void;
  tables: EncounterTableSummary[];
  settings: EncounterSettings;
};

/** Label of a table: `encounter-table-<id>`, with its biome code. */
export const useTableLabel = () => {
  const { t } = useTranslation();
  return (tableId: string, tables?: EncounterTableSummary[]) => {
    const biome = tables?.find((table) => table.id === tableId)?.biome;
    const name = t(`encounter-table-${tableId}`, { defaultValue: tableId });
    return biome ? `${name} (${biome})` : name;
  };
};

/** Step 1 (spec 061): the table, water and land, the population and the Table 15.4a modifiers. */
export default function EncounterSituationStep({ situation, onChange, tables, settings }: Props) {
  const { t } = useTranslation();
  const tableLabel = useTableLabel();
  const set = (change: Partial<EncounterSituation>) => onChange({ ...situation, ...change });
  const selected = tables.find((table) => table.id === situation.tableId);
  const biomes = tables.filter((table) => table.kind === 'biome');
  const byLabel = (a: EncounterTableSummary, b: EncounterTableSummary) =>
    tableLabel(a.id).localeCompare(tableLabel(b.id));

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
        <Panel title={t('encounter-place')}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="encounter-table-label">{t('encounter-table')}</InputLabel>
              <Select
                labelId="encounter-table-label"
                label={t('encounter-table')}
                value={situation.tableId ?? ''}
                onChange={(event) => set({ tableId: event.target.value || null })}
              >
                {ENCOUNTER_TABLE_KINDS.flatMap((kind) => [
                  <ListSubheader key={`kind-${kind}`}>{t(`encounter-kind-${kind}`)}</ListSubheader>,
                  ...tables
                    .filter((table) => table.kind === kind)
                    .sort(byLabel)
                    .map((table) => (
                      <MenuItem key={table.id} value={table.id}>
                        {tableLabel(table.id, tables)}
                      </MenuItem>
                    )),
                ])}
              </Select>
            </FormControl>
            {selected && selected.kind !== 'biome' && (
              <FormControl fullWidth>
                <InputLabel id="encounter-region-label">{t('encounter-region')}</InputLabel>
                <Select
                  labelId="encounter-region-label"
                  label={t('encounter-region')}
                  value={situation.regionTableId ?? ''}
                  onChange={(event) => set({ regionTableId: event.target.value || null })}
                >
                  <MenuItem value="">{t('encounter-region-none')}</MenuItem>
                  {[...biomes].sort(byLabel).map((table) => (
                    <MenuItem key={table.id} value={table.id}>
                      {tableLabel(table.id, tables)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Stack direction="row" sx={{ flexWrap: 'wrap', columnGap: 2 }}>
              <FormControlLabel
                control={<Switch checked={situation.water} onChange={(_, water) => set({ water })} />}
                label={t('encounter-water')}
              />
              <FormControlLabel
                control={<Switch checked={situation.land} onChange={(_, land) => set({ land })} />}
                label={t('encounter-land')}
              />
            </Stack>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <NumericInput
                label={t('encounter-creature-modifier')}
                value={situation.creatureModifier}
                onChange={(value) => set({ creatureModifier: value ?? 0 })}
                integer
                allowNegatives
              />
              <NumericInput
                label={t('encounter-party-levels')}
                value={situation.partyLevels}
                onChange={(value) => set({ partyLevels: value })}
                integer
                min={1}
              />
            </Box>
          </Stack>
        </Panel>
        <Panel title={t('encounter-check')}>
          <Stack spacing={2}>
            <FormControlLabel
              control={<Switch checked={situation.skipCheck} onChange={(_, skipCheck) => set({ skipCheck })} />}
              label={t('encounter-skip-check')}
            />
            {!situation.skipCheck && (
              <FormControl fullWidth>
                <InputLabel id="encounter-population-label">{t('population')}</InputLabel>
                <Select
                  labelId="encounter-population-label"
                  label={t('population')}
                  value={situation.population}
                  onChange={(event) => set({ population: event.target.value as EncounterPopulation })}
                >
                  {ENCOUNTER_POPULATIONS.map((population) => (
                    <MenuItem key={population} value={population}>
                      {t(`encounter-population-${population}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Typography variant="body2" color="text.secondary">
              {t(situation.skipCheck ? 'encounter-skip-check-help' : 'encounter-check-help')}
            </Typography>
          </Stack>
        </Panel>
      </Box>
      {!situation.skipCheck && (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' } }}>
          {ENCOUNTER_SIDES.map((side) => (
            <ModifierPanel key={side} side={side} situation={situation} onChange={onChange} settings={settings} />
          ))}
        </Box>
      )}
    </Stack>
  );
}

const valueLabel = (setting: EncounterModifierSetting, t: (key: string) => string) =>
  setting.value === null ? t('encounter-mod-variable') : formatBonus(setting.value);

/** The modifiers of one side: a select per exclusive group, a checkbox for the rest, a number for variable ones. */
function ModifierPanel({
  side,
  situation,
  onChange,
  settings,
}: {
  side: EncounterSide;
  situation: EncounterSituation;
  onChange: (situation: EncounterSituation) => void;
  settings: EncounterSettings;
}) {
  const { t } = useTranslation();
  const all = settings.modifiers;
  const mine = all.filter((setting) => setting.side === side);
  const groups = [...new Set(mine.map((setting) => setting.group).filter((group): group is string => !!group))];
  const total = modifierTotal(situation, all, side);
  const toggle = (key: string, checked: boolean, value: number | null = null) =>
    onChange(toggleModifier(situation, all, key, checked, value));
  const setValue = (key: string, value: number | null) =>
    onChange({ ...situation, modifiers: { ...situation.modifiers, [key]: value } });
  const variableInput = (setting: EncounterModifierSetting) =>
    setting.value === null &&
    setting.key in situation.modifiers && (
      <NumericInput
        label={t('encounter-mod-value')}
        value={situation.modifiers[setting.key]}
        onChange={(value) => setValue(setting.key, value)}
        error={situation.modifiers[setting.key] === null}
        integer
        allowNegatives
      />
    );

  return (
    <Panel
      title={t(`encounter-${side}-modifiers`)}
      extra={
        <Typography variant="subtitle2" color={total < 0 ? 'error.main' : 'text.primary'}>
          {formatBonus(total)}
        </Typography>
      }
    >
      <Stack spacing={1.5}>
        {groups.map((group) => {
          const options = mine.filter((setting) => setting.group === group);
          const current = options.find((setting) => setting.key in situation.modifiers);
          return (
            <Stack key={group} spacing={1}>
              <TextField
                select
                fullWidth
                label={t(`encounter-group-${group}`)}
                value={current?.key ?? ''}
                onChange={(event) =>
                  event.target.value ? toggle(event.target.value, true) : current && toggle(current.key, false)
                }
              >
                <MenuItem value="">{t('encounter-mod-none')}</MenuItem>
                {options.map((setting) => (
                  <MenuItem key={setting.key} value={setting.key}>
                    {t(`encounter-mod-${setting.key}`)} ({valueLabel(setting, t)})
                  </MenuItem>
                ))}
              </TextField>
              {current && variableInput(current)}
            </Stack>
          );
        })}
        {mine
          .filter((setting) => !setting.group)
          .map((setting) => (
            <Stack key={setting.key} spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={setting.key in situation.modifiers}
                    onChange={(_, checked) => toggle(setting.key, checked)}
                  />
                }
                label={`${t(`encounter-mod-${setting.key}`)} (${valueLabel(setting, t)})`}
              />
              {variableInput(setting)}
            </Stack>
          ))}
      </Stack>
    </Panel>
  );
}
