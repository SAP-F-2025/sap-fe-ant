import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Space,
  Button,
  Tag,
  Typography,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  EditOutlined,
  RollbackOutlined,
  GlobalOutlined,
  LockOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { QuestionBank } from '../../types';
import questionBankService from '../../services/questionBankService';
import dayjs from 'dayjs';
import { ManageQuestionBankQuestions } from '../../components/QuestionBank/ManageQuestionBankQuestions';

const { Title, Text } = Typography;

const QuestionBankDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuestionBank(parseInt(id));
    }
  }, [id]);

  const fetchQuestionBank = async (bankId: number) => {
    setLoading(true);
    try {
      const data = await questionBankService.getQuestionBank(bankId);
      setQuestionBank(data);
    } catch (error) {
      // Error handled by interceptor
      navigate('/question-banks');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !questionBank) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <Button
              icon={<RollbackOutlined />}
              onClick={() => navigate('/question-banks')}
            >
              Quay lại
            </Button>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/question-banks/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              {questionBank.name}
            </Title>
            <Space>
              {questionBank.is_public ? (
                <Tag icon={<GlobalOutlined />} color="success">
                  Công khai
                </Tag>
              ) : (
                <Tag icon={<LockOutlined />}>Riêng tư</Tag>
              )}
            </Space>
          </div>

          {questionBank.description && (
            <Typography.Paragraph>{questionBank.description}</Typography.Paragraph>
          )}
        </Space>
      </Card>

      <Card title="Thông tin chi tiết">
        <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered>
          <Descriptions.Item label="Số câu hỏi">
            <FileTextOutlined /> {questionBank.question_count || 0} câu
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {questionBank.is_public ? (
              <Tag icon={<GlobalOutlined />} color="success">
                Công khai
              </Tag>
            ) : (
              <Tag icon={<LockOutlined />}>Riêng tư</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dayjs(questionBank.created_at).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          {questionBank.tags && questionBank.tags.length > 0 && (
            <Descriptions.Item label="Thẻ" span={3}>
              <Space wrap>
                {questionBank.tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <ManageQuestionBankQuestions
        bankId={parseInt(id!)}
        onQuestionsChange={() => {
          fetchQuestionBank(parseInt(id!));
        }}
      />
    </Space>
  );
};

export default QuestionBankDetail;
