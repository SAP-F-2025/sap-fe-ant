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
  DatePicker,
  Switch,
  Divider,
  Spin,
} from 'antd';
import { SaveOutlined, RollbackOutlined } from '@ant-design/icons';
import { AssessmentCreateRequest } from '../../types';
import assessmentService from '../../services/assessmentService';
import { showSuccess } from '../../utils/errorHandler';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit && id) {
      fetchAssessment(parseInt(id));
    }
  }, [id]);

  const fetchAssessment = async (assessmentId: number) => {
    setLoading(true);
    try {
      const assessment = await assessmentService.getAssessment(assessmentId);
      form.setFieldsValue({
        ...assessment,
        due_date: assessment.due_date ? dayjs(assessment.due_date) : null,
      });
    } catch (error) {
      // Error will be handled by axios interceptor
      navigate('/assessments');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const data: AssessmentCreateRequest = {
        ...values,
        due_date: values.due_date ? values.due_date.toISOString() : undefined,
      };

      if (isEdit && id) {
        await assessmentService.updateAssessment(parseInt(id), data);
        showSuccess('Cập nhật bài thi thành công');
      } else {
        await assessmentService.createAssessment(data);
        showSuccess('Tạo bài thi thành công');
      }

      navigate('/assessments');
    } catch (error) {
      // Error will be handled by axios interceptor with notification
      // No need to show message here
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
            {isEdit ? 'Chỉnh sửa bài thi' : 'Tạo bài thi mới'}
          </Title>
        </Col>
        <Col>
          <Button
            icon={<RollbackOutlined />}
            onClick={() => navigate('/assessments')}
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
          duration: 60,
          passing_score: 70,
          max_attempts: 1,
          time_warning: 300,
          settings: {
            randomize_questions: false,
            randomize_options: false,
            questions_per_page: 1,
            show_progress_bar: true,
            time_limit_enforced: true,
            auto_submit_on_timeout: true,
            require_webcam: false,
            prevent_tab_switching: false,
            prevent_right_click: false,
            prevent_copy_paste: false,
            require_identity_verification: false,
            require_full_screen: false,
            allow_screen_reader: true,
            font_size_adjustment: 0,
            high_contrast_mode: false,
          },
        }}
      >
        <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Tiêu đề bài thi"
                name="title"
                rules={[
                  { required: true, message: 'Vui lòng nhập tiêu đề' },
                  { max: 200, message: 'Tiêu đề không được quá 200 ký tự' },
                ]}
              >
                <Input placeholder="Nhập tiêu đề bài thi" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  { max: 1000, message: 'Mô tả không được quá 1000 ký tự' },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập mô tả bài thi"
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Thời gian làm bài (phút)"
                name="duration"
                rules={[
                  { required: true, message: 'Vui lòng nhập thời gian' },
                ]}
              >
                <InputNumber
                  min={5}
                  max={300}
                  style={{ width: '100%' }}
                  placeholder="60"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Điểm qua môn (%)"
                name="passing_score"
                rules={[
                  { required: true, message: 'Vui lòng nhập điểm qua môn' },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  placeholder="70"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Số lần thử tối đa"
                name="max_attempts"
                tooltip="Số lần học sinh có thể làm bài kiểm tra này. Đặt 1 nếu không cho phép làm lại."
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: '100%' }}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Form.Item
                label="Thời gian cảnh báo (giây)"
                name="time_warning"
                tooltip="Cảnh báo trước khi hết giờ"
              >
                <InputNumber
                  min={60}
                  max={3600}
                  style={{ width: '100%' }}
                  placeholder="300"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Hạn nộp bài" name="due_date">
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  style={{ width: '100%' }}
                  placeholder="Chọn hạn nộp bài"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Cài đặt hiển thị" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Xáo trộn thứ tự câu hỏi"
                name={['settings', 'randomize_questions']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Xáo trộn thứ tự đáp án"
                name={['settings', 'randomize_options']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Hiển thị thanh tiến trình"
                name={['settings', 'show_progress_bar']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Bắt buộc giới hạn thời gian"
                name={['settings', 'time_limit_enforced']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Tự động nộp khi hết giờ"
                name={['settings', 'auto_submit_on_timeout']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Cài đặt giám sát (Proctoring)" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Yêu cầu camera"
                name={['settings', 'require_webcam']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Ngăn chuyển tab"
                name={['settings', 'prevent_tab_switching']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Ngăn chuột phải"
                name={['settings', 'prevent_right_click']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Ngăn sao chép/dán"
                name={['settings', 'prevent_copy_paste']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Yêu cầu toàn màn hình"
                name={['settings', 'require_full_screen']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Yêu cầu xác thực danh tính"
                name={['settings', 'require_identity_verification']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Hỗ trợ truy cập (Accessibility)" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Cho phép đọc màn hình"
                name={['settings', 'allow_screen_reader']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Chế độ tương phản cao"
                name={['settings', 'high_contrast_mode']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                label="Điều chỉnh kích thước font"
                name={['settings', 'font_size_adjustment']}
                tooltip="Từ -2 đến +2"
              >
                <InputNumber
                  min={-2}
                  max={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
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
              {isEdit ? 'Cập nhật' : 'Tạo bài thi'}
            </Button>
            <Button onClick={() => navigate('/assessments')} size="large">
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default AssessmentForm;
