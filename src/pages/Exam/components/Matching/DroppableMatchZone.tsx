import { CloseOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import { Button, Space, Typography } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useThemeToken } from "../../../../theme/ThemeProvider";

const { Text } = Typography;

interface DroppableMatchZoneProps {
	id: string;
	matchedItem: { id: string; text: string; image_url?: string } | null;
	onRemove: () => void;
}

export const DroppableMatchZone: React.FC<DroppableMatchZoneProps> = ({
	id,
	matchedItem,
	onRemove,
}) => {
	const { t } = useTranslation();
	const { isOver, setNodeRef } = useDroppable({ id });
	const { token } = useThemeToken();
	const isDark = document.body.classList.contains("dark-mode");

	return (
		<div
			ref={setNodeRef}
			style={{
				minHeight: "80px",
				border: isOver
					? `2px dashed ${token.colorPrimary}`
					: matchedItem
						? `2px solid ${token.colorSuccess}`
						: `2px dashed ${isDark ? "#434343" : "#d9d9d9"}`,
				borderRadius: "8px",
				padding: "12px",
				marginTop: "8px",
				backgroundColor: isOver
					? isDark
						? "rgba(24, 144, 255, 0.15)"
						: "rgba(24, 144, 255, 0.1)"
					: matchedItem
						? isDark
							? "rgba(82, 196, 26, 0.15)"
							: "rgba(82, 196, 26, 0.1)"
						: "transparent",
				transition: "all 0.3s",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{matchedItem ? (
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						width: "100%",
					}}
				>
					<Space>
						{matchedItem.image_url && (
							<img
								src={matchedItem.image_url}
								alt={matchedItem.text}
								style={{
									maxHeight: "40px",
									borderRadius: "4px",
								}}
							/>
						)}
						<Text>{matchedItem.text}</Text>
					</Space>
					<Button
						type="text"
						size="small"
						icon={<CloseOutlined />}
						onClick={onRemove}
						title={t("common.delete")}
					/>
				</div>
			) : (
				<Text type="secondary" style={{ textAlign: "center" }}>
					{t("exam.questionTypes.matching.dropHere")}
				</Text>
			)}
		</div>
	);
};
