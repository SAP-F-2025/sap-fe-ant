import { FileSearchOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Empty, Flex, Input, Skeleton, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import groupService from '../../../services/groupService';
import { gradingService } from '../../../services/gradingService';
import { useThemeToken } from '../../../theme/ThemeProvider';
import AssessmentCard, { type AssessmentGradingInfo } from './AssessmentCard';

const { Text } = Typography;
const { Search } = Input;

interface AssessmentSidebarProps {
    groupId: number;
    selectedId: number | null;
    onSelect: (assessmentId: number | null) => void;
}

const AssessmentSidebar: React.FC<AssessmentSidebarProps> = ({
    groupId,
    selectedId,
    onSelect,
}) => {
    const { t } = useTranslation();
    const token = useThemeToken();
    const [loading, setLoading] = useState(false);
    const [assessments, setAssessments] = useState<AssessmentGradingInfo[]>([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (groupId) {
            fetchAssessmentsWithStats();
        }
    }, [groupId]);

    const fetchAssessmentsWithStats = async () => {
        setLoading(true);
        try {
            // Get group assessments
            const groupAssessments = await groupService.getGroupAssessments(groupId);
            const assessmentList = groupAssessments.assessments || [];

            // For each assessment, get grading stats
            const assessmentsWithStats: AssessmentGradingInfo[] = await Promise.all(
                assessmentList.map(async (assessment) => {
                    try {
                        const stats = await gradingService.getGradingOverview(assessment.id, groupId);
                        return {
                            id: assessment.id,
                            title: assessment.title,
                            total_attempts: stats.total_attempts || 0,
                            graded_attempts: stats.graded_attempts || 0,
                            pending_attempts: stats.pending_attempts || 0,
                            average_score: stats.average_score,
                        };
                    } catch {
                        // If stats fetch fails, return with zero values
                        return {
                            id: assessment.id,
                            title: assessment.title,
                            total_attempts: 0,
                            graded_attempts: 0,
                            pending_attempts: 0,
                        };
                    }
                })
            );

            // Sort by pending (most pending first), then by title
            assessmentsWithStats.sort((a, b) => {
                if (b.pending_attempts !== a.pending_attempts) {
                    return b.pending_attempts - a.pending_attempts;
                }
                return a.title.localeCompare(b.title);
            });

            setAssessments(assessmentsWithStats);

            // Auto-select first assessment with pending items, or first assessment
            if (!selectedId && assessmentsWithStats.length > 0) {
                const firstPending = assessmentsWithStats.find((a) => a.pending_attempts > 0);
                onSelect(firstPending?.id || assessmentsWithStats[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch assessments:', error);
            setAssessments([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssessments = searchText
        ? assessments.filter((a) =>
            a.title.toLowerCase().includes(searchText.toLowerCase())
        )
        : assessments;

    const totalPending = assessments.reduce((sum, a) => sum + a.pending_attempts, 0);
    const totalAttempts = assessments.reduce((sum, a) => sum + a.total_attempts, 0);

    return (
        <Flex
            vertical
            style={{
                height: 'calc(100vh - 280px)',
                minHeight: 400,
                background: token.token.colorBgLayout,
                borderRadius: 12,
                padding: 16,
            }}
        >
            {/* Header */}
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: 16 }}>
                        <FileSearchOutlined style={{ marginRight: 8 }} />
                        {t('groupGrading.assessments', 'Bài thi')}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {t('groupGrading.pendingSummary', {
                            pending: totalPending,
                            total: totalAttempts,
                            defaultValue: `${totalPending}/${totalAttempts} cần chấm`,
                        })}
                    </Text>
                </Space>
                <Button
                    type="text"
                    icon={<SyncOutlined spin={loading} />}
                    onClick={fetchAssessmentsWithStats}
                    size="small"
                />
            </Flex>

            {/* Search */}
            <Search
                placeholder={t('groupGrading.searchAssessment', 'Tìm bài thi...')}
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ marginBottom: 16 }}
            />

            {/* Assessment List */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                {loading ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton.Button
                                key={i}
                                active
                                block
                                style={{ height: 100, borderRadius: 12 }}
                            />
                        ))}
                    </Space>
                ) : filteredAssessments.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            searchText
                                ? t('groupGrading.noSearchResults', 'Không tìm thấy bài thi')
                                : t('groupGrading.noAssessments', 'Chưa có bài thi nào')
                        }
                    />
                ) : (
                    filteredAssessments.map((assessment) => (
                        <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                            isSelected={selectedId === assessment.id}
                            onClick={() => onSelect(assessment.id)}
                        />
                    ))
                )}
            </div>
        </Flex>
    );
};

export default AssessmentSidebar;
