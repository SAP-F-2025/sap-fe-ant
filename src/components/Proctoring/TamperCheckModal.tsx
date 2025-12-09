import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	WarningOutlined,
} from "@ant-design/icons";
import { Alert, Button, Modal, Space, Typography } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useBrowserTamperDetection } from "../../hooks/useBrowserTamperDetection";

const { Text } = Typography;

interface TamperCheckModalProps {
	open: boolean;
	onPass: () => void;
	onCancel: () => void;
}

export const TamperCheckModal: React.FC<TamperCheckModalProps> = ({
	open,
	onPass,
	onCancel,
}) => {
	const { tamperStatus, hasTampering, performCheck, isBypassed } =
		useBrowserTamperDetection();
	const { t } = useTranslation();

	useEffect(() => {
		if (open) {
			performCheck();
		}
	}, [open, performCheck]);

	const CheckItem = ({
		label,
		passed,
	}: {
		label: string;
		passed: boolean;
	}) => (
		<Space>
			{passed ? (
				<CheckCircleOutlined
					style={{ color: "#52c41a", fontSize: 18 }}
				/>
			) : (
				<CloseCircleOutlined
					style={{ color: "#ff4d4f", fontSize: 18 }}
				/>
			)}
			<Text>{label}</Text>
		</Space>
	);

	return (
		<Modal
			title={t("proctoring.tamperCheck.title")}
			open={open}
			onCancel={onCancel}
			footer={[
				<Button key="cancel" onClick={onCancel}>
					{t("common.cancel")}
				</Button>,
				<Button key="recheck" onClick={performCheck}>
					{t("proctoring.tamperCheck.recheck")}
				</Button>,
				<Button
					key="start"
					type="primary"
					disabled={hasTampering}
					onClick={onPass}
				>
					{t("proctoring.tamperCheck.startExam")}
				</Button>,
			]}
		>
			<Space direction="vertical" style={{ width: "100%" }} size="large">
				{isBypassed && (
					<Alert
						message={t("proctoring.tamperCheck.devMode")}
						description={t(
							"proctoring.tamperCheck.devModeDescription",
						)}
						type="info"
						showIcon
					/>
				)}

				{hasTampering && !isBypassed && (
					<Alert
						message={t("proctoring.tamperCheck.securityIssue")}
						description={t(
							"proctoring.tamperCheck.securityIssueDescription",
						)}
						type="error"
						showIcon
						icon={<WarningOutlined />}
					/>
				)}

				<Space direction="vertical" style={{ width: "100%" }}>
					<CheckItem
						label={t("proctoring.tamperCheck.devToolsClosed")}
						passed={!tamperStatus.devTools}
					/>
					<CheckItem
						label={t("proctoring.tamperCheck.consoleIntact")}
						passed={!tamperStatus.consoleOverride}
					/>
					<CheckItem
						label={t("proctoring.tamperCheck.noExtensions")}
						passed={!tamperStatus.suspiciousExtensions}
					/>
				</Space>

				{!isBypassed && hasTampering && (
					<Alert
						message={t("proctoring.tamperCheck.fixInstructions")}
						description={
							<ul style={{ margin: 0, paddingLeft: 20 }}>
								{tamperStatus.devTools && (
									<li>
										{t(
											"proctoring.tamperCheck.closeDevTools",
										)}
									</li>
								)}
								{tamperStatus.consoleOverride && (
									<li>
										{t("proctoring.tamperCheck.reloadPage")}
									</li>
								)}
								{tamperStatus.suspiciousExtensions && (
									<li>
										{t(
											"proctoring.tamperCheck.disableExtensions",
										)}
									</li>
								)}
							</ul>
						}
						type="warning"
						showIcon
					/>
				)}
			</Space>
		</Modal>
	);
};
