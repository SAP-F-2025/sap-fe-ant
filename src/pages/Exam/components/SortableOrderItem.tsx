import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Space, Tag, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeToken } from '../../../theme/ThemeProvider';

const { Text } = Typography;

export interface SortableOrderItemProps {
	id: string;
	item: { id: string; text: string; image_url?: string };
	index: number;
	totalItems: number;
	onMoveUp: () => void;
	onMoveDown: () => void;
	isGrabbed?: boolean;
	isFocused?: boolean;
}

export const SortableOrderItem: React.FC<SortableOrderItemProps> = ({
	id,
	item,
	index,
	totalItems,
	onMoveUp,
	onMoveDown,
	isGrabbed,
	isFocused,
}) => {
	const { t } = useTranslation();
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
	});

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
			: isGrabbed
				? `0 0 0 2px ${token.colorPrimary}`
				: isFocused
					? `0 0 0 2px ${token.colorWarning}`
					: undefined,
		border:
			isDragging || isGrabbed
				? `2px solid ${token.colorPrimary}`
				: isFocused
					? `2px solid ${token.colorWarning}`
					: `1px solid ${token.colorBorder}`,
		zIndex: isGrabbed ? 1 : undefined,
		outline: 'none',
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			size="small"
			{...attributes}
			{...listeners}
			data-sortable-id={id}
			tabIndex={0}
			onClick={(e) => {
				e.currentTarget.focus();
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '12px',
				}}
			>
				{/* Content - Left side */}
				<Space style={{ flex: 1, minWidth: 0 }}>
					<Tag color={isGrabbed ? 'processing' : 'default'}>{index + 1}</Tag>
					{item.image_url && (
						<img
							src={item.image_url}
							alt={item.text}
							style={{
								maxWidth: '100px',
								maxHeight: '60px',
								borderRadius: '4px',
							}}
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
							title={t('exam.questionTypes.ordering.moveUp')}
						/>
						<Button
							size="small"
							icon={<DownOutlined />}
							disabled={index === totalItems - 1}
							onClick={onMoveDown}
							title={t('exam.questionTypes.ordering.moveDown')}
						/>
					</Space>
				</div>
			</div>
		</Card>
	);
};
