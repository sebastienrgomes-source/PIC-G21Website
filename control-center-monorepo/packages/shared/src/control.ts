import type { DeviceMode, DeviceState } from './schemas';

export interface ComputeDutyCycleInput {
  tInternal: number | null;
  tSet: number;
  tBand: number;
  maxDuty: number;
  vBatt: number | null;
  minBattV: number;
  mode: DeviceMode;
  lowSolarBudget?: boolean;
}

export interface ComputeDutyCycleResult {
  duty: number;
  state: DeviceState;
  effectiveMode: Exclude<DeviceMode, 'AUTO'>;
  reason: string;
}

const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : 0));

const resolveAutoMode = ({
  tInternal,
  tSet,
  tBand,
  vBatt,
  minBattV,
}: Pick<ComputeDutyCycleInput, 'tInternal' | 'tSet' | 'tBand' | 'vBatt' | 'minBattV'>): Exclude<
  DeviceMode,
  'AUTO'
> => {
  if (vBatt !== null && vBatt < minBattV + 0.3) return 'ECO';
  if (tInternal !== null && tInternal <= tSet - tBand * 2) return 'BOOST';
  return 'NORMAL';
};

const modeProfile = (mode: Exclude<DeviceMode, 'AUTO'>) => {
  if (mode === 'ECO') return { maxFactor: 0.6, maintainDuty: 0.12 };
  if (mode === 'BOOST') return { maxFactor: 1, maintainDuty: 0.28 };
  return { maxFactor: 0.8, maintainDuty: 0.2 };
};

export const computeDutyCycle = (input: ComputeDutyCycleInput): ComputeDutyCycleResult => {
  const {
    tInternal,
    tSet,
    tBand,
    maxDuty,
    vBatt,
    minBattV,
    mode,
    lowSolarBudget = false,
  } = input;

  if (vBatt === null || tInternal === null) {
    return {
      duty: 0,
      state: 'PROTECT',
      effectiveMode: mode === 'AUTO' ? 'NORMAL' : mode,
      reason: 'missing_sensor_data',
    };
  }

  if (vBatt < minBattV) {
    return {
      duty: 0,
      state: 'LOW_BATT',
      effectiveMode: mode === 'AUTO' ? 'ECO' : mode,
      reason: 'battery_below_cutoff',
    };
  }

  const effectiveMode = mode === 'AUTO' ? resolveAutoMode({ tInternal, tSet, tBand, vBatt, minBattV }) : mode;
  const profile = modeProfile(effectiveMode);

  let allowedMaxDuty = clamp(maxDuty * profile.maxFactor);
  if (lowSolarBudget) allowedMaxDuty = clamp(allowedMaxDuty * 0.7);

  if (tInternal <= tSet - tBand) {
    return {
      duty: allowedMaxDuty,
      state: allowedMaxDuty > 0 ? 'HEATING' : 'IDLE',
      effectiveMode,
      reason: 'below_lower_band',
    };
  }

  if (tInternal >= tSet + tBand) {
    return {
      duty: 0,
      state: 'IDLE',
      effectiveMode,
      reason: 'above_upper_band',
    };
  }

  const maintainDuty = clamp(Math.min(profile.maintainDuty, allowedMaxDuty));
  return {
    duty: maintainDuty,
    state: maintainDuty > 0 ? 'HEATING' : 'IDLE',
    effectiveMode,
    reason: 'inside_hysteresis_band',
  };
};
