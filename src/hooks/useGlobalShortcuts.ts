import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface UseGlobalShortcutsProps {
	onOpenShortcuts: () => void;
	onOpenSettings: () => void;
	onToggleTheme: () => void;
}

export const useGlobalShortcuts = ({
	onOpenShortcuts,
	onOpenSettings,
	onToggleTheme,
}: UseGlobalShortcutsProps) => {
	const location = useLocation();
	const isExamPage = location.pathname.includes("/student/take/");

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl+/ - Open shortcuts (now works everywhere including exam page)
			if (e.ctrlKey && e.key === "/") {
				e.preventDefault();
				onOpenShortcuts();
			}

			// Ctrl+, - Open settings (disabled on exam page)
			if (e.ctrlKey && e.key === "," && !isExamPage) {
				e.preventDefault();
				onOpenSettings();
			}

			// Ctrl+Shift+T - Toggle theme (works everywhere including exam page)
			if (e.ctrlKey && e.shiftKey && e.key === "T") {
				e.preventDefault();
				onToggleTheme();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isExamPage, onOpenShortcuts, onOpenSettings, onToggleTheme]);
};
