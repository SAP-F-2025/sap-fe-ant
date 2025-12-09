import type { ThemeConfig } from "antd";

/**
 * Design Tokens - Token-first approach
 * All spacing follows 8px scale: 8, 16, 24, 32, 40, 48, 56, 64
 * Colors are semantic and theme-aware
 */

// Spacing scale (8px based)
export const spacing = {
	xs: 8,
	sm: 16,
	md: 24,
	lg: 32,
	xl: 40,
	xxl: 48,
	xxxl: 56,
	xxxxl: 64,
} as const;

// Border radius scale
export const borderRadius = {
	sm: 6,
	md: 12,
	lg: 16,
	xl: 20,
} as const;

// Common theme tokens shared between light and dark
const commonTokens = {
	// Typography
	fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
	fontSize: 14,
	fontSizeHeading1: 32,
	fontSizeHeading2: 24,
	fontSizeHeading3: 20,
	fontSizeHeading4: 16,
	fontSizeHeading5: 14,
	lineHeight: 1.5715,
	lineHeightHeading1: 1.2,
	lineHeightHeading2: 1.3,
	lineHeightHeading3: 1.35,

	// Spacing
	padding: spacing.md,
	paddingXS: spacing.xs,
	paddingSM: spacing.sm,
	paddingLG: spacing.lg,
	paddingXL: spacing.xl,

	margin: spacing.md,
	marginXS: spacing.xs,
	marginSM: spacing.sm,
	marginLG: spacing.lg,
	marginXL: spacing.xl,

	// Border
	borderRadius: borderRadius.md,
	borderRadiusSM: borderRadius.sm,
	borderRadiusLG: borderRadius.lg,
	borderRadiusXS: borderRadius.sm,
	lineWidth: 1,
	lineWidthBold: 1,

	// Layout
	controlHeight: 32,
	controlHeightSM: 24,
	controlHeightLG: 40,

	// Animation
	motionDurationSlow: "0.3s",
	motionDurationMid: "0.2s",
	motionDurationFast: "0.1s",
} as const;

// Light theme configuration
export const lightTheme: ThemeConfig = {
	token: {
		...commonTokens,
		colorPrimary: "#1890ff",
		colorSuccess: "#52c41a",
		colorWarning: "#faad14",
		colorError: "#ff4d4f",
		colorInfo: "#1890ff",
		colorTextBase: "#000000",
		colorBgBase: "#ffffff",
		colorBgContainer: "#ffffff",
		colorBgElevated: "#ffffff",
		colorBgLayout: "#fafafa",
		colorBorder: "#e8e8e8",
		colorBorderSecondary: "#f0f0f0",
		colorSplit: "#f5f5f5",
	},
	components: {
		Layout: {
			headerBg: "#ffffff",
			headerColor: "#000000",
			siderBg: "#ffffff",
			bodyBg: "#fafafa",
			triggerBg: "#f5f5f5",
			triggerColor: "#000000",
			headerHeight: 64,
			headerPadding: "0 24px",
		},
		Button: {
			controlHeight: 32,
			controlHeightLG: 40,
			controlHeightSM: 24,
			fontWeight: 500,
		},
		Menu: {
			itemBg: "transparent",
			itemColor: "rgba(0, 0, 0, 0.65)",
			itemHoverBg: "rgba(24, 144, 255, 0.08)",
			itemHoverColor: "#1890ff",
			itemSelectedBg: "rgba(24, 144, 255, 0.12)",
			itemSelectedColor: "#1890ff",
			itemBorderRadius: 10,
			itemHeight: 44,
		},
		Table: {
			headerBg: "#fafafa",
			headerSortActiveBg: "#f0f0f0",
			headerSortHoverBg: "#f5f5f5",
			rowHoverBg: "#fafafa",
			rowSelectedBg: "#e6f7ff",
			rowSelectedHoverBg: "#bae7ff",
			borderColor: "#f0f0f0",
			headerBorderRadius: 12,
		},
		Card: {
			headerBg: "transparent",
			boxShadowTertiary:
				"0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
			paddingLG: 24,
			borderRadiusLG: 16,
		},
		Tag: {
			defaultBg: "#fafafa",
			defaultColor: "rgba(0, 0, 0, 0.88)",
		},
	},
};

// Dark theme configuration
export const darkTheme: ThemeConfig = {
	token: {
		...commonTokens,
		colorPrimary: "#1890ff",
		colorSuccess: "#52c41a",
		colorWarning: "#faad14",
		colorError: "#ff4d4f",
		colorInfo: "#1890ff",
		colorTextBase: "#ffffff",
		colorBgBase: "#0a0a0a",
		colorBgContainer: "#1a1a1a",
		colorBgElevated: "#2a2a2a",
		colorBgLayout: "#141414",
		colorBorder: "rgba(255, 255, 255, 0.12)",
		colorBorderSecondary: "rgba(255, 255, 255, 0.08)",
		colorSplit: "rgba(255, 255, 255, 0.08)",
	},
	components: {
		Layout: {
			headerBg: "#1a1a1a",
			headerColor: "#ffffff",
			siderBg: "#1a1a1a",
			bodyBg: "#0a0a0a",
			triggerBg: "#2a2a2a",
			triggerColor: "#ffffff",
			headerHeight: 64,
			headerPadding: "0 24px",
		},
		Button: {
			controlHeight: 32,
			controlHeightLG: 40,
			controlHeightSM: 24,
			fontWeight: 500,
		},
		Menu: {
			itemBg: "transparent",
			itemColor: "rgba(255, 255, 255, 0.65)",
			itemHoverBg: "rgba(24, 144, 255, 0.15)",
			itemHoverColor: "#1890ff",
			itemSelectedBg: "rgba(24, 144, 255, 0.2)",
			itemSelectedColor: "#1890ff",
			itemBorderRadius: 10,
			itemHeight: 44,
		},

		Card: {
			headerBg: "transparent",
			boxShadowTertiary:
				"0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 1px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.15)",
			paddingLG: 24,
			borderRadiusLG: 16,
		},
		Tag: {
			defaultBg: "#2a2a2a",
			defaultColor: "rgba(255, 255, 255, 0.85)",
		},
		Table: {
			headerBg: "#1a1a1a",
			headerSortActiveBg: "#2a2a2a",
			headerSortHoverBg: "#2a2a2a",
			rowHoverBg: "#2a2a2a",
			rowSelectedBg: "rgba(24, 144, 255, 0.15)",
			rowSelectedHoverBg: "rgba(24, 144, 255, 0.2)",
			borderColor: "rgba(255, 255, 255, 0.08)",
			headerBorderRadius: 12,
		},
	},
	algorithm: undefined, // Will be set in ThemeProvider
};

// High contrast theme (for accessibility)
export const highContrastTheme: ThemeConfig = {
	token: {
		...commonTokens,
		colorPrimary: "#0050b3",
		colorSuccess: "#389e0d",
		colorWarning: "#d48806",
		colorError: "#cf1322",
		colorInfo: "#0050b3",
		colorTextBase: "#000000",
		colorBgBase: "#ffffff",
		colorBgContainer: "#ffffff",
		colorBgElevated: "#ffffff",
		colorBgLayout: "#f5f5f5",
		colorBorder: "#000000",
		colorBorderSecondary: "#595959",
		colorSplit: "#000000",
		// Increase font weight for better readability
		fontWeightStrong: 700,
	},
	components: {
		Button: {
			// Higher contrast buttons
			colorPrimary: "#000000",
			defaultBorderColor: "#000000",
			defaultColor: "#000000",
		},
		Input: {
			activeBorderColor: "#000000",
			hoverBorderColor: "#000000",
		},
	},
};

// Export theme mode type
export type ThemeMode = "light" | "dark" | "highContrast";

// Theme selector helper
export const getTheme = (mode: ThemeMode): ThemeConfig => {
	switch (mode) {
		case "dark":
			return darkTheme;
		case "highContrast":
			return highContrastTheme;
		case "light":
		default:
			return lightTheme;
	}
};
