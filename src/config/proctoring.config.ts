export const PROCTORING_CONFIG = {
	// Auto-bypass tamper detection in dev mode (allows console usage)
	BYPASS_TAMPER_DETECTION: import.meta.env.DEV,

	// Override: Set VITE_FORCE_TAMPER_DETECTION=true in .env to test in dev mode
	FORCE_TAMPER_DETECTION: import.meta.env.VITE_FORCE_TAMPER_DETECTION === 'true',
};

export const shouldBypassTamperDetection = () => {
	return PROCTORING_CONFIG.BYPASS_TAMPER_DETECTION && !PROCTORING_CONFIG.FORCE_TAMPER_DETECTION;
};
