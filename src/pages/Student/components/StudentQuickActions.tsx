import {
    BookOutlined,
    CustomerServiceOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

/**
 * StudentQuickActions Component
 * Floating action button group for quick navigation
 */
export const StudentQuickActions: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <FloatButton.Group
            trigger="hover"
            type="primary"
            style={{ right: 24, bottom: 24 }}
            icon={<CustomerServiceOutlined />}
        >
            <FloatButton
                tooltip={t('studentDashboard.quickActions.viewAssessments')}
                icon={<BookOutlined />}
                onClick={() => navigate('/student/assessments')}
            />
            <FloatButton
                tooltip={t('studentDashboard.quickActions.viewHistory')}
                icon={<FileTextOutlined />}
                onClick={() => navigate('/student/history')}
            />
            <FloatButton
                tooltip={t('studentDashboard.quickActions.help')}
                icon={<QuestionCircleOutlined />}
            />
        </FloatButton.Group>
    );
};
