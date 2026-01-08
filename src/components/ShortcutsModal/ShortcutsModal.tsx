import { CloseOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeToken } from '../../theme/ThemeProvider';

const { Text } = Typography;

interface Shortcut {
	keys: string[];
	descriptionKey: string;
}

interface ShortcutSubsection {
	titleKey?: string;
	shortcuts: Shortcut[];
}

interface ShortcutSection {
	titleKey: string;
	subsections?: ShortcutSubsection[];
	shortcuts?: Shortcut[];
}

interface ShortcutsModalProps {
	activeContext?: string;
}

const allShortcuts: Record<string, ShortcutSection> = {
	'settings-notifications': {
		titleKey: 'shortcuts.sections.settingsNotifications',
		shortcuts: [
			{
				keys: ['Ctrl', 'Enter'],
				descriptionKey: 'shortcuts.descriptions.saveChanges',
			},
			{
				keys: ['Ctrl', 'Backspace'],
				descriptionKey: 'shortcuts.descriptions.cancelChanges',
			},
		],
	},
	settings: {
		titleKey: 'shortcuts.sections.settings',
		shortcuts: [
			{
				keys: ['Alt', '↑/↓'],
				descriptionKey: 'shortcuts.descriptions.switchSettingsTab',
			},
			{
				keys: ['Shift', '↑/↓'],
				descriptionKey: 'shortcuts.descriptions.navigateInTab',
			},
		],
	},
	navigation: {
		titleKey: 'shortcuts.sections.navigation',
		shortcuts: [
			{
				keys: ['Alt', '↑/↓'],
				descriptionKey: 'shortcuts.descriptions.switchMenuTab',
			},
			{
				keys: ['Ctrl', 'B'],
				descriptionKey: 'shortcuts.descriptions.toggleSidebar',
			},
		],
	},
	exam: {
		titleKey: 'shortcuts.sections.exam',
		subsections: [
			{
				titleKey: 'shortcuts.subsections.general',
				shortcuts: [
					{
						keys: ['←', '→'],
						descriptionKey: 'shortcuts.descriptions.prevNextQuestion',
					},
					{
						keys: ['Shift', 'Enter'],
						descriptionKey: 'shortcuts.descriptions.exitInput',
					},
					{
						keys: ['Ctrl', 'Enter'],
						descriptionKey: 'shortcuts.descriptions.openSubmitDialog',
					},
					{
						keys: ['Ctrl', 'Shift', 'Enter'],
						descriptionKey: 'shortcuts.descriptions.confirmSubmit',
					},
					{
						keys: ['Enter', 'Space'],
						descriptionKey: 'shortcuts.descriptions.verifyFace',
					},
					{
						keys: ['Ctrl', 'Shift', 'T'],
						descriptionKey: 'shortcuts.descriptions.toggleTheme',
					},
					{
						keys: ['Ctrl', '/'],
						descriptionKey: 'shortcuts.descriptions.toggleShortcuts',
					},
				],
			},
			{
				titleKey: 'shortcuts.subsections.multipleChoice',
				shortcuts: [
					{
						keys: ['1', '9'],
						descriptionKey: 'shortcuts.descriptions.selectAnswer',
					},
				],
			},
			{
				titleKey: 'shortcuts.subsections.trueFalse',
				shortcuts: [
					{
						keys: ['1'],
						descriptionKey: 'shortcuts.descriptions.selectTrue',
					},
					{
						keys: ['2'],
						descriptionKey: 'shortcuts.descriptions.selectFalse',
					},
				],
			},
			{
				titleKey: 'shortcuts.subsections.ordering',
				shortcuts: [
					{
						keys: ['Space', 'Enter'],
						descriptionKey: 'shortcuts.descriptions.selectOrMove',
					},
					{
						keys: ['Alt', '↑/↓'],
						descriptionKey: 'shortcuts.descriptions.moveSelectedOrNavigate',
					},
					{
						keys: ['1', '9'],
						descriptionKey: 'shortcuts.descriptions.quickSelectOrMove',
					},
				],
			},
		],
	},
	global: {
		titleKey: 'shortcuts.sections.global',
		shortcuts: [
			{
				keys: ['Ctrl', '/'],
				descriptionKey: 'shortcuts.descriptions.toggleShortcuts',
			},
			{
				keys: ['Ctrl', ','],
				descriptionKey: 'shortcuts.descriptions.openSettings',
			},
			{
				keys: ['Ctrl', 'Shift', 'T'],
				descriptionKey: 'shortcuts.descriptions.toggleTheme',
			},
			{
				keys: ['Esc'],
				descriptionKey: 'shortcuts.descriptions.closeModal',
			},
		],
	},
};

export interface ShortcutsModalHandle {
	open: () => void;
	close: () => void;
	toggle: () => void;
}

const ShortcutsModalComponent = React.forwardRef<ShortcutsModalHandle, ShortcutsModalProps>(
	({ activeContext }, ref) => {
		const { token } = useThemeToken();
		const { t } = useTranslation();
		const [open, setOpen] = useState(false);
		const contentRef = React.useRef<HTMLDivElement>(null);

		React.useImperativeHandle(ref, () => ({
			open: () => setOpen(true),
			close: () => setOpen(false),
			toggle: () => setOpen((prev) => !prev),
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

		const renderShortcutsList = (shortcuts: Shortcut[]) => (
			<div style={{ display: 'grid', gap: 4 }}>
				{shortcuts.map((shortcut, index) => (
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
						<Text style={{ fontSize: 14 }}>{t(shortcut.descriptionKey)}</Text>
						<div
							style={{
								display: 'flex',
								gap: 6,
								alignItems: 'center',
							}}
						>
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
										<Text
											type="secondary"
											style={{
												fontSize: 12,
												fontWeight: 600,
											}}
										>
											+
										</Text>
									)}
								</React.Fragment>
							))}
						</div>
					</div>
				))}
			</div>
		);

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
							<Text strong style={{ fontSize: 18 }}>
								{t('shortcuts.title')}
							</Text>
							<div style={{ marginTop: 4 }}>
								<Text type="secondary" style={{ fontSize: 13 }}>
									{t('shortcuts.subtitle')}
								</Text>
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
							onMouseEnter={(e) =>
								(e.currentTarget.style.background = token.colorBgTextHover)
							}
							onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
						>
							<CloseOutlined
								style={{
									fontSize: 16,
									color: token.colorTextSecondary,
								}}
							/>
						</div>
					</div>

					{/* Content */}
					<div
						ref={contentRef}
						tabIndex={0}
						style={{
							padding: '16px 24px 24px',
							maxHeight: '60vh',
							overflow: 'auto',
							outline: 'none',
						}}
					>
						{getSortedSections().map(([key, section], sectionIndex) => (
							<div
								key={key}
								style={{
									marginBottom:
										sectionIndex < getSortedSections().length - 1 ? 24 : 0,
								}}
							>
								<Text
									strong
									style={{
										display: 'block',
										marginBottom: 12,
										fontSize: 13,
										textTransform: 'uppercase',
										letterSpacing: '0.5px',
										color:
											key === activeContext
												? token.colorPrimary
												: token.colorTextSecondary,
									}}
								>
									{t(section.titleKey)}
								</Text>

								{section.subsections ? (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 16,
										}}
									>
										{section.subsections.map((subsection, subIndex) => (
											<div key={subIndex}>
												{subsection.titleKey && (
													<Text
														type="secondary"
														style={{
															display: 'block',
															marginBottom: 8,
															fontSize: 12,
															fontWeight: 600,
															marginLeft: 4,
														}}
													>
														{t(subsection.titleKey)}
													</Text>
												)}
												{renderShortcutsList(subsection.shortcuts)}
											</div>
										))}
									</div>
								) : (
									renderShortcutsList(section.shortcuts || [])
								)}
							</div>
						))}
					</div>
				</div>
			</Modal>
		);
	}
);

ShortcutsModalComponent.displayName = 'ShortcutsModal';

export const ShortcutsModal = ShortcutsModalComponent;
export default ShortcutsModalComponent;
