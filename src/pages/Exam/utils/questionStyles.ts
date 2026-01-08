import type { ThemeToken } from '../../../theme/ThemeProvider';

export const getOptionStyle = (
	isSelected: boolean,
	isHovered: boolean,
	token: ThemeToken,
	isDark: boolean
) => {
	if (isSelected) {
		return {
			border: `2px solid ${token.colorPrimary}`,
			backgroundColor: isDark ? 'rgba(24, 144, 255, 0.15)' : '#e6f7ff',
			boxShadow: `0 0 0 2px ${isDark ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)'}`,
		};
	}

	if (isHovered) {
		return {
			border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
			backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
			boxShadow: `0 2px 8px ${isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.08)'}`,
			transform: 'translateY(-2px)',
		};
	}

	return {
		border: `1px solid ${isDark ? '#303030' : '#d9d9d9'}`,
		backgroundColor: isDark ? '#141414' : '#ffffff',
		boxShadow: 'none',
		transform: 'translateY(0)',
	};
};
