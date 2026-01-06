import { Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface StudentDashboardHeaderProps {
    user: {
        displayName?: string;
        email?: string;
        avatarUrl?: string;
    } | null;
}

/**
 * Capitalize first letter of a string
 */
const capitalizeFirst = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * StudentDashboardHeader Component
 * Welcome header with student name and current date
 */
export const StudentDashboardHeader: React.FC<StudentDashboardHeaderProps> = ({ user }) => {
    const { t, i18n } = useTranslation();

    // Determine if current language is Vietnamese
    const isVietnamese = useMemo(() => {
        const lang = i18n.language?.toLowerCase() || '';
        return lang.startsWith('vi');
    }, [i18n.language]);

    // Format date based on locale with proper capitalization
    const formattedDate = useMemo(() => {
        if (isVietnamese) {
            // Format cho tiếng Việt: "Chủ nhật, ngày 4 tháng 1 năm 2026"
            const dateStr = dayjs().locale('vi').format('dddd, [ngày] D [tháng] M [năm] YYYY');
            return capitalizeFirst(dateStr);
        }
        // Format cho tiếng Anh: "Sunday, January 4, 2026"
        return dayjs().locale('en').format('dddd, MMMM D, YYYY');
    }, [isVietnamese]);

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student';

    return (
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
            <div>
                <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
                    {t('studentDashboard.header.welcomeBack', { name: displayName })} 👋
                </Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                    {t('studentDashboard.header.todayIs', { date: formattedDate })}
                </Text>
            </div>
        </Flex>
    );
};
