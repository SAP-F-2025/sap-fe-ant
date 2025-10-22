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
  Spin,
  Radio,
  Checkbox,
  Divider,
  Tag,
  Alert,
} from 'antd';
import {
  SaveOutlined,
  RollbackOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { QuestionCreateRequest, QuestionType, DifficultyLevel } from '../../types';
import questionService from '../../services/questionService';
import { showSuccess } from '../../utils/errorHandler';

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
      // Error will be handled by axios interceptor
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

      // Auto-generate correct_order for Ordering questions
      if (data.type === QuestionType.Ordering && data.content?.items) {
        data.content.correct_order = data.content.items
          .map((item: any) => item?.id)
          .filter(Boolean);
      }

      if (isEdit && id) {
        await questionService.updateQuestion(parseInt(id), data);
        showSuccess('Cập nhật câu hỏi thành công');
      } else {
        await questionService.createQuestion(data);
        showSuccess('Tạo câu hỏi thành công');
      }

      navigate('/questions');
    } catch (error) {
      // Error will be handled by axios interceptor with notification
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionTypeContent = () => {
    switch (questionType) {
      case QuestionType.MultipleChoice:
        return (
          <Card title="Cấu hình trắc nghiệm" type="inner">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Options List */}
              <Form.List name={['content', 'options']}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8, flexWrap: 'wrap' }}
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
                          <Input placeholder="Nội dung đáp án" style={{ width: 300 }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'image_url']}
                        >
                          <Input placeholder="URL hình ảnh (tùy chọn)" style={{ width: 200 }} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'order']}
                          rules={[{ required: true, message: 'Nhập thứ tự' }]}
                        >
                          <InputNumber placeholder="Thứ tự" min={1} style={{ width: 80 }} />
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

              {/* Correct Answers */}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.content?.options !== currentValues.content?.options
                }
              >
                {({ getFieldValue }) => {
                  const options = getFieldValue(['content', 'options']) || [];
                  return (
                    <Form.Item
                      label="Đáp án đúng"
                      name={['content', 'correct_answers']}
                      rules={[{ required: true, message: 'Chọn đáp án đúng' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn đáp án đúng (ID)"
                        style={{ width: '100%' }}
                        options={options.map((opt: any) => ({
                          label: `${opt?.id || ''} - ${opt?.text || ''}`,
                          value: opt?.id,
                        })).filter((opt: any) => opt.value)}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>

              {/* Settings */}
              <Card title="Cài đặt" type="inner" size="small">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'multiple_correct']}
                      valuePropName="checked"
                    >
                      <Checkbox>Cho phép nhiều đáp án đúng</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'randomize_options']}
                      valuePropName="checked"
                    >
                      <Checkbox>Xáo trộn thứ tự đáp án</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'partial_credit']}
                      valuePropName="checked"
                    >
                      <Checkbox>Cho điểm từng phần</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Card>
        );

      case QuestionType.TrueFalse:
        return (
          <Card title="Cấu hình Đúng/Sai" type="inner">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Correct Answer */}
              <Form.Item
                label="Đáp án đúng"
                name={['content', 'correct_answer']}
                rules={[{ required: true, message: 'Chọn đáp án đúng' }]}
              >
                <Radio.Group>
                  <Radio value={true}>Đúng</Radio>
                  <Radio value={false}>Sai</Radio>
                </Radio.Group>
              </Form.Item>

              {/* Custom Labels */}
              <Card title="Nhãn tùy chỉnh (tùy chọn)" type="inner" size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Nhãn cho 'Đúng'"
                      name={['content', 'true_label']}
                      tooltip="VD: Đồng ý, Có, True"
                    >
                      <Input placeholder="Mặc định: Đúng" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Nhãn cho 'Sai'"
                      name={['content', 'false_label']}
                      tooltip="VD: Không đồng ý, Không, False"
                    >
                      <Input placeholder="Mặc định: Sai" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Card>
        );

      case QuestionType.Essay:
        return (
          <Card title="Cấu hình Tự luận" type="inner">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Word Limits */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Số từ tối thiểu (tùy chọn)"
                    name={['content', 'min_words']}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 100" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số từ tối đa (tùy chọn)"
                    name={['content', 'max_words']}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="VD: 500" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Suggested Length */}
              <Form.Item
                label="Độ dài gợi ý"
                name={['content', 'suggested_length']}
                tooltip="VD: 2-3 đoạn văn, 200-300 từ, 1 trang A4"
              >
                <Input placeholder="VD: 2-3 đoạn văn" />
              </Form.Item>

              {/* Rubric Criteria */}
              <Card title="Tiêu chí đánh giá (Rubric)" type="inner" size="small">
                <Form.Item
                  label="Các tiêu chí chấm điểm"
                  name={['content', 'rubric_criteria']}
                  tooltip="Nhấn Enter để thêm tiêu chí mới"
                >
                  <Select
                    mode="tags"
                    placeholder="VD: Nội dung, Ngữ pháp, Cấu trúc..."
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Card>

              {/* Sample Answer */}
              <Form.Item
                label="Đáp án mẫu (tùy chọn)"
                name={['content', 'sample_answer']}
                tooltip="Đáp án tham khảo cho giáo viên"
              >
                <TextArea
                  rows={6}
                  placeholder="Nhập đáp án mẫu để giáo viên tham khảo khi chấm bài..."
                />
              </Form.Item>

              {/* Auto Grading Settings */}
              <Card title="Cài đặt tự động chấm điểm" type="inner" size="small">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Form.Item
                    name={['content', 'auto_grade']}
                    valuePropName="checked"
                  >
                    <Checkbox>Bật chấm điểm tự động</Checkbox>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.content?.auto_grade !== currentValues.content?.auto_grade
                    }
                  >
                    {({ getFieldValue }) => {
                      const autoGrade = getFieldValue(['content', 'auto_grade']);

                      return autoGrade ? (
                        <Form.Item
                          label="Từ khóa quan trọng"
                          name={['content', 'key_words']}
                          tooltip="Các từ khóa cần có trong bài làm để tự động tính điểm"
                        >
                          <Select
                            mode="tags"
                            placeholder="Nhập các từ khóa quan trọng (nhấn Enter để thêm)"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      ) : null;
                    }}
                  </Form.Item>
                </Space>
              </Card>

              <Alert
                message="Lưu ý về chấm điểm tự động"
                description="Chấm điểm tự động sẽ dựa trên: số từ, từ khóa quan trọng. Giáo viên vẫn nên xem xét và điều chỉnh điểm thủ công."
                type="warning"
                showIcon
              />
            </Space>
          </Card>
        );

      case QuestionType.FillBlank:
        return (
          <Card title="Cấu hình Điền khuyết" type="inner">
            <Form.Item
              label="Template câu hỏi"
              name={['content', 'template']}
              rules={[{ required: true, message: 'Nhập template câu hỏi' }]}
              tooltip="Sử dụng {blank1}, {blank2}, ... để đánh dấu vị trí cần điền"
            >
              <TextArea
                rows={3}
                placeholder="VD: The capital of {blank1} is {blank2}"
                showCount
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Phân biệt hoa thường"
                  name={['content', 'case_sensitive']}
                  valuePropName="checked"
                >
                  <Checkbox>Đáp án có phân biệt hoa thường</Checkbox>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tự động xóa khoảng trắng"
                  name={['content', 'trim_spaces']}
                  valuePropName="checked"
                >
                  <Checkbox>Tự động xóa khoảng trắng đầu cuối</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Divider>Cấu hình các chỗ trống</Divider>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.content?.template !== currentValues.content?.template
              }
            >
              {({ getFieldValue }) => {
                const template = getFieldValue(['content', 'template']) || '';
                const blankMatches = template.match(/\{blank\d+\}/g) || [];
                const uniqueBlanks = Array.from(new Set(blankMatches)).sort();

                return (
                  <>
                    {uniqueBlanks.length > 0 ? (
                      <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {uniqueBlanks.map((blankPlaceholder) => {
                          const blankId = blankPlaceholder.replace(/[{}]/g, '');
                          return (
                            <Card
                              key={blankId}
                              type="inner"
                              size="small"
                              title={`Chỗ trống: ${blankPlaceholder}`}
                            >
                              <Form.Item
                                label="Các đáp án chấp nhận"
                                name={['content', 'blanks', blankId, 'accepted_answers']}
                                rules={[{ required: true, message: 'Nhập ít nhất 1 đáp án' }]}
                              >
                                <Select
                                  mode="tags"
                                  placeholder="Nhập các đáp án (nhấn Enter để thêm nhiều)"
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>

                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item
                                    label="Điểm số"
                                    name={['content', 'blanks', blankId, 'points']}
                                    rules={[{ required: true, message: 'Nhập điểm số' }]}
                                  >
                                    <InputNumber
                                      min={1}
                                      max={100}
                                      style={{ width: '100%' }}
                                      placeholder="Điểm cho chỗ trống này"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    label="Text gợi ý (tùy chọn)"
                                    name={['content', 'blanks', blankId, 'placeholder_text']}
                                  >
                                    <Input placeholder="VD: Nhập tên quốc gia" />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Card>
                          );
                        })}
                      </Space>
                    ) : (
                      <Typography.Text type="secondary">
                        Nhập template với {'{blank1}'}, {'{blank2}'}, ... để hiển thị cấu hình các chỗ trống
                      </Typography.Text>
                    )}
                  </>
                );
              }}
            </Form.Item>
          </Card>
        );

      case QuestionType.Matching:
        return (
          <Card title="Cấu hình Ghép cặp" type="inner">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Left Items */}
              <Card title="Danh sách bên trái" type="inner" size="small">
                <Form.List name={['content', 'left_items']}>
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
                            <Input placeholder="ID (L1, L2...)" style={{ width: 100 }} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'text']}
                            rules={[{ required: true, message: 'Nhập nội dung' }]}
                          >
                            <Input placeholder="Nội dung" style={{ width: 300 }} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'image_url']}
                          >
                            <Input placeholder="URL hình ảnh (tùy chọn)" style={{ width: 200 }} />
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
                          Thêm item bên trái
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>

              {/* Right Items */}
              <Card title="Danh sách bên phải" type="inner" size="small">
                <Form.List name={['content', 'right_items']}>
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
                            <Input placeholder="ID (R1, R2...)" style={{ width: 100 }} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'text']}
                            rules={[{ required: true, message: 'Nhập nội dung' }]}
                          >
                            <Input placeholder="Nội dung" style={{ width: 300 }} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'image_url']}
                          >
                            <Input placeholder="URL hình ảnh (tùy chọn)" style={{ width: 200 }} />
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
                          Thêm item bên phải
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>

              {/* Correct Pairs */}
              <Card title="Các cặp ghép đúng" type="inner" size="small">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.content?.left_items !== currentValues.content?.left_items ||
                    prevValues.content?.right_items !== currentValues.content?.right_items
                  }
                >
                  {({ getFieldValue }) => {
                    const leftItems = getFieldValue(['content', 'left_items']) || [];
                    const rightItems = getFieldValue(['content', 'right_items']) || [];

                    return (
                      <Form.List name={['content', 'correct_pairs']}>
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
                                  name={[name, 'left_id']}
                                  rules={[{ required: true, message: 'Chọn item trái' }]}
                                >
                                  <Select
                                    placeholder="Chọn bên trái"
                                    style={{ width: 250 }}
                                    options={leftItems.map((item: any) => ({
                                      label: `${item?.id || ''} - ${item?.text || ''}`,
                                      value: item?.id,
                                    })).filter((opt: any) => opt.value)}
                                  />
                                </Form.Item>
                                <span>⟷</span>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'right_id']}
                                  rules={[{ required: true, message: 'Chọn item phải' }]}
                                >
                                  <Select
                                    placeholder="Chọn bên phải"
                                    style={{ width: 250 }}
                                    options={rightItems.map((item: any) => ({
                                      label: `${item?.id || ''} - ${item?.text || ''}`,
                                      value: item?.id,
                                    })).filter((opt: any) => opt.value)}
                                  />
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
                                disabled={leftItems.length === 0 || rightItems.length === 0}
                              >
                                Thêm cặp ghép đúng
                              </Button>
                            </Form.Item>
                            {(leftItems.length === 0 || rightItems.length === 0) && (
                              <Typography.Text type="secondary">
                                Vui lòng thêm ít nhất 1 item ở cả 2 bên trước khi tạo cặp ghép
                              </Typography.Text>
                            )}
                          </>
                        )}
                      </Form.List>
                    );
                  }}
                </Form.Item>
              </Card>

              {/* Settings */}
              <Card title="Cài đặt" type="inner" size="small">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'randomize_left']}
                      valuePropName="checked"
                    >
                      <Checkbox>Xáo trộn danh sách trái</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'randomize_right']}
                      valuePropName="checked"
                    >
                      <Checkbox>Xáo trộn danh sách phải</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'partial_credit']}
                      valuePropName="checked"
                    >
                      <Checkbox>Cho điểm từng phần</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Card>
        );

      case QuestionType.Ordering:
        return (
          <Card title="Cấu hình Sắp xếp" type="inner">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Items List */}
              <Card title="Danh sách items" type="inner" size="small">
                <Form.List name={['content', 'items']}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          style={{ display: 'flex', marginBottom: 8 }}
                          align="baseline"
                        >
                          <Typography.Text style={{ minWidth: '30px' }}>
                            {name + 1}.
                          </Typography.Text>
                          <Form.Item
                            {...restField}
                            name={[name, 'id']}
                            rules={[{ required: true, message: 'Nhập ID' }]}
                          >
                            <Input placeholder="ID (O1, O2...)" style={{ width: 100 }} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'text']}
                            rules={[{ required: true, message: 'Nhập nội dung' }]}
                          >
                            <Input placeholder="Nội dung cần sắp xếp" style={{ width: 350 }} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'image_url']}
                          >
                            <Input placeholder="URL hình ảnh (tùy chọn)" style={{ width: 200 }} />
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
                          Thêm item
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <Typography.Text type="secondary">
                  Lưu ý: Thứ tự hiện tại là thứ tự đúng. Hệ thống sẽ tự động tạo correct_order từ thứ tự các items.
                </Typography.Text>
              </Card>

              {/* Correct Order (Auto-generated preview) */}
              <Card title="Thứ tự đúng" type="inner" size="small">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.content?.items !== currentValues.content?.items
                  }
                >
                  {({ getFieldValue }) => {
                    const items = getFieldValue(['content', 'items']) || [];

                    // Auto-generate correct_order from items order
                    const correctOrder = items.map((item: any) => item?.id).filter(Boolean);

                    return (
                      <>
                        {correctOrder.length > 0 ? (
                          <Space wrap>
                            {correctOrder.map((id: string, index: number) => (
                              <Tag key={id} color="blue">
                                {index + 1}. {id}
                              </Tag>
                            ))}
                          </Space>
                        ) : (
                          <Typography.Text type="secondary">
                            Chưa có items nào. Thêm items ở trên để xem thứ tự đúng.
                          </Typography.Text>
                        )}
                        {/* Hidden field to store correct_order */}
                        <Form.Item
                          name={['content', 'correct_order']}
                          hidden
                          initialValue={correctOrder}
                        >
                          <Input />
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.Item>
              </Card>

              {/* Settings */}
              <Card title="Cài đặt" type="inner" size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={['content', 'randomize_initial']}
                      valuePropName="checked"
                    >
                      <Checkbox>Xáo trộn thứ tự ban đầu</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={['content', 'partial_credit']}
                      valuePropName="checked"
                    >
                      <Checkbox>Cho điểm từng phần</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Card>
        );

      case QuestionType.ShortAnswer:
        return (
          <Card title="Cấu hình Trả lời ngắn" type="inner">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Accepted Answers */}
              <Form.Item
                label="Đáp án chấp nhận"
                name={['content', 'accepted_answers']}
                rules={[{ required: true, message: 'Nhập ít nhất 1 đáp án chấp nhận' }]}
                tooltip="Nhấn Enter để thêm nhiều đáp án"
              >
                <Select
                  mode="tags"
                  placeholder="Nhập các đáp án chấp nhận (có thể nhiều)"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {/* Placeholder Text */}
              <Form.Item
                label="Text gợi ý (tùy chọn)"
                name={['content', 'placeholder_text']}
              >
                <Input placeholder="VD: Nhập câu trả lời của bạn..." />
              </Form.Item>

              {/* Max Length */}
              <Form.Item
                label="Độ dài tối đa (ký tự)"
                name={['content', 'max_length']}
                rules={[
                  { required: true, message: 'Nhập độ dài tối đa' },
                  { type: 'number', min: 1, max: 500, message: 'Từ 1 đến 500 ký tự' }
                ]}
              >
                <InputNumber
                  min={1}
                  max={500}
                  style={{ width: '100%' }}
                  placeholder="Tối đa 500 ký tự"
                />
              </Form.Item>

              {/* Matching Settings */}
              <Card title="Cài đặt so khớp" type="inner" size="small">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'case_sensitive']}
                      valuePropName="checked"
                    >
                      <Checkbox>Phân biệt hoa thường</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'exact_match']}
                      valuePropName="checked"
                    >
                      <Checkbox>Khớp chính xác</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={['content', 'fuzzy_matching']}
                      valuePropName="checked"
                      tooltip="Cho phép sai sót nhỏ trong câu trả lời"
                    >
                      <Checkbox>Khớp mờ (Fuzzy)</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Alert
                message="Lưu ý"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                    <li>Khớp chính xác: Đáp án phải giống hệt một trong các đáp án chấp nhận</li>
                    <li>Khớp mờ: Chấp nhận đáp án có sai sót nhỏ (lỗi chính tả, thừa khoảng trắng...)</li>
                    <li>Nếu bật cả hai, khớp chính xác sẽ được ưu tiên</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </Space>
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
            // Multiple Choice fields
            options: [
              { id: 'a', text: '', order: 1, image_url: '' },
              { id: 'b', text: '', order: 2, image_url: '' },
            ],
            correct_answers: [],
            multiple_correct: false,
            randomize_options: false,
            partial_credit: false,
            // True False fields
            correct_answer: true,
            true_label: '',
            false_label: '',
            // Fill blank fields
            template: '',
            blanks: {},
            case_sensitive: false,
            trim_spaces: true,
            // Matching fields
            left_items: [],
            right_items: [],
            correct_pairs: [],
            randomize_left: false,
            randomize_right: false,
            // Ordering fields
            items: [],
            correct_order: [],
            randomize_initial: false,
            // Short Answer fields
            accepted_answers: [],
            exact_match: false,
            max_length: 200,
            placeholder_text: '',
            fuzzy_matching: false,
            // Essay fields
            min_words: undefined,
            max_words: undefined,
            suggested_length: '',
            rubric_criteria: [],
            sample_answer: '',
            auto_grade: false,
            key_words: [],
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
            {/* DEPRECATED: time_limit is not used in timing logic. Assessment.Duration is used instead.
            <Col xs={24} sm={12}>
              <Form.Item
                label="Giới hạn thời gian (giây)"
                name="time_limit"
              >
                <InputNumber
                  min={5}
                  max={7200}
                  style={{ width: '100%' }}
                  placeholder="Không giới hạn"
                />
              </Form.Item>
            </Col>
            */}
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
