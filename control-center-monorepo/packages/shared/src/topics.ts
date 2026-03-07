export const deviceTopic = {
  cmd: (deviceUid: string) => `devices/${deviceUid}/cmd`,
  telemetry: (deviceUid: string) => `devices/${deviceUid}/telemetry`,
  ack: (deviceUid: string) => `devices/${deviceUid}/ack`,
  status: (deviceUid: string) => `devices/${deviceUid}/status`,
};

export const extractDeviceUidFromTopic = (topic: string): string | null => {
  const parts = topic.split('/');
  if (parts.length < 3 || parts[0] !== 'devices') return null;
  return parts[1] ?? null;
};
