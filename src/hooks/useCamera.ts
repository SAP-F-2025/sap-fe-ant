import { useEffect, useRef, useState } from "react";

export const useCamera = (enabled: boolean) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isActive, setIsActive] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const streamRef = useRef<MediaStream | null>(null);

	useEffect(() => {
		if (!enabled || !videoRef.current) return;

		let mounted = true;

		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { width: 640, height: 480 },
				});

				if (mounted && videoRef.current) {
					videoRef.current.srcObject = stream;
					streamRef.current = stream;
					setIsActive(true);
					setError(null);
				}
			} catch (err: any) {
				if (mounted) {
					setError(err.message || "Failed to access camera");
					setIsActive(false);
				}
			}
		};

		startCamera();

		return () => {
			mounted = false;
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
			setIsActive(false);
		};
	}, [enabled]);

	return {
		videoRef,
		isActive,
		error,
	};
};
