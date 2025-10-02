import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Switch,
  message,
  Spin,
} from 'antd';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';
import { QuestionBankCreateRequest } from '../../types';
import questionBankService from '../../services/questionBankService';

const { Title } = Typography;
const { TextArea } = Input;

const QuestionBankForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit && id) {
      fetchQuestionBank(parseInt(id));
    }
  }, [id]);

  const fetchQuestionBank = async (bankId: number) => {
    setLoading(true);
    try {
      const bank = await questionBankService.getQuestionBank(bankId);
      form.setFieldsValue({
        ...bank,
        tags: bank.tags?.join(', '),
      });
    } catch (error) {
      message.error('Không thể tải thông tin ngân hàng câu hỏi');
      navigate('/question-banks');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data: QuestionBankCreateRequest = {
        ...values,
        tags: values.tags
          ? values.tags.split(',').map((tag: string) => tag.trim())
          : [],
      };

      if (isEdit && id) {
        await questionBankService.updateQuestionBank(parseInt(id), data);
        message.success('Cập nhật ngân hàng câu hỏi thành công');
      } else {
        await questionBankService.createQuestionBank(data);
        message.success('Tạo ngân hàng câu hỏi thành công');
      }

      navigate('/question-banks');
    } catch (error) {
      message.error(
        isEdit
          ? 'Không thể cập nhật ngân hàng câu hỏi'
          : 'Không thể tạo ngân hàng câu hỏi'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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
          <Title level={2}>
            {isEdit ? 'Chỉnh sửa ngân hàng câu hỏi' : 'Tạo ngân hàng câu hỏi mới'}
          </Title>
        </Col>
        <Col>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => navigate('/question-banks')}
          >
            Quay lại
          </Button>
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          is_public: false,
        }}
      >
        <Card>
          <Form.Item
            label="Tên ngân hàng"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên ngân hàng' },
              { max: 200, message: 'Tên không được quá 200 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên ngân hàng câu hỏi" size="large" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { max: 1000, message: 'Mô tả không được quá 1000 ký tự' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả ngân hàng câu hỏi"
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item
            label="Thẻ (phân cách bằng dấu phẩy)"
            name="tags"
          >
            <Input placeholder="VD: toán học, vật lý, cơ bản" />
          </Form.Item>

          <Form.Item
            label="Công khai"
            name="is_public"
            valuePropName="checked"
            tooltip="Cho phép người khác xem và sử dụng ngân hàng câu hỏi này"
          >
            <Switch />
          </Form.Item>
        </Card>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              size="large"
            >
              {isEdit ? 'Cập nhật' : 'Tạo ngân hàng'}
            </Button>
            <Button onClick={() => navigate('/question-banks')} size="large">
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default QuestionBankForm;
