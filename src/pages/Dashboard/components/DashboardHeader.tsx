import { Flex, Segmented, Space, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "../../../theme/ThemeProvider";

const { Title, Text } = Typography;

interface DashboardHeaderProps {
	timePeriod: "week" | "month" | "year";
	onTimePeriodChange: (value: "week" | "month" | "year") => void;
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
	const { t } = useTranslation();

	return (
		<Flex
			justify="space-between"
			align="center"
			wrap="wrap"
			gap={token.marginMD}
		>
			<Space direction="vertical" size={4}>
				<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
					{t("dashboard.title")}
				</Title>
				<Text type="secondary" style={{ fontSize: 14 }}>
					{t("dashboard.subtitle")}
				</Text>
			</Space>
			<Segmented
				options={[
					{ label: t("dashboard.thisWeek"), value: "week" },
					{ label: t("dashboard.thisMonth"), value: "month" },
					{ label: t("dashboard.thisYear"), value: "year" },
				]}
				value={timePeriod}
				onChange={onTimePeriodChange}
				style={{ borderRadius: 8 }}
			/>
		</Flex>
	);
};
