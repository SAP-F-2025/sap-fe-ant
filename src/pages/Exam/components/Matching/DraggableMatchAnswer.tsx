import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, Space, Typography } from 'antd';
import { useThemeToken } from '../../../../theme/ThemeProvider';

const { Text } = Typography;

interface DraggableMatchAnswerProps {
  id: string;
  item: { id: string; text: string; image_url?: string };
  isUsed: boolean;
}

export const DraggableMatchAnswer: React.FC<DraggableMatchAnswerProps> = ({ id, item, isUsed }) => {
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
