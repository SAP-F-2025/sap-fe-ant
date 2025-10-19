import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Typography,
  App,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import type { StudentAssessment } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AvailableAssessments: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { modal } = App.useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      console.log('Starting assessment:', assessment);
      console.log('Current user:', user);

      if (!user?.id) {
        modal.error({
          title: 'Lỗi xác thực',
          content: 'Bạn cần đăng nhập để làm bài kiểm tra.',
        });
        return;
      }

      // Check if can start
      const canStartResult = await studentService.canStartAssessment(assessment.id);
      console.log('Can start result:', canStartResult);

      if (!canStartResult.can_start) {
        modal.error({
          title: 'Không thể bắt đầu',
          content: canStartResult.message || 'Bạn không thể bắt đầu bài kiểm tra này lúc này.',
        });
        return;
      }

      // Check for active attempt
      if (assessment.has_active_attempt) {
        console.log('Has active attempt, showing resume modal');
        modal.confirm({
          title: 'Tiếp tục làm bài',
          icon: <ExclamationCircleOutlined />,
          content: 'Bạn đang có một lần làm bài chưa hoàn thành. Bạn có muốn tiếp tục?',
          okText: 'Tiếp tục',
          cancelText: 'Hủy',
          onOk: () => {
            // Get current attempt and navigate
            studentService.getCurrentAttempt(assessment.id).then((attempt) => {
              if (attempt) {
                navigate(`/student/take/${attempt.id}`);
              }
            });
          },
        });
        return;
      }

      // Show confirmation before starting new attempt
      console.log('Showing start confirmation modal');
      modal.confirm({
        title: 'Bắt đầu làm bài',
        icon: <PlayCircleOutlined />,
        content: (
          <div>
            <p>
              <strong>{assessment.title}</strong>
            </p>
            <p>Thời gian: {assessment.duration} phút</p>
            <p>
              Số lần làm: {assessment.attempts_used} / {assessment.max_attempts}
            </p>
            <p>Điểm đạt: {assessment.passing_score}%</p>
            <Alert
              message="Khi bạn bắt đầu, đồng hồ sẽ bắt đầu đếm. Hãy đảm bảo kết nối internet ổn định."
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        ),
        okText: 'Bắt đầu ngay',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            console.log('User confirmed, starting attempt...');
            const attempt = await studentService.startAttempt({
              assessment_id: assessment.id,
              student_id: user?.id || '',
            });
            console.log('Attempt started:', attempt);
            navigate(`/student/take/${attempt.id}`);
          } catch (error: any) {
            console.error('Error starting attempt:', error);
            modal.error({
              title: 'Lỗi',
              content: error.message || 'Không thể bắt đầu bài kiểm tra',
            });
          }
        },
      });
    } catch (error: any) {
      console.error('Error in handleStartAssessment:', error);
      modal.error({
        title: 'Lỗi',
        content: error.message || 'Đã có lỗi xảy ra',
      });
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
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
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      render: (duration: number) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{duration} phút</Text>
        </Space>
      ),
    },
    {
      title: 'Số câu hỏi',
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
      title: 'Điểm đạt',
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
      title: 'Lượt làm',
      key: 'attempts',
      width: 120,
      render: (_: any, record: StudentAssessment) => (
        <Tag color={record.attempts_used >= record.max_attempts ? 'red' : 'blue'}>
          {record.attempts_used} / {record.max_attempts}
        </Tag>
      ),
    },
    {
      title: 'Điểm cao nhất',
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
      title: 'Hạn nộp',
      dataIndex: 'due_date',
      key: 'due_date',
      width: 180,
      render: (date: string | undefined) => {
        if (!date) return <Text type="secondary">Không có hạn</Text>;
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
      title: 'Trạng thái',
      key: 'status',
      width: 130,
      render: (_: any, record: StudentAssessment) => {
        if (record.has_active_attempt) {
          return <Tag color="processing">Đang làm</Tag>;
        }
        if (!record.can_start) {
          return <Tag color="error">Không khả dụng</Tag>;
        }
        return <Tag color="success">Sẵn sàng</Tag>;
      },
    },
    {
      title: 'Hành động',
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
              Tiếp tục
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              disabled={!record.can_start}
              onClick={() => handleStartAssessment(record)}
            >
              Bắt đầu
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Bài kiểm tra khả dụng</Title>
        <Text type="secondary">
          Chọn một bài kiểm tra để bắt đầu. Hãy đảm bảo bạn có đủ thời gian để hoàn thành.
        </Text>
      </div>

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Search */}
          <Input
            placeholder="Tìm kiếm bài kiểm tra..."
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
              showTotal: (total) => `Tổng ${total} bài kiểm tra`,
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
  );
};

export default AvailableAssessments;
