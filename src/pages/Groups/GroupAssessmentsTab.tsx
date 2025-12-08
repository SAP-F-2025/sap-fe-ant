import React, { useEffect, useState, useMemo } from 'react';
import {
    Table,
    Button,
    Space,
    Typography,
    Tag,
    Popconfirm,
    Tooltip,
    Modal,
    Spin,
    Empty,
    Flex,
    Avatar,
    Statistic,
    Row,
    Col,
    Progress,
    Tabs,
    Input,
    Checkbox,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined,
    EditOutlined,
    SearchOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { GroupAssessmentItem, Assessment, AssessmentStatus } from '../../types';
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

    // Assign modal - new state
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [allAssessments, setAllAssessments] = useState<Assessment[]>([]);
    const [selectedAssessmentIds, setSelectedAssessmentIds] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
    const [searchFilter, setSearchFilter] = useState('');

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

    // Open modal and load assessments
    const handleOpenAssignModal = async () => {
        setAssignModalOpen(true);
        setModalLoading(true);
        setSelectedAssessmentIds([]);
        setSearchFilter('');
        setActiveTab('my');
        try {
            // Load all active assessments (size 100 should be enough for most cases)
            const response = await assessmentService.getAssessments({ size: 100, status: 'Active' });
            setAllAssessments(response.assessments || []);
        } catch (error) {
            showError('Không thể tải danh sách bài thi');
            setAllAssessments([]);
        } finally {
            setModalLoading(false);
        }
    };

    // Close modal and reset state
    const handleCloseModal = () => {
        setAssignModalOpen(false);
        setSelectedAssessmentIds([]);
        setAllAssessments([]);
        setSearchFilter('');
    };

    // Filtered lists
    const assignedIds = useMemo(() => assessments.map(a => a.id), [assessments]);
    
    const myAssessments = useMemo(() => 
        allAssessments.filter(a => a.can_edit && !assignedIds.includes(a.id)),
        [allAssessments, assignedIds]
    );
    
    const otherAssessments = useMemo(() => 
        allAssessments.filter(a => !a.can_edit && !assignedIds.includes(a.id)),
        [allAssessments, assignedIds]
    );

    // Apply search filter
    const filteredMyAssessments = useMemo(() => {
        if (!searchFilter) return myAssessments;
        const search = searchFilter.toLowerCase();
        return myAssessments.filter(a => 
            a.title.toLowerCase().includes(search) ||
            a.description?.toLowerCase().includes(search)
        );
    }, [myAssessments, searchFilter]);

    const filteredOtherAssessments = useMemo(() => {
        if (!searchFilter) return otherAssessments;
        const search = searchFilter.toLowerCase();
        return otherAssessments.filter(a => 
            a.title.toLowerCase().includes(search) ||
            a.description?.toLowerCase().includes(search)
        );
    }, [otherAssessments, searchFilter]);

    const currentList = activeTab === 'my' ? filteredMyAssessments : filteredOtherAssessments;

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
            showSuccess(`Đã gán ${selectedAssessmentIds.length} bài thi cho nhóm`);
            handleCloseModal();
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

    // Toggle selection
    const handleToggleSelect = (assessmentId: number) => {
        setSelectedAssessmentIds(prev => 
            prev.includes(assessmentId)
                ? prev.filter(id => id !== assessmentId)
                : [...prev, assessmentId]
        );
    };

    // Select all in current list
    const handleSelectAllInList = (checked: boolean) => {
        if (checked) {
            const idsToAdd = currentList.map(a => a.id).filter(id => !selectedAssessmentIds.includes(id));
            setSelectedAssessmentIds(prev => [...prev, ...idsToAdd]);
        } else {
            const idsToRemove = new Set(currentList.map(a => a.id));
            setSelectedAssessmentIds(prev => prev.filter(id => !idsToRemove.has(id)));
        }
    };

    const allInListSelected = currentList.length > 0 && currentList.every(a => selectedAssessmentIds.includes(a.id));
    const someInListSelected = currentList.some(a => selectedAssessmentIds.includes(a.id));

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
                            onClick={() => navigate(`/assessments/edit/${record.id}`)}
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
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Space size={4}>
                    {record.can_edit && (
                        <Tooltip title="Chỉnh sửa bài thi">
                            <Button
                                type="primary"
                                ghost
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => navigate(`/assessments/edit/${record.id}`)}
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
                            <Tooltip title="Hủy gán khỏi nhóm">
                                <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    // Modal assessment list columns
    const modalColumns: ColumnsType<Assessment> = [
        {
            title: () => (
                <Checkbox
                    checked={allInListSelected}
                    indeterminate={!allInListSelected && someInListSelected}
                    onChange={(e) => handleSelectAllInList(e.target.checked)}
                />
            ),
            key: 'select',
            width: 50,
            render: (_, record) => (
                <Checkbox
                    checked={selectedAssessmentIds.includes(record.id)}
                    onChange={() => handleToggleSelect(record.id)}
                />
            ),
        },
        {
            title: 'Bài thi',
            key: 'assessment',
            render: (_, record) => (
                <Flex align="center" gap={8}>
                    <Avatar
                        size="small"
                        icon={<FileTextOutlined />}
                        style={{ backgroundColor: '#1890ff' }}
                    />
                    <Space direction="vertical" size={0}>
                        <Text strong>{record.title}</Text>
                        {record.description && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                {record.description.length > 50
                                    ? `${record.description.substring(0, 50)}...`
                                    : record.description}
                            </Text>
                        )}
                    </Space>
                </Flex>
            ),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 110,
            render: (_, record) => getStatusTag(record.status),
        },
        {
            title: 'Câu hỏi',
            key: 'questions',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Text>{record.questions_count || 0}</Text>
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
                        onClick={handleOpenAssignModal}
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
                            onClick={handleOpenAssignModal}
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

            {/* Improved Assign Assessment Modal */}
            <Modal
                title="Gán bài thi cho nhóm"
                open={assignModalOpen}
                onCancel={handleCloseModal}
                onOk={handleAssign}
                okText={`Gán ${selectedAssessmentIds.length > 0 ? selectedAssessmentIds.length + ' ' : ''}bài thi`}
                cancelText="Hủy"
                okButtonProps={{ 
                    loading: assignLoading, 
                    disabled: selectedAssessmentIds.length === 0 
                }}
                width={700}
                styles={{ body: { maxHeight: '60vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' } }}
            >
                {modalLoading ? (
                    <Flex justify="center" align="center" style={{ minHeight: 300 }}>
                        <Spin size="large" tip="Đang tải danh sách bài thi..." />
                    </Flex>
                ) : (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        {/* Search Input */}
                        <Input
                            placeholder="Tìm kiếm bài thi..."
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            allowClear
                        />

                        {/* Tabs */}
                        <Tabs
                            activeKey={activeTab}
                            onChange={(key) => setActiveTab(key as 'my' | 'all')}
                            items={[
                                {
                                    key: 'my',
                                    label: (
                                        <Space>
                                            <UserOutlined />
                                            Bài thi của tôi
                                            <Tag>{filteredMyAssessments.length}</Tag>
                                        </Space>
                                    ),
                                },
                                {
                                    key: 'all',
                                    label: (
                                        <Space>
                                            <FileTextOutlined />
                                            Tất cả bài thi
                                            <Tag>{filteredOtherAssessments.length}</Tag>
                                        </Space>
                                    ),
                                },
                            ]}
                        />

                        {/* Assessment List */}
                        <div style={{ maxHeight: '40vh', overflow: 'auto' }}>
                            {currentList.length === 0 ? (
                                <Empty
                                    description={
                                        searchFilter 
                                            ? "Không tìm thấy bài thi phù hợp"
                                            : activeTab === 'my' 
                                                ? "Bạn chưa tạo bài thi nào hoặc tất cả đã được gán"
                                                : "Không có bài thi nào khác"
                                    }
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            ) : (
                                <Table
                                    columns={modalColumns}
                                    dataSource={currentList}
                                    rowKey="id"
                                    size="small"
                                    pagination={currentList.length > 8 ? { pageSize: 8, size: 'small' } : false}
                                    onRow={(record) => ({
                                        onClick: () => handleToggleSelect(record.id),
                                        style: { 
                                            cursor: 'pointer',
                                            backgroundColor: selectedAssessmentIds.includes(record.id) 
                                                ? '#e6f7ff' 
                                                : undefined 
                                        },
                                    })}
                                />
                            )}
                        </div>

                        {/* Selection Summary */}
                        {selectedAssessmentIds.length > 0 && (
                            <Flex justify="space-between" align="center" style={{ paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                                <Text type="secondary">
                                    Đã chọn <Text strong>{selectedAssessmentIds.length}</Text> bài thi
                                </Text>
                                <Button 
                                    type="link" 
                                    size="small"
                                    onClick={() => setSelectedAssessmentIds([])}
                                >
                                    Bỏ chọn tất cả
                                </Button>
                            </Flex>
                        )}
                    </Space>
                )}
            </Modal>
        </Space>
    );
};

export default GroupAssessmentsTab;

