import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	ExclamationCircleOutlined,
	MinusCircleOutlined,
	SyncOutlined,
} from "@ant-design/icons";
import type { TagProps } from "antd";
import { Tag } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

export type StatusType =
	| "active"
	| "inactive"
	| "draft"
	| "archived"
	| "pending"
	| "completed"
	| "failed"
	| "in-progress";

interface StatusBadgeProps extends Omit<TagProps, "color" | "icon"> {
	status: StatusType;
	showIcon?: boolean;
}

const statusConfig: Record<
	StatusType,
	{ color: string; icon: React.ReactNode; labelKey: string }
> = {
	active: {
		color: "success",
		icon: <CheckCircleOutlined />,
		labelKey: "statusBadge.active",
	},
	inactive: {
		color: "default",
		icon: <MinusCircleOutlined />,
		labelKey: "statusBadge.inactive",
	},
	draft: {
		color: "default",
		icon: <ClockCircleOutlined />,
		labelKey: "statusBadge.draft",
	},
	archived: {
		color: "warning",
		icon: <ExclamationCircleOutlined />,
		labelKey: "statusBadge.archived",
	},
	pending: {
		color: "processing",
		icon: <ClockCircleOutlined />,
		labelKey: "statusBadge.pending",
	},
	completed: {
		color: "success",
		icon: <CheckCircleOutlined />,
		labelKey: "statusBadge.completed",
	},
	failed: {
		color: "error",
		icon: <CloseCircleOutlined />,
		labelKey: "statusBadge.failed",
	},
	"in-progress": {
		color: "processing",
		icon: <SyncOutlined spin />,
		labelKey: "statusBadge.inProgress",
	},
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
	status,
	showIcon = true,
	children,
	...props
}) => {
	const { t } = useTranslation();
	const config = statusConfig[status];

	return (
		<Tag
			color={config.color}
			icon={showIcon ? config.icon : undefined}
			{...props}
		>
			{children || t(config.labelKey)}
		</Tag>
	);
};

export default StatusBadge;
