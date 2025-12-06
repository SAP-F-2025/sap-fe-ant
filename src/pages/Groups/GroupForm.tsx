import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    Button,
    Space,
    Typography,
    Form,
    Input,
    Select,
    Flex,
    Spin,
} from 'antd';
import { elevation } from '../../styles/elevation';
import { ArrowLeftOutlined, SaveOutlined, TeamOutlined } from '@ant-design/icons';
import { GroupResponse, GroupCreateRequest, GroupUpdateRequest } from '../../types';
import groupService from '../../services/groupService';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Title, Text } = Typography;

const GroupForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const isEdit = !!id;
    const groupId = parseInt(id || '0');

    useEffect(() => {
        if (isEdit && groupId) {
            fetchGroup();
        }
    }, [groupId]);

    const fetchGroup = async () => {
        setLoading(true);
        try {
            const data = await groupService.getGroup(groupId);
            form.setFieldsValue({
                name: data.name,
                display_name: data.display_name,
                description: data.description,
                type: data.type,
            });
        } catch (error) {
            showError('Không thể tải thông tin nhóm');
            navigate('/groups');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: GroupCreateRequest | GroupUpdateRequest) => {
        setSaving(true);
        try {
            if (isEdit) {
                await groupService.updateGroup(groupId, values as GroupUpdateRequest);
                showSuccess('Đã cập nhật nhóm');
            } else {
                await groupService.createGroup(values as GroupCreateRequest);
                showSuccess('Đã tạo nhóm mới');
            }
            navigate('/groups');
        } catch (error) {
            // handled by interceptor
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ minHeight: 400 }}>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 800 }}>
            {/* Header */}
            <Flex justify="space-between" align="center">
                <Space>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/groups')}
                    >
                        Quay lại
                    </Button>
                    <Title level={2} style={{ margin: 0 }}>
                        <TeamOutlined style={{ marginRight: 8 }} />
                        {isEdit ? 'Chỉnh sửa nhóm' : 'Tạo nhóm mới'}
                    </Title>
                </Space>
            </Flex>

            {/* Form */}
            <Card style={{ ...elevation[1], borderRadius: 16 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ type: 'class' }}
                >
                    <Form.Item
                        name="name"
                        label="Mã nhóm"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã nhóm' },
                            { pattern: /^[a-z0-9-]+$/, message: 'Chỉ chứa chữ thường, số và gạch ngang' },
                        ]}
                        extra="Mã định danh duy nhất, không thể thay đổi sau khi tạo"
                    >
                        <Input
                            placeholder="vd: lop-12a1"
                            disabled={isEdit}
                            style={{ maxWidth: 300 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="display_name"
                        label="Tên hiển thị"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
                    >
                        <Input placeholder="vd: Lớp 12A1 - Toán nâng cao" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại nhóm"
                        rules={[{ required: true, message: 'Vui lòng chọn loại nhóm' }]}
                    >
                        <Select
                            style={{ maxWidth: 200 }}
                            options={[
                                { label: 'Lớp học', value: 'class' },
                                { label: 'Nhóm học', value: 'study-group' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Mô tả chi tiết về nhóm..."
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space>
                            <Button onClick={() => navigate('/groups')}>
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={saving}
                                icon={<SaveOutlined />}
                            >
                                {isEdit ? 'Lưu thay đổi' : 'Tạo nhóm'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </Space>
    );
};

export default GroupForm;
