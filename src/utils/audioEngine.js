// Audio Engine disabled per user request ("hilangkan musiknya")
export const audioEngine = {
  isEnabled: false,
  activeSessions: new Map(),
  subscribe: () => () => {},
  enableAudio: () => {},
  toggleAudio: () => false,
  startFigureAudio: () => {},
  stopFigureAudio: () => {},
  stopAllAudio: () => {},
};
