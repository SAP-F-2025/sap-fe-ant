import { useState, useEffect } from 'react';
import studentService from '../../../services/studentService';

export const useExamTimer = (attemptId: number | undefined, onTimeUp: () => void) => {
	const [timeRemaining, setTimeRemaining] = useState<number>(0);
	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		if (!attemptId || !isActive) return;

		const fetchTimeRemaining = async () => {
			try {
				const timeData = await studentService.getTimeRemaining(attemptId);
				const remainingSeconds = timeData.data;

				if (remainingSeconds <= 0) {
					onTimeUp();
					return;
				}

				setTimeRemaining(remainingSeconds);
			} catch (error: any) {
				// Silence 409 errors (attempt already completed)
				if (error?.response?.status !== 409) {
					console.error('Error fetching time remaining:', error);
				}
			}
		};

		fetchTimeRemaining();
		const interval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					onTimeUp();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [attemptId, onTimeUp, isActive]);

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}
		return `${minutes}:${secs.toString().padStart(2, '0')}`;
	};

	const stopTimer = () => setIsActive(false);

	return { timeRemaining, formatTime, stopTimer };
};
