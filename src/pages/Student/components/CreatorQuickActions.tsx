import {
    BankOutlined,
    BookOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { FloatButton } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const CreatorQuickActions: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <FloatButton.Group
            trigger="hover"
            type="primary"
            style={{ right: 24, bottom: 24 }}
            icon={<PlusOutlined />}
        >
            <FloatButton
                tooltip={t('creatorDashboard.quickActions.createAssessment')}
                icon={<BookOutlined />}
                onClick={() => navigate('/student/manage-assessments/new')}
            />
            <FloatButton
                tooltip={t('creatorDashboard.quickActions.createQuestion')}
                icon={<QuestionCircleOutlined />}
                onClick={() => navigate('/student/questions/new')}
            />
            <FloatButton
                tooltip={t('creatorDashboard.quickActions.createBank')}
                icon={<BankOutlined />}
                onClick={() => navigate('/student/question-banks/new')}
            />
        </FloatButton.Group>
    );
};
