import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	EditOutlined,
	ExclamationCircleOutlined,
	FileTextOutlined,
	RollbackOutlined,
	TrophyOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	App,
	Button,
	Card,
	Col,
	Descriptions,
	Row,
	Space,
	Spin,
	Statistic,
	Tag,
	Typography,
	message,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ManageAssessmentQuestions } from "../../components/Assessment/ManageAssessmentQuestions";
import assessmentService from "../../services/assessmentService";
import { Assessment, AssessmentStats, AssessmentStatus } from "../../types";

const { Title } = Typography;

const AssessmentDetail: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(false);
	const [assessment, setAssessment] = useState<Assessment | null>(null);
	const [stats, setStats] = useState<AssessmentStats | null>(null);
	const { modal } = App.useApp();

	// Detect if we're in student context
	const isStudentContext = location.pathname.startsWith("/student");
	const basePath = isStudentContext
		? "/student/manage-assessments"
		: "/assessments";
	const editPath = isStudentContext
		? `${basePath}/${id}/edit`
		: `/assessments/edit/${id}`;

	useEffect(() => {
		if (id) {
			fetchAssessment(parseInt(id));
			fetchStats(parseInt(id));
		}
	}, [id]);

	const fetchAssessment = async (assessmentId: number) => {
		setLoading(true);
		try {
			const data = await assessmentService.getAssessment(assessmentId);
			setAssessment(data);
		} catch (error) {
			message.error(t("assessmentDetail.loadError"));
			navigate(basePath);
		} finally {
			setLoading(false);
		}
	};

	const fetchStats = async (assessmentId: number) => {
		try {
			const data =
				await assessmentService.getAssessmentStats(assessmentId);
			setStats(data);
		} catch (error) {
			console.error("Failed to fetch stats");
		}
	};

	const getStatusTag = (status: AssessmentStatus) => {
		const statusConfig = {
			[AssessmentStatus.Draft]: {
				color: "default",
				text: t("assessmentDetail.status.draft"),
			},
			[AssessmentStatus.Active]: {
				color: "success",
				text: t("assessmentDetail.status.active"),
			},
			[AssessmentStatus.Expired]: {
				color: "warning",
				text: t("assessmentDetail.status.expired"),
			},
			[AssessmentStatus.Archived]: {
				color: "error",
				text: t("assessmentDetail.status.archived"),
			},
		};
		const config = statusConfig[status];
		return <Tag color={config.color}>{config.text}</Tag>;
	};

	const handlePublish = async () => {
		if (!id || !assessment) return;

		// Validation before publishing
		const hasQuestions = (assessment.questions_count || 0) > 0;
		const totalPoints = assessment.total_points || 0;
		const hasValidPoints = totalPoints === 100;

		// Show warning modal
		modal.confirm({
			title: t("assessmentDetail.publish.title"),
			icon: <ExclamationCircleOutlined />,
			content: (
				<div>
					<p>
						<strong>
							⚠️ {t("assessmentDetail.publish.warning")}:
						</strong>{" "}
						{t("assessmentDetail.publish.warningText")}
					</p>
					<p>{t("assessmentDetail.publish.checkBefore")}:</p>
					<ul style={{ marginLeft: 20 }}>
						<li style={{ color: hasQuestions ? "green" : "red" }}>
							{hasQuestions ? "✓" : "✗"}{" "}
							{t("assessmentDetail.publish.hasQuestions")}
						</li>
						<li
							style={{
								color: hasValidPoints ? "green" : "orange",
							}}
						>
							{hasValidPoints ? "✓" : "⚠"}{" "}
							{t("assessmentDetail.publish.totalPoints", {
								current: totalPoints,
							})}
						</li>
						<li
							style={{
								color: assessment.description
									? "green"
									: "orange",
							}}
						>
							{assessment.description ? "✓" : "⚠"}{" "}
							{t("assessmentDetail.publish.hasDescription")}
						</li>
					</ul>
				</div>
			),
			okText: t("assessmentDetail.publish.confirm"),
			cancelText: t("common.cancel"),
			onOk: async () => {
				if (!hasQuestions) {
					message.error(
						t("assessmentDetail.publish.noQuestionsError"),
					);
					return;
				}

				try {
					await assessmentService.publishAssessment(parseInt(id));
					message.success(t("assessmentDetail.publish.success"));
					fetchAssessment(parseInt(id));
				} catch (error) {
					message.error(t("assessmentDetail.publish.error"));
				}
			},
		});
	};

	const handleArchive = async () => {
		if (!id) return;
		try {
			await assessmentService.archiveAssessment(parseInt(id));
			message.success(t("assessmentDetail.archive.success"));
			fetchAssessment(parseInt(id));
		} catch (error) {
			message.error(t("assessmentDetail.archive.error"));
		}
	};

	if (loading || !assessment) {
		return (
			<div style={{ textAlign: "center", padding: "100px 0" }}>
				<Spin size="large" />
			</div>
		);
	}

	return (
		<Space direction="vertical" size="large" style={{ width: "100%" }}>
			<Row justify="space-between" align="middle">
				<Col>
					<Space>
						<Button
							icon={<RollbackOutlined />}
							onClick={() => navigate(basePath)}
						>
							{t("common.back")}
						</Button>
					</Space>
				</Col>
				<Col>
					<Space>
						{assessment.status === AssessmentStatus.Draft && (
							<Button
								type="primary"
								icon={<CheckCircleOutlined />}
								onClick={handlePublish}
							>
								{t("assessmentDetail.publish.button")}
							</Button>
						)}
						{assessment.status === AssessmentStatus.Active && (
							<Button
								icon={<CloseCircleOutlined />}
								onClick={handleArchive}
							>
								{t("assessmentDetail.archive.button")}
							</Button>
						)}
						<Button
							type="primary"
							icon={<EditOutlined />}
							onClick={() => navigate(editPath)}
						>
							{t("common.edit")}
						</Button>
					</Space>
				</Col>
			</Row>

			<Card>
				<Space
					direction="vertical"
					size="middle"
					style={{ width: "100%" }}
				>
					<div>
						<Title level={2} style={{ marginBottom: 8 }}>
							{assessment.title}
						</Title>
						{getStatusTag(assessment.status)}
					</div>

					{assessment.description && (
						<Typography.Paragraph>
							{assessment.description}
						</Typography.Paragraph>
					)}
				</Space>
			</Card>

			{stats && (
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} lg={6}>
						<Card>
							<Statistic
								title={t(
									"assessmentDetail.stats.totalAttempts",
								)}
								value={stats.total_attempts}
								prefix={<UserOutlined />}
								valueStyle={{ color: "#3f8600" }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Card>
							<Statistic
								title={t("assessmentDetail.stats.averageScore")}
								value={stats.average_score}
								precision={1}
								prefix={<TrophyOutlined />}
								valueStyle={{ color: "#1890ff" }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Card>
							<Statistic
								title={t("assessmentDetail.stats.passRate")}
								value={stats.pass_rate}
								precision={1}
								suffix="%"
								prefix={<CheckCircleOutlined />}
								valueStyle={{ color: "#52c41a" }}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={12} lg={6}>
						<Card>
							<Statistic
								title={t("assessmentDetail.stats.averageTime")}
								value={stats.average_time}
								suffix={t("common.minutes")}
								prefix={<ClockCircleOutlined />}
								valueStyle={{ color: "#722ed1" }}
							/>
						</Card>
					</Col>
				</Row>
			)}

			<Card title={t("assessmentDetail.details.title")}>
				<Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered>
					<Descriptions.Item
						label={t("assessmentDetail.details.duration")}
					>
						{assessment.duration} {t("common.minutes")}
					</Descriptions.Item>
					<Descriptions.Item
						label={t("assessmentDetail.details.passingScore")}
					>
						{assessment.passing_score}%
					</Descriptions.Item>
					<Descriptions.Item
						label={t("assessmentDetail.details.maxAttempts")}
					>
						{assessment.max_attempts}
					</Descriptions.Item>
					<Descriptions.Item
						label={t("assessmentDetail.details.questionsCount")}
					>
						<FileTextOutlined /> {assessment.questions_count || 0}{" "}
						{t("assessmentDetail.details.questionsUnit")}
					</Descriptions.Item>
					<Descriptions.Item
						label={t("assessmentDetail.details.totalPoints")}
					>
						{assessment.total_points || 0}{" "}
						{t("assessmentDetail.details.pointsUnit")}
					</Descriptions.Item>
					<Descriptions.Item
						label={t("assessmentDetail.details.dueDate")}
					>
						{assessment.due_date
							? dayjs(assessment.due_date).format(
									"DD/MM/YYYY HH:mm",
								)
							: t("assessmentDetail.details.noLimit")}
					</Descriptions.Item>
					<Descriptions.Item
						label={t("assessmentDetail.details.createdAt")}
						span={3}
					>
						{dayjs(assessment.created_at).format(
							"DD/MM/YYYY HH:mm",
						)}
					</Descriptions.Item>
				</Descriptions>
			</Card>

			{assessment.settings && (
				<Card title={t("assessmentDetail.settings.title")}>
					<Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered>
						<Descriptions.Item
							label={t(
								"assessmentDetail.settings.randomizeQuestions",
							)}
						>
							{assessment.settings.randomize_questions ? (
								<Tag color="success">{t("common.yes")}</Tag>
							) : (
								<Tag>{t("common.no")}</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t(
								"assessmentDetail.settings.randomizeOptions",
							)}
						>
							{assessment.settings.randomize_options ? (
								<Tag color="success">{t("common.yes")}</Tag>
							) : (
								<Tag>{t("common.no")}</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t(
								"assessmentDetail.settings.showProgressBar",
							)}
						>
							{assessment.settings.show_progress_bar ? (
								<Tag color="success">{t("common.yes")}</Tag>
							) : (
								<Tag>{t("common.no")}</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t(
								"assessmentDetail.settings.timeLimitEnforced",
							)}
						>
							{assessment.settings.time_limit_enforced ? (
								<Tag color="warning">{t("common.yes")}</Tag>
							) : (
								<Tag>{t("common.no")}</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t("assessmentDetail.settings.requireWebcam")}
						>
							{assessment.settings.require_webcam ? (
								<Tag color="warning">{t("common.yes")}</Tag>
							) : (
								<Tag>{t("common.no")}</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t(
								"assessmentDetail.settings.preventTabSwitching",
							)}
						>
							{assessment.settings.prevent_tab_switching ? (
								<Tag color="warning">{t("common.yes")}</Tag>
							) : (
								<Tag>{t("common.no")}</Tag>
							)}
						</Descriptions.Item>
						<Descriptions.Item
							label={t(
								"assessmentDetail.settings.requireFullScreen",
							)}
						>
							{assessment.settings.require_full_screen ? (
								<Tag color="warning">{t("common.yes")}</Tag>
							) : (
								<Tag>{t("common.no")}</Tag>
							)}
						</Descriptions.Item>
					</Descriptions>
				</Card>
			)}

			<ManageAssessmentQuestions
				assessment={assessment}
				questions={assessment.questions}
				onQuestionsChange={() => {
					fetchAssessment(parseInt(id!));
				}}
			/>
		</Space>
	);
};

export default AssessmentDetail;
