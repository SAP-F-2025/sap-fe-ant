import React, { useEffect, useState, useMemo } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Modal,
  message,
  Card,
  Row,
  Col,
  InputNumber,
  Input,
  Flex,
  Avatar,
} from 'antd';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { elevation } from '../../styles/elevation';
import { cardColors } from '../../styles/cardColors';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  TrophyOutlined,
  FileSearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Attempt, AttemptStatus } from '../../types';
import { mockAttempts } from '../../services/mockData';
import dayjs from 'dayjs';
import { useThemeToken } from '../../theme/ThemeProvider';

const { Title, Text } = Typography;
const { TextArea } = Input;

const GradingList: React.FC = () => {
  const token = useThemeToken();
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [gradingModalVisible, setGradingModalVisible] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  // Calculate statistics
  const stats = useMemo(() => {
    const graded = attempts.filter((a) => a.score !== undefined).length;
    const pending = attempts.filter(
      (a) => a.status === AttemptStatus.Completed && a.score === undefined
    ).length;
    const avgScore =
      graded > 0
        ? Math.round(
            attempts
              .filter((a) => a.score !== undefined)
              .reduce((sum, a) => sum + (a.score || 0), 0) / graded
          )
        : 0;
    return {
      total: attempts.length,
      graded,
      pending,
      avgScore,
    };
  }, [attempts]);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    setLoading(true);
    setTimeout(() => {
      setAttempts(mockAttempts);
      setLoading(false);
    }, 500);
  };

  const getStatusBadge = (status: AttemptStatus) => {
    const statusMap: Record<AttemptStatus, 'in-progress' | 'completed' | 'failed' | 'pending'> = {
      [AttemptStatus.InProgress]: 'in-progress',
      [AttemptStatus.Completed]: 'completed',
      [AttemptStatus.Abandoned]: 'failed',
      [AttemptStatus.Timeout]: 'failed',
    };
    return <StatusBadge status={statusMap[status]} />;
  };

  const handleGrade = (attempt: Attempt) => {
    setSelectedAttempt(attempt);
    setScore(attempt.score || 0);
    setFeedback('');
    setGradingModalVisible(true);
  };

  const handleSubmitGrade = () => {
    if (selectedAttempt) {
      message.success('Chấm điểm thành công');
      setGradingModalVisible(false);
      fetchAttempts();
    }
  };

  const columns: ColumnsType<Attempt> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Bài thi',
      dataIndex: 'assessment_id',
      key: 'assessment_id',
      width: 120,
      render: (id) => `Bài thi #${id}`,
    },
    {
      title: 'Học viên',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 120,
      render: (id) => `HV-${id}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => getStatusBadge(status),
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      width: 100,
      align: 'center',
      render: (score, record) => (
        <Space direction="vertical" size={0}>
          {score !== undefined ? (
            <>
              <Text strong style={{ fontSize: 18 }}>
                {score}
              </Text>
              {record.passed ? (
                <Tag color="success">Đạt</Tag>
              ) : (
                <Tag color="error">Không đạt</Tag>
              )}
            </>
          ) : (
            <Text type="secondary">Chưa chấm</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'started_at',
      key: 'started_at',
      width: 150,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thời gian hoàn thành',
      dataIndex: 'completed_at',
      key: 'completed_at',
      width: 150,
      render: (date) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleGrade(record)}
          disabled={record.status !== AttemptStatus.Completed}
        >
          Chấm điểm
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between" align="center">
        <Space direction="vertical" size={4}>
          <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
            <CheckCircleOutlined style={{ marginRight: 8 }} /> Chấm điểm
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Quản lý và chấm điểm bài làm của học viên
          </Text>
        </Space>
      </Flex>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.geekblue, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<FileSearchOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.total}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Tổng bài làm</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.green, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<CheckCircleOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.graded}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Đã chấm</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.orange, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<ClockCircleOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.pending}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Chờ chấm</Text>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ background: cardColors.volcano, borderRadius: 16, ...elevation[1] }} styles={{ body: { padding: 20 } }}>
            <Flex vertical align="center" gap={12}>
              <Avatar size={44} icon={<TrophyOutlined style={{ fontSize: 20 }} />} style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none' }} />
              <Title level={3} style={{ color: 'white', margin: 0, fontSize: 32, fontWeight: 700 }}>{stats.avgScore}</Title>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 13, fontWeight: 500 }}>Điểm trung bình</Text>
            </Flex>
          </Card>
        </Col>
      </Row>

      <Card style={{ ...elevation[1], borderRadius: 16 }}>
        <Table
          columns={columns}
          dataSource={attempts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài làm`,
          }}
        />
      </Card>

      <Modal
        title="Chấm điểm bài làm"
        open={gradingModalVisible}
        onOk={handleSubmitGrade}
        onCancel={() => setGradingModalVisible(false)}
        okText="Lưu điểm"
        cancelText="Hủy"
        width={600}
      >
        {selectedAttempt && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong>Bài thi:</Text> Bài thi #{selectedAttempt.assessment_id}
            </div>
            <div>
              <Text strong>Học viên:</Text> HV-{selectedAttempt.student_id}
            </div>
            <div>
              <Text strong>Điểm số:</Text>
              <br />
              <InputNumber
                min={0}
                max={100}
                value={score}
                onChange={(value) => setScore(value || 0)}
                style={{ width: '100%', marginTop: 8 }}
                size="large"
              />
            </div>
            <div>
              <Text strong>Nhận xét:</Text>
              <br />
              <TextArea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Nhập nhận xét cho học viên"
                style={{ marginTop: 8 }}
              />
            </div>
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default GradingList;
