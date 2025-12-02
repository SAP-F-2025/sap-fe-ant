import { CloseOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useThemeToken } from '../../theme/ThemeProvider';

const { Text } = Typography;

interface Shortcut {
	keys: string[];
	description: string;
}

interface ShortcutSection {
	title: string;
	shortcuts: Shortcut[];
}

interface ShortcutsModalProps {
	activeContext?: string;
}

const allShortcuts: Record<string, ShortcutSection> = {
	'settings-notifications': {
		title: 'Cài đặt - Thông báo',
		shortcuts: [
			{ keys: ['Ctrl', 'Enter'], description: 'Lưu thay đổi' },
			{ keys: ['Ctrl', 'Backspace'], description: 'Hủy thay đổi' },
		],
	},
	settings: {
		title: 'Cài đặt',
		shortcuts: [
			{ keys: ['Alt', '↑/↓'], description: 'Chuyển tab cài đặt' },
			{ keys: ['Shift', '↑/↓'], description: 'Điều hướng trong tab' },
		],
	},
	navigation: {
		title: 'Điều hướng',
		shortcuts: [
			{ keys: ['Alt', '↑/↓'], description: 'Chuyển tab menu' },
			{ keys: ['Ctrl', 'B'], description: 'Ẩn/Hiện thanh bên' },
		],
	},
	global: {
		title: 'Toàn cục',
		shortcuts: [
			{ keys: ['Ctrl', '/'], description: 'Mở/Đóng danh sách phím tắt' },
			{ keys: ['Ctrl', ','], description: 'Mở/Đóng cài đặt' },
			{ keys: ['Ctrl', 'Shift', 'T'], description: 'Chuyển đổi chủ đề' },
			{ keys: ['Esc'], description: 'Đóng modal' },
		],
	},
};

export interface ShortcutsModalHandle {
	open: () => void;
	close: () => void;
	toggle: () => void;
}

const ShortcutsModalComponent = React.forwardRef<ShortcutsModalHandle, ShortcutsModalProps>(({ activeContext }, ref) => {
	const { token } = useThemeToken();
	const [open, setOpen] = useState(false);
	const contentRef = React.useRef<HTMLDivElement>(null);

	React.useImperativeHandle(ref, () => ({
		open: () => setOpen(true),
		close: () => setOpen(false),
		toggle: () => setOpen(prev => !prev),
	}));

	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
				e.stopPropagation();
			}
		};
		window.addEventListener('keydown', handleKeyDown, true);
		return () => window.removeEventListener('keydown', handleKeyDown, true);
	}, [open]);

	useEffect(() => {
		if (open && contentRef.current) {
			setTimeout(() => contentRef.current?.focus(), 100);
		}
	}, [open]);

	const getSortedSections = () => {
		const sections = Object.entries(allShortcuts);
		if (activeContext && allShortcuts[activeContext]) {
			const activeSection = sections.find(([key]) => key === activeContext);
			const otherSections = sections.filter(([key]) => key !== activeContext);
			return activeSection ? [activeSection, ...otherSections] : sections;
		}
		return sections;
	};

	return (
		<Modal
			open={open}
			onCancel={() => setOpen(false)}
			footer={null}
			width={700}
			centered
			closable={false}
			styles={{
				body: { padding: 0 },
				content: { borderRadius: 8, overflow: 'hidden' },
			}}
		>
			<div style={{ background: token.colorBgElevated }}>
				{/* Header */}
				<div
					style={{
						padding: '20px 24px',
						background: token.colorBgContainer,
						borderBottom: `1px solid ${token.colorBorderSecondary}`,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<div>
						<Text strong style={{ fontSize: 18 }}>Phím tắt</Text>
						<div style={{ marginTop: 4 }}>
							<Text type="secondary" style={{ fontSize: 13 }}>Sử dụng các phím tắt để làm việc nhanh hơn</Text>
						</div>
					</div>
					<div
						style={{
							cursor: 'pointer',
							padding: 8,
							borderRadius: 4,
							transition: 'background 0.2s',
						}}
						onClick={() => setOpen(false)}
						onMouseEnter={(e) => e.currentTarget.style.background = token.colorBgTextHover}
						onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
					>
						<CloseOutlined style={{ fontSize: 16, color: token.colorTextSecondary }} />
					</div>
				</div>

				{/* Content */}
				<div 
					ref={contentRef}
					tabIndex={0}
					style={{ padding: '16px 24px 24px', maxHeight: '60vh', overflow: 'auto', outline: 'none' }}
				>
					{getSortedSections().map(([key, section], sectionIndex) => (
						<div key={key} style={{ marginBottom: sectionIndex < getSortedSections().length - 1 ? 24 : 0 }}>
							<Text
								strong
								style={{
									display: 'block',
									marginBottom: 12,
									fontSize: 13,
									textTransform: 'uppercase',
									letterSpacing: '0.5px',
									color: key === activeContext ? token.colorPrimary : token.colorTextSecondary,
								}}
							>
								{section.title}
							</Text>
							<div style={{ display: 'grid', gap: 4 }}>
								{section.shortcuts.map((shortcut, index) => (
									<div
										key={index}
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											padding: '10px 12px',
											background: token.colorBgContainer,
											borderRadius: 4,
										}}
									>
										<Text style={{ fontSize: 14 }}>{shortcut.description}</Text>
										<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
											{shortcut.keys.map((key, i) => (
												<React.Fragment key={i}>
													<kbd
														style={{
															padding: '6px 10px',
															background: token.colorBgLayout,
															border: `1px solid ${token.colorBorder}`,
															borderRadius: 4,
															fontSize: 13,
															fontWeight: 600,
															fontFamily: 'monospace',
															boxShadow: `0 2px 0 ${token.colorBorder}`,
															minWidth: 32,
															textAlign: 'center',
														}}
													>
														{key}
													</kbd>
													{i < shortcut.keys.length - 1 && (
														<Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>+</Text>
													)}
												</React.Fragment>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</Modal>
	);
});

ShortcutsModalComponent.displayName = 'ShortcutsModal';

export const ShortcutsModal = ShortcutsModalComponent;
export default ShortcutsModalComponent;
