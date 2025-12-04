import React from 'react';
import { Space, Alert, Typography } from 'antd';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableOrderItem } from '../SortableOrderItem';
import type { DndQuestionProps } from '../../types';

const { Text } = Typography;

export const OrderingQuestion: React.FC<DndQuestionProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  dndSensors,
  customGrabbedId,
  focusedItemId,
}) => {
  if (!question.content?.items) {
    return <Text type="secondary">Câu hỏi sắp xếp không hợp lệ</Text>;
  }

  const { items } = question.content;
  const currentOrder = currentAnswer || items.map((item: any) => item.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentOrder.indexOf(active.id as string);
      const newIndex = currentOrder.indexOf(over.id as string);
      const newOrder = arrayMove(currentOrder, oldIndex, newIndex);
      onAnswerChange(question.id, newOrder);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...currentOrder];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    onAnswerChange(question.id, newOrder);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <DndContext
        sensors={dndSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
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
      
      <Alert
        message="Kéo thả các items hoặc dùng nút ↑↓ để sắp xếp theo thứ tự đúng"
        type="warning"
        showIcon={false}
        style={{ fontSize: '13px', padding: '4px 12px' }}
      />
    </Space>
  );
};
