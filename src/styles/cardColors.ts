/**
 * Solid Card Colors - Minimal Design
 * Using Ant Design color palette for consistency
 */

export const cardColors = {
	// Primary colors
	blue: '#1890ff',
	green: '#52c41a',
	cyan: '#13c2c2',
	orange: '#faad14',

	// Secondary colors
	purple: '#722ed1',
	magenta: '#eb2f96',
	red: '#f5222d',
	volcano: '#fa541c',

	// Soft colors
	geekblue: '#2f54eb',
	lime: '#a0d911',
	gold: '#fadb14',
	pink: '#eb2f96',
} as const;

export type CardColor = keyof typeof cardColors;

/**
 * Get card style with solid color
 */
export const getCardStyle = (color: CardColor) => ({
	background: cardColors[color],
	borderRadius: 16,
	border: 'none',
});

/**
 * Get avatar style for card
 */
export const getAvatarStyle = () => ({
	backgroundColor: 'rgba(255, 255, 255, 0.2)',
	border: 'none',
});

/**
 * Get title style for card
 */
export const getTitleStyle = () => ({
	color: 'white',
	margin: 0,
	fontSize: 32,
	fontWeight: 700,
});

/**
 * Get text style for card
 */
export const getTextStyle = () => ({
	color: 'rgba(255, 255, 255, 0.9)',
	fontSize: 13,
	fontWeight: 500,
});
