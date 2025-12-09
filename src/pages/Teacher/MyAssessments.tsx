import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	FileTextOutlined,
	PlusOutlined,
	SearchOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input, Modal, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api';
import teacherService from '../../services/teacherService';
import type { Assessment, AssessmentStatus } from '../../types';

const { Title, Text } = Typography;
const { confirm } = Modal;

const MyAssessments: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState<string | undefined>();

	// Fetch assessments
	const { data, isLoading } = useQuery({
		queryKey: ['my-assessments', currentPage, pageSize, searchText, statusFilter],
		queryFn: () =>
			teacherService.getMyAssessments({
				page: currentPage,
				size: pageSize,
				search: searchText,
				status: statusFilter,
			}),
	});

	// Delete mutation
	const deleteMutation = useMutation({
		mutationFn: (id: number) => apiService.delete(`/api/v1/assessments/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['my-assessments'] });
		},
	});

	const handleDelete = (id: number, title: string) => {
		confirm({
			title: t('myAssessments.deleteConfirm.title'),
			content: t('myAssessments.deleteConfirm.content', { title }),
			okText: t('common.delete'),
			okType: 'danger',
			cancelText: t('common.cancel'),
			onOk: () => deleteMutation.mutate(id),
		});
	};

	const columns = [
		{
			title: t('myAssessments.columns.title'),
			dataIndex: 'title',
			key: 'title',
			render: (title: string, record: Assessment) => (
				<Space direction="vertical" size={0}>
					<Text strong>{title}</Text>
					{record.description && (
						<Text type="secondary" style={{ fontSize: 12 }}>
							{record.description.substring(0, 80)}
							{record.description.length > 80 ? '...' : ''}
						</Text>
					)}
				</Space>
			),
		},
		{
			title: t('myAssessments.columns.status'),
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: AssessmentStatus) => {
				const statusMap: Record<
					string,
					{ color: string; text: string; icon: React.ReactNode }
				> = {
					Draft: {
						color: 'default',
						text: t('myAssessments.status.draft'),
						icon: <EditOutlined />,
					},
					Active: {
						color: 'success',
						text: t('myAssessments.status.active'),
						icon: <CheckCircleOutlined />,
					},
					Expired: {
						color: 'warning',
						text: t('myAssessments.status.expired'),
						icon: <ClockCircleOutlined />,
					},
					Archived: {
						color: 'default',
						text: t('myAssessments.status.archived'),
						icon: <FileTextOutlined />,
					},
				};
				const mapped = statusMap[status] || {
					color: 'default',
					text: status,
					icon: null,
				};
				return (
					<Tag color={mapped.color} icon={mapped.icon}>
						{mapped.text}
					</Tag>
				);
			},
		},
		{
			title: t('myAssessments.columns.questions'),
			dataIndex: 'questions_count',
			key: 'questions_count',
			width: 100,
			align: 'center' as const,
			render: (count: number) => <Text>{count || 0}</Text>,
		},
		{
			title: t('myAssessments.columns.duration'),
			dataIndex: 'duration',
			key: 'duration',
			width: 100,
			align: 'center' as const,
			render: (duration: number) => (
				<Text>
					{duration} {t('common.minutes')}
				</Text>
			),
		},
		{
			title: t('myAssessments.columns.passingScore'),
			dataIndex: 'passing_score',
			key: 'passing_score',
			width: 100,
			align: 'center' as const,
			render: (score: number) => <Text>{score}%</Text>,
		},
		{
			title: t('myAssessments.columns.dueDate'),
			dataIndex: 'due_date',
			key: 'due_date',
			width: 150,
			render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'),
		},
		{
			title: t('myAssessments.columns.createdAt'),
			dataIndex: 'created_at',
			key: 'created_at',
			width: 150,
			render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: t('myAssessments.columns.actions'),
			key: 'action',
			width: 200,
			fixed: 'right' as const,
			render: (_: any, record: Assessment) => (
				<Space>
					<Tooltip title={t('common.viewDetails')}>
						<Button
							type="text"
							icon={<EyeOutlined />}
							onClick={() => navigate(`/assessments/${record.id}`)}
						/>
					</Tooltip>
					<Tooltip title={t('common.edit')}>
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() => navigate(`/assessments/edit/${record.id}`)}
						/>
					</Tooltip>
					<Tooltip title={t('myAssessments.viewProgress')}>
						<Button
							type="text"
							icon={<TeamOutlined />}
							onClick={() => navigate(`/teacher/student-progress`)}
						/>
					</Tooltip>
					<Tooltip title={t('common.delete')}>
						<Button
							type="text"
							danger
							icon={<DeleteOutlined />}
							onClick={() => handleDelete(record.id, record.title)}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<div style={{ marginBottom: 16 }}>
				<Title level={2}>{t('myAssessments.title')}</Title>
				<Text type="secondary">{t('myAssessments.description')}</Text>
			</div>

			<Card>
				<Space direction="vertical" style={{ width: '100%' }} size="middle">
					{/* Filters and Actions */}
					<Space
						style={{
							width: '100%',
							justifyContent: 'space-between',
						}}
					>
						<Space>
							<Input
								placeholder={t('myAssessments.searchPlaceholder')}
								prefix={<SearchOutlined />}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								style={{ width: 300 }}
								allowClear
							/>
							<Select
								placeholder={t('myAssessments.filterByStatus')}
								style={{ width: 150 }}
								value={statusFilter}
								onChange={setStatusFilter}
								allowClear
							>
								<Select.Option value="Draft">
									{t('myAssessments.status.draft')}
								</Select.Option>
								<Select.Option value="Active">
									{t('myAssessments.status.active')}
								</Select.Option>
								<Select.Option value="Expired">
									{t('myAssessments.status.expired')}
								</Select.Option>
								<Select.Option value="Archived">
									{t('myAssessments.status.archived')}
								</Select.Option>
							</Select>
						</Space>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => navigate('/assessments/new')}
						>
							{t('myAssessments.createNew')}
						</Button>
					</Space>

					{/* Table */}
					<Table
						columns={columns}
						dataSource={data?.assessments || []}
						rowKey="id"
						loading={isLoading}
						pagination={{
							current: currentPage,
							pageSize: pageSize,
							total: data?.total || 0,
							onChange: (page, size) => {
								setCurrentPage(page);
								setPageSize(size || 10);
							},
							showSizeChanger: true,
							showTotal: (total) =>
								t('myAssessments.totalAssessments', {
									count: total,
								}),
						}}
						scroll={{ x: 1200 }}
						locale={{
							emptyText: t('myAssessments.noAssessments'),
						}}
					/>
				</Space>
			</Card>
		</div>
	);
};

export default MyAssessments;
