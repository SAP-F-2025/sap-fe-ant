import { CSSProperties } from "react";

/**
 * Elevation system for consistent shadows and depth
 * Based on Material Design elevation levels
 */

export const elevation = {
	0: {
		boxShadow: "none",
	},
	1: {
		boxShadow:
			"0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.02)",
	},
	2: {
		boxShadow:
			"0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)",
	},
	3: {
		boxShadow:
			"0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
	},
	4: {
		boxShadow:
			"0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06)",
	},
	5: {
		boxShadow:
			"0 12px 32px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)",
	},
} as const;

export type ElevationLevel = keyof typeof elevation;

export const getElevation = (level: ElevationLevel): CSSProperties =>
	elevation[level];

// Minimal border style
export const minimalBorder: CSSProperties = {
	border: "1px solid rgba(0, 0, 0, 0.06)",
};

export const minimalBorderBottom: CSSProperties = {
	borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
};
