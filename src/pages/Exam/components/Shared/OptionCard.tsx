import React, { useState } from 'react';
import { Card, Space, Typography } from 'antd';
import { useThemeToken } from '../../../../theme/ThemeProvider';
import { useIsDarkMode } from '../../hooks/useIsDarkMode';
import { getOptionStyle } from '../../utils/questionStyles';

const { Text } = Typography;

interface OptionCardProps {
	isSelected: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

export const OptionCard: React.FC<OptionCardProps> = ({ isSelected, onClick, children }) => {
	const { token } = useThemeToken();
	const isDark = useIsDarkMode();
	const [isHovered, setIsHovered] = useState(false);

	const optionStyle = getOptionStyle(isSelected, isHovered, token, isDark);

	return (
		<Card
			size="small"
			hoverable
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				...optionStyle,
				cursor: 'pointer',
				transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
				width: '100%',
			}}
			bodyStyle={{ padding: '16px' }}
			onClick={onClick}
		>
			{children}
		</Card>
	);
};
