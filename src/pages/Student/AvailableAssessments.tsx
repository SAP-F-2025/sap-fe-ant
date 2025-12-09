import { Alert, App, Button, Card, Input, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';

import {
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	FileTextOutlined,
	PlayCircleOutlined,
	SearchOutlined,
	TrophyOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { TamperCheckModal } from '../../components/Proctoring/TamperCheckModal';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import type { StudentAssessment } from '../../types';

const { Title, Text } = Typography;

const AvailableAssessments: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const { modal } = App.useApp();
	const { t } = useTranslation();
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const [tamperCheckModal, setTamperCheckModal] = useState(false);
	const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

	const { data, isLoading } = useQuery({
		queryKey: ['student-assessments', page, pageSize, search],
		queryFn: () =>
			studentService.getAvailableAssessments({
				page,
				size: pageSize,
				search: search || undefined,
			}),
	});

	const handleStartAssessment = async (assessment: StudentAssessment) => {
		try {
			if (!user?.id) {
				modal.error({
					title: t('availableAssessments.modals.authError.title'),
					content: t('availableAssessments.modals.authError.content'),
				});
				return;
			}

			// Handle active attempt first (skip canStartAssessment check)
			if (assessment.has_active_attempt) {
				modal.confirm({
					title: t('availableAssessments.modals.continueAttempt.title'),
					icon: <ExclamationCircleOutlined />,
					content: t('availableAssessments.modals.continueAttempt.content'),
					okText: t('availableAssessments.modals.continueAttempt.okText'),
					cancelText: t('availableAssessments.modals.continueAttempt.cancelText'),
					onOk: async () => {
						try {
							const attempt = await studentService.getCurrentAttempt(assessment.id);
							if (attempt) {
								// Check if attempt has expired
								const timeData = await studentService.getTimeRemaining(attempt.id);
								if (timeData.data <= 0) {
									// Auto-submit expired attempt
									modal.warning({
										title: t('availableAssessments.modals.timeout.title'),
										content: t('availableAssessments.modals.timeout.content'),
										onOk: async () => {
											await studentService.submitAttempt({
												attempt_id: attempt.id,
												answers: [],
												end_reason: 'timeout',
											});
											// Refresh the list
											window.location.reload();
										},
									});
								} else {
									navigate(`/student/take/${attempt.id}`);
								}
							}
						} catch (error: any) {
							modal.error({
								title: t('availableAssessments.modals.error.title'),
								content:
									error.message ||
									t('availableAssessments.modals.error.cannotContinue'),
							});
						}
					},
				});
				return;
			}

			// Check if student can start a new attempt
			const canStartResult = await studentService.canStartAssessment(assessment.id);
			if (!canStartResult.can_start) {
				modal.error({
					title: t('availableAssessments.modals.cannotStart.title'),
					content:
						canStartResult.message ||
						t('availableAssessments.modals.cannotStart.defaultContent'),
				});
				return;
			}

			// Fetch full assessment details
			const assessmentDetail = await studentService.getAssessmentDetail(assessment.id);

			// Preserve the original assessment data and merge with details
			const fullAssessment = { ...assessment, ...assessmentDetail };
			// console.log('Assessment Settings:', assessmentDetail);
			// console.log('Assessment:', assessment);
			const requireWebcam = assessment.settings?.require_webcam;
			if (requireWebcam) {
				navigate('/student/face-verification', {
					state: { assessment: fullAssessment },
				});
			} else {
				showStartConfirmation(fullAssessment);
			}
		} catch (error: any) {
			modal.error({
				title: t('availableAssessments.modals.error.title'),
				content: error.message || t('availableAssessments.modals.error.defaultContent'),
			});
		}
	};

	const showStartConfirmation = (assessment: any) => {
		setSelectedAssessment(assessment);
		setTamperCheckModal(true);
	};

	const handleTamperCheckPass = () => {
		setTamperCheckModal(false);
		if (!selectedAssessment) return;

		modal.confirm({
			title: t('availableAssessments.modals.startAssessment.title'),
			icon: <PlayCircleOutlined />,
			content: (
				<div>
					<p>
						<strong>{selectedAssessment.title}</strong>
					</p>
					<p>
						{t('availableAssessments.modals.startAssessment.duration', {
							duration: selectedAssessment.duration,
						})}
					</p>
					<p>
						{t('availableAssessments.modals.startAssessment.attempts', {
							used: selectedAssessment.attempts_used,
							max: selectedAssessment.max_attempts,
						})}
					</p>
					<p>
						{t('availableAssessments.modals.startAssessment.passingScore', {
							score: selectedAssessment.passing_score,
						})}
					</p>
					<Alert
						message={t('availableAssessments.modals.startAssessment.warning')}
						type="warning"
						showIcon
						style={{ marginTop: 16 }}
					/>
				</div>
			),
			okText: t('availableAssessments.modals.startAssessment.okText'),
			cancelText: t('availableAssessments.modals.startAssessment.cancelText'),
			onOk: async () => {
				try {
					const attempt = await studentService.startAttempt({
						assessment_id: selectedAssessment.id,
						student_id: user?.id || '',
					});
					navigate(`/student/take/${attempt.id}`);
				} catch (error: any) {
					modal.error({
						title: t('availableAssessments.modals.error.title'),
						content:
							error.response?.data?.message ||
							error.message ||
							t('availableAssessments.modals.error.cannotStart'),
					});
				}
			},
		});
	};

	const columns = [
		{
			title: t('availableAssessments.columns.title'),
			dataIndex: 'title',
			key: 'title',
			render: (title: string, record: StudentAssessment) => (
				<div>
					<Text strong>{title}</Text>
					{record.description ? (
						<div>
							<Text type="secondary" style={{ fontSize: '12px' }}>
								{record.description}
							</Text>
						</div>
					) : null}
				</div>
			),
		},
		{
			title: t('availableAssessments.columns.duration'),
			dataIndex: 'duration',
			key: 'duration',
			width: 120,
			render: (duration: number) => (
				<Space>
					<ClockCircleOutlined />
					<Text>{t('availableAssessments.minutes', { count: duration })}</Text>
				</Space>
			),
		},
		{
			title: t('availableAssessments.columns.questions'),
			dataIndex: 'questions_count',
			key: 'questions_count',
			width: 120,
			render: (count: number) => (
				<Space>
					<FileTextOutlined />
					<Text>{count || 0}</Text>
				</Space>
			),
		},
		{
			title: t('availableAssessments.columns.passingScore'),
			dataIndex: 'passing_score',
			key: 'passing_score',
			width: 130,
			render: (score: number) => (
				<Space>
					<TrophyOutlined />
					<Text>{score}%</Text>
				</Space>
			),
		},
		{
			title: t('availableAssessments.columns.attempts'),
			key: 'attempts',
			width: 120,
			render: (_: any, record: StudentAssessment) => (
				<Tag color={record.attempts_used >= record.max_attempts ? 'red' : 'blue'}>
					{record.attempts_used} / {record.max_attempts}
				</Tag>
			),
		},
		{
			title: t('availableAssessments.columns.bestScore'),
			dataIndex: 'best_score',
			key: 'best_score',
			width: 120,
			render: (score: number | null | undefined) =>
				score != null ? (
					<Text type={score >= 70 ? 'success' : 'danger'}>{score.toFixed(1)}%</Text>
				) : (
					<Text type="secondary">-</Text>
				),
		},
		{
			title: t('availableAssessments.columns.dueDate'),
			dataIndex: 'due_date',
			key: 'due_date',
			width: 180,
			render: (date: string | undefined) => {
				if (!date)
					return <Text type="secondary">{t('availableAssessments.noDueDate')}</Text>;
				const dueDate = dayjs(date);
				const isOverdue = dueDate.isBefore(dayjs());
				const isUrgent = dueDate.diff(dayjs(), 'day') <= 3;

				return (
					<Tag color={isOverdue ? 'red' : isUrgent ? 'orange' : 'default'}>
						{dueDate.format('DD/MM/YYYY')}
					</Tag>
				);
			},
		},
		{
			title: t('availableAssessments.columns.status'),
			key: 'status',
			width: 130,
			render: (_: any, record: StudentAssessment) => {
				if (record.has_active_attempt) {
					return (
						<Tag color="processing">{t('availableAssessments.status.inProgress')}</Tag>
					);
				}
				if (!record.can_start) {
					return <Tag color="error">{t('availableAssessments.status.unavailable')}</Tag>;
				}
				return <Tag color="success">{t('availableAssessments.status.ready')}</Tag>;
			},
		},
		{
			title: t('availableAssessments.columns.action'),
			key: 'action',
			width: 120,
			fixed: 'right' as const,
			render: (_: any, record: StudentAssessment) => (
				<Space>
					{record.has_active_attempt ? (
						<Button
							type="primary"
							size="small"
							icon={<PlayCircleOutlined />}
							onClick={() => handleStartAssessment(record)}
						>
							{t('availableAssessments.continue')}
						</Button>
					) : (
						<Button
							type="primary"
							size="small"
							icon={<PlayCircleOutlined />}
							disabled={!record.can_start}
							onClick={() => handleStartAssessment(record)}
						>
							{t('availableAssessments.start')}
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<>
			<TamperCheckModal
				open={tamperCheckModal}
				onPass={handleTamperCheckPass}
				onCancel={() => setTamperCheckModal(false)}
			/>
			<div style={{ padding: '24px' }}>
				<div style={{ marginBottom: '24px' }}>
					<Title level={2}>{t('availableAssessments.title')}</Title>
					<Text type="secondary">{t('availableAssessments.subtitle')}</Text>
				</div>

				<Card>
					<Space direction="vertical" size="large" style={{ width: '100%' }}>
						{/* Search */}
						<Input
							placeholder={t('availableAssessments.searchPlaceholder')}
							prefix={<SearchOutlined />}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							style={{ maxWidth: 400 }}
							allowClear
						/>

						{/* Table */}
						<Table
							columns={columns}
							dataSource={data?.data || []}
							rowKey="id"
							loading={isLoading}
							pagination={{
								current: page,
								pageSize: pageSize,
								total: data?.total || 0,
								showSizeChanger: true,
								showTotal: (total) =>
									t('availableAssessments.totalAssessments', {
										count: total,
									}),
								onChange: (page, pageSize) => {
									setPage(page);
									setPageSize(pageSize);
								},
							}}
							scroll={{ x: 1200 }}
						/>
					</Space>
				</Card>
			</div>
		</>
	);
};

export default AvailableAssessments;
