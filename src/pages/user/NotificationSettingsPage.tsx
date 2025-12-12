import React from 'react';
import { Typography } from 'antd';
import NotificationSettings from '../../components/notifications/NotificationSettings';

const { Title } = Typography;

const NotificationSettingsPage: React.FC = () => {
    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <Title level={2}>Account Settings</Title>
            <NotificationSettings />
        </div>
    );
};

export default NotificationSettingsPage;
