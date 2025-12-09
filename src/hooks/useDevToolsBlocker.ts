import { useEffect } from 'react';
import { shouldBypassTamperDetection } from '../config/proctoring.config';

export const useDevToolsBlocker = (enabled: boolean = true) => {
	useEffect(() => {
		if (!enabled || shouldBypassTamperDetection()) return;

		// Disable right-click context menu
		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			return false;
		};

		// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
		const handleKeyDown = (e: KeyboardEvent) => {
			// F12
			if (e.key === 'F12') {
				e.preventDefault();
				return false;
			}

			// Ctrl+Shift+I (Inspect)
			if (e.ctrlKey && e.shiftKey && e.key === 'I') {
				e.preventDefault();
				return false;
			}

			// Ctrl+Shift+J (Console)
			if (e.ctrlKey && e.shiftKey && e.key === 'J') {
				e.preventDefault();
				return false;
			}

			// Ctrl+Shift+C (Inspect Element)
			if (e.ctrlKey && e.shiftKey && e.key === 'C') {
				e.preventDefault();
				return false;
			}

			// Ctrl+U (View Source)
			if (e.ctrlKey && e.key === 'u') {
				e.preventDefault();
				return false;
			}
		};

		document.addEventListener('contextmenu', handleContextMenu);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('contextmenu', handleContextMenu);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [enabled]);
};
