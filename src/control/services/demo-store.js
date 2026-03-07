import { computeDutyCycle } from "../../shared/utils/control";

const ACTIVE_USER_KEY = "pic_control_active_email_v1";
const STORAGE_PREFIX = "pic_demo_v2";

const BASE_DEVICE_CONFIG = [
  {
    id: "demo-hive-01",
    name: "Hive Norte",
    device_uid: "BEE-001-ESP32",
    status: "online",
    lastSeenOffsetMin: 1,
    createdAtOffsetHours: 72,
    tempBase: 7.5,
    battBase: 12.2,
    phase: 0,
  },
  {
    id: "demo-hive-02",
    name: "Hive Sul",
    device_uid: "BEE-002-ESP32",
    status: "online",
    lastSeenOffsetMin: 3,
    createdAtOffsetHours: 36,
    tempBase: 8.3,
    battBase: 12.0,
    phase: 8,
  },
];

const DEFAULT_MODES = {
  "demo-hive-01": "AUTO",
  "demo-hive-02": "ECO",
};

const hasWindow = () => typeof window !== "undefined";

const storage = () => {
  if (!hasWindow()) return null;
  return window.localStorage;
};

const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();

const now = () => Date.now();

const randomInt = (max) => {
  if (hasWindow() && window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
};

const randomId = () => {
  if (hasWindow() && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `id_${Math.random().toString(36).slice(2, 12)}_${Date.now()}`;
};

const readJson = (key, fallback) => {
  const store = storage();
  if (!store) return fallback;

  try {
    const raw = store.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  const store = storage();
  if (!store) return;
  store.setItem(key, JSON.stringify(value));
};

export function setActiveUserEmail(email) {
  const store = storage();
  if (!store) return;

  const normalized = normalizeEmail(email);
  if (!normalized) return;
  store.setItem(ACTIVE_USER_KEY, normalized);
}

export function clearActiveUserEmail() {
  const store = storage();
  if (!store) return;
  store.removeItem(ACTIVE_USER_KEY);
}

function getActiveUserEmail() {
  const store = storage();
  if (!store) return "";
  return normalizeEmail(store.getItem(ACTIVE_USER_KEY) ?? "");
}

function requireActiveUserEmail() {
  const email = getActiveUserEmail();
  if (!email) {
    throw new Error("Sem sessão ativa.");
  }

  return email;
}

function scopedKey(email, suffix) {
  return `${STORAGE_PREFIX}_${suffix}_${normalizeEmail(email)}`;
}

const generatePairingCode = (length = 8) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let output = "";
  for (let idx = 0; idx < length; idx += 1) {
    output += chars[randomInt(chars.length)];
  }
  return output;
};

const generateDeviceSecret = (length = 32) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
  let output = "";
  for (let idx = 0; idx < length; idx += 1) {
    output += chars[randomInt(chars.length)];
  }
  return output;
};

const makeDefaultDevices = () => {
  const current = now();
  return BASE_DEVICE_CONFIG.map((item) => ({
    id: item.id,
    owner_id: "demo-user",
    name: item.name,
    device_uid: item.device_uid,
    status: item.status,
    last_seen_at: new Date(current - item.lastSeenOffsetMin * 60 * 1000).toISOString(),
    created_at: new Date(current - item.createdAtOffsetHours * 60 * 60 * 1000).toISOString(),
  }));
};

const makeDefaultSettings = () => {
  const settings = {};

  BASE_DEVICE_CONFIG.forEach((item) => {
    settings[item.id] = {
      device_id: item.id,
      mode: DEFAULT_MODES[item.id] ?? "AUTO",
      t_set: 8,
      t_band: 1,
      max_duty: 0.8,
      min_batt_v: 11.6,
      max_heater_w: 60,
      updated_at: new Date(now() - 15 * 60 * 1000).toISOString(),
    };
  });

  return settings;
};

const makeDefaultCommands = () => {
  const ts = now();
  return {
    "demo-hive-01": [
      {
        id: "demo-hive-01-cmd-1",
        device_id: "demo-hive-01",
        owner_id: "demo-user",
        command_type: "SET_CONTROL",
        payload: {
          msgId: "demo-hive-01-msg-1",
          type: "SET_CONTROL",
          tSet: 8,
          mode: "AUTO",
          duty: 0.2,
          maxDuty: 0.8,
          ts: ts - 8 * 60 * 1000,
        },
        status: "acked",
        created_at: new Date(ts - 8 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-hive-01-cmd-2",
        device_id: "demo-hive-01",
        owner_id: "demo-user",
        command_type: "SET_CONTROL",
        payload: {
          msgId: "demo-hive-01-msg-2",
          type: "SET_CONTROL",
          tSet: 8.5,
          mode: "BOOST",
          duty: 0.8,
          maxDuty: 0.8,
          ts: ts - 42 * 60 * 1000,
        },
        status: "acked",
        created_at: new Date(ts - 42 * 60 * 1000).toISOString(),
      },
    ],
    "demo-hive-02": [
      {
        id: "demo-hive-02-cmd-1",
        device_id: "demo-hive-02",
        owner_id: "demo-user",
        command_type: "SET_CONTROL",
        payload: {
          msgId: "demo-hive-02-msg-1",
          type: "SET_CONTROL",
          tSet: 7.5,
          mode: "ECO",
          duty: 0.12,
          maxDuty: 0.8,
          ts: ts - 18 * 60 * 1000,
        },
        status: "acked",
        created_at: new Date(ts - 18 * 60 * 1000).toISOString(),
      },
    ],
  };
};

function ensureStore(email) {
  const devicesKey = scopedKey(email, "devices");
  const settingsKey = scopedKey(email, "settings");
  const commandsKey = scopedKey(email, "commands");

  if (!readJson(devicesKey, null)) {
    writeJson(devicesKey, makeDefaultDevices());
  }

  if (!readJson(settingsKey, null)) {
    writeJson(settingsKey, makeDefaultSettings());
  }

  if (!readJson(commandsKey, null)) {
    writeJson(commandsKey, makeDefaultCommands());
  }
}

function loadDevices(email) {
  ensureStore(email);
  return readJson(scopedKey(email, "devices"), makeDefaultDevices());
}

function saveDevices(email, devices) {
  writeJson(scopedKey(email, "devices"), devices);
}

function loadSettings(email) {
  ensureStore(email);
  return readJson(scopedKey(email, "settings"), makeDefaultSettings());
}

function saveSettings(email, settings) {
  writeJson(scopedKey(email, "settings"), settings);
}

function loadCommands(email) {
  ensureStore(email);
  return readJson(scopedKey(email, "commands"), makeDefaultCommands());
}

function saveCommands(email, commands) {
  writeJson(scopedKey(email, "commands"), commands);
}

const seedFromString = (value) => {
  let seed = 0;
  for (let idx = 0; idx < value.length; idx += 1) {
    seed = (seed * 31 + value.charCodeAt(idx)) % 997;
  }
  return seed;
};

const resolveDeviceConfig = (device) => {
  const known = BASE_DEVICE_CONFIG.find((item) => item.id === device.id);
  if (known) return known;

  const seed = seedFromString(device.id + device.device_uid);

  return {
    id: device.id,
    name: device.name,
    device_uid: device.device_uid,
    status: device.status,
    lastSeenOffsetMin: device.status === "online" ? (seed % 5) + 1 : (seed % 20) + 12,
    createdAtOffsetHours: (seed % 96) + 12,
    tempBase: 7.4 + (seed % 12) / 10,
    battBase: 11.9 + (seed % 8) / 20,
    phase: seed % 15,
  };
};

const safeState = (duty, battery) => {
  if (battery < 11.6) return "LOW_BATT";
  return duty > 0 ? "HEATING" : "IDLE";
};

const buildTelemetry = (device) => {
  const config = resolveDeviceConfig(device);
  const points = [];
  const current = now();

  for (let idx = 95; idx >= 0; idx -= 1) {
    const ts = new Date(current - idx * 15 * 60 * 1000).toISOString();
    const waveA = Math.sin((idx + config.phase) / 7);
    const waveB = Math.cos((idx + config.phase) / 11);

    const tInternal = Number((config.tempBase + waveA * 1.15 + waveB * 0.35).toFixed(2));
    const vBatt = Number((config.battBase + Math.cos((idx + config.phase) / 17) * 0.25).toFixed(2));
    const duty = tInternal < 7.8 ? 0.72 : tInternal > 9.2 ? 0 : 0.2;
    const state = safeState(duty, vBatt);

    points.push({
      id: 1000 + idx,
      device_id: device.id,
      ts,
      t_internal: tInternal,
      t_external: Number((5.8 + waveB * 1.9).toFixed(2)),
      humidity: Number((58 + waveA * 4).toFixed(2)),
      v_batt: vBatt,
      i_heater: Number((duty * 2.8).toFixed(2)),
      duty,
      state,
      raw: {
        ts: Date.parse(ts),
        tInternal,
        vBatt,
        duty,
        state,
      },
    });
  }

  return points;
};

const sanitizeDeviceId = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const listDemoDevices = () => {
  const email = requireActiveUserEmail();
  const devices = loadDevices(email);

  return [...devices].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const getDemoDeviceById = (deviceId) => {
  const email = requireActiveUserEmail();
  const devices = loadDevices(email);
  return devices.find((device) => device.id === deviceId) ?? null;
};

export const getDemoDeviceSettings = (deviceId) => {
  const email = requireActiveUserEmail();
  const settings = loadSettings(email);

  if (settings[deviceId]) {
    return settings[deviceId];
  }

  const fallback = {
    device_id: deviceId,
    mode: "AUTO",
    t_set: 8,
    t_band: 1,
    max_duty: 0.8,
    min_batt_v: 11.6,
    max_heater_w: 60,
    updated_at: new Date().toISOString(),
  };

  settings[deviceId] = fallback;
  saveSettings(email, settings);
  return fallback;
};

export const getDemoTelemetry = (deviceId) => {
  const device = getDemoDeviceById(deviceId);
  if (!device) return [];
  return buildTelemetry(device);
};

export const getDemoCommands = (deviceId) => {
  const email = requireActiveUserEmail();
  const commands = loadCommands(email);
  return commands[deviceId] ?? [];
};

export const createDemoPairing = ({ device_uid: rawUid, name: rawName }) => {
  const email = requireActiveUserEmail();

  const deviceUid = rawUid?.trim();
  if (!deviceUid || deviceUid.length < 4) {
    throw new Error("Device UID invalido.");
  }

  const name = rawName?.trim();
  const devices = loadDevices(email);
  const settings = loadSettings(email);
  const commands = loadCommands(email);

  let device = devices.find((item) => item.device_uid.toLowerCase() === deviceUid.toLowerCase()) ?? null;

  if (!device) {
    let generatedId = sanitizeDeviceId(`demo-${deviceUid}`) || `demo-${randomId().slice(0, 6)}`;
    while (devices.some((item) => item.id === generatedId)) {
      generatedId = `${generatedId}-${randomInt(999)}`;
    }

    device = {
      id: generatedId,
      owner_id: "demo-user",
      name: name || "My Device",
      device_uid: deviceUid,
      status: "offline",
      last_seen_at: null,
      created_at: new Date().toISOString(),
    };

    devices.unshift(device);
  } else if (name) {
    device.name = name;
  }

  settings[device.id] = {
    ...(settings[device.id] ?? {
      device_id: device.id,
      mode: "AUTO",
      t_set: 8,
      t_band: 1,
      max_duty: 0.8,
      min_batt_v: 11.6,
      max_heater_w: 60,
    }),
    updated_at: new Date().toISOString(),
  };

  if (!commands[device.id]) {
    commands[device.id] = [];
  }

  saveDevices(email, devices);
  saveSettings(email, settings);
  saveCommands(email, commands);

  return {
    pairingCode: generatePairingCode(8),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    deviceUid,
    provisioningSecret: generateDeviceSecret(),
  };
};

export const applyDemoCommand = ({ deviceId, tSet, mode }) => {
  const email = requireActiveUserEmail();

  const device = getDemoDeviceById(deviceId);
  if (!device) {
    throw new Error("Device nao encontrado.");
  }

  const settings = loadSettings(email);
  const commands = loadCommands(email);

  const currentSettings = getDemoDeviceSettings(deviceId);
  const latestTelemetry = getDemoTelemetry(deviceId).at(-1);

  const computed = computeDutyCycle({
    tInternal: latestTelemetry?.t_internal ?? null,
    tSet,
    tBand: Number(currentSettings.t_band),
    maxDuty: Number(currentSettings.max_duty),
    vBatt: latestTelemetry?.v_batt ?? null,
    minBattV: Number(currentSettings.min_batt_v),
    mode,
    lowSolarBudget: false,
  });

  const payload = {
    msgId: randomId(),
    type: "SET_CONTROL",
    tSet,
    mode,
    duty: computed.duty,
    maxDuty: Number(currentSettings.max_duty),
    ts: Date.now(),
  };

  const command = {
    id: randomId(),
    device_id: deviceId,
    owner_id: "demo-user",
    command_type: "SET_CONTROL",
    payload,
    status: "sent",
    created_at: new Date().toISOString(),
  };

  commands[deviceId] = [command, ...(commands[deviceId] ?? [])].slice(0, 20);

  settings[deviceId] = {
    ...currentSettings,
    mode,
    t_set: tSet,
    updated_at: new Date().toISOString(),
  };

  saveCommands(email, commands);
  saveSettings(email, settings);

  return {
    command,
    computed: {
      ...computed,
      lowSolarBudget: false,
    },
  };
};

export const resetDemoStore = () => {
  const email = getActiveUserEmail();
  if (!email) return;

  const store = storage();
  if (!store) return;

  store.removeItem(scopedKey(email, "devices"));
  store.removeItem(scopedKey(email, "settings"));
  store.removeItem(scopedKey(email, "commands"));
};
