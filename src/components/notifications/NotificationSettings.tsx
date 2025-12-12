import { Button, Card, Col, Divider, Form, Row, Select, Switch, Typography, message } from 'antd';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import notificationService from '../../services/notificationService';
import { PreferencesCreate } from '../../types/notification';

const { Title, Text } = Typography;

const NotificationSettings: React.FC = () => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    const { data: preferences, isLoading } = useQuery({
        queryKey: ['preferences'],
        queryFn: () => notificationService.getPreferences(),
    });

    const mutation = useMutation({
        mutationFn: (data: PreferencesCreate) => notificationService.updatePreferences(data),
        onSuccess: () => {
            message.success('Preferences updated successfully');
            queryClient.invalidateQueries({ queryKey: ['preferences'] });
        },
        onError: () => message.error('Failed to update preferences'),
    });

    const handleSave = (values: any) => {
        // Transform form values back to nested structure if flat, but here we can map directly
        // The structure matches PreferencesCreate interface mostly
        mutation.mutate(values);
    };

    // Prepare initial values
    const initialValues = preferences ? {
        notificationsEnabled: preferences.notificationsEnabled,
        emailEnabled: preferences.emailEnabled,
        pushEnabled: preferences.pushEnabled,
        emailFrequency: preferences.emailFrequency,
        ...preferences.notificationTypes // Spread for generic access or specific mapping below
    } : {};

    if (isLoading) return <div>Loading settings...</div>;

    return (
        <Card title="Notification Preferences">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={preferences || {
                    notificationsEnabled: true,
                    emailEnabled: true,
                    pushEnabled: true,
                    emailFrequency: 'IMMEDIATE'
                }}
            >
                {/* Global Settings */}
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item name="notificationsEnabled" valuePropName="checked" label="Enable All Notifications">
                            <Switch checkedChildren="On" unCheckedChildren="Off" />
                        </Form.Item>
                        <Text type="secondary">Global master switch for all notifications.</Text>
                    </Col>
                </Row>

                <Divider />

                <Title level={5}>Channels</Title>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item name="emailEnabled" valuePropName="checked" label="Email Notifications">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="pushEnabled" valuePropName="checked" label="Push Notifications (Web)">
                            <Switch />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="emailFrequency" label="Email Frequency">
                            <Select>
                                <Select.Option value="IMMEDIATE">Immediate</Select.Option>
                                <Select.Option value="DAILY">Daily Digest</Select.Option>
                                <Select.Option value="WEEKLY">Weekly Digest</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                {/* Granular Settings (Mocked list based on spec examples, 
                    ideally we iterate over keys if keys are dynamic, 
                    but usually UI has specific labels for known types) */}
                <Title level={5}>Notification Types</Title>

                {/* 
                   Since `preferences.notificationTypes` is a Record<string, Setting>,
                   we can iterate it.
                */}
                {preferences?.notificationTypes && Object.entries(preferences.notificationTypes).map(([key, setting]) => (
                    <div key={key} style={{ marginBottom: 16 }}>
                        <Text strong>{key.replace(/_/g, ' ').toUpperCase()}</Text>
                        <Row gutter={16} style={{ marginTop: 8 }}>
                            <Col>
                                <Form.Item name={['notificationTypes', key, 'enabled']} valuePropName="checked" label="Enabled" initialValue={setting.enabled}>
                                    <Switch size="small" />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item name={['notificationTypes', key, 'emailEnabled']} valuePropName="checked" label="Email" initialValue={setting.emailEnabled}>
                                    <Switch size="small" />
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item name={['notificationTypes', key, 'pushEnabled']} valuePropName="checked" label="Push" initialValue={setting.pushEnabled}>
                                    <Switch size="small" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                ))}

                {!preferences?.notificationTypes && <Text type="secondary">No granular settings available yet.</Text>}

                <Form.Item style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default NotificationSettings;
