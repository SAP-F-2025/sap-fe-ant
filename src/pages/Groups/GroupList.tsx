import {
	CrownOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	SearchOutlined,
	TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Avatar,
	Button,
	Card,
	Col,
	Flex,
	Form,
	Input,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import groupService from "../../services/groupService";
import { cardColors } from "../../styles/cardColors";
import { elevation } from "../../styles/elevation";
import {
	GroupCreateRequest,
	GroupMemberRole,
	GroupResponse,
} from "../../types";
import { showError, showSuccess } from "../../utils/errorHandler";

const { Title, Text } = Typography;
const { Search } = Input;

const GroupList: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [groups, setGroups] = useState<GroupResponse[]>([]);
	const [total, setTotal] = useState(0);
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [createLoading, setCreateLoading] = useState(false);
	const [form] = Form.useForm();
	const [filters, setFilters] = useState({
		page: 1,
		size: 10,
		type: undefined as string | undefined,
		search: "",
	});

	// Calculate statistics
	const stats = useMemo(() => {
		return {
			total: total,
			class: groups.filter((g) => g.type === "class").length,
			studyGroup: groups.filter((g) => g.type === "study-group").length,
			other: groups.filter(
				(g) => !["class", "study-group"].includes(g.type),
			).length,
		};
	}, [groups, total]);

	useEffect(() => {
		fetchGroups();
	}, [filters]);

	const fetchGroups = async () => {
		setLoading(true);
		try {
			const response = await groupService.getGroups({
				page: filters.page,
				size: filters.size,
				type: filters.type,
				search: filters.search,
			});
			setGroups(response.groups || []);
			setTotal(response.total);
		} catch (error) {
			showError(t("groups.loadError"));
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await groupService.deleteGroup(id);
			showSuccess(t("groups.deleteSuccess"));
			fetchGroups();
		} catch (error) {
			// Error handled by interceptor
		}
	};

	const handleCreate = async (values: GroupCreateRequest) => {
		setCreateLoading(true);
		try {
			await groupService.createGroup(values);
			showSuccess(t("groups.createSuccess"));
			setCreateModalOpen(false);
			form.resetFields();
			fetchGroups();
		} catch (error) {
			// Error handled by interceptor
		} finally {
			setCreateLoading(false);
		}
	};

	const getRoleBadge = (role?: string) => {
		const roleMap: Record<string, { color: string; label: string }> = {
			[GroupMemberRole.Owner]: {
				color: "gold",
				label: t("groups.role.owner"),
			},
			[GroupMemberRole.CoOwner]: {
				color: "blue",
				label: t("groups.role.coOwner"),
			},
			[GroupMemberRole.Member]: {
				color: "default",
				label: t("groups.role.member"),
			},
		};
		if (!role) return null;
		const config = roleMap[role] || { color: "default", label: role };
		return <Tag color={config.color}>{config.label}</Tag>;
	};

	const getTypeBadge = (type: string) => {
		const typeMap: Record<string, { color: string; label: string }> = {
			class: { color: "purple", label: t("groups.type.class") },
			"study-group": {
				color: "cyan",
				label: t("groups.type.studyGroup"),
			},
		};
		const config = typeMap[type] || { color: "default", label: type };
		return <Tag color={config.color}>{config.label}</Tag>;
	};

	const columns: ColumnsType<GroupResponse> = [
		{
			title: t("groups.columns.name"),
			dataIndex: "display_name",
			key: "display_name",
			width: 280,
			render: (text, record) => (
				<Space direction="vertical" size={0}>
					<Typography.Link
						strong
						onClick={() => navigate(`/groups/${record.id}`)}
					>
						{text || record.name}
					</Typography.Link>
					{record.description && (
						<Typography.Text
							type="secondary"
							style={{ fontSize: 12 }}
						>
							{record.description.length > 60
								? `${record.description.substring(0, 60)}...`
								: record.description}
						</Typography.Text>
					)}
				</Space>
			),
		},
		{
			title: t("groups.columns.type"),
			dataIndex: "type",
			key: "type",
			width: 120,
			render: (type) => getTypeBadge(type),
		},
		{
			title: t("groups.columns.memberCount"),
			dataIndex: "member_count",
			key: "member_count",
			width: 120,
			render: (count) => (
				<Space>
					<TeamOutlined />
					<Text>{count || 0}</Text>
				</Space>
			),
		},
		{
			title: t("groups.columns.role"),
			dataIndex: "member_role",
			key: "member_role",
			width: 140,
			render: (role) =>
				getRoleBadge(role) || <Text type="secondary">—</Text>,
		},
		{
			title: t("groups.columns.createdAt"),
			dataIndex: "created_at",
			key: "created_at",
			width: 150,
			render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
		},
		{
			title: t("groups.columns.actions"),
			key: "action",
			fixed: "right",
			width: 160,
			render: (_, record) => (
				<Space size="small" style={{ display: "flex" }}>
					<Tooltip title={t("groups.tooltip.view")}>
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() => navigate(`/groups/${record.id}`)}
						/>
					</Tooltip>
					{record.can_edit && (
						<Tooltip title={t("groups.tooltip.edit")}>
							<Button
								type="text"
								icon={<EditOutlined />}
								onClick={() =>
									navigate(`/groups/${record.id}/edit`)
								}
							/>
						</Tooltip>
					)}
					{record.can_delete && (
						<Popconfirm
							title={t("groups.deleteConfirm.title")}
							description={t("groups.deleteConfirm.content", {
								name: record.display_name || record.name,
							})}
							onConfirm={() => handleDelete(record.id)}
							okText={t("groups.deleteConfirm.okText")}
							cancelText={t("groups.deleteConfirm.cancelText")}
							okButtonProps={{ danger: true }}
						>
							<Tooltip title={t("groups.tooltip.delete")}>
								<Button
									type="text"
									danger
									icon={<DeleteOutlined />}
								/>
							</Tooltip>
						</Popconfirm>
					)}
				</Space>
			),
		},
	];

	return (
		<Space direction="vertical" size="large" style={{ width: "100%" }}>
			<Flex justify="space-between" align="center">
				<Space direction="vertical" size={4}>
					<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
						<TeamOutlined style={{ marginRight: 8 }} />{" "}
						{t("groups.title")}
					</Title>
					<Text type="secondary" style={{ fontSize: 14 }}>
						{t("groups.subtitle")}
					</Text>
				</Space>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					size="large"
					onClick={() => setCreateModalOpen(true)}
					style={{
						fontWeight: 500,
						height: 44,
						borderRadius: 10,
						paddingLeft: 24,
						paddingRight: 24,
					}}
				>
					{t("groups.createGroup")}
				</Button>
			</Flex>

			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				<Space
					direction="vertical"
					size="middle"
					style={{ width: "100%" }}
				>
					<Row gutter={16}>
						<Col flex="auto">
							<Search
								placeholder={t("groups.search.placeholder")}
								allowClear
								enterButton={<SearchOutlined />}
								size="large"
								onSearch={(value) =>
									setFilters({
										...filters,
										search: value,
										page: 1,
									})
								}
							/>
						</Col>
						<Col>
							<Select
								placeholder={t("groups.form.type")}
								style={{ width: 160 }}
								size="large"
								allowClear
								onChange={(value) =>
									setFilters({
										...filters,
										type: value,
										page: 1,
									})
								}
								options={[
									{
										label: t("groups.type.class"),
										value: "class",
									},
									{
										label: t("groups.type.studyGroup"),
										value: "study-group",
									},
								]}
							/>
						</Col>
					</Row>

					<Table
						columns={columns}
						dataSource={groups}
						rowKey="id"
						loading={loading}
						scroll={{ x: 1000 }}
						pagination={{
							current: filters.page,
							pageSize: filters.size,
							total: total,
							showSizeChanger: true,
							showTotal: (total) =>
								t("groups.pagination.total", { count: total }),
							onChange: (page, size) =>
								setFilters({ ...filters, page, size }),
						}}
					/>
				</Space>
			</Card>

			{/* Statistics Summary */}
			<Card
				bordered={false}
				style={{
					...elevation[1],
					borderRadius: 16,
					background: "#f5f5f5",
				}}
			>
				<Space direction="vertical" size={8} style={{ width: "100%" }}>
					<Text
						type="secondary"
						style={{ fontSize: 13, fontWeight: 500 }}
					>
						{t("groups.statistics.title")}
					</Text>
					<Row gutter={[12, 12]}>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={
										<TeamOutlined
											style={{ fontSize: 16 }}
										/>
									}
									style={{
										backgroundColor: cardColors.blue,
										flexShrink: 0,
									}}
								/>
								<Space direction="vertical" size={0}>
									<Text
										style={{
											fontSize: 20,
											fontWeight: 700,
											lineHeight: 1.2,
										}}
									>
										{stats.total}
									</Text>
									<Text
										type="secondary"
										style={{ fontSize: 12 }}
									>
										{t("groups.stats.totalGroups")}
									</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={
										<CrownOutlined
											style={{ fontSize: 16 }}
										/>
									}
									style={{
										backgroundColor: cardColors.purple,
										flexShrink: 0,
									}}
								/>
								<Space direction="vertical" size={0}>
									<Text
										style={{
											fontSize: 20,
											fontWeight: 700,
											lineHeight: 1.2,
										}}
									>
										{stats.class}
									</Text>
									<Text
										type="secondary"
										style={{ fontSize: 12 }}
									>
										{t("groups.stats.classGroups")}
									</Text>
								</Space>
							</Flex>
						</Col>
						<Col xs={12} sm={6}>
							<Flex align="center" gap={8}>
								<Avatar
									size={36}
									icon={
										<UserOutlined
											style={{ fontSize: 16 }}
										/>
									}
									style={{
										backgroundColor: cardColors.cyan,
										flexShrink: 0,
									}}
								/>
								<Space direction="vertical" size={0}>
									<Text
										style={{
											fontSize: 20,
											fontWeight: 700,
											lineHeight: 1.2,
										}}
									>
										{stats.studyGroup}
									</Text>
									<Text
										type="secondary"
										style={{ fontSize: 12 }}
									>
										{t("groups.stats.studyGroups")}
									</Text>
								</Space>
							</Flex>
						</Col>
					</Row>
				</Space>
			</Card>

			{/* Create Group Modal */}
			<Modal
				title={t("groups.createModal.title")}
				open={createModalOpen}
				onCancel={() => {
					setCreateModalOpen(false);
					form.resetFields();
				}}
				footer={null}
				destroyOnClose
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleCreate}
					style={{ marginTop: 16 }}
				>
					<Form.Item
						name="name"
						label={t("groups.form.name")}
						rules={[
							{
								required: true,
								message: t("groups.form.nameRequired"),
							},
							{
								pattern: /^[a-z0-9-]+$/,
								message: t("groups.form.namePattern"),
							},
						]}
					>
						<Input placeholder={t("groups.form.namePlaceholder")} />
					</Form.Item>
					<Form.Item
						name="display_name"
						label={t("groups.form.displayName")}
						rules={[
							{
								required: true,
								message: t("groups.form.displayNameRequired"),
							},
						]}
					>
						<Input
							placeholder={t(
								"groups.form.displayNamePlaceholder",
							)}
						/>
					</Form.Item>
					<Form.Item
						name="description"
						label={t("groups.form.description")}
					>
						<Input.TextArea
							rows={3}
							placeholder={t(
								"groups.form.descriptionPlaceholder",
							)}
						/>
					</Form.Item>
					<Form.Item name="type" label={t("groups.form.type")}>
						<Select
							placeholder={t("groups.form.typeRequired")}
							options={[
								{
									label: t("groups.type.class"),
									value: "class",
								},
								{
									label: t("groups.type.studyGroup"),
									value: "study-group",
								},
							]}
						/>
					</Form.Item>
					<Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
						<Space>
							<Button onClick={() => setCreateModalOpen(false)}>
								{t("common.cancel")}
							</Button>
							<Button
								type="primary"
								htmlType="submit"
								loading={createLoading}
							>
								{t("groups.createModal.submitCreate")}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</Space>
	);
};

export default GroupList;
