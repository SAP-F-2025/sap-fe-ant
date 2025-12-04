import React from 'react';
import { Space, Alert, Row, Col, Card, Typography } from 'antd';
import { DndContext, DragOverlay, DragEndEvent } from '@dnd-kit/core';
import { DroppableMatchZone } from '../Matching/DroppableMatchZone';
import { DraggableMatchAnswer } from '../Matching/DraggableMatchAnswer';
import type { DndQuestionProps } from '../../types';

const { Text } = Typography;

export const MatchingQuestion: React.FC<DndQuestionProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  dndSensors,
  activeMatchingId,
  setActiveMatchingId,
}) => {
  if (!question.content?.left_items || !question.content?.right_items) {
    return <Text type="secondary">Câu hỏi ghép cặp không hợp lệ</Text>;
  }

  const { left_items, right_items } = question.content;
  const currentMatches = currentAnswer || {};
  const usedRightIds = Object.values(currentMatches) as string[];

  const handleMatchDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const rightItemId = active.id as string;
      const leftItemId = over.id as string;

      const newMatches = { ...currentMatches };
      Object.keys(newMatches).forEach((key) => {
        if (newMatches[key] === rightItemId) {
          delete newMatches[key];
        }
      });

      newMatches[leftItemId] = rightItemId;
      onAnswerChange(question.id, newMatches);
    }

    setActiveMatchingId(null);
  };

  const removeMatch = (leftItemId: string) => {
    const newMatches = { ...currentMatches };
    delete newMatches[leftItemId];
    onAnswerChange(question.id, newMatches);
  };

  return (
    <DndContext
      sensors={dndSensors}
      onDragStart={(e) => setActiveMatchingId(e.active.id as string)}
      onDragEnd={handleMatchDragEnd}
      onDragCancel={() => setActiveMatchingId(null)}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Câu hỏi" size="small">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {left_items.map((leftItem: any) => {
                  const matchedRightId = currentMatches[leftItem.id];
                  const matchedRightItem = right_items.find((r: any) => r.id === matchedRightId);

                  return (
                    <div key={leftItem.id}>
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
        
        <Alert
          message={`Đã ghép: ${Object.keys(currentMatches).length}/${left_items.length}`}
          type="warning"
          showIcon={false}
          style={{ fontSize: '13px', padding: '4px 12px' }}
        />
      </Space>

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
};
