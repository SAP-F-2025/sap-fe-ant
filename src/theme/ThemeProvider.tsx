import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { ConfigProvider, theme as antdTheme, App as AntApp } from "antd";
import viVN from "antd/locale/vi_VN";
import { getTheme, ThemeMode } from "./tokens";

/**
 * Theme Context for managing app-wide theme state
 * Persists user preference to localStorage
 */

interface ThemeContextValue {
	mode: ThemeMode;
	setMode: (mode: ThemeMode) => void;
	toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Theme preference key in localStorage
const THEME_STORAGE_KEY = "sap-theme-preference";

interface ThemeProviderProps {
	children: ReactNode;
	defaultMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	children,
	defaultMode = "light",
}) => {
	// Load theme from localStorage or use default
	const [mode, setModeState] = useState<ThemeMode>(() => {
		try {
			const stored = localStorage.getItem(THEME_STORAGE_KEY);
			return (stored as ThemeMode) || defaultMode;
		} catch {
			return defaultMode;
		}
	});

	// Persist theme preference
	useEffect(() => {
		try {
			localStorage.setItem(THEME_STORAGE_KEY, mode);
		} catch (error) {
			console.warn("Failed to save theme preference:", error);
		}
	}, [mode]);

	const setMode = (newMode: ThemeMode) => {
		setModeState(newMode);
	};

	const toggleDark = () => {
		setModeState((prev) => (prev === "dark" ? "light" : "dark"));
	};

	// Get theme config based on mode
	const themeConfig = getTheme(mode);

	// Apply dark algorithm if dark mode
	const algorithm = mode === "dark" ? [antdTheme.darkAlgorithm] : undefined;

	// Add dark-mode class to body
	useEffect(() => {
		if (mode === "dark") {
			document.body.classList.add("dark-mode");
		} else {
			document.body.classList.remove("dark-mode");
		}
	}, [mode]);

	return (
		<ThemeContext.Provider value={{ mode, setMode, toggleDark }}>
			<ConfigProvider
				locale={viVN}
				theme={{
					...themeConfig,
					algorithm,
				}}
			>
				{/* AntApp provides static methods: message, notification, modal */}
				<AntApp>{children}</AntApp>
			</ConfigProvider>
		</ThemeContext.Provider>
	);
};

/**
 * Hook to access theme context
 * @example
 * const { mode, setMode, toggleDark } = useTheme();
 */
export const useTheme = (): ThemeContextValue => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
};

/**
 * Hook to access design tokens
 * @example
 * const { token } = useThemeToken();
 * const padding = token.padding; // 24
 */
export const useThemeToken = () => {
	return antdTheme.useToken();
};
