import React from 'react';
import { Card, Row, Col, Space, Typography, Tag, Statistic, Progress } from 'antd';
import { ClockCircleOutlined, SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ExamHeaderProps {
  title: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining: string;
  timeColor: string;
  answeredCount: number;
  autoSaving: boolean;
  lastSavedTime: number | null;
  progress: number;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  title,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  timeColor,
  answeredCount,
  autoSaving,
  lastSavedTime,
  progress,
}) => {
  return (
    <Card style={{ marginBottom: '16px' }}>
      <Row gutter={16} align="middle">
        <Col flex="auto">
          <Space align="center">
            <Title level={3} style={{ margin: 0 }}>
              {title}
            </Title>
            {autoSaving && (
              <Tag color="processing" icon={<SaveOutlined />}>
                Đang lưu...
              </Tag>
            )}
          </Space>
          <div style={{ marginTop: '4px' }}>
            <Space size="small">
              <Text type="secondary">
                Câu {currentQuestionIndex + 1} / {totalQuestions}
              </Text>
              {!autoSaving && lastSavedTime && (
                <Text type="success" style={{ fontSize: '12px' }}>
                  <CheckCircleOutlined /> Đã lưu
                </Text>
              )}
            </Space>
          </div>
        </Col>
        <Col>
          <Statistic
            title="Thời gian còn lại"
            value={timeRemaining}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: timeColor, fontSize: '24px' }}
          />
        </Col>
        <Col>
          <Statistic
            title="Đã trả lời"
            value={answeredCount}
            suffix={`/ ${totalQuestions}`}
            valueStyle={{ fontSize: '24px' }}
          />
        </Col>
      </Row>
      <Progress
        percent={progress}
        showInfo={false}
        strokeColor="#1890ff"
        style={{ marginTop: '16px' }}
      />
    </Card>
  );
};
