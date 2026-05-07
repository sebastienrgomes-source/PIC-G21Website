export const deviceTopic = {
  cmd: (deviceUid: string) => `heatspot/${deviceUid}/cmd`,
  telemetry: (deviceUid: string) => `heatspot/${deviceUid}/telemetry`,
  ack: (deviceUid: string) => `heatspot/${deviceUid}/ack`,
  status: (deviceUid: string) => `heatspot/${deviceUid}/status`,
};

export const extractDeviceUidFromTopic = (topic: string): string | null => {
  const parts = topic.split('/');
  if (parts.length < 3 || parts[0] !== 'heatspot') return null;
  return parts[1] ?? null;
};
