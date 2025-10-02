import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Select,
  message,
  Spin,
  Radio,
  Checkbox,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  RollbackOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { QuestionCreateRequest, QuestionType, DifficultyLevel } from '../../types';
import questionService from '../../services/questionService';

const { Title } = Typography;
const { TextArea } = Input;

const QuestionForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionType, setQuestionType] = useState<QuestionType>(
    QuestionType.MultipleChoice
  );
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit && id) {
      fetchQuestion(parseInt(id));
    }
  }, [id]);

  const fetchQuestion = async (questionId: number) => {
    setLoading(true);
    try {
      const question = await questionService.getQuestion(questionId);
      form.setFieldsValue(question);
      setQuestionType(question.type);
    } catch (error) {
      message.error('Không thể tải thông tin câu hỏi');
      navigate('/questions');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data: QuestionCreateRequest = {
        ...values,
        tags: values.tags
          ? values.tags.split(',').map((tag: string) => tag.trim())
          : [],
      };

      if (isEdit && id) {
        await questionService.updateQuestion(parseInt(id), data);
        message.success('Cập nhật câu hỏi thành công');
      } else {
        await questionService.createQuestion(data);
        message.success('Tạo câu hỏi thành công');
      }

      navigate('/questions');
    } catch (error) {
      message.error(
        isEdit ? 'Không thể cập nhật câu hỏi' : 'Không thể tạo câu hỏi'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionTypeContent = () => {
    switch (questionType) {
      case QuestionType.MultipleChoice:
        return (
          <Card title="Cấu hình trắc nghiệm" type="inner">
            <Form.List name={['content', 'options']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'id']}
                        rules={[{ required: true, message: 'Nhập ID' }]}
                      >
                        <Input placeholder="ID (a, b, c...)" style={{ width: 80 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'text']}
                        rules={[{ required: true, message: 'Nhập nội dung' }]}
                      >
                        <Input placeholder="Nội dung đáp án" style={{ width: 400 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'order']}
                        rules={[{ required: true, message: 'Nhập thứ tự' }]}
                      >
                        <InputNumber placeholder="Thứ tự" min={1} />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm đáp án
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item
              label="Đáp án đúng"
              name={['content', 'correct_answers']}
              rules={[{ required: true, message: 'Chọn đáp án đúng' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn đáp án đúng (ID)"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              label="Cho phép nhiều đáp án đúng"
              name={['content', 'multiple_correct']}
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Card>
        );

      case QuestionType.TrueFalse:
        return (
          <Card title="Cấu hình Đúng/Sai" type="inner">
            <Form.Item
              label="Đáp án đúng"
              name={['content', 'correct_answers']}
              rules={[{ required: true, message: 'Chọn đáp án đúng' }]}
            >
              <Radio.Group>
                <Radio value="true">Đúng</Radio>
                <Radio value="false">Sai</Radio>
              </Radio.Group>
            </Form.Item>
          </Card>
        );

      case QuestionType.Essay:
        return (
          <Card title="Cấu hình Tự luận" type="inner">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Số từ tối thiểu"
                  name={['content', 'min_words']}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số từ tối đa"
                  name={['content', 'max_words']}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );

      case QuestionType.FillBlank:
        return (
          <Card title="Cấu hình Điền khuyết" type="inner">
            <Form.List name={['content', 'blanks']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{ required: true, message: 'Nhập đáp án' }]}
                      >
                        <Input placeholder="Đáp án điền vào chỗ trống" style={{ width: 400 }} />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm chỗ trống
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        );

      case QuestionType.Matching:
        return (
          <Card title="Cấu hình Ghép cặp" type="inner">
            <Form.List name={['content', 'pairs']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'left']}
                        rules={[{ required: true, message: 'Nhập bên trái' }]}
                      >
                        <Input placeholder="Bên trái" style={{ width: 250 }} />
                      </Form.Item>
                      <span>⟷</span>
                      <Form.Item
                        {...restField}
                        name={[name, 'right']}
                        rules={[{ required: true, message: 'Nhập bên phải' }]}
                      >
                        <Input placeholder="Bên phải" style={{ width: 250 }} />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm cặp
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        );

      case QuestionType.Ordering:
        return (
          <Card title="Cấu hình Sắp xếp" type="inner">
            <Form.List name={['content', 'items']}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Typography.Text>{name + 1}.</Typography.Text>
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{ required: true, message: 'Nhập nội dung' }]}
                      >
                        <Input placeholder="Nội dung cần sắp xếp" style={{ width: 500 }} />
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm mục
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Typography.Text type="secondary">
              Thứ tự hiện tại là thứ tự đúng
            </Typography.Text>
          </Card>
        );

      case QuestionType.ShortAnswer:
        return (
          <Card title="Cấu hình Trả lời ngắn" type="inner">
            <Form.Item
              label="Đáp án chấp nhận"
              name={['content', 'correct_answers']}
              rules={[{ required: true, message: 'Nhập các đáp án chấp nhận' }]}
            >
              <Select
                mode="tags"
                placeholder="Nhập các đáp án chấp nhận (có thể nhiều)"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Typography.Text type="secondary">
              Nhấn Enter để thêm nhiều đáp án chấp nhận
            </Typography.Text>
          </Card>
        );

      default:
        return null;
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
            {isEdit ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới'}
          </Title>
        </Col>
        <Col>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => navigate('/questions')}
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
          type: QuestionType.MultipleChoice,
          points: 10,
          difficulty: DifficultyLevel.Medium,
          content: {
            options: [
              { id: 'a', text: '', order: 1 },
              { id: 'b', text: '', order: 2 },
            ],
            correct_answers: [],
            multiple_correct: false,
          },
        }}
      >
        <Card title="Thông tin cơ bản">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Loại câu hỏi"
                name="type"
                rules={[{ required: true, message: 'Chọn loại câu hỏi' }]}
              >
                <Select
                  onChange={(value) => setQuestionType(value)}
                  options={[
                    { label: 'Trắc nghiệm', value: QuestionType.MultipleChoice },
                    { label: 'Đúng/Sai', value: QuestionType.TrueFalse },
                    { label: 'Tự luận', value: QuestionType.Essay },
                    { label: 'Điền khuyết', value: QuestionType.FillBlank },
                    { label: 'Ghép cặp', value: QuestionType.Matching },
                    { label: 'Sắp xếp', value: QuestionType.Ordering },
                    { label: 'Trả lời ngắn', value: QuestionType.ShortAnswer },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Độ khó"
                name="difficulty"
                rules={[{ required: true, message: 'Chọn độ khó' }]}
              >
                <Select
                  options={[
                    { label: 'Dễ', value: DifficultyLevel.Easy },
                    { label: 'Trung bình', value: DifficultyLevel.Medium },
                    { label: 'Khó', value: DifficultyLevel.Hard },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Nội dung câu hỏi"
            name="text"
            rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung câu hỏi"
              showCount
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Điểm số"
                name="points"
                rules={[{ required: true, message: 'Nhập điểm số' }]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Giới hạn thời gian (giây)"
                name="time_limit"
              >
                <InputNumber
                  min={10}
                  max={7200}
                  style={{ width: '100%' }}
                  placeholder="Không giới hạn"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Thẻ (phân cách bằng dấu phẩy)"
            name="tags"
          >
            <Input placeholder="VD: toán học, đại số, cơ bản" />
          </Form.Item>

          <Form.Item
            label="Giải thích"
            name="explanation"
          >
            <TextArea
              rows={3}
              placeholder="Giải thích đáp án đúng"
              showCount
            />
          </Form.Item>
        </Card>

        {renderQuestionTypeContent()}

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              size="large"
            >
              {isEdit ? 'Cập nhật' : 'Tạo câu hỏi'}
            </Button>
            <Button onClick={() => navigate('/questions')} size="large">
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default QuestionForm;
