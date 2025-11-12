import React, { useState, useEffect, useRef } from 'react';
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
import { CameraConsentModal } from '../../components/Proctoring/CameraConsentModal';
import { TamperCheckModal } from '../../components/Proctoring/TamperCheckModal';
import {
  SearchOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import studentService from '../../services/studentService';
import type { StudentAssessment } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AvailableAssessments: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { modal } = App.useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [cameraConsentModal, setCameraConsentModal] = useState(false);
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
          title: 'Lỗi xác thực',
          content: 'Bạn cần đăng nhập để làm bài kiểm tra.',
        });
        return;
      }

      // Handle active attempt first (skip canStartAssessment check)
      if (assessment.has_active_attempt) {
        modal.confirm({
          title: 'Tiếp tục làm bài',
          icon: <ExclamationCircleOutlined />,
          content: 'Bạn đang có một lần làm bài chưa hoàn thành. Bạn có muốn tiếp tục?',
          okText: 'Tiếp tục',
          cancelText: 'Hủy',
          onOk: async () => {
            try {
              const attempt = await studentService.getCurrentAttempt(assessment.id);
              if (attempt) {
                // Check if attempt has expired
                const timeData = await studentService.getTimeRemaining(attempt.id);
                if (timeData.data <= 0) {
                  // Auto-submit expired attempt
                  modal.warning({
                    title: 'Hết giờ',
                    content: 'Bài kiểm tra đã hết thời gian và sẽ được nộp tự động.',
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
                title: 'Lỗi',
                content: error.message || 'Không thể tiếp tục bài kiểm tra',
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
          title: 'Không thể bắt đầu',
          content: canStartResult.message || 'Bạn không thể bắt đầu bài kiểm tra này lúc này.',
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
        // Check if user has registered face
        try {
          const registrationStatus = await studentService.checkFaceRegistrationStatus();
          if (!registrationStatus.registered) {
            modal.confirm({
              title: 'Chưa đăng ký khuôn mặt',
              content: 'Bài kiểm tra này yêu cầu xác thực khuôn mặt. Bạn cần đăng ký khuôn mặt trước khi bắt đầu. Bạn có muốn đăng ký ngay không?',
              okText: 'Đăng ký ngay',
              cancelText: 'Hủy',
              onOk: () => {
                navigate('/profile', { state: { returnToAssessment: assessment.id } });
              },
            });
            return;
          }
        } catch (error) {
          console.error('Failed to check face registration status:', error);
        }

        const consent = localStorage.getItem('camera-consent');
        if (consent === 'always') {
          navigate('/student/face-verification', { state: { assessment: fullAssessment } });
        } else {
          setSelectedAssessment(fullAssessment);
          setCameraConsentModal(true);
        }
      } else {
        showStartConfirmation(fullAssessment);
      }
    } catch (error: any) {
      modal.error({
        title: 'Lỗi',
        content: error.message || 'Đã có lỗi xảy ra',
      });
    }
  };

  const handleCameraConsent = (consent: 'once' | 'always') => {
    if (consent === 'always') {
      localStorage.setItem('camera-consent', 'always');
    }
    setCameraConsentModal(false);
    if (selectedAssessment) {
      navigate('/student/face-verification', { state: { assessment: selectedAssessment } });
    }
  };

  const handleCameraReject = () => {
    setCameraConsentModal(false);
    setSelectedAssessment(null);
    modal.warning({
      title: 'Từ chối quyền camera',
      content: 'Bạn cần cho phép truy cập camera để làm bài kiểm tra này.',
    });
  };

  const showStartConfirmation = (assessment: any) => {
    setSelectedAssessment(assessment);
    setTamperCheckModal(true);
  };

  const handleTamperCheckPass = () => {
    setTamperCheckModal(false);
    if (!selectedAssessment) return;

    modal.confirm({
      title: 'Bắt đầu làm bài',
      icon: <PlayCircleOutlined />,
      content: (
        <div>
          <p><strong>{selectedAssessment.title}</strong></p>
          <p>Thời gian: {selectedAssessment.duration} phút</p>
          <p>Số lần làm: {selectedAssessment.attempts_used} / {selectedAssessment.max_attempts}</p>
          <p>Điểm đạt: {selectedAssessment.passing_score}%</p>
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
          const attempt = await studentService.startAttempt({
            assessment_id: selectedAssessment.id,
            student_id: user?.id || '',
          });
          navigate(`/student/take/${attempt.id}`);
        } catch (error: any) {
          modal.error({
            title: 'Lỗi',
            content: error.response?.data?.message || error.message || 'Không thể bắt đầu bài kiểm tra',
          });
        }
      },
    });
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
    <>
      <CameraConsentModal
        open={cameraConsentModal}
        onConsent={handleCameraConsent}
        onReject={handleCameraReject}
      />
      <TamperCheckModal
        open={tamperCheckModal}
        onPass={handleTamperCheckPass}
        onCancel={() => setTamperCheckModal(false)}
      />
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
    </>
  );
};

export default AvailableAssessments;
