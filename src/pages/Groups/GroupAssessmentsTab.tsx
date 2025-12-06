import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Space,
    Typography,
    Tag,
    Popconfirm,
    Tooltip,
    Modal,
    Select,
    Spin,
    Empty,
    Flex,
    Avatar,
    Statistic,
    Row,
    Col,
    Progress,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { GroupAssessmentItem, GroupAssessmentListResponse, Assessment, AssessmentStatus } from '../../types';
import groupService from '../../services/groupService';
import assessmentService from '../../services/assessmentService';
import { showError, showSuccess } from '../../utils/errorHandler';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

interface GroupAssessmentsTabProps {
    groupId: number;
    canManage: boolean;
}

const GroupAssessmentsTab: React.FC<GroupAssessmentsTabProps> = ({ groupId, canManage }) => {
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState<GroupAssessmentItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Assign modal
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [availableAssessments, setAvailableAssessments] = useState<Assessment[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedAssessmentIds, setSelectedAssessmentIds] = useState<number[]>([]);

    useEffect(() => {
        if (groupId) {
            fetchAssessments();
        }
    }, [groupId]);

    const fetchAssessments = async () => {
        setLoading(true);
        try {
            const response = await groupService.getGroupAssessments(groupId);
            setAssessments(response.assessments || []);
            setTotalCount(response.total_count || 0);
        } catch (error) {
            showError('Không thể tải danh sách bài thi');
            setAssessments([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchAssessments = async (search: string) => {
        if (search.length < 2) return;
        setSearchLoading(true);
        try {
            const response = await assessmentService.getAssessments({ search, size: 20 });
            // Filter out already assigned assessments
            const assignedIds = assessments.map(a => a.id);
            setAvailableAssessments(
                (response.assessments || []).filter(a => !assignedIds.includes(a.id))
            );
        } catch (error) {
            // ignore
        } finally {
            setSearchLoading(false);
        }
    };

    const handleAssign = async () => {
        if (selectedAssessmentIds.length === 0) return;
        setAssignLoading(true);
        try {
            // Assign each assessment to this group
            await Promise.all(
                selectedAssessmentIds.map(assessmentId =>
                    groupService.assignAssessmentToGroups(assessmentId, [groupId])
                )
            );
            showSuccess('Đã gán bài thi cho nhóm');
            setAssignModalOpen(false);
            setSelectedAssessmentIds([]);
            setAvailableAssessments([]);
            fetchAssessments();
        } catch (error) {
            // handled by interceptor
        } finally {
            setAssignLoading(false);
        }
    };

    const handleUnassign = async (assessmentId: number) => {
        try {
            await groupService.unassignAssessmentFromGroups(assessmentId, [groupId]);
            showSuccess('Đã hủy gán bài thi');
            fetchAssessments();
        } catch (error) {
            // handled by interceptor
        }
    };

    const getStatusConfig = (status: AssessmentStatus) => {
        const config: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
            [AssessmentStatus.Draft]: { color: 'default', label: 'Nháp', icon: <EditOutlined /> },
            [AssessmentStatus.Active]: { color: 'success', label: 'Đang mở', icon: <PlayCircleOutlined /> },
            [AssessmentStatus.Expired]: { color: 'warning', label: 'Hết hạn', icon: <ClockCircleOutlined /> },
            [AssessmentStatus.Archived]: { color: 'error', label: 'Lưu trữ', icon: <DeleteOutlined /> },
        };
        return config[status] || { color: 'default', label: status, icon: null };
    };

    const getStatusTag = (status: AssessmentStatus) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color} icon={config.icon}>{config.label}</Tag>;
    };

    const columns: ColumnsType<GroupAssessmentItem> = [
        {
            title: 'Bài thi',
            key: 'assessment',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Flex align="center" gap={8}>
                        <Avatar
                            size="small"
                            icon={<FileTextOutlined />}
                            style={{
                                backgroundColor: record.is_expired ? '#ff4d4f' : '#1890ff',
                            }}
                        />
                        <Text
                            strong
                            style={{
                                cursor: 'pointer',
                                color: '#1890ff',
                            }}
                            onClick={() => navigate(`/assessments/${record.id}`)}
                        >
                            {record.title}
                        </Text>
                        {record.is_expired && <Tag color="error" style={{ marginLeft: 4 }}>Hết hạn</Tag>}
                    </Flex>
                    {record.description && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.description.length > 80
                                ? `${record.description.substring(0, 80)}...`
                                : record.description}
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 130,
            render: (_, record) => getStatusTag(record.status),
        },
        {
            title: 'Câu hỏi',
            key: 'questions',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Tooltip title={`${record.total_points} điểm tổng`}>
                    <Space>
                        <Text strong>{record.questions_count}</Text>
                        <Text type="secondary">câu</Text>
                    </Space>
                </Tooltip>
            ),
        },
        {
            title: 'Thời lượng',
            key: 'duration',
            width: 110,
            render: (_, record) => (
                <Space>
                    <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                    <Text>{record.duration} phút</Text>
                </Space>
            ),
        },
        {
            title: 'Điểm đạt',
            key: 'passing_score',
            width: 100,
            render: (_, record) => (
                <Progress
                    percent={record.passing_score}
                    size="small"
                    format={(p) => `${p}%`}
                    strokeColor={record.passing_score >= 70 ? '#52c41a' : '#faad14'}
                />
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (_, record) => (
                <Space>
                    {record.can_take && (
                        <Tooltip title="Làm bài">
                            <Button
                                type="primary"
                                size="small"
                                icon={<PlayCircleOutlined />}
                                onClick={() => navigate(`/student/take/${record.id}`)}
                            />
                        </Tooltip>
                    )}
                    {record.can_edit && (
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => navigate(`/assessments/${record.id}/edit`)}
                            />
                        </Tooltip>
                    )}
                    {canManage && (
                        <Popconfirm
                            title="Hủy gán bài thi?"
                            description="Thành viên nhóm sẽ không còn truy cập được bài thi này"
                            onConfirm={() => handleUnassign(record.id)}
                            okText="Hủy gán"
                            cancelText="Không"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Hủy gán">
                                <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    // Statistics
    const activeCount = assessments.filter(a => a.status === AssessmentStatus.Active).length;
    const expiredCount = assessments.filter(a => a.is_expired).length;
    const canTakeCount = assessments.filter(a => a.can_take).length;

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Statistics Row */}
            <Row gutter={16}>
                <Col span={6}>
                    <Statistic
                        title="Tổng bài thi"
                        value={totalCount}
                        prefix={<FileTextOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Đang mở"
                        value={activeCount}
                        valueStyle={{ color: '#52c41a' }}
                        prefix={<PlayCircleOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Có thể làm"
                        value={canTakeCount}
                        valueStyle={{ color: '#1890ff' }}
                        prefix={<CheckCircleOutlined />}
                    />
                </Col>
                <Col span={6}>
                    <Statistic
                        title="Hết hạn"
                        value={expiredCount}
                        valueStyle={{ color: '#ff4d4f' }}
                        prefix={<ClockCircleOutlined />}
                    />
                </Col>
            </Row>

            {/* Action Bar */}
            {canManage && (
                <Flex justify="flex-end">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setAssignModalOpen(true)}
                    >
                        Gán bài thi
                    </Button>
                </Flex>
            )}

            {/* Assessments Table */}
            {loading ? (
                <Flex justify="center" align="center" style={{ minHeight: 200 }}>
                    <Spin size="large" />
                </Flex>
            ) : assessments.length === 0 ? (
                <Empty
                    description="Chưa có bài thi nào được gán cho nhóm này"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    {canManage && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setAssignModalOpen(true)}
                        >
                            Gán bài thi đầu tiên
                        </Button>
                    )}
                </Empty>
            ) : (
                <Table
                    columns={columns}
                    dataSource={assessments}
                    rowKey="id"
                    pagination={assessments.length > 10 ? { pageSize: 10 } : false}
                    size="middle"
                />
            )}

            {/* Assign Assessment Modal */}
            <Modal
                title="Gán bài thi cho nhóm"
                open={assignModalOpen}
                onCancel={() => {
                    setAssignModalOpen(false);
                    setSelectedAssessmentIds([]);
                    setAvailableAssessments([]);
                }}
                onOk={handleAssign}
                okText="Gán bài thi"
                cancelText="Hủy"
                okButtonProps={{ loading: assignLoading, disabled: selectedAssessmentIds.length === 0 }}
                width={600}
            >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Text type="secondary">
                        Tìm và chọn một hoặc nhiều bài thi để gán cho nhóm. Thành viên trong nhóm sẽ có thể truy cập các bài thi này.
                    </Text>
                    <Select
                        mode="multiple"
                        showSearch
                        placeholder="Nhập tên bài thi để tìm..."
                        style={{ width: '100%' }}
                        loading={searchLoading}
                        filterOption={false}
                        onSearch={handleSearchAssessments}
                        onChange={(values) => setSelectedAssessmentIds(values)}
                        value={selectedAssessmentIds}
                        notFoundContent={searchLoading ? <Spin size="small" /> : 'Nhập ít nhất 2 ký tự để tìm kiếm'}
                        options={availableAssessments.map((a) => ({
                            label: (
                                <Flex align="center" gap={8} justify="space-between">
                                    <Flex align="center" gap={8}>
                                        <FileTextOutlined />
                                        <span>{a.title}</span>
                                    </Flex>
                                    {getStatusTag(a.status)}
                                </Flex>
                            ),
                            value: a.id,
                        }))}
                    />
                    {selectedAssessmentIds.length > 0 && (
                        <Text type="secondary">
                            Đã chọn {selectedAssessmentIds.length} bài thi
                        </Text>
                    )}
                </Space>
            </Modal>
        </Space>
    );
};

export default GroupAssessmentsTab;
