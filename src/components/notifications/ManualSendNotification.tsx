import { Button, Form, Input, message, Modal, Select, Tabs } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import notificationService from '../../services/notificationService';
import { apiService } from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

interface ManualSendNotificationProps {
    visible: boolean;
    onClose: () => void;
    userId?: number;
}

const ManualSendNotification: React.FC<ManualSendNotificationProps> = ({
    visible,
    onClose,
    userId,
}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('single');

    // User search state
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [users, setUsers] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    // Search users effect
    React.useEffect(() => {
        if (debouncedSearch) {
            setSearching(true);
            // Assuming there is a user search endpoint or we use the generic one
            // The API config has USERS_SEARCH
            apiService.get<any>(API_ENDPOINTS.USERS_SEARCH, { params: { q: debouncedSearch } })
                .then(res => {
                    // API might return array or page
                    const list = Array.isArray(res) ? res : (res as any).content || [];
                    setUsers(list);
                })
                .catch(() => setUsers([]))
                .finally(() => setSearching(false));
        }
    }, [debouncedSearch]);


    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            if (activeTab === 'single') {
                // Ensure targetUserId is number
                await notificationService.sendTestNotificationToUserCorrected(
                    Number(values.targetUserId),
                    values.message,
                    values.type,
                    values.subject
                );
                message.success('Notification sent to user');
            } else {
                await notificationService.broadcastMessage(values.topic, values.message);
                message.success(`Broadcast sent to topic: ${values.topic}`);
            }
            form.resetFields();
            onClose();
        } catch (error) {
            message.error('Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    const handleUserSearch = (value: string) => {
        setSearchTerm(value);
    };

    return (
        <Modal
            title="Send Manual Notification"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'single',
                        label: 'Single User',
                        children: (
                            <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ type: 'info', targetUserId: userId }}>
                                <Form.Item
                                    name="targetUserId"
                                    label="Target User"
                                    rules={[{ required: true, message: 'Please select a user' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Search by name or email"
                                        onSearch={handleUserSearch}
                                        filterOption={false}
                                        loading={searching}
                                        notFoundContent={searching ? 'Searching...' : 'No users found'}
                                        disabled={!!userId}
                                    >
                                        {users.map((u: any) => (
                                            <Select.Option key={u.id} value={u.id}>
                                                {u.fullName || u.username} ({u.email})
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
                                    <Input placeholder="Notification Subject" />
                                </Form.Item>
                                <Form.Item name="type" label="Type">
                                    <Select>
                                        <Select.Option value="info">Info</Select.Option>
                                        <Select.Option value="warning">Warning</Select.Option>
                                        <Select.Option value="error">Error</Select.Option>
                                        <Select.Option value="success">Success</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                                    <Input.TextArea rows={4} placeholder="HTML content is supported" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} block>
                                        Send Notification
                                    </Button>
                                </Form.Item>
                            </Form>
                        ),
                    },
                    {
                        key: 'broadcast',
                        label: 'Broadcast',
                        children: (
                            <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ topic: 'global' }}>
                                <Form.Item name="topic" label="Topic" rules={[{ required: true }]}>
                                    <Select mode="tags">
                                        <Select.Option value="global">Global (All Users)</Select.Option>
                                        <Select.Option value="students">Students</Select.Option>
                                        <Select.Option value="teachers">Teachers</Select.Option>
                                        <Select.Option value="admins">Admins</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                                    <Input.TextArea rows={4} placeholder="Content" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="danger" htmlType="submit" loading={loading} block>
                                        Broadcast Message
                                    </Button>
                                </Form.Item>
                            </Form>
                        ),
                    },
                ]}
            />
        </Modal>
    );
};

export default ManualSendNotification;
