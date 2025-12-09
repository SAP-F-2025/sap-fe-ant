import React from "react";
import {
	Card,
	Space,
	Button,
	Typography,
	Row,
	Col,
	Alert,
	Divider,
} from "antd";
import { useTranslation } from "react-i18next";
import {
	TeamOutlined,
	SafetyOutlined,
	UserOutlined,
	ArrowRightOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { CasdoorConfig } from "../../config/casdoor";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

/**
 * User Management Page
 * Redirects admins to Casdoor for user management
 */
const UserManagement: React.FC = () => {
	const { t } = useTranslation();
	const { user } = useAuth();
	const navigate = useNavigate();

	// Create Casdoor users management URL
	const getCasdoorUsersUrl = () => {
		const { serverUrl, organizationName } = CasdoorConfig;
		return `${serverUrl}/users/${organizationName}`;
	};

	const handleManageUsers = () => {
		window.location.href = getCasdoorUsersUrl();
	};

	// If not admin, show access denied
	if (!user?.isAdmin) {
		return (
			<Space direction="vertical" size="large" style={{ width: "100%" }}>
				<Title level={2}>
					<TeamOutlined /> {t("userManagement.title")}
				</Title>

				<Alert
					message={t("userManagement.noAccess")}
					description={t("userManagement.noAccessDesc")}
					type="error"
					showIcon
					action={
						<Button
							size="small"
							onClick={() => navigate("/dashboard")}
						>
							{t("userManagement.backHome")}
						</Button>
					}
				/>
			</Space>
		);
	}

	return (
		<Space direction="vertical" size="large" style={{ width: "100%" }}>
			<div>
				<Title level={2}>
					<TeamOutlined /> {t("userManagement.title")}
				</Title>
				<Text type="secondary">{t("userManagement.subtitle")}</Text>
			</div>

			{/* Main Card */}
			<Card>
				<Space
					direction="vertical"
					size="large"
					style={{ width: "100%" }}
				>
					<div>
						<Title level={4}>
							<SettingOutlined />{" "}
							{t("userManagement.casdoorTitle")}
						</Title>
						<Paragraph>{t("userManagement.casdoorDesc")}</Paragraph>
					</div>

					<Divider />

					{/* Features */}
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={6}>
							<Card size="small" style={{ textAlign: "center" }}>
								<Space direction="vertical" size="small">
									<UserOutlined
										style={{
											fontSize: 32,
											color: "#1890ff",
										}}
									/>
									<Text strong>
										{t("userManagement.createUser")}
									</Text>
									<Text
										type="secondary"
										style={{ fontSize: 12 }}
									>
										{t("userManagement.createUserDesc")}
									</Text>
								</Space>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card size="small" style={{ textAlign: "center" }}>
								<Space direction="vertical" size="small">
									<SafetyOutlined
										style={{
											fontSize: 32,
											color: "#52c41a",
										}}
									/>
									<Text strong>
										{t("userManagement.permissions")}
									</Text>
									<Text
										type="secondary"
										style={{ fontSize: 12 }}
									>
										{t("userManagement.permissionsDesc")}
									</Text>
								</Space>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card size="small" style={{ textAlign: "center" }}>
								<Space direction="vertical" size="small">
									<TeamOutlined
										style={{
											fontSize: 32,
											color: "#faad14",
										}}
									/>
									<Text strong>
										{t("userManagement.manageGroups")}
									</Text>
									<Text
										type="secondary"
										style={{ fontSize: 12 }}
									>
										{t("userManagement.manageGroupsDesc")}
									</Text>
								</Space>
							</Card>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Card size="small" style={{ textAlign: "center" }}>
								<Space direction="vertical" size="small">
									<SettingOutlined
										style={{
											fontSize: 32,
											color: "#722ed1",
										}}
									/>
									<Text strong>
										{t("userManagement.configuration")}
									</Text>
									<Text
										type="secondary"
										style={{ fontSize: 12 }}
									>
										{t("userManagement.configurationDesc")}
									</Text>
								</Space>
							</Card>
						</Col>
					</Row>

					<Divider />

					{/* Action Button */}
					<div style={{ textAlign: "center" }}>
						<Button
							type="primary"
							size="large"
							icon={<ArrowRightOutlined />}
							onClick={handleManageUsers}
						>
							{t("userManagement.openCasdoor")}
						</Button>
						<div style={{ marginTop: 12 }}>
							<Text type="secondary" style={{ fontSize: 12 }}>
								{t("userManagement.redirectNote")}
							</Text>
						</div>
					</div>

					<Alert
						message={t("userManagement.infoTitle")}
						description={t("userManagement.infoDesc")}
						type="info"
						showIcon
					/>
				</Space>
			</Card>
		</Space>
	);
};

export default UserManagement;
