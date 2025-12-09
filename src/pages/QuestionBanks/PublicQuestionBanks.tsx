import {
	EyeOutlined,
	GlobalOutlined,
	RollbackOutlined,
	SearchOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Badge,
	Button,
	Card,
	Col,
	Input,
	message,
	Row,
	Space,
	Table,
	Tooltip,
	Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import questionBankService from "../../services/questionBankService";
import { elevation } from "../../styles/elevation";
import { QuestionBank } from "../../types";

const { Title, Text } = Typography;
const { Search } = Input;

const PublicQuestionBanks: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
	const [total, setTotal] = useState(0);
	const [filters, setFilters] = useState({
		page: 1,
		size: 10,
		search: "",
	});

	useEffect(() => {
		fetchPublicQuestionBanks();
	}, [filters]);

	const fetchPublicQuestionBanks = async () => {
		setLoading(true);
		try {
			const response =
				await questionBankService.getPublicQuestionBanks(filters);
			setQuestionBanks(response.banks);
			setTotal(response.total);
		} catch (error) {
			message.error(t("publicQuestionBanks.loadError"));
		} finally {
			setLoading(false);
		}
	};

	const columns: ColumnsType<QuestionBank> = [
		{
			title: t("publicQuestionBanks.columns.bankName"),
			dataIndex: "name",
			key: "name",
			width: 300,
			render: (text, record) => (
				<Space direction="vertical" size={0}>
					<Space>
						<Typography.Text strong>{text}</Typography.Text>
						<Tooltip title={t("publicQuestionBanks.public")}>
							<GlobalOutlined style={{ color: "#52c41a" }} />
						</Tooltip>
					</Space>
					{record.description && (
						<Typography.Text
							type="secondary"
							style={{ fontSize: 12 }}
						>
							{record.description.length > 80
								? `${record.description.substring(0, 80)}...`
								: record.description}
						</Typography.Text>
					)}
				</Space>
			),
		},
		{
			title: t("publicQuestionBanks.columns.questionCount"),
			dataIndex: "question_count",
			key: "question_count",
			width: 120,
			align: "center",
			render: (count) => (
				<Badge
					count={count || 0}
					showZero
					color="#1890ff"
					style={{ fontSize: 14 }}
				/>
			),
		},
		{
			title: t("publicQuestionBanks.columns.creator"),
			key: "creator",
			width: 150,
			render: (_, record: any) => (
				<Space>
					<UserOutlined />
					<Text>{record.creator?.full_name || "N/A"}</Text>
				</Space>
			),
		},
		{
			title: t("publicQuestionBanks.columns.createdAt"),
			dataIndex: "created_at",
			key: "created_at",
			width: 150,
			render: (date) => dayjs(date).format("DD/MM/YYYY"),
		},
		{
			title: t("publicQuestionBanks.columns.actions"),
			key: "action",
			fixed: "right",
			width: 100,
			render: (_, record) => (
				<Space size="small">
					<Tooltip title={t("publicQuestionBanks.viewDetail")}>
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() =>
								navigate(`/question-banks/${record.id}`)
							}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<Space direction="vertical" size="large" style={{ width: "100%" }}>
			<Row justify="space-between" align="middle">
				<Col>
					<Space direction="vertical" size={4}>
						<Title level={2} style={{ margin: 0, fontWeight: 600 }}>
							<GlobalOutlined style={{ marginRight: 8 }} />{" "}
							{t("publicQuestionBanks.title")}
						</Title>
						<Text type="secondary" style={{ fontSize: 14 }}>
							{t("publicQuestionBanks.subtitle")}
						</Text>
					</Space>
				</Col>
				<Col>
					<Button
						icon={<RollbackOutlined />}
						onClick={() => navigate("/question-banks")}
					>
						{t("publicQuestionBanks.back")}
					</Button>
				</Col>
			</Row>

			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				<Space
					direction="vertical"
					size="middle"
					style={{ width: "100%" }}
				>
					<Search
						placeholder={t("publicQuestionBanks.searchPlaceholder")}
						allowClear
						enterButton={<SearchOutlined />}
						size="large"
						onSearch={(value) =>
							setFilters({ ...filters, search: value, page: 1 })
						}
					/>

					<Table
						columns={columns}
						dataSource={questionBanks}
						rowKey="id"
						loading={loading}
						scroll={{ x: 1000 }}
						pagination={{
							current: filters.page,
							pageSize: filters.size,
							total: total,
							showSizeChanger: true,
							showTotal: (total) =>
								t("publicQuestionBanks.showTotal", { total }),
							onChange: (page, size) =>
								setFilters({ ...filters, page, size }),
						}}
					/>
				</Space>
			</Card>
		</Space>
	);
};

export default PublicQuestionBanks;
