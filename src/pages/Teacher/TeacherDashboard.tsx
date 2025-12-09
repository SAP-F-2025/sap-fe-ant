import {
	BookOutlined,
	CheckCircleOutlined,
	EditOutlined,
	FileTextOutlined,
	QuestionCircleOutlined,
	TeamOutlined,
	TrophyOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
	Button,
	Card,
	Col,
	Row,
	Space,
	Statistic,
	Table,
	Tag,
	theme,
	Typography,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import teacherService from "../../services/teacherService";
import type { DashboardStats } from "../../types";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { useToken } = theme;

const TeacherDashboard: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { token } = useToken();

	// Fetch dashboard stats
	const { data: stats, isLoading } = useQuery<DashboardStats>({
		queryKey: ["teacher-dashboard-stats"],
		queryFn: () => teacherService.getDashboardStats(),
	});

	// Get creator stats if user ID is available
	const { data: creatorStats } = useQuery({
		queryKey: ["teacher-creator-stats", user?.id],
		queryFn: () => teacherService.getCreatorStats(user?.id || ""),
		enabled: !!user?.id,
	});

	const recentActivitiesColumns = [
		{
			title: t("teacherDashboard.columns.student"),
			dataIndex: "user_name",
			key: "user_name",
			render: (name: string) => <Text strong>{name}</Text>,
		},
		{
			title: t("teacherDashboard.columns.action"),
			dataIndex: "action",
			key: "action",
			render: (action: string) => {
				const actionMap: Record<
					string,
					{ text: string; color: string }
				> = {
					completed_assessment: {
						text: t("teacherDashboard.actions.completedAssessment"),
						color: "success",
					},
					started_assessment: {
						text: t("teacherDashboard.actions.startedAssessment"),
						color: "processing",
					},
					created_question: {
						text: t("teacherDashboard.actions.createdQuestion"),
						color: "default",
					},
					created_assessment: {
						text: t("teacherDashboard.actions.createdAssessment"),
						color: "default",
					},
					published_assessment: {
						text: t("teacherDashboard.actions.publishedAssessment"),
						color: "success",
					},
				};
				const mapped = actionMap[action] || {
					text: action,
					color: "default",
				};
				return <Tag color={mapped.color}>{mapped.text}</Tag>;
			},
		},
		{
			title: t("teacherDashboard.columns.content"),
			dataIndex: "assessment_title",
			key: "assessment_title",
			render: (title: string) => title || "-",
		},
		{
			title: t("teacherDashboard.columns.score"),
			dataIndex: "score",
			key: "score",
			render: (score: number | undefined) =>
				score !== undefined ? (
					<Text type={score >= 70 ? "success" : "danger"}>
						{score.toFixed(1)}%
					</Text>
				) : (
					"-"
				),
		},
		{
			title: t("teacherDashboard.columns.time"),
			dataIndex: "created_at",
			key: "created_at",
			render: (date: string) => dayjs(date).fromNow(),
		},
	];

	return (
		<div style={{ padding: "24px" }}>
			<Title level={2}>{t("teacherDashboard.title")}</Title>
			<Text type="secondary">
				{t("teacherDashboard.welcome", { name: user?.displayName })}
			</Text>

			{/* Overview Stats */}
			<Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t("teacherDashboard.stats.totalAssessments")}
							value={stats?.overview.total_assessments || 0}
							prefix={<BookOutlined />}
							valueStyle={{ color: token.colorPrimary }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t("teacherDashboard.stats.totalQuestions")}
							value={stats?.overview.total_questions || 0}
							prefix={<QuestionCircleOutlined />}
							valueStyle={{ color: token.colorSuccess }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t("teacherDashboard.stats.questionBanks")}
							value={stats?.overview.total_question_banks || 0}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: token.colorWarning }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic
							title={t("teacherDashboard.stats.totalAttempts")}
							value={stats?.overview.total_attempts || 0}
							prefix={<TeamOutlined />}
						/>
					</Card>
				</Col>
			</Row>

			{/* Performance Metrics */}
			<Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
				<Col xs={24} sm={8}>
					<Card loading={isLoading}>
						<Statistic
							title={t("teacherDashboard.stats.averageScore")}
							value={stats?.metrics.average_score || 0}
							precision={1}
							suffix="%"
							prefix={<TrophyOutlined />}
							valueStyle={{ color: token.colorPrimary }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card loading={isLoading}>
						<Statistic
							title={t("teacherDashboard.stats.completionRate")}
							value={stats?.metrics.completion_rate || 0}
							precision={1}
							suffix="%"
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: token.colorSuccess }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card loading={isLoading}>
						<Statistic
							title={t("teacherDashboard.stats.passRate")}
							value={stats?.metrics.pass_rate || 0}
							precision={1}
							suffix="%"
							prefix={<CheckCircleOutlined />}
							valueStyle={{ color: token.colorSuccess }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Creator Stats */}
			{creatorStats && (
				<Card
					title={t("teacherDashboard.myStats.title")}
					style={{ marginTop: "24px" }}
				>
					<Row gutter={16}>
						<Col span={8}>
							<Statistic
								title={t(
									"teacherDashboard.myStats.myAssessments",
								)}
								value={creatorStats.total_assessments}
								prefix={<BookOutlined />}
							/>
						</Col>
						<Col span={8}>
							<Statistic
								title={t(
									"teacherDashboard.myStats.myQuestions",
								)}
								value={creatorStats.total_questions}
								prefix={<QuestionCircleOutlined />}
							/>
						</Col>
						<Col span={8}>
							<Statistic
								title={t("teacherDashboard.myStats.myBanks")}
								value={creatorStats.total_question_banks}
								prefix={<FileTextOutlined />}
							/>
						</Col>
					</Row>
				</Card>
			)}

			{/* Recent Activities */}
			<Card
				title={t("teacherDashboard.recentActivities")}
				style={{ marginTop: "24px" }}
				loading={isLoading}
			>
				<Table
					columns={recentActivitiesColumns}
					dataSource={stats?.recent_activities || []}
					rowKey="id"
					pagination={false}
					locale={{ emptyText: t("teacherDashboard.noActivities") }}
				/>
			</Card>

			{/* Quick Actions */}
			<Card
				title={t("teacherDashboard.quickActions")}
				style={{ marginTop: "24px" }}
			>
				<Space size="middle" wrap>
					<Button
						type="primary"
						icon={<BookOutlined />}
						onClick={() => navigate("/assessments/new")}
					>
						{t("teacherDashboard.buttons.createAssessment")}
					</Button>
					<Button
						icon={<QuestionCircleOutlined />}
						onClick={() => navigate("/questions/new")}
					>
						{t("teacherDashboard.buttons.createQuestion")}
					</Button>
					<Button
						icon={<FileTextOutlined />}
						onClick={() => navigate("/question-banks/new")}
					>
						{t("teacherDashboard.buttons.createQuestionBank")}
					</Button>
					<Button
						icon={<TeamOutlined />}
						onClick={() => navigate("/teacher/student-progress")}
					>
						{t("teacherDashboard.buttons.viewStudentProgress")}
					</Button>
					<Button
						icon={<EditOutlined />}
						onClick={() => navigate("/grading")}
					>
						{t("teacherDashboard.buttons.grading")}
					</Button>
				</Space>
			</Card>
		</div>
	);
};

export default TeacherDashboard;
