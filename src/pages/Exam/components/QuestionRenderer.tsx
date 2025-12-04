import React, { useState } from 'react';
import {
  Typography,
  Input,
  Radio,
  Checkbox,
  Space,
  Alert,
  Row,
  Col,
  Card,
  Tag,
  Button,
} from 'antd';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CloseOutlined } from '@ant-design/icons';
import { useThemeToken } from '../../../theme/ThemeProvider';
import { SortableOrderItem } from './SortableOrderItem';
import { DroppableMatchZone } from './Matching/DroppableMatchZone';
import { DraggableMatchAnswer } from './Matching/DraggableMatchAnswer';

const { Text } = Typography;
const { TextArea } = Input;

interface QuestionRendererProps {
  question: any; // AssessmentQuestion type
  currentAnswer: any;
  onAnswerChange: (questionId: number, value: any) => void;
  dndSensors: any;
  activeMatchingId: string | null;
  setActiveMatchingId: (id: string | null) => void;
  customGrabbedId: string | null;
  setCustomGrabbedId: (id: string | null) => void;
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  dndSensors,
  activeMatchingId,
  setActiveMatchingId,
  customGrabbedId,
  setCustomGrabbedId,
  focusedItemId,
  setFocusedItemId,
}) => {
  const { token } = useThemeToken();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  if (!question) return null;

  const questionId = question.id;

  // Helper for Multiple Choice / True False styles
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

  switch (question.type) {
    case 'multiple_choice':
      const isMultiple = question.content?.multiple_correct;
      
      if (isMultiple) {
        // Checkbox Group for multiple correct answers
        const selectedValues = (currentAnswer as number[]) || [];
        
        return (
          <Checkbox.Group
            value={selectedValues}
            onChange={(values) => onAnswerChange(questionId, values)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {question.content?.options?.map((option: any) => {
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
                        ? selectedValues.filter(v => v !== option.id)
                        : [...selectedValues, option.id];
                      onAnswerChange(questionId, newValues);
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

      // Radio Group for single correct answer
      return (
        <Radio.Group
          value={currentAnswer}
          onChange={(e) => onAnswerChange(questionId, e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {question.content?.options?.map((option: any) => {
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
                  onClick={() => onAnswerChange(questionId, option.id)}
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

      return (
        <Radio.Group
          value={currentAnswer}
          onChange={(e) => onAnswerChange(questionId, e.target.value)}
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
                ...getOptionStyle(currentAnswer === true, hoveredOption === 'true'),
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
              }}
              bodyStyle={{ padding: '16px' }}
              onClick={() => onAnswerChange(questionId, true)}
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
                ...getOptionStyle(currentAnswer === false, hoveredOption === 'false'),
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
              }}
              bodyStyle={{ padding: '16px' }}
              onClick={() => onAnswerChange(questionId, false)}
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
            onChange={(e) => onAnswerChange(questionId, e.target.value)}
          />

          {/* Word & Character Counter */}
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
              <Text>
                <strong>Ký tự:</strong>{' '}
                <Tag color="blue">
                  {currentText.length}
                </Tag>
              </Text>
              {minWords && (
                <Text type={wordCount < minWords ? 'danger' : 'secondary'}>
                  Tối thiểu: {minWords} từ
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
            onChange={(e) => onAnswerChange(questionId, e.target.value)}
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
    case 'fill_in_blank': // Handle both types
      // Check if using new fill_blank structure (fields directly in content)
      if (question.content?.template && question.content?.blanks) {
        const { template, blanks, case_sensitive } = question.content;
        
        // Split template by blanks
        const parts = template.split(/(\{blank\d+\})/);

        return (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div style={{ fontSize: '16px', lineHeight: '2' }}>
              {parts.map((part: string, index: number) => {
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
                        onAnswerChange(questionId, newAnswer);
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
          onChange={(e) => onAnswerChange(questionId, e.target.value)}
        />
      );

    case 'matching':
      if (question.content?.left_items && question.content?.right_items) {
        const { left_items, right_items } = question.content;
        const currentMatches = currentAnswer || {};
        const usedRightIds = Object.values(currentMatches) as string[];

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
            onAnswerChange(questionId, newMatches);
          }
          
          // Reset active dragging state
          setActiveMatchingId(null);
        };

        const removeMatch = (leftItemId: string) => {
          const newMatches = { ...currentMatches };
          delete newMatches[leftItemId];
          onAnswerChange(questionId, newMatches);
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

        const handleDragEnd = (event: DragEndEvent) => {
          const { active, over } = event;

          if (over && active.id !== over.id) {
            const oldIndex = currentOrder.indexOf(active.id as string);
            const newIndex = currentOrder.indexOf(over.id as string);
            const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
            onAnswerChange(questionId, newOrder);
          }
        };

        const moveItem = (fromIndex: number, toIndex: number) => {
          const newOrder = [...currentOrder];
          const [removed] = newOrder.splice(fromIndex, 1);
          newOrder.splice(toIndex, 0, removed);
          onAnswerChange(questionId, newOrder);
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
                      isGrabbed={customGrabbedId === itemId}
                      isFocused={focusedItemId === itemId}
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
