import { useState, useCallback } from 'react';
import { shouldBypassTamperDetection } from '../config/proctoring.config';

export interface TamperStatus {
	devTools: boolean;
	consoleOverride: boolean;
	suspiciousExtensions: boolean;
}

export const useBrowserTamperDetection = () => {
	const [tamperStatus, setTamperStatus] = useState<TamperStatus>({
		devTools: false,
		consoleOverride: false,
		suspiciousExtensions: false,
	});

	const isBypassed = shouldBypassTamperDetection();

	const checkDevTools = useCallback((): boolean => {
		if (isBypassed) return false;

		// Method 1: Window size difference
		const widthDiff = window.outerWidth - window.innerWidth;
		const heightDiff = window.outerHeight - window.innerHeight;
		if (widthDiff > 160 || heightDiff > 160) return true;

		// Method 2: Debugger timing
		const start = performance.now();
		// eslint-disable-next-line no-debugger
		debugger;
		const end = performance.now();
		if (end - start > 100) return true;

		return false;
	}, [isBypassed]);

	const checkConsoleOverride = useCallback((): boolean => {
		if (isBypassed) return false;

		try {
			const descriptor = Object.getOwnPropertyDescriptor(window, 'console');
			return descriptor ? !descriptor.writable : false;
		} catch {
			return false;
		}
	}, [isBypassed]);

	const checkSuspiciousExtensions = useCallback((): boolean => {
		if (isBypassed) return false;

		const suspiciousSelectors = [
			'[data-extension]',
			'[class*="extension"]',
			'[id*="extension"]',
		];

		return suspiciousSelectors.some(
			(selector) => document.querySelectorAll(selector).length > 0
		);
	}, [isBypassed]);

	const performCheck = useCallback(() => {
		const status: TamperStatus = {
			devTools: checkDevTools(),
			consoleOverride: checkConsoleOverride(),
			suspiciousExtensions: checkSuspiciousExtensions(),
		};
		setTamperStatus(status);
		return status;
	}, [checkDevTools, checkConsoleOverride, checkSuspiciousExtensions]);

	const hasTampering =
		tamperStatus.devTools || tamperStatus.consoleOverride || tamperStatus.suspiciousExtensions;

	return {
		tamperStatus,
		hasTampering,
		performCheck,
		isBypassed,
	};
};
