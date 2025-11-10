export const PROCTORING_CONFIG = {
  // Auto-bypass tamper detection in dev mode (allows console usage)
  BYPASS_TAMPER_DETECTION: import.meta.env.DEV,
  
  // Set to true to test actual tamper detection behavior in dev mode
  FORCE_TAMPER_DETECTION: false,
};

export const shouldBypassTamperDetection = () => {
  return PROCTORING_CONFIG.BYPASS_TAMPER_DETECTION && !PROCTORING_CONFIG.FORCE_TAMPER_DETECTION;
};
