import { Flex, Segmented, Space, Typography } from 'antd';
import React from 'react';
import { useThemeToken } from '../../../theme/ThemeProvider';

const { Title, Text } = Typography;

interface DashboardHeaderProps {
	timePeriod: 'week' | 'month' | 'year';
	onTimePeriodChange: (value: 'week' | 'month' | 'year') => void;
}

/**
 * Dashboard Header Component
 * Contains title and time period filter
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
	timePeriod,
	onTimePeriodChange,
}) => {
	const { token } = useThemeToken();

	return (
		<Flex justify="space-between" align="center" wrap="wrap" gap={token.marginMD}>
			<Space direction="vertical" size={4}>
				<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
					Dashboard
				</Title>
				<Text type="secondary" style={{ fontSize: 14 }}>
					Tổng quan hệ thống đánh giá
				</Text>
			</Space>
			<Segmented
				options={[
					{ label: 'Tuần này', value: 'week' },
					{ label: 'Tháng này', value: 'month' },
					{ label: 'Năm nay', value: 'year' },
				]}
				value={timePeriod}
				onChange={onTimePeriodChange}
				style={{ borderRadius: 8 }}
			/>
		</Flex>
	);
};
