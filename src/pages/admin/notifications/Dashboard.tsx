import {
    ApiOutlined,
    CheckCircleOutlined,
    HddOutlined,
    MessageOutlined,
    SendOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Row, Statistic, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import notificationService from '../../../services/notificationService';
import { apiService } from '../../../services/api';
import { API_ENDPOINTS } from '../../../config/api';
import ManualSendNotification from '../../../components/notifications/ManualSendNotification';

const { Title, Text } = Typography;

const NotificationDashboard: React.FC = () => {
    const [sendModalVisible, setSendModalVisible] = useState(false);

    // Fetch Stats
    const { data: sseStats, isLoading: statsLoading } = useQuery({
        queryKey: ['sse_stats'],
        queryFn: () => notificationService.getSSEStats(),
        refetchInterval: 10000,
    });

    // Fetch Health
    const { data: health, isLoading: healthLoading } = useQuery({
        queryKey: ['health'],
        queryFn: () => apiService.get<any>(API_ENDPOINTS.HEALTH),
        refetchInterval: 30000,
    });

    // Diagram Visualization (Simple CSS)
    const Diagram = () => (
        <Card title="System Flow" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: '20px', flexWrap: 'wrap' }}>
                <Card size="small" style={{ borderColor: '#1890ff', textAlign: 'center' }}>
                    <ApiOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <div>API Gateway</div>
                </Card>
                <div style={{ fontSize: 20 }}>→</div>
                <Card size="small" style={{ borderColor: '#52c41a', textAlign: 'center' }}>
                    <MessageOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                    <div>Notification Svc</div>
                </Card>
                <div style={{ fontSize: 20 }}>→</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Tag color="blue">📧 SMTP (Email)</Tag>
                    <Tag color="green">🔔 SSE (Realtime)</Tag>
                    <Tag color="orange">📱 Push (Mobile)</Tag>
                </div>
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
                <Text type="secondary">Redis Stream Event Bus connects Assessment Service → Notification Service</Text>
            </div>
        </Card>
    );

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2}>Notification Dashboard</Title>
                <Button type="primary" icon={<SendOutlined />} onClick={() => setSendModalVisible(true)}>
                    Quick Send / Broadcast
                </Button>
            </div>

            <Row gutter={[16, 16]}>
                {/* Stats Row */}
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Active SSE Connections"
                            value={sseStats?.activeUserConnections ?? 0}
                            prefix={<ApiOutlined />}
                            loading={statsLoading}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Service Health"
                            value={health?.status || 'Unknown'}
                            valueStyle={{ color: health?.status === 'UP' ? '#3f8600' : '#cf1322' }}
                            prefix={health?.status === 'UP' ? <CheckCircleOutlined /> : <HddOutlined />}
                            loading={healthLoading}
                        />
                        <Text type="secondary">DB: {health?.components?.db?.status}</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Pending Events"
                            // Mocking this as the API doesn't expose it yet in the provided spec
                            value={0}
                            prefix={<SyncOutlined spin={false} />}
                        />
                        <Text type="secondary">Redis Stream Lag</Text>
                    </Card>
                </Col>

                {/* Main Content */}
                <Col xs={24} md={14}>
                    <Diagram />
                </Col>
                <Col xs={24} md={10}>
                    <Card title="Quick Actions">
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <Button type="primary" onClick={() => setSendModalVisible(true)}>Send Notification</Button>
                            <Button onClick={() => notificationService.broadcastMessage('global', 'Test Broadcast')}>Test Global Broadcast</Button>
                        </div>
                    </Card>
                    <Card title="Recent Activity" style={{ marginTop: 16 }}>
                        <Text type="secondary">No recent activity logs available via API.</Text>
                    </Card>
                </Col>
            </Row>

            <ManualSendNotification
                visible={sendModalVisible}
                onClose={() => setSendModalVisible(false)}
            />
        </div>
    );
};

export default NotificationDashboard;
