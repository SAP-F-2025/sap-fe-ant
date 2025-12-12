import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Card,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Typography,
    message,
} from 'antd';
import React, { useState } from 'react';
import notificationService from '../../../services/notificationService';
import { Template, TemplateCreate } from '../../../types/notification';

const { Title } = Typography;
const { TextArea } = Input;

const TemplatesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    // Fetch Templates
    const { data, isLoading } = useQuery({
        queryKey: ['templates'],
        queryFn: () => notificationService.getTemplates({ size: 100 }), // Simplified pagination
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: (data: TemplateCreate) => notificationService.createTemplate(data),
        onSuccess: () => {
            message.success('Template created successfully');
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            handleCloseModal();
        },
        onError: () => message.error('Failed to create template'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ name, data }: { name: string; data: TemplateCreate }) =>
            notificationService.updateTemplate(name, data),
        onSuccess: () => {
            message.success('Template updated successfully');
            queryClient.invalidateQueries({ queryKey: ['templates'] });
            handleCloseModal();
        },
        onError: () => message.error('Failed to update template'),
    });

    const deleteMutation = useMutation({
        mutationFn: (name: string) => notificationService.deleteTemplate(name),
        onSuccess: () => {
            message.success('Template deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['templates'] });
        },
        onError: () => message.error('Failed to delete template'),
    });

    const handleOpenModal = (template?: Template) => {
        if (template) {
            setEditingTemplate(template);
            form.setFieldsValue({
                ...template,
                // If variables is an object, form might need special handling if we want to edit them
                // For now we assume variables are just placeholders in body
            });
        } else {
            setEditingTemplate(null);
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTemplate(null);
        form.resetFields();
    };

    const handleSubmit = (values: TemplateCreate) => {
        if (editingTemplate) {
            updateMutation.mutate({ name: editingTemplate.name, data: values });
        } else {
            createMutation.mutate(values);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => (
                <Tag color={type === 'EMAIL' ? 'gold' : 'cyan'}>{type}</Tag>
            ),
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Template) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleOpenModal(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this template?"
                        onConfirm={() => deleteMutation.mutate(record.name)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 24,
                }}
            >
                <Title level={2}>Notification Templates</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenModal()}
                >
                    Create Template
                </Button>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={data?.content || []}
                    rowKey="id"
                    loading={isLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingTemplate ? 'Edit Template' : 'Create Template'}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ type: 'EMAIL' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Template Name"
                                rules={[
                                    { required: true, message: 'Please enter template name' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Alphanumeric and underscore only' }
                                ]}
                            >
                                <Input disabled={!!editingTemplate} placeholder="e.g. welcome_email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[{ required: true }]}
                            >
                                <Select disabled={!!editingTemplate}>
                                    <Select.Option value="EMAIL">Email</Select.Option>
                                    <Select.Option value="PUSH">Push Notification</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="subject"
                        label="Subject"
                        rules={[{ required: true, message: 'Please enter subject' }]}
                    >
                        <Input placeholder="Notification subject (supports {{variable}})" />
                    </Form.Item>

                    <Form.Item
                        name="body"
                        label="Body Content"
                        rules={[{ required: true, message: 'Please enter body content' }]}
                        help="Supports HTML and {{variable}} interpolation"
                    >
                        <TextArea rows={10} placeholder="<html>...</html>" style={{ fontFamily: 'monospace' }} />
                    </Form.Item>

                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createMutation.isPending || updateMutation.isPending}
                            >
                                {editingTemplate ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

// Add explicit import for Col and Row to avoid "ReferenceError: Col is not defined" handled by auto-imports?
// No, I missed importing Col and Row from antd in the implementation above.
// Correcting imports in the code block.

import { Col, Row } from 'antd'; // Appended to imports

export default TemplatesPage;
