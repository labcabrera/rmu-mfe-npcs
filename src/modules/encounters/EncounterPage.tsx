/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import { useSearchParams } from 'react-router-dom';
import { Alert, Button, Stack, Step, StepButton, Stepper } from '@mui/material';
import {
  EncounterCheckResult,
  EncounterSettings,
  EncounterSide,
  EncounterTableSummary,
  ErrorState,
  fetchEncounterSettings,
  fetchEncounterTables,
  LayoutBase,
  LoadingState,
  RollValue,
  useNotify,
} from '@labcabrera-rmu/rmu-react-shared-lib';
import EncounterCheckStep from './EncounterCheckStep';
import EncounterCreatureStep from './EncounterCreatureStep';
import EncounterSituationStep from './EncounterSituationStep';
import { EncounterSituation, missingValues, readSituation, writeSituation } from './encounter-situation';

const STEPS = ['encounter-step-situation', 'encounter-step-check', 'encounter-step-creature'];

/**
 * Creature Law encounter rolls (spec 061): the situation (kept in the URL), the avoidance and activity check
 * (Tables 15.4a and 15.4b) and the creature rolls on the biome, location and universal tables.
 */
export default function EncounterPage() {
  const { t } = useTranslation();
  const auth = useAuth();
  const notify = useNotify();
  const [params, setParams] = useSearchParams();
  const situation = useMemo(() => readSituation(params), [params]);
  const [tables, setTables] = useState<EncounterTableSummary[]>();
  const [settings, setSettings] = useState<EncounterSettings>();
  const [error, setError] = useState<unknown>();
  const [reloads, setReloads] = useState(0);
  const [step, setStep] = useState(0);
  const [checkRolls, setCheckRolls] = useState<Partial<Record<EncounterSide, RollValue>>>({});
  const [check, setCheck] = useState<EncounterCheckResult | null>(null);
  // A new creature step for every encounter, so its rolls start empty.
  const [run, setRun] = useState(0);

  useEffect(() => {
    setError(undefined);
    Promise.all([fetchEncounterTables(auth), fetchEncounterSettings(auth)])
      .then(([loadedTables, loadedSettings]) => {
        setTables(loadedTables);
        setSettings(loadedSettings);
      })
      .catch((err) => {
        setError(err);
        notify.error(err);
      });
  }, [reloads]);

  const setSituation = (next: EncounterSituation) => {
    setParams(writeSituation(next), { replace: true });
    setCheckRolls({});
    setCheck(null);
  };

  const missing = settings ? missingValues(situation, settings.modifiers) : [];
  const situationReady = !!situation.tableId && (situation.skipCheck || missing.length === 0);
  const canOpen = (index: number) => {
    if (index === 0) return true;
    if (!situationReady) return false;
    if (index === 1) return !situation.skipCheck;
    return situation.skipCheck || !!check;
  };
  const goCreature = () => {
    setRun((count) => count + 1);
    setStep(2);
  };
  const newEncounter = () => {
    setCheckRolls({});
    setCheck(null);
    setRun((count) => count + 1);
    setStep(situation.skipCheck ? 2 : 1);
  };

  let content: React.ReactNode;
  if (error && (!tables || !settings)) content = <ErrorState error={error} onRetry={() => setReloads((n) => n + 1)} />;
  else if (!tables || !settings) content = <LoadingState variant="detail" />;
  else
    content = (
      <Stack spacing={3}>
        <Stepper nonLinear activeStep={step} alternativeLabel>
          {STEPS.map((label, index) => (
            <Step key={label} completed={index < step} disabled={!canOpen(index)}>
              <StepButton onClick={() => setStep(index)}>{t(label)}</StepButton>
            </Step>
          ))}
        </Stepper>

        {step === 0 && (
          <Stack spacing={2}>
            <EncounterSituationStep situation={situation} onChange={setSituation} tables={tables} settings={settings} />
            {!situation.tableId && <Alert severity="info">{t('encounter-pick-table')}</Alert>}
            {missing.length > 0 && !situation.skipCheck && (
              <Alert severity="warning">
                {t('encounter-missing-values', {
                  modifiers: missing.map((key) => t(`encounter-mod-${key}`)).join(', '),
                })}
              </Alert>
            )}
            <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                disabled={!situationReady}
                onClick={() => (situation.skipCheck ? goCreature() : setStep(1))}
              >
                {t(situation.skipCheck ? 'encounter-go-creature' : 'next')}
              </Button>
            </Stack>
          </Stack>
        )}

        {step === 1 && (
          <Stack spacing={2}>
            <EncounterCheckStep
              situation={situation}
              tables={tables}
              settings={settings}
              rolls={checkRolls}
              onRollsChange={setCheckRolls}
              result={check}
              onResult={setCheck}
            />
            <Stack direction="row" sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Button onClick={() => setStep(0)}>{t('back')}</Button>
              <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
                <Button
                  onClick={() => {
                    setCheckRolls({});
                    setCheck(null);
                  }}
                  disabled={!checkRolls.avoidance && !checkRolls.activity}
                >
                  {t('encounter-reroll-check')}
                </Button>
                <Button
                  variant={check?.encounter === false ? 'outlined' : 'contained'}
                  disabled={!check}
                  onClick={goCreature}
                >
                  {t(check?.encounter === false ? 'encounter-go-creature-anyway' : 'encounter-go-creature')}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={2}>
            {check && !situation.skipCheck && !check.encounter && (
              <Alert severity="info">{t('encounter-check-none')}</Alert>
            )}
            <EncounterCreatureStep key={run} situation={situation} tables={tables} onNewEncounter={newEncounter} />
            <Stack direction="row">
              <Button onClick={() => setStep(situation.skipCheck ? 0 : 1)}>{t('back')}</Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    );

  return (
    <LayoutBase
      breadcrumbs={[{ name: t('home'), link: '/' }, { name: t('npcs'), link: '/npcs' }, { name: t('encounter-title') }]}
    >
      {content}
    </LayoutBase>
  );
}
