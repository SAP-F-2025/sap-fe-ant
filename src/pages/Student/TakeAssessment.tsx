import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Radio,
  Checkbox,
  Input,
  Select,
  Space,
  Typography,
  Progress,
  Tag,
  App,
  Alert,
  Spin,
  Row,
  Col,
  Statistic,
} from 'antd';
import { ProctoringMonitor } from '../../components/Proctoring/ProctoringMonitor';
import type { ProctoringEvent } from '../../hooks/useProctoring';
import { useBrowserProctoring, type BrowserProctoringEvent } from '../../hooks/useBrowserProctoring';
import { useDevToolsBlocker } from '../../hooks/useDevToolsBlocker';
import { InTestFaceVerificationModal } from '../../components/Proctoring/InTestFaceVerificationModal';
import {
  ClockCircleOutlined,
  CheckOutlined,
  SaveOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined,
  HolderOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  useDraggable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import violationService from '../../services/violationService';
import { useAuth } from '../../hooks/useAuth';
import { useThemeToken } from '../../theme/ThemeProvider';
import type { AttemptDetail, SubmitAnswerRequest, CompleteAttemptRequest } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Sortable Item Component for Ordering Questions
interface SortableOrderItemProps {
  id: string;
  item: { id: string; text: string; image_url?: string };
  index: number;
  totalItems: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SortableOrderItem: React.FC<SortableOrderItemProps> = ({
  id,
  item,
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({ id });

  const { token } = useThemeToken();
  const isDark = document.body.classList.contains('dark-mode');

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '8px',
    cursor: isDragging ? 'grabbing' : 'grab',
    boxShadow: isDragging 
      ? `0 4px 12px ${isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.15)'}`
      : undefined,
    border: isDragging 
      ? `2px solid ${token.colorPrimary}` 
      : undefined,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      size="small"
      {...attributes}
      {...listeners}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        {/* Content - Left side */}
        <Space style={{ flex: 1, minWidth: 0 }}>
          <Tag color="blue">{index + 1}</Tag>
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.text}
              style={{ maxWidth: '100px', maxHeight: '60px', borderRadius: '4px' }}
            />
          )}
          <Text style={{ wordBreak: 'break-word' }}>{item.text}</Text>
        </Space>

        {/* Right side - Fallback Buttons */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <Space>
            <Button
              size="small"
              icon={<UpOutlined />}
              disabled={index === 0}
              onClick={onMoveUp}
              title="Di chuyển lên"
            />
            <Button
              size="small"
              icon={<DownOutlined />}
              disabled={index === totalItems - 1}
              onClick={onMoveDown}
              title="Di chuyển xuống"
            />
          </Space>
        </div>
      </div>
    </Card>
  );
};

// Droppable Zone Component for Matching Questions
interface DroppableMatchZoneProps {
  id: string;
  matchedItem: { id: string; text: string; image_url?: string } | null;
  onRemove: () => void;
}

const DroppableMatchZone: React.FC<DroppableMatchZoneProps> = ({ id, matchedItem, onRemove }) => {
  const { isOver, setNodeRef } = useDroppable({ id });
  const { token } = useThemeToken();
  const isDark = document.body.classList.contains('dark-mode');

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: '80px',
        border: isOver
          ? `2px dashed ${token.colorPrimary}`
          : matchedItem
          ? `2px solid ${token.colorSuccess}`
          : `2px dashed ${isDark ? '#434343' : '#d9d9d9'}`,
        borderRadius: '8px',
        padding: '12px',
        marginTop: '8px',
        backgroundColor: isOver
          ? isDark ? 'rgba(24, 144, 255, 0.15)' : 'rgba(24, 144, 255, 0.1)'
          : matchedItem
          ? isDark ? 'rgba(82, 196, 26, 0.15)' : 'rgba(82, 196, 26, 0.1)'
          : 'transparent',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {matchedItem ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Space>
            {matchedItem.image_url && (
              <img
                src={matchedItem.image_url}
                alt={matchedItem.text}
                style={{ maxHeight: '40px', borderRadius: '4px' }}
              />
            )}
            <Text>{matchedItem.text}</Text>
          </Space>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onRemove}
            title="Xóa"
          />
        </div>
      ) : (
        <Text type="secondary" style={{ textAlign: 'center' }}>
          Kéo thả câu trả lời vào đây
        </Text>
      )}
    </div>
  );
};

// Draggable Answer Component for Matching Questions
interface DraggableMatchAnswerProps {
  id: string;
  item: { id: string; text: string; image_url?: string };
  isUsed: boolean;
}

const DraggableMatchAnswer: React.FC<DraggableMatchAnswerProps> = ({ id, item, isUsed }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: isUsed,
  });
  const { token } = useThemeToken();
  const isDark = document.body.classList.contains('dark-mode');

  return (
    <div style={{ minHeight: '64px', marginBottom: '8px' }}>
      {!isUsed && (
        <Card
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          size="small"
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            opacity: isDragging ? 0.5 : 1,
            border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
            transition: 'opacity 0.3s',
          }}
        >
          <Space>
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.text}
                style={{ maxHeight: '50px', borderRadius: '4px' }}
              />
            )}
            <Text>{item.text}</Text>
          </Space>
        </Card>
      )}
    </div>
  );
};


const TakeAssessment: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { modal } = App.useApp();
  const { user } = useAuth();
  const { token } = useThemeToken(); // Move to top level to follow Rules of Hooks

  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [autoSaving, setAutoSaving] = useState(false);
  const [proctoringEvents, setProctoringEvents] = useState<ProctoringEvent[]>([]);
  const [browserViolations, setBrowserViolations] = useState<Map<string, BrowserProctoringEvent>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFaceVerifyModal, setShowFaceVerifyModal] = useState(false);
  const [prevFaceCount, setPrevFaceCount] = useState<number | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null); // Add hover state at top level
  const [activeMatchingId, setActiveMatchingId] = useState<string | null>(null); // For matching drag overlay


  // Setup sensors for drag-and-drop at top level (for ordering questions)
  const dndSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const { data: attempt, isLoading } = useQuery<AttemptDetail>({
    queryKey: ['attempt-detail', attemptId],
    queryFn: () => studentService.getAttemptDetails(Number(attemptId)),
    enabled: !!attemptId,
  });



  // Questions are included in attempt details
  const questions = attempt?.questions || [];

  // Mark initial load complete after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoadComplete(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize currentQuestionId when questions load
  useEffect(() => {
    if (questions.length > 0 && currentQuestionId === null) {
      setCurrentQuestionId(questions[0].id);
    }
  }, [questions, currentQuestionId]);

  // Reset hover state when question changes
  useEffect(() => {
    setHoveredOption(null);
  }, [currentQuestionId]);

  // Get current question by ID (not index)
  const currentQuestion = currentQuestionId
    ? questions.find(q => q.id === currentQuestionId)
    : null;

  // Get current index for display purposes
  const currentQuestionIndex = currentQuestion
    ? questions.findIndex(q => q.id === currentQuestion.id)
    : 0;

  // Load existing answers from attempt
  useEffect(() => {
    if (attempt?.answers) {
      const existingAnswers: Record<number, any> = {};
      attempt.answers.forEach((ans) => {
        if (ans.answer !== null && ans.answer !== undefined) {
          existingAnswers[ans.question_id] = ans.answer;
        }
      });
      setAnswers(existingAnswers);
    }
  }, [attempt]);

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: (data: SubmitAnswerRequest) =>
      studentService.submitAnswer(Number(attemptId), data),
    onSuccess: () => {
      setAutoSaving(false);
    },
    onError: () => {
      setAutoSaving(false);
    },
  });

  // Submit attempt mutation
  const submitAttemptMutation = useMutation({
    mutationFn: async (data: CompleteAttemptRequest) => {
      setIsSubmitting(true);
      
      // Submit all violations before submitting attempt
      if (user && attempt) {
        const allViolations = [
          ...proctoringEvents.map(event => ({ event, type: 'camera' as const })),
          ...Array.from(browserViolations.values()).map(event => ({ event, type: 'browser' as const }))
        ];
        
        if (allViolations.length > 0) {
          try {
            await violationService.submitViolationsBatch(
              allViolations,
              user.id,
              attempt.id,
              attempt.assessment_id
            );
          } catch (error) {
            console.error('Failed to submit violations batch:', error);
          }
        }
      }
      
      return studentService.submitAttempt(data);
    },
    onSuccess: (data) => {
      // Exit fullscreen after submission
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error('Failed to exit fullscreen:', err));
      }
      
      modal.success({
        title: 'Đã nộp bài',
        content: 'Bài kiểm tra của bạn đã được nộp thành công!',
        onOk: () => {
          queryClient.invalidateQueries({ queryKey: ['attempt-detail', attemptId] });
          navigate(`/student/results/${attemptId}`);
        },
      });
    },
    onError: (error: any) => {
      modal.error({
        title: 'Nộp bài thất bại',
        content: error.message || 'Không thể nộp bài kiểm tra',
      });
    },
  });

  // Timer countdown
  useEffect(() => {
    if (!attempt) return;

    const fetchTimeRemaining = async () => {
      try {
        const timeData = await studentService.getTimeRemaining(Number(attemptId));
        const remainingSeconds = timeData.data;
        
        // Check if attempt has already expired
        if (remainingSeconds <= 0) {
          modal.warning({
            title: 'Hết giờ!',
            content: 'Thời gian làm bài đã hết. Bài kiểm tra sẽ được nộp tự động.',
            onOk: () => {
              submitAttemptMutation.mutate(buildCompleteAttemptRequest('timeout'));
            },
          });
          return;
        }
        
        setTimeRemaining(remainingSeconds);
      } catch (error) {
        console.error('Error fetching time remaining:', error);
      }
    };

    fetchTimeRemaining();
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [attempt, attemptId]);

  // Save queue to track pending auto-saves
  const saveQueueRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const pendingSavesRef = useRef<Set<number>>(new Set());

  // Flush all pending saves before submission
  const flushPendingSaves = async () => {
    const pendingQuestions = Array.from(pendingSavesRef.current);
    if (pendingQuestions.length === 0) return;

    console.log('Flushing pending saves for questions:', pendingQuestions);
    
    const savePromises = pendingQuestions.map(questionId => {
      return submitAnswerMutation.mutateAsync({
        question_id: questionId,
        answer: answers[questionId],
      }).then(() => {
        // Only remove on success
        pendingSavesRef.current.delete(questionId);
      }).catch(err => {
        console.error(`Failed to save question ${questionId}:`, err);
        // Keep in pending set for potential retry
        throw err; // Re-throw to track failures
      });
    });

    try {
      await Promise.all(savePromises);
    } catch (error) {
      // Some saves failed, warn the user
      modal.error({
        title: 'Lỗi lưu câu trả lời',
        content: 'Một số câu trả lời chưa được lưu. Vui lòng kiểm tra kết nối mạng và thử lại.',
      });
      throw error; // Prevent submission if saves failed
    }
  };

  const buildCompleteAttemptRequest = (endReason?: string): CompleteAttemptRequest => {
    // Convert answers from Record<number, any> to SubmitAnswerRequest[]
    const answersArray: SubmitAnswerRequest[] = Object.entries(answers).map(
      ([questionId, answer]) => ({
        question_id: Number(questionId),
        answer,
      })
    );

    return {
      attempt_id: Number(attemptId),
      answers: answersArray,
      end_reason: endReason,
    };
  };

  const handleTimeUp = async () => {
    // Flush any pending auto-saves first
    await flushPendingSaves();
    
    modal.warning({
      title: 'Hết giờ!',
      content: 'Thời gian làm bài đã hết. Câu trả lời của bạn sẽ được nộp tự động.',
      onOk: () => {
        submitAttemptMutation.mutate(buildCompleteAttemptRequest('timeout'));
      },
    });
  };

  const handleSaveAnswer = async (questionId: number, answer: any) => {
    setAutoSaving(true);
    submitAnswerMutation.mutate({
      question_id: questionId,
      answer,
    });
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    // Update local state immediately
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    // Clear existing timeout for this question
    const existingTimeout = saveQueueRef.current.get(questionId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Mark as pending
    pendingSavesRef.current.add(questionId);

    // Set new debounced save
    const timeout = setTimeout(() => {
      setAutoSaving(true);
      submitAnswerMutation.mutate(
        {
          question_id: questionId,
          answer,
        },
        {
          onSuccess: () => {
            // Only remove from pending on success
            pendingSavesRef.current.delete(questionId);
            setAutoSaving(false);
          },
          onError: () => {
            // Keep in pending set for flush retry
            setAutoSaving(false);
          },
        }
      );
      saveQueueRef.current.delete(questionId);
    }, 2000);

    saveQueueRef.current.set(questionId, timeout);
  };

  const handlePreviousQuestion = () => {
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex > 0) {
      setCurrentQuestionId(questions[currentIndex - 1].id);
    }
  };

  const handleNextQuestion = () => {
    const currentIndex = questions.findIndex(q => q.id === currentQuestionId);
    if (currentIndex < questions.length - 1) {
      setCurrentQuestionId(questions[currentIndex + 1].id);
    }
  };

  const goToQuestion = (questionId: number) => {
    setCurrentQuestionId(questionId);
  };

  const handleSubmit = async () => {
    // Flush pending saves before showing confirmation
    await flushPendingSaves();
    
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = questions.length;

    modal.confirm({
      title: 'Nộp bài?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn nộp bài?</p>
          <p>
            Đã trả lời: {answeredCount} / {totalQuestions} câu
          </p>
          {answeredCount < totalQuestions && (
            <Alert
              message={`Bạn còn ${totalQuestions - answeredCount} câu chưa trả lời`}
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </div>
      ),
      okText: 'Nộp bài',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: () => {
        submitAttemptMutation.mutate(buildCompleteAttemptRequest('submitted'));
      },
    });
  };

  const renderQuestionContent = (question: any) => {
    const questionId = question.id;
    const currentAnswer = answers[questionId];

    switch (question.type) {
      case 'multiple_choice':
        const isMultipleCorrect = question.content?.multiple_correct;
        // token is now from component top level
        
        // Get theme-aware colors
        const getOptionStyle = (isSelected: boolean, isHovered: boolean) => {
          const isDark = document.body.classList.contains('dark-mode');
          
          if (isSelected) {
            return {
              border: `2px solid ${token.colorPrimary}`,
              backgroundColor: isDark ? 'rgba(24, 144, 255, 0.15)' : '#e6f7ff',
              boxShadow: `0 0 0 2px ${isDark ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)'}`,
            };
          }
          
          if (isHovered) {
            return {
              border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
              boxShadow: `0 2px 8px ${isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.08)'}`,
              transform: 'translateY(-2px)',
            };
          }
          
          return {
            border: `1px solid ${isDark ? '#303030' : '#d9d9d9'}`,
            backgroundColor: isDark ? '#141414' : '#ffffff',
            boxShadow: 'none',
            transform: 'translateY(0)',
          };
        };

        // For multiple correct answers
        if (isMultipleCorrect) {
          const selectedValues = Array.isArray(currentAnswer) ? currentAnswer : [];
          // hoveredOption and setHoveredOption are now from component top level

          return (
            <Checkbox.Group
              value={selectedValues}
              onChange={(values) => handleAnswerChange(questionId, values)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {question.content.options?.map((option: any) => {
                  const isSelected = selectedValues.includes(option.id);
                  const isHovered = hoveredOption === option.id;
                  const optionStyle = getOptionStyle(isSelected, isHovered);

                  return (
                    <Card
                      key={option.id}
                      size="small"
                      hoverable
                      onMouseEnter={() => setHoveredOption(option.id)}
                      onMouseLeave={() => setHoveredOption(null)}
                      style={{
                        ...optionStyle,
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: '100%',
                      }}
                      bodyStyle={{ padding: '16px' }}
                      onClick={() => {
                        const newValues = isSelected
                          ? selectedValues.filter((v) => v !== option.id)
                          : [...selectedValues, option.id];
                        handleAnswerChange(questionId, newValues);
                      }}
                    >
                      <Checkbox value={option.id} style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%', marginLeft: '8px' }}>
                          {option.image_url && (
                            <img
                              src={option.image_url}
                              alt={option.text}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                borderRadius: '4px',
                                marginTop: '8px',
                              }}
                            />
                          )}
                          <Text style={{ fontSize: '15px' }}>{option.text}</Text>
                        </Space>
                      </Checkbox>
                    </Card>
                  );
                })}
              </Space>
            </Checkbox.Group>
          );
        }

        // For single correct answer
        // hoveredOption and setHoveredOption are now from component top level

        return (
          <Radio.Group
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {question.content.options?.map((option: any) => {
                const isSelected = currentAnswer === option.id;
                const isHovered = hoveredOption === option.id;
                const optionStyle = getOptionStyle(isSelected, isHovered);

                return (
                  <Card
                    key={option.id}
                    size="small"
                    hoverable
                    onMouseEnter={() => setHoveredOption(option.id)}
                    onMouseLeave={() => setHoveredOption(null)}
                    style={{
                      ...optionStyle,
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      width: '100%',
                    }}
                    bodyStyle={{ padding: '16px' }}
                    onClick={() => handleAnswerChange(questionId, option.id)}
                  >
                    <Radio value={option.id} style={{ width: '100%' }}>
                      <Space direction="vertical" style={{ width: '100%', marginLeft: '8px' }}>
                        {option.image_url && (
                          <img
                            src={option.image_url}
                            alt={option.text}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: '4px',
                              marginTop: '8px',
                            }}
                          />
                        )}
                        <Text style={{ fontSize: '15px' }}>{option.text}</Text>
                      </Space>
                    </Radio>
                  </Card>
                );
              })}
            </Space>
          </Radio.Group>
        );

      case 'true_false':
        const trueLabel = question.content?.true_label || 'Đúng';
        const falseLabel = question.content?.false_label || 'Sai';

        // Get theme-aware colors (reuse from multiple choice)
        const getTrueFalseStyle = (isSelected: boolean, isHovered: boolean) => {
          const isDark = document.body.classList.contains('dark-mode');
          
          if (isSelected) {
            return {
              border: `2px solid ${token.colorPrimary}`,
              backgroundColor: isDark ? 'rgba(24, 144, 255, 0.15)' : '#e6f7ff',
              boxShadow: `0 0 0 2px ${isDark ? 'rgba(24, 144, 255, 0.2)' : 'rgba(24, 144, 255, 0.1)'}`,
            };
          }
          
          if (isHovered) {
            return {
              border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
              boxShadow: `0 2px 8px ${isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.08)'}`,
              transform: 'translateY(-2px)',
            };
          }
          
          return {
            border: `1px solid ${isDark ? '#303030' : '#d9d9d9'}`,
            backgroundColor: isDark ? '#141414' : '#ffffff',
            boxShadow: 'none',
            transform: 'translateY(0)',
          };
        };

        return (
          <Radio.Group
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {/* True Option */}
              <Card
                size="small"
                hoverable
                onMouseEnter={() => setHoveredOption('true')}
                onMouseLeave={() => setHoveredOption(null)}
                style={{
                  ...getTrueFalseStyle(currentAnswer === true, hoveredOption === 'true'),
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: '100%',
                }}
                bodyStyle={{ padding: '16px' }}
                onClick={() => handleAnswerChange(questionId, true)}
              >
                <Radio value={true} style={{ width: '100%' }}>
                  <Text style={{ fontSize: '15px', marginLeft: '8px' }}>{trueLabel}</Text>
                </Radio>
              </Card>

              {/* False Option */}
              <Card
                size="small"
                hoverable
                onMouseEnter={() => setHoveredOption('false')}
                onMouseLeave={() => setHoveredOption(null)}
                style={{
                  ...getTrueFalseStyle(currentAnswer === false, hoveredOption === 'false'),
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: '100%',
                }}
                bodyStyle={{ padding: '16px' }}
                onClick={() => handleAnswerChange(questionId, false)}
              >
                <Radio value={false} style={{ width: '100%' }}>
                  <Text style={{ fontSize: '15px', marginLeft: '8px' }}>{falseLabel}</Text>
                </Radio>
              </Card>
            </Space>
          </Radio.Group>
        );

      case 'essay':
        const minWords = question.content?.min_words;
        const maxWords = question.content?.max_words;
        const suggestedLength = question.content?.suggested_length;
        const currentText = currentAnswer || '';
        const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;

        return (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* Info Alerts */}
            {(minWords || maxWords || suggestedLength) && (
              <Alert
                message="Yêu cầu"
                description={
                  <Space direction="vertical" size="small">
                    {minWords && <Text>• Số từ tối thiểu: {minWords} từ</Text>}
                    {maxWords && <Text>• Số từ tối đa: {maxWords} từ</Text>}
                    {suggestedLength && <Text>• Độ dài gợi ý: {suggestedLength}</Text>}
                  </Space>
                }
                type="info"
                showIcon
              />
            )}

            {/* Text Area */}
            <TextArea
              rows={12}
              placeholder="Nhập câu trả lời của bạn..."
              value={currentText}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            />

            {/* Word Counter */}
            <Card size="small" style={{ backgroundColor: '#fafafa' }}>
              <Space split={<span>|</span>}>
                <Text>
                  <strong>Số từ:</strong>{' '}
                  <Tag color={
                    (minWords && wordCount < minWords) || (maxWords && wordCount > maxWords)
                      ? 'warning'
                      : 'success'
                  }>
                    {wordCount}
                  </Tag>
                </Text>
                {minWords && (
                  <Text type={wordCount < minWords ? 'danger' : 'secondary'}>
                    Tối thiểu: {minWords}
                  </Text>
                )}
                {maxWords && (
                  <Text type={wordCount > maxWords ? 'danger' : 'secondary'}>
                    Tối đa: {maxWords}
                  </Text>
                )}
              </Space>
            </Card>
          </Space>
        );

      case 'short_answer':
        const maxLength = question.content?.max_length || 200;
        const placeholderText = question.content?.placeholder_text || 'Nhập câu trả lời ngắn...';
        const caseSensitive = question.content?.case_sensitive;

        return (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Input
              placeholder={placeholderText}
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              maxLength={maxLength}
              showCount
              style={{ width: '100%' }}
            />
            {caseSensitive && (
              <Alert
                message="Lưu ý: Câu trả lời có phân biệt chữ hoa chữ thường"
                type="info"
                showIcon
                style={{ marginTop: '8px' }}
              />
            )}
          </Space>
        );

      case 'fill_blank':
        // Check if using new fill_blank structure (fields directly in content)
        if (question.content?.template && question.content?.blanks) {
          const { template, blanks, case_sensitive } = question.content;
          const blankMatches = template.match(/\{blank\d+\}/g) || [];
          const uniqueBlanks = Array.from(new Set(blankMatches));

          // Split template by blanks
          const parts = template.split(/(\{blank\d+\})/);

          return (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ fontSize: '16px', lineHeight: '2' }}>
                {parts.map((part, index) => {
                  const blankMatch = part.match(/\{(blank\d+)\}/);
                  if (blankMatch) {
                    const blankId = blankMatch[1];
                    const blankDef = blanks[blankId];
                    const currentValue = currentAnswer?.[blankId] || '';

                    return (
                      <Input
                        key={index}
                        placeholder={blankDef?.placeholder_text || 'Điền vào chỗ trống...'}
                        value={currentValue}
                        onChange={(e) => {
                          const newAnswer = { ...currentAnswer, [blankId]: e.target.value };
                          handleAnswerChange(questionId, newAnswer);
                        }}
                        style={{
                          width: '200px',
                          margin: '0 4px',
                          display: 'inline-block',
                        }}
                      />
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </div>
              {case_sensitive && (
                <Alert
                  message="Lưu ý: Câu trả lời có phân biệt chữ hoa chữ thường"
                  type="info"
                  showIcon
                  style={{ marginTop: '8px' }}
                />
              )}
            </Space>
          );
        }

        // Fallback for old structure
        return (
          <Input
            placeholder="Điền vào chỗ trống..."
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
          />
        );

      case 'matching':
        if (question.content?.left_items && question.content?.right_items) {
          const { left_items, right_items } = question.content;
          const currentMatches = currentAnswer || {};
          const usedRightIds = Object.values(currentMatches);

          const handleMatchDragEnd = (event: DragEndEvent) => {
            const { active, over } = event;

            if (over) {
              const rightItemId = active.id as string;
              const leftItemId = over.id as string;

              // Remove previous match if this right item was already matched
              const newMatches = { ...currentMatches };
              Object.keys(newMatches).forEach((key) => {
                if (newMatches[key] === rightItemId) {
                  delete newMatches[key];
                }
              });

              // Add new match
              newMatches[leftItemId] = rightItemId;
              handleAnswerChange(questionId, newMatches);
            }
            
            // Reset active dragging state
            setActiveMatchingId(null);
          };

          const removeMatch = (leftItemId: string) => {
            const newMatches = { ...currentMatches };
            delete newMatches[leftItemId];
            handleAnswerChange(questionId, newMatches);
          };

          return (
            <DndContext
              sensors={dndSensors}
              onDragStart={(e) => setActiveMatchingId(e.active.id as string)}
              onDragEnd={handleMatchDragEnd}
              onDragCancel={() => setActiveMatchingId(null)}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Alert
                  message={`Đã ghép: ${Object.keys(currentMatches).length}/${left_items.length}`}
                  type="info"
                  showIcon
                />

                <Row gutter={16}>
                  {/* Left Column - Questions with Drop Zones */}
                  <Col span={12}>
                    <Card title="Câu hỏi" size="small">
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {left_items.map((leftItem: any) => {
                          const matchedRightId = currentMatches[leftItem.id];
                          const matchedRightItem = right_items.find(
                            (r: any) => r.id === matchedRightId
                          );

                          return (
                            <div key={leftItem.id}>
                              {/* Question */}
                              <div style={{ marginBottom: '8px' }}>
                                {leftItem.image_url && (
                                  <img
                                    src={leftItem.image_url}
                                    alt={leftItem.text}
                                    style={{
                                      maxWidth: '100%',
                                      maxHeight: '100px',
                                      marginBottom: '8px',
                                      borderRadius: '4px',
                                    }}
                                  />
                                )}
                                <Text strong>{leftItem.text}</Text>
                              </div>

                              {/* Drop Zone */}
                              <DroppableMatchZone
                                id={leftItem.id}
                                matchedItem={matchedRightItem || null}
                                onRemove={() => removeMatch(leftItem.id)}
                              />
                            </div>
                          );
                        })}
                      </Space>
                    </Card>
                  </Col>

                  {/* Right Column - Draggable Answers */}
                  <Col span={12}>
                    <Card title="Câu trả lời" size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {right_items.map((rightItem: any) => (
                          <DraggableMatchAnswer
                            key={rightItem.id}
                            id={rightItem.id}
                            item={rightItem}
                            isUsed={usedRightIds.includes(rightItem.id)}
                          />
                        ))}
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Space>

              {/* Drag Overlay - shows card following cursor */}
              <DragOverlay>
                {activeMatchingId ? (
                  <Card
                    size="small"
                    style={{
                      cursor: 'grabbing',
                      border: '1px solid #d9d9d9',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <Space>
                      {(() => {
                        const item = right_items.find((r: any) => r.id === activeMatchingId);
                        if (!item) return null;
                        return (
                          <>
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.text}
                                style={{ maxHeight: '50px', borderRadius: '4px' }}
                              />
                            )}
                            <Text>{item.text}</Text>
                          </>
                        );
                      })()}
                    </Space>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          );
        }
        return <Text type="secondary">Câu hỏi ghép cặp không hợp lệ</Text>;

      case 'ordering':
        if (question.content?.items) {
          const { items } = question.content;
          const currentOrder = currentAnswer || items.map((item: any) => item.id);

          // dndSensors is now from component top level

          const handleDragEnd = (event: DragEndEvent) => {
            const { active, over } = event;

            if (over && active.id !== over.id) {
              const oldIndex = currentOrder.indexOf(active.id as string);
              const newIndex = currentOrder.indexOf(over.id as string);
              const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
              handleAnswerChange(questionId, newOrder);
            }
          };

          const moveItem = (fromIndex: number, toIndex: number) => {
            const newOrder = [...currentOrder];
            const [removed] = newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, removed);
            handleAnswerChange(questionId, newOrder);
          };

          return (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Alert
                message="Kéo thả các items hoặc dùng nút ↑↓ để sắp xếp theo thứ tự đúng"
                type="info"
                showIcon
              />

              <DndContext
                sensors={dndSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={currentOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {currentOrder.map((itemId: string, index: number) => {
                    const item = items.find((i: any) => i.id === itemId);
                    if (!item) return null;

                    return (
                      <SortableOrderItem
                        key={itemId}
                        id={itemId}
                        item={item}
                        index={index}
                        totalItems={currentOrder.length}
                        onMoveUp={() => moveItem(index, index - 1)}
                        onMoveDown={() => moveItem(index, index + 1)}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            </Space>
          );
        }
        return <Text type="secondary">Câu hỏi sắp xếp không hợp lệ</Text>;

      default:
        return <Text type="secondary">Loại câu hỏi không được hỗ trợ</Text>;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const totalTime = (attempt?.assessment?.duration || 60) * 60;
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage > 50) return '#52c41a';
    if (percentage > 20) return '#faad14';
    return '#f5222d';
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const settings = attempt?.assessment?.settings;
  const requireWebcam = settings?.require_webcam;

  useEffect(() => {
    if (settings) {
      console.log('Assessment proctoring settings:', {
        require_webcam: settings.require_webcam,
        require_full_screen: settings.require_full_screen,
        prevent_tab_switching: settings.prevent_tab_switching,
        prevent_copy_paste: settings.prevent_copy_paste
      });
    }
  }, [settings]);

  const handleProctoringViolation = async (event: ProctoringEvent) => {
    setProctoringEvents(prev => [...prev, event]);
    console.log('Proctoring violation:', event);

    // Submit to backend if violation ended
    if (user && attempt && (event.duration > 0 && event.endTime > 0)) {
      try {
        await violationService.submitCameraViolation(
          event,
          user.id,
          attempt.id,
          attempt.assessment_id
        );
      } catch (error) {
        console.error('Failed to submit camera violation:', error);
      }
    }
  };

  const handleBrowserViolation = async (event: BrowserProctoringEvent) => {
    const key = event.type;
    if (event.duration === 0) {
      setBrowserViolations(prev => new Map(prev).set(key, event));
    } else {
      setBrowserViolations(prev => new Map(prev).set(key, event));
      setTimeout(() => {
        setBrowserViolations(prev => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
      }, 3000);
    }
    console.log('Browser violation:', event);

    // Submit to backend
    if (user && attempt) {
      try {
        await violationService.submitBrowserViolation(
          event,
          user.id,
          attempt.id,
          attempt.assessment_id
        );
      } catch (error) {
        console.error('Failed to submit browser violation:', error);
      }
    }
  };

  // Browser proctoring for ALL tests (not just webcam tests)
  useBrowserProctoring({
    enabled: true,
    requireFullscreen: settings?.require_full_screen,
    preventTabSwitching: settings?.prevent_tab_switching,
    preventCopyPaste: settings?.prevent_copy_paste,
    detectTampering: true,
    onViolation: handleBrowserViolation
  });

  // Block DevTools shortcuts (F12, right-click, etc.) - bypassed in dev mode
  useDevToolsBlocker(true);

  // Auto-enter fullscreen when test loads (if required)
  useEffect(() => {
    if (!attempt || !settings) return;
    
    const enterFullscreen = async () => {
      if (settings.require_full_screen && !document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
          console.log('Entered fullscreen mode');
        } catch (err) {
          console.error('Failed to enter fullscreen:', err);
          modal.warning({
            title: 'Yêu cầu toàn màn hình',
            content: 'Bài kiểm tra này yêu cầu chế độ toàn màn hình. Vui lòng cho phép.',
          });
        }
      }
    };

    enterFullscreen();
  }, [attempt, settings]);

  // Prevent exiting fullscreen during test
  useEffect(() => {
    if (!settings?.require_full_screen) return;

    const handleFullscreenChange = () => {
      // Don't show warning if test is being submitted
      if (isSubmitting) return;
      
      if (!document.fullscreenElement) {
        // User exited fullscreen - try to re-enter
        modal.warning({
          title: 'Yêu cầu toàn màn hình',
          content: 'Bạn không thể thoát chế độ toàn màn hình trong khi làm bài.',
          onOk: async () => {
            try {
              await document.documentElement.requestFullscreen();
            } catch (err) {
              console.error('Failed to re-enter fullscreen:', err);
            }
          },
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [settings, isSubmitting]);

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải bài kiểm tra...</Text>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Không tìm thấy bài kiểm tra"
          description="Bài kiểm tra bạn đang tìm không tồn tại hoặc đã bị xóa."
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Không có câu hỏi"
          description="Bài kiểm tra này chưa có câu hỏi nào. Vui lòng liên hệ giáo viên."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi tải câu hỏi"
          description="Không thể tải câu hỏi hiện tại. Vui lòng thử lại."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space align="center">
              <Title level={3} style={{ margin: 0 }}>
                {attempt.assessment?.title}
              </Title>
              {autoSaving && (
                <Tag color="processing" icon={<SaveOutlined />}>
                  Đang lưu...
                </Tag>
              )}
            </Space>
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary">
                Câu {currentQuestionIndex + 1} / {questions.length}
              </Text>
            </div>
          </Col>
          <Col>
            <Statistic
              title="Thời gian còn lại"
              value={formatTime(timeRemaining)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: getTimeColor(), fontSize: '24px' }}
            />
          </Col>
          <Col>
            <Statistic
              title="Đã trả lời"
              value={answeredCount}
              suffix={`/ ${questions.length}`}
              valueStyle={{ fontSize: '24px' }}
            />
          </Col>
        </Row>
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor="#1890ff"
          style={{ marginTop: '16px' }}
        />
      </Card>

      {/* Question Card */}
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Question Header */}
          <div>
            <Space>
              <Tag color="blue">Câu {currentQuestionIndex + 1}</Tag>
              <Tag>{currentQuestion.points} điểm</Tag>
              {/* DEPRECATED: time_limit per question not used. Only Assessment.Duration is enforced.
              {currentQuestion.time_limit && (
                <Tag icon={<ClockCircleOutlined />}>
                  {currentQuestion.time_limit} giây
                </Tag>
              )}
              */}
            </Space>
          </div>

          {/* Question Text */}
          <div>
            <Paragraph strong style={{ fontSize: '16px' }}>
              {currentQuestion.text}
            </Paragraph>
          </div>

          {/* Answer Input */}
          <div>{renderQuestionContent(currentQuestion)}</div>

          {/* Navigation */}
          <Row justify="space-between" align="middle">
            <Col>
              <Button
                icon={<LeftOutlined />}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Trước
              </Button>
            </Col>
            <Col>
              <Space>
                <Text type="secondary">
                  {answeredCount} / {questions.length} đã trả lời
                </Text>
              </Space>
            </Col>
            <Col>
              <Space>
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleSubmit}
                    loading={submitAttemptMutation.isPending}
                  >
                    Nộp bài
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<RightOutlined />}
                    onClick={handleNextQuestion}
                  >
                    Tiếp theo
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Question Navigation Grid */}
      <Card title="Điều hướng câu hỏi" style={{ marginTop: '16px' }}>
        <Space wrap>
          {questions.map((q, index) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = q.id === currentQuestionId;
            return (
              <Button
                key={q.id}
                type={isCurrent ? 'primary' : isAnswered ? 'default' : 'dashed'}
                onClick={() => goToQuestion(q.id)}
                style={{
                  width: '40px',
                  backgroundColor: isAnswered && !isCurrent ? '#52c41a' : undefined,
                  borderColor: isAnswered && !isCurrent ? '#52c41a' : undefined,
                  color: isAnswered && !isCurrent ? '#fff' : undefined,
                }}
              >
                {index + 1}
              </Button>
            );
          })}
        </Space>
      </Card>

      {/* Proctoring Monitor - Floating */}
      {requireWebcam && (
        <>
          <ProctoringMonitor
            onViolation={handleProctoringViolation}
            onFaceCountChange={(count) => {
              // Trigger verification if:
              // 1. Face count returns to 1 from 0 or 2+ (normal case)
              // 2. First face detected after initial load period (prevents cheating)
              if (prevFaceCount !== null && (prevFaceCount === 0 || prevFaceCount >= 2) && count === 1) {
                setShowFaceVerifyModal(true);
              } else if (prevFaceCount === null && count === 1 && initialLoadComplete) {
                // First face detected after initial load - could be cheating
                setShowFaceVerifyModal(true);
              }
              setPrevFaceCount(count);
            }}
            showLandmarks={false}
            compact
            violationCount={proctoringEvents.length}
            requireFullscreen={settings?.require_full_screen}
            preventTabSwitching={settings?.prevent_tab_switching}
            preventCopyPaste={settings?.prevent_copy_paste}
            detectTampering={true}
          />
          <InTestFaceVerificationModal
            open={showFaceVerifyModal}
            onSuccess={() => {
              setShowFaceVerifyModal(false);
              setPrevFaceCount(1);
            }}
            onFail={() => {
              setShowFaceVerifyModal(false);
            }}
          />
        </>
      )}

      {/* Browser Violations (for non-webcam tests) */}
      {!requireWebcam && browserViolations.size > 0 && (
        <Card title="Cảnh báo vi phạm" style={{ marginTop: '16px' }}>
          {Array.from(browserViolations.values()).map((violation) => {
            const getMessage = (type: string, metadata?: any) => {
              switch (type) {
                case 'tab_switch': return metadata?.hidden ? 'Chuyển tab/cửa sổ' : 'Quay lại tab';
                case 'fullscreen_exit': return 'Thoát chế độ toàn màn hình';
                case 'copy_paste': return `Phát hiện ${metadata?.action === 'copy' ? 'sao chép' : metadata?.action === 'paste' ? 'dán' : 'cắt'}`;
                case 'browser_tamper': return 'Phát hiện DevTools';
                default: return 'Vi phạm';
              }
            };
            return (
              <Alert
                key={violation.type}
                type={violation.duration === 0 ? 'error' : 'warning'}
                message={getMessage(violation.type, violation.metadata)}
                showIcon
                style={{ marginBottom: 8 }}
              />
            );
          })}
        </Card>
      )}

      {/* Warning: Leave page */}
      <Alert
        message="Cảnh báo"
        description="Không đóng hoặc làm mới trang này trong khi làm bài. Tiến trình của bạn được tự động lưu."
        type="warning"
        showIcon
        style={{ marginTop: '16px' }}
      />
    </div>
  );
};

export default TakeAssessment;
