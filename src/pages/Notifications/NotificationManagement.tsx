import {
    BellOutlined,
    DeleteOutlined,
    EditOutlined,
    MailOutlined,
    PlusOutlined,
    ReloadOutlined,
    SendOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tabs,
    TabsProps,
    Tag,
    Typography,
    message
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import notificationService, { Template, TemplateCreate } from '../../services/notificationService';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NotificationManagement: React.FC = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleSendNotification = async (values: any) => {
        setLoading(true);
        try {
            const { type, groupId, userId, title, content, channel } = values;
            const finalContent = JSON.stringify({ title, content, channel }); // Simple wrapping for now, backend might expect JSON string or just string

            if (type === 'USER') {
                await notificationService.sendTestNotificationToUser(Number(userId), content, 'admin_notification', title);
            } else if (type === 'GROUP') {
                await notificationService.broadcastToTopic(`group-${groupId}`, content); // Assuming group topic pattern, but payload might need structure
                // Note: The specific backend logic for group broadcast via SSE topic needs careful alignment.
                // For now adhering to the generic 'broadcastToTopic' available test endpoint.
            } else if (type === 'BROADCAST') {
                // Broadcast to all
                await notificationService.broadcastToTopic('global', content);
            }

            messageApi.success(t('common.success') || 'Notification sent successfully');
            form.resetFields();
        } catch (error) {
            console.error(error);
            messageApi.error(t('common.error') || 'Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    const SendNotificationTab = () => {
        // Template Selection State
        const [templates, setTemplates] = useState<Template[]>([]);
        const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
        const [variableValues, setVariableValues] = useState<Record<string, string>>({});

        useEffect(() => {
            fetchTemplatesForSelect();
        }, []);

        const fetchTemplatesForSelect = async () => {
            try {
                // Fetch all templates (page 0, size 100 for simplicity)
                const data = await notificationService.getAllTemplates(0, 100);
                setTemplates(data.content);
            } catch (error) {
                console.error('Failed to load templates for selection', error);
            }
        };

        const handleTemplateChange = (templateId: string) => {
            const template = templates.find(t => t.id === templateId);
            if (template) {
                setSelectedTemplate(template);
                form.setFieldsValue({
                    title: template.subject,
                    // We don't set 'content' directly yet, we will generate it
                });
                setVariableValues({}); // Reset variables
            } else {
                setSelectedTemplate(null);
            }
        };

        const handleVariableChange = (key: string, value: string) => {
            const newValues = { ...variableValues, [key]: value };
            setVariableValues(newValues);

            // Auto-generate content based on template
            if (selectedTemplate) {
                let content = selectedTemplate.body;
                Object.entries(newValues).forEach(([k, v]) => {
                    content = content.replace(new RegExp(`{{${k}}}`, 'g'), v);
                });
                form.setFieldsValue({ content });
            }
        };

        return (
            <Card variant="outlined">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSendNotification}
                    style={{ maxWidth: 800 }}
                >
                    {/* Template Selection */}
                    <Form.Item label="Use Template (Optional)">
                        <Select
                            placeholder="Select a template..."
                            allowClear
                            onChange={handleTemplateChange}
                        >
                            {templates.map(t => (
                                <Option key={t.id} value={t.id}>{t.name} ({t.type})</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Dynamic Variable Inputs */}
                    {selectedTemplate && selectedTemplate.variables && (
                        <Card size="small" title="Template Variables" style={{ marginBottom: 24, background: '#f5f5f5' }}>
                            {Object.keys(selectedTemplate.variables).map(key => (
                                <Form.Item
                                    key={key}
                                    label={key}
                                    required
                                    help={`Type: ${selectedTemplate.variables[key]}`}
                                >
                                    <Input
                                        onChange={(e) => handleVariableChange(key, e.target.value)}
                                        placeholder={`Enter value for ${key}`}
                                    />
                                </Form.Item>
                            ))}
                        </Card>
                    )}

                    <Form.Item
                        name="type"
                        label="Notification Type"
                        rules={[{ required: true, message: 'Please select a type' }]}
                        initialValue="BROADCAST"
                    >
                        <Select>
                            <Option value="BROADCAST">Broadcast (All Users)</Option>
                            <Option value="GROUP">Specific Group</Option>
                            <Option value="USER">Specific User</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('type') === 'GROUP' ? (
                                <Form.Item
                                    name="groupId"
                                    label="Group ID"
                                    rules={[{ required: true, message: 'Please enter group ID' }]}
                                >
                                    <Input prefix={<TeamOutlined />} placeholder="Enter Group ID" />
                                </Form.Item>
                            ) : getFieldValue('type') === 'USER' ? (
                                <Form.Item
                                    name="userId"
                                    label="User ID"
                                    rules={[{ required: true, message: 'Please enter user ID' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Enter User ID" />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input prefix={<BellOutlined />} placeholder="Notification Title" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please enter content' }]}
                    >
                        <TextArea rows={4} placeholder="Notification Content" />
                    </Form.Item>

                    <Form.Item
                        name="channel"
                        label="Channel"
                        initialValue={['IN_APP']}
                    >
                        <Select mode="multiple">
                            <Option value="IN_APP">In-App Notification</Option>
                            <Option value="EMAIL">Email</Option>
                            <Option value="PUSH">Push Notification</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading}>
                            Send Notification
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    };

    const NotificationTemplatesTab = () => {
        const [templates, setTemplates] = useState<Template[]>([]);
        const [loadingTemplates, setLoadingTemplates] = useState(false);
        const [isModalVisible, setIsModalVisible] = useState(false);
        const [templateForm] = Form.useForm();
        const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

        const fetchTemplates = async (page = 1, pageSize = 10) => {
            setLoadingTemplates(true);
            try {
                const data = await notificationService.getAllTemplates(page - 1, pageSize);
                setTemplates(data.content);
                setPagination({
                    current: page,
                    pageSize: pageSize,
                    total: data.totalElements
                });
            } catch (error) {
                messageApi.error('Failed to fetch templates');
            } finally {
                setLoadingTemplates(false);
            }
        };

        useEffect(() => {
            fetchTemplates();
        }, []);

        const handleCreateTemplate = async (values: TemplateCreate) => {
            try {
                await notificationService.createTemplate(values);
                messageApi.success('Template created successfully');
                setIsModalVisible(false);
                templateForm.resetFields();
                fetchTemplates(pagination.current, pagination.pageSize);
            } catch (error) {
                messageApi.error('Failed to create template');
            }
        };

        const handleDeleteTemplate = async (name: string) => {
            try {
                await notificationService.deleteTemplate(name);
                messageApi.success('Template deleted successfully');
                fetchTemplates(pagination.current, pagination.pageSize);
            } catch (error) {
                messageApi.error('Failed to delete template');
            }
        };

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render: (type: string) => (
                    <Tag color={type === 'EMAIL' ? 'blue' : 'green'}>{type}</Tag>
                ),
            },
            {
                title: 'Subject',
                dataIndex: 'subject',
                key: 'subject',
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_: any, record: Template) => (
                    <Space size="middle">
                        <Popconfirm
                            title="Delete this template?"
                            onConfirm={() => handleDeleteTemplate(record.name)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger icon={<DeleteOutlined />}>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        return (
            <Card variant="outlined">
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Title level={4} style={{ margin: 0 }}>Templates Management</Title>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={() => fetchTemplates(pagination.current, pagination.pageSize)} loading={loadingTemplates}>
                            Refresh
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                            Create New Template
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={templates}
                    rowKey="id"
                    loading={loadingTemplates}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: (page, pageSize) => fetchTemplates(page, pageSize),
                        showSizeChanger: true
                    }}
                />

                <Modal
                    title="Create New Template"
                    open={isModalVisible}
                    onOk={() => templateForm.submit()}
                    onCancel={() => setIsModalVisible(false)}
                >
                    <Form
                        form={templateForm}
                        layout="vertical"
                        onFinish={handleCreateTemplate}
                    >
                        <Form.Item
                            name="name"
                            label="Template Name"
                            rules={[{ required: true, message: 'Please enter template name' }]}
                        >
                            <Input placeholder="e.g., welcome_email" />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Type"
                            rules={[{ required: true, message: 'Please select type' }]}
                            initialValue="EMAIL"
                        >
                            <Select>
                                <Option value="EMAIL">Email</Option>
                                <Option value="PUSH">Push</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="subject"
                            label="Subject"
                            rules={[{ required: true, message: 'Please enter subject' }]}
                        >
                            <Input placeholder="Notification Subject" />
                        </Form.Item>
                        <Form.Item
                            name="body"
                            label="Body (HTML supported)"
                            rules={[{ required: true, message: 'Please enter body' }]}
                        >
                            <TextArea rows={6} placeholder="<html>...</html>" />
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        );
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: (
                <span>
                    <SendOutlined />
                    Send Notification
                </span>
            ),
            children: <SendNotificationTab />,
        },
        {
            key: '2',
            label: (
                <span>
                    <MailOutlined />
                    Templates
                </span>
            ),
            children: <NotificationTemplatesTab />,
        },
    ];

    return (
        <div className="notification-management-page" style={{ padding: 24 }}>
            {contextHolder}
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>Manage Notifications</Title>
                <Text type="secondary">Send notifications and manage templates</Text>
            </div>

            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
};



export default NotificationManagement;
