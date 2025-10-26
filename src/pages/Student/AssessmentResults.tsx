import React from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    Typography,
    Tag,
    Space,
    Button,
    Divider,
    Alert,
    Collapse,
    Progress,
    Table,
    theme,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
    FileTextOutlined,
    HomeOutlined,
    ReloadOutlined,
    HourglassOutlined,
} from '@ant-design/icons';
import {useQuery} from '@tanstack/react-query';
import {useParams, useNavigate} from 'react-router-dom';
import studentService from '../../services/studentService';
import type {AttemptDetail, StudentAnswer, QuestionScore} from '../../types';
import {useAuth} from '../../hooks/useAuth';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const {Title, Text, Paragraph} = Typography;
const {Panel} = Collapse;

const AssessmentResults: React.FC = () => {
    const {attemptId} = useParams<{ attemptId: string }>();
    const navigate = useNavigate();
    const {user} = useAuth();
    const {token} = theme.useToken();

    const {data: attempt, isLoading} = useQuery<AttemptDetail>({
        queryKey: ['attempt-detail', attemptId],
        queryFn: () => studentService.getAttemptDetails(Number(attemptId)),
        enabled: !!attemptId,
    });

    if (isLoading) {
        return (
            <div style={{padding: '24px'}}>
                <Card loading/>
            </div>
        );
    }

    if (!attempt) {
        return (
            <div style={{padding: '24px'}}>
                <Alert
                    message="Không tìm thấy kết quả"
                    description="Không thể tìm thấy kết quả bài kiểm tra."
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // Check if user is teacher/admin (always see results)
    const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

    const score = attempt.score || 0;
    const percentage = attempt.percentage || 0;
    const maxScore = attempt.max_score || 100;
    const passed = attempt.passed || false;
    const totalQuestions = attempt.answers?.length || 0;
    const correctAnswers =
        attempt.answers?.filter((a: StudentAnswer) => a.is_correct).length || 0;
    const timeSpent = attempt.completed_at && attempt.started_at
        ? dayjs(attempt.completed_at).diff(dayjs(attempt.started_at), 'second')
        : 0;

    // Check if score breakdown is available
    const hasScoreBreakdown = attempt.score_breakdown && attempt.score_breakdown.length > 0;

    // Check if there are any ungraded questions
    const isPendingGrading = attempt.is_pending_grade ?? false;

    // Count graded vs ungraded answers
    const gradedCount = attempt.answers?.filter((a: StudentAnswer) => a.is_graded).length || 0;
    const totalCount = attempt.answers?.length || 0;
    const ungradedCount = totalCount - gradedCount;

    const renderAnswerFeedback = (answer: StudentAnswer, questionNumber: number) => {
        // Use nested question from answer if available, otherwise try to find from attempt.questions
        const question = (answer as any).question || attempt.questions?.find((q: any) => q.id === answer.question_id);

        if (!question) return null;

        // Check if this answer has been graded
        const isGraded = answer.is_graded ?? true; // Default to true for backward compatibility
        const hasCorrectStatus = answer.is_correct !== undefined && answer.is_correct !== null;
        const questionType = question.type;
        const questionContent = question.content;

        // Render student's answer based on question type
        const renderStudentAnswer = () => {
            if (!answer.answer) return <Text type="secondary">Chưa trả lời</Text>;

            switch (questionType) {
                case 'multiple_choice':
                    // Find the selected option(s)
                    const selectedIds = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
                    const selectedOptions = questionContent.options?.filter((opt: any) =>
                        selectedIds.includes(opt.id)
                    ) || [];

                    return (
                        <Space direction="vertical" style={{width: '100%'}}>
                            {selectedOptions.map((opt: any) => (
                                <div
                                    key={opt.id}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: token.colorInfoBg,
                                        border: `1px solid ${token.colorInfoBorder}`,
                                        borderRadius: '4px',
                                    }}
                                >
                                    <Text strong>{opt.id}.</Text> {opt.text}
                                </div>
                            ))}
                        </Space>
                    );

                case 'true_false':
                    return (
                        <Tag color={answer.answer === true ? 'blue' : 'orange'} style={{fontSize: '14px', padding: '4px 12px'}}>
                            {answer.answer === true ? (questionContent.true_label || 'Đúng') : (questionContent.false_label || 'Sai')}
                        </Tag>
                    );

                case 'essay':
                case 'short_answer':
                    return (
                        <div
                            style={{
                                padding: '12px',
                                backgroundColor: token.colorBgContainer,
                                borderRadius: '4px',
                                border: `1px solid ${token.colorBorder}`,
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {answer.answer.toString()}
                        </div>
                    );

                case 'fill_blank':
                    return (
                        <div style={{padding: '8px'}}>
                            {typeof answer.answer === 'object'
                                ? Object.entries(answer.answer).map(([key, value]: [string, any]) => (
                                    <div key={key} style={{marginBottom: '8px'}}>
                                        <Text strong>Chỗ trống {key}:</Text> <Tag>{value}</Tag>
                                    </div>
                                ))
                                : answer.answer}
                        </div>
                    );

                default:
                    return (
                        <div style={{padding: '8px', backgroundColor: token.colorBgContainer, borderRadius: '4px', border: `1px solid ${token.colorBorder}`}}>
                            {typeof answer.answer === 'object'
                                ? JSON.stringify(answer.answer, null, 2)
                                : answer.answer.toString()}
                        </div>
                    );
            }
        };

        // Render correct answer based on question type
        const renderCorrectAnswer = () => {
            switch (questionType) {
                case 'multiple_choice':
                    const correctIds = questionContent.correct_answers || [];
                    const correctOptions = questionContent.options?.filter((opt: any) =>
                        correctIds.includes(opt.id)
                    ) || [];

                    return (
                        <Space direction="vertical" style={{width: '100%'}}>
                            {correctOptions.map((opt: any) => (
                                <div
                                    key={opt.id}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: token.colorSuccessBg,
                                        border: `1px solid ${token.colorSuccessBorder}`,
                                        borderRadius: '4px',
                                    }}
                                >
                                    <CheckCircleOutlined style={{color: token.colorSuccess, marginRight: '8px'}}/>
                                    <Text strong>{opt.id}.</Text> {opt.text}
                                </div>
                            ))}
                        </Space>
                    );

                case 'true_false':
                    const correctBool = questionContent.correct_answer;
                    return (
                        <Tag color="success" style={{fontSize: '14px', padding: '4px 12px'}}>
                            {correctBool === true ? (questionContent.true_label || 'Đúng') : (questionContent.false_label || 'Sai')}
                        </Tag>
                    );

                case 'short_answer':
                case 'essay':
                    if (questionContent.accepted_answers && questionContent.accepted_answers.length > 0) {
                        return (
                            <div style={{padding: '8px'}}>
                                {questionContent.accepted_answers.map((ans: string, idx: number) => (
                                    <Tag key={idx} color="success" style={{marginBottom: '4px'}}>
                                        {ans}
                                    </Tag>
                                ))}
                            </div>
                        );
                    }
                    return <Text type="secondary">Chấm điểm thủ công</Text>;

                case 'fill_blank':
                    if (questionContent.blanks) {
                        return (
                            <div style={{padding: '8px'}}>
                                {Object.entries(questionContent.blanks).map(([key, blank]: [string, any]) => (
                                    <div key={key} style={{marginBottom: '8px'}}>
                                        <Text strong>Chỗ trống {key}:</Text>{' '}
                                        {blank.accepted_answers?.map((ans: string, idx: number) => (
                                            <Tag key={idx} color="success">
                                                {ans}
                                            </Tag>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    return null;

                default:
                    if (questionContent.correct_answers) {
                        return <Text>{questionContent.correct_answers.join(', ')}</Text>;
                    }
                    return null;
            }
        };

        return (
            <Panel
                header={
                    <Space>
                        {hasCorrectStatus ? (
                            <Tag color={answer.is_correct ? 'success' : 'error'}>
                                {answer.is_correct ? <CheckCircleOutlined/> : <CloseCircleOutlined/>}
                            </Tag>
                        ) : (
                            <Tag color="warning">
                                <HourglassOutlined/>
                            </Tag>
                        )}
                        <Text strong>Câu {questionNumber}</Text>
                        <Tag color="blue">{questionType === 'multiple_choice' ? 'Trắc nghiệm' : questionType === 'essay' ? 'Tự luận' : questionType === 'true_false' ? 'Đúng/Sai' : questionType}</Tag>
                        {answer.score !== undefined && answer.max_score !== undefined && (
                            <Text type="secondary">
                                {answer.score} / {answer.max_score} điểm
                            </Text>
                        )}
                    </Space>
                }
                key={answer.id || answer.question_id}
            >
                <Space direction="vertical" style={{width: '100%'}} size="middle">
                    {/* Question Text */}
                    <div>
                        <Text strong style={{fontSize: '16px'}}>Câu hỏi:</Text>
                        <Paragraph style={{fontSize: '15px', marginTop: '8px'}}>{question.text}</Paragraph>
                    </div>

                    {/* Show all options for multiple choice */}
                    {questionType === 'multiple_choice' && questionContent.options && (
                        <div>
                            <Text strong>Các lựa chọn:</Text>
                            {!isGraded && (
                                <Alert
                                    message="Câu hỏi này đang được chấm điểm"
                                    type="warning"
                                    showIcon
                                    icon={<HourglassOutlined />}
                                    style={{marginTop: '8px', marginBottom: '8px'}}
                                    banner
                                />
                            )}
                            <Space direction="vertical" style={{width: '100%', marginTop: '8px'}}>
                                {questionContent.options.map((opt: any) => {
                                    const isStudentAnswer = Array.isArray(answer.answer)
                                        ? answer.answer.includes(opt.id)
                                        : answer.answer === opt.id;
                                    const isCorrect = questionContent.correct_answers?.includes(opt.id);

                                    // If not graded, don't show correct answers
                                    const showCorrectness = isGraded;

                                    return (
                                        <div
                                            key={opt.id}
                                            style={{
                                                padding: '8px 12px',
                                                backgroundColor: isStudentAnswer
                                                    ? (showCorrectness && isCorrect ? token.colorSuccessBg : showCorrectness && !isCorrect ? token.colorErrorBg : token.colorInfoBg)
                                                    : (showCorrectness && isCorrect ? token.colorSuccessBg : token.colorBgContainer),
                                                border: `1px solid ${isStudentAnswer
                                                    ? (showCorrectness && isCorrect ? token.colorSuccessBorder : showCorrectness && !isCorrect ? token.colorErrorBorder : token.colorInfoBorder)
                                                    : (showCorrectness && isCorrect ? token.colorSuccessBorder : token.colorBorder)}`,
                                                borderRadius: '4px',
                                            }}
                                        >
                                            <Space>
                                                {showCorrectness && isStudentAnswer && (
                                                    isCorrect
                                                        ? <CheckCircleOutlined style={{color: '#52c41a'}}/>
                                                        : <CloseCircleOutlined style={{color: '#ff4d4f'}}/>
                                                )}
                                                {showCorrectness && !isStudentAnswer && isCorrect && (
                                                    <CheckCircleOutlined style={{color: '#52c41a'}}/>
                                                )}
                                                {!showCorrectness && isStudentAnswer && (
                                                    <HourglassOutlined style={{color: '#1890ff'}}/>
                                                )}
                                                <Text strong>{opt.id}.</Text>
                                                <Text>{opt.text}</Text>
                                            </Space>
                                        </div>
                                    );
                                })}
                            </Space>
                        </div>
                    )}

                    {/* Student Answer for non-multiple-choice */}
                    {questionType !== 'multiple_choice' && (
                        <div>
                            <Text strong>Câu trả lời của bạn:</Text>
                            {!isGraded && (
                                <Alert
                                    message="Câu hỏi này đang được chấm điểm"
                                    type="warning"
                                    showIcon
                                    icon={<HourglassOutlined />}
                                    style={{marginTop: '8px', marginBottom: '8px'}}
                                    banner
                                />
                            )}
                            <div style={{marginTop: '8px'}}>
                                {renderStudentAnswer()}
                            </div>
                        </div>
                    )}

                    {/* Correct Answer for non-multiple-choice - Only show if graded */}
                    {questionType !== 'multiple_choice' && isGraded && renderCorrectAnswer() && (
                        <div>
                            <Text strong type="success">
                                Đáp án đúng:
                            </Text>
                            <div style={{marginTop: '8px'}}>
                                {renderCorrectAnswer()}
                            </div>
                        </div>
                    )}

                    {/* Explanation */}
                    {question.explanation && (
                        <div>
                            <Text strong type="secondary">
                                Giải thích:
                            </Text>
                            <Paragraph type="secondary" style={{marginTop: '8px'}}>
                                {question.explanation}
                            </Paragraph>
                        </div>
                    )}

                    {/* Grader Feedback */}
                    {answer.feedback && (
                        <div>
                            <Text strong>Nhận xét từ giáo viên:</Text>
                            <Alert
                                message={answer.feedback}
                                type={answer.is_correct ? 'success' : 'info'}
                                showIcon
                                style={{marginTop: '8px'}}
                            />
                        </div>
                    )}
                </Space>
            </Panel>
        );
    };

    return (
        <div style={{padding: '24px', maxWidth: '1200px', margin: '0 auto'}}>
            {/* Header */}
            <Card>
                <Space direction="vertical" size="large" style={{width: '100%'}}>
                    <div style={{textAlign: 'center'}}>
                        {isPendingGrading ? (
                            <HourglassOutlined
                                style={{fontSize: '64px', color: '#faad14', marginBottom: '16px'}}
                            />
                        ) : passed ? (
                            <CheckCircleOutlined
                                style={{fontSize: '64px', color: '#52c41a', marginBottom: '16px'}}
                            />
                        ) : (
                            <CloseCircleOutlined
                                style={{fontSize: '64px', color: '#f5222d', marginBottom: '16px'}}
                            />
                        )}
                        <Title level={2} style={{margin: 0}}>
                            {isPendingGrading ? 'Đang chấm điểm' : passed ? 'Chúc mừng!' : 'Hoàn thành bài kiểm tra'}
                        </Title>
                        <Text type="secondary" style={{fontSize: '16px'}}>
                            {attempt.assessment?.title}
                        </Text>
                    </div>

                    <Divider/>

                    {/* Pending Grading Alert */}
                    {isPendingGrading && ungradedCount > 0 && (
                        <Alert
                            message={`Một số câu hỏi đang được chấm điểm (${ungradedCount}/${totalCount} câu)`}
                            description={`Kết quả hiện tại là tạm thời. Điểm số cuối cùng sẽ được cập nhật sau khi giáo viên hoàn tất chấm ${ungradedCount} câu còn lại.`}
                            type="warning"
                            showIcon
                            icon={<HourglassOutlined />}
                            style={{marginBottom: '16px'}}
                        />
                    )}

                    {/* Score Overview */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={isPendingGrading ? "Điểm số (Tạm thời)" : "Điểm số"}
                                    value={score}
                                    precision={1}
                                    suffix={`/ ${maxScore}`}
                                    prefix={isPendingGrading ? <HourglassOutlined /> : <TrophyOutlined/>}
                                    valueStyle={{color: isPendingGrading ? '#faad14' : passed ? '#52c41a' : '#f5222d', fontSize: '28px'}}
                                />
                                <Progress
                                    percent={percentage}
                                    strokeColor={isPendingGrading ? '#faad14' : passed ? '#52c41a' : '#f5222d'}
                                    showInfo={true}
                                    format={percent => `${percent?.toFixed(1)}%`}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Trạng thái"
                                    value={isPendingGrading ? 'ĐANG CHẤM' : passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                                    prefix={isPendingGrading ? <HourglassOutlined /> : undefined}
                                    valueStyle={{
                                        color: isPendingGrading ? '#faad14' : passed ? '#52c41a' : '#f5222d',
                                        fontSize: '24px',
                                    }}
                                />
                                <Text type="secondary">
                                    Điểm đạt: {attempt.assessment?.passing_score}%
                                </Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Câu trả lời đúng"
                                    value={correctAnswers}
                                    suffix={`/ ${totalQuestions}`}
                                    prefix={<CheckCircleOutlined/>}
                                    valueStyle={{fontSize: '24px'}}
                                />
                                <Text type="secondary">
                                    {totalQuestions > 0
                                        ? ((correctAnswers / totalQuestions) * 100).toFixed(1)
                                        : 0}
                                    % độ chính xác
                                </Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Thời gian làm bài"
                                    value={Math.floor(timeSpent / 60)}
                                    suffix="phút"
                                    prefix={<ClockCircleOutlined/>}
                                    valueStyle={{fontSize: '24px'}}
                                />
                                <Text type="secondary">
                                    Giới hạn: {attempt.assessment?.duration} phút
                                </Text>
                            </Card>
                        </Col>
                    </Row>

                    {/* Status Alert - Only show if fully graded */}
                    {!isPendingGrading && (
                        <Alert
                            message={passed ? 'Bạn đã đạt bài kiểm tra này!' : 'Bạn chưa đạt bài kiểm tra này'}
                            description={
                                passed
                                    ? `Xuất sắc! Điểm số ${percentage.toFixed(1)}% của bạn đã đạt yêu cầu ${attempt.assessment?.passing_score}%.`
                                    : `Điểm số ${percentage.toFixed(1)}% của bạn thấp hơn yêu cầu ${attempt.assessment?.passing_score}%. ${
                                        attempt.assessment?.max_attempts && attempt.assessment.max_attempts > 1
                                            ? 'Bạn có thể làm lại bài kiểm tra này nếu còn lượt.'
                                            : ''
                                    }`
                            }
                            type={passed ? 'success' : 'error'}
                            showIcon
                        />
                    )}
                </Space>
            </Card>

            {/* Score Breakdown */}
            {hasScoreBreakdown && (
                <Card
                    title={
                        <Space>
                            <FileTextOutlined/>
                            <Text strong>Chi tiết điểm từng câu</Text>
                            {isPendingGrading && ungradedCount > 0 && (
                                <Tag color="warning" icon={<HourglassOutlined />}>
                                    {gradedCount}/{totalCount} đã chấm
                                </Tag>
                            )}
                        </Space>
                    }
                    style={{marginTop: '24px'}}
                >
                    <Table<QuestionScore>
                        dataSource={attempt.score_breakdown || []}
                        rowKey="question_id"
                        pagination={false}
                        columns={[
                            {
                                title: 'Câu hỏi',
                                key: 'question_number',
                                render: (_, record, index) => `Câu ${index + 1}`,
                                width: 100,
                            },
                            {
                                title: 'Điểm',
                                key: 'score',
                                render: (_, record) => (
                                    <Space>
                                        <Text strong>
                                            {record.score.toFixed(1)} / {record.max_score}
                                        </Text>
                                        {record.partial_credit && (
                                            <Tag color="warning">Điểm một phần</Tag>
                                        )}
                                    </Space>
                                ),
                                width: 200,
                            },
                            {
                                title: 'Trạng thái',
                                key: 'status',
                                align: 'center',
                                render: (_, record) => {
                                    if (record.is_correct === true) {
                                        return (
                                            <Tag icon={<CheckCircleOutlined/>} color="success">
                                                Đúng
                                            </Tag>
                                        );
                                    } else if (record.is_correct === false) {
                                        return (
                                            <Tag icon={<CloseCircleOutlined/>} color="error">
                                                Sai
                                            </Tag>
                                        );
                                    } else {
                                        return (
                                            <Tag icon={<HourglassOutlined/>} color="warning">
                                                Đang chấm
                                            </Tag>
                                        );
                                    }
                                },
                                width: 150,
                            },
                            {
                                title: 'Tiến độ',
                                key: 'progress',
                                render: (_, record) => {
                                    const percent = (record.score / record.max_score) * 100;
                                    return (
                                        <Progress
                                            percent={percent}
                                            size="small"
                                            strokeColor={
                                                record.is_correct === true
                                                    ? '#52c41a'
                                                    : record.is_correct === false
                                                        ? '#f5222d'
                                                        : '#faad14'
                                            }
                                            format={p => `${p?.toFixed(0)}%`}
                                        />
                                    );
                                },
                            },
                        ]}
                    />
                </Card>
            )}

            {/* Detailed Feedback */}
            {attempt.answers && attempt.answers.length > 0 && (
                <Card
                    title={
                        <Space>
                            <FileTextOutlined/>
                            <Text strong>Chi tiết đáp án</Text>
                            {isPendingGrading && ungradedCount > 0 && (
                                <Tag color="warning" icon={<HourglassOutlined />}>
                                    {gradedCount}/{totalCount} đã chấm
                                </Tag>
                            )}
                        </Space>
                    }
                    style={{marginTop: '24px'}}
                >
                    <Collapse accordion>
                        {attempt.answers.map((answer, index) => renderAnswerFeedback(answer, index + 1))}
                    </Collapse>
                </Card>
            )}

            {/* Actions */}
            <Card style={{marginTop: '24px'}}>
                <Space size="middle" wrap>
                    <Button
                        type="primary"
                        icon={<HomeOutlined/>}
                        onClick={() => navigate('/student/dashboard')}
                    >
                        Về trang chủ
                    </Button>
                    <Button
                        icon={<FileTextOutlined/>}
                        onClick={() => navigate('/student/history')}
                    >
                        Xem lịch sử
                    </Button>
                    {/* Show retake button if max_attempts > 1 (backend validates actual attempts left) */}
                    {attempt.assessment?.max_attempts && attempt.assessment.max_attempts > 1 && !passed && (
                        <Button
                            icon={<ReloadOutlined/>}
                            onClick={() => navigate(`/student/assessments/${attempt.assessment_id}`)}
                        >
                            Làm lại
                        </Button>
                    )}
                </Space>
            </Card>

            {/* Additional Info */}
            <Card title="Thông tin bài kiểm tra" style={{marginTop: '24px'}}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text type="secondary">Bắt đầu lúc:</Text>
                        <div>
                            <Text strong>{dayjs(attempt.started_at).format('DD/MM/YYYY HH:mm')}</Text>
                        </div>
                    </Col>
                    <Col span={12}>
                        <Text type="secondary">Hoàn thành lúc:</Text>
                        <div>
                            <Text strong>
                                {attempt.completed_at
                                    ? dayjs(attempt.completed_at).format('DD/MM/YYYY HH:mm')
                                    : 'N/A'}
                            </Text>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AssessmentResults;
