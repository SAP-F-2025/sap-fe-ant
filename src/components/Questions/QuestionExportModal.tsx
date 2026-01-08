import React, { useState } from 'react';
import {
	Modal,
	Button,
	Space,
	Typography,
	Radio,
	Checkbox,
	Alert,
	Progress,
	message,
	List,
	Tag,
	Divider,
} from 'antd';
import {
	DownloadOutlined,
	FileExcelOutlined,
	FileTextOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import importExportService from '../../services/importExportService';
import { Question } from '../../types';

const { Text, Title } = Typography;

interface QuestionExportModalProps {
	open: boolean;
	onClose: () => void;
	selectedQuestions: Question[];
	allSelected?: boolean;
	totalCount?: number;
}

const QuestionExportModal: React.FC<QuestionExportModalProps> = ({
	open,
	onClose,
	selectedQuestions,
	allSelected = false,
	totalCount = 0,
}) => {
	const { t } = useTranslation();
	const [format, setFormat] = useState<'xlsx' | 'csv'>('xlsx');
	const [exporting, setExporting] = useState(false);
	const [exportComplete, setExportComplete] = useState(false);

	const handleExport = async () => {
		if (selectedQuestions.length === 0) {
			message.warning(t('export.noSelection'));
			return;
		}

		setExporting(true);
		try {
			const questionIds = selectedQuestions.map((q) => q.id);
			const blob = await importExportService.exportQuestions(questionIds, format);

			const filename = `questions_export_${new Date().toISOString().split('T')[0]}.${format}`;
			importExportService.downloadFile(blob, filename);

			setExportComplete(true);
			message.success(t('export.success', { count: selectedQuestions.length }));
		} catch (error: any) {
			message.error(error.response?.data?.message || t('export.error'));
		} finally {
			setExporting(false);
		}
	};

	const handleClose = () => {
		setExportComplete(false);
		onClose();
	};

	const questionTypeColors: Record<string, string> = {
		multiple_choice: 'blue',
		true_false: 'green',
		essay: 'purple',
		short_answer: 'geekblue',
		fill_blank: 'orange',
		matching: 'cyan',
		ordering: 'magenta',
	};

	return (
		<Modal
			title={
				<Space>
					<DownloadOutlined style={{ color: '#1890ff' }} />
					<span>{t('export.title')}</span>
				</Space>
			}
			open={open}
			onCancel={handleClose}
			width={600}
			footer={[
				<Button key="cancel" onClick={handleClose}>
					{exportComplete ? t('common.close') : t('common.cancel')}
				</Button>,
				!exportComplete && (
					<Button
						key="export"
						type="primary"
						loading={exporting}
						onClick={handleExport}
						disabled={selectedQuestions.length === 0}
						icon={<DownloadOutlined />}
					>
						{exporting ? t('export.exporting') : t('export.start')}
					</Button>
				),
			]}
		>
			{exportComplete ? (
				<div style={{ textAlign: 'center', padding: 40 }}>
					<CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
					<Title level={4} style={{ marginTop: 16 }}>
						{t('export.complete')}
					</Title>
					<Text type="secondary">{t('export.downloadStarted')}</Text>
				</div>
			) : (
				<Space direction="vertical" size="large" style={{ width: '100%' }}>
					{/* Selection summary */}
					<Alert
						message={
							allSelected
								? t('export.allSelected', {
										count: totalCount,
										defaultValue: `All ${totalCount} questions selected`,
									})
								: t('export.selectedCount', {
										count: selectedQuestions.length,
										defaultValue: `${selectedQuestions.length} questions selected`,
									})
						}
						type="info"
						showIcon
					/>

					{/* Format selection */}
					<div>
						<Text strong style={{ display: 'block', marginBottom: 12 }}>
							{t('export.selectFormat')}
						</Text>
						<Radio.Group
							value={format}
							onChange={(e) => setFormat(e.target.value)}
							size="large"
						>
							<Space direction="vertical" size="middle">
								<Radio value="xlsx">
									<Space>
										<FileExcelOutlined
											style={{
												color: '#52c41a',
												fontSize: 20,
											}}
										/>
										<div>
											<Text strong>Excel (.xlsx)</Text>
											<br />
											<Text type="secondary" style={{ fontSize: 12 }}>
												{t('export.excelDesc')}
											</Text>
										</div>
									</Space>
								</Radio>
								<Radio value="csv">
									<Space>
										<FileTextOutlined
											style={{
												color: '#1890ff',
												fontSize: 20,
											}}
										/>
										<div>
											<Text strong>CSV (.csv)</Text>
											<br />
											<Text type="secondary" style={{ fontSize: 12 }}>
												{t('export.csvDesc')}
											</Text>
										</div>
									</Space>
								</Radio>
							</Space>
						</Radio.Group>
					</div>

					<Divider />

					{/* Preview of selected questions */}
					<div>
						<Text strong style={{ display: 'block', marginBottom: 12 }}>
							{t('export.preview')} ({selectedQuestions.length})
						</Text>
						<List
							size="small"
							bordered
							dataSource={selectedQuestions.slice(0, 5)}
							style={{ maxHeight: 200, overflow: 'auto' }}
							renderItem={(item) => (
								<List.Item>
									<Space>
										<Tag color={questionTypeColors[item.type] || 'default'}>
											{item.type}
										</Tag>
										<Text ellipsis style={{ maxWidth: 350 }}>
											{item.text}
										</Text>
									</Space>
								</List.Item>
							)}
						/>
						{selectedQuestions.length > 5 && (
							<Text
								type="secondary"
								style={{
									display: 'block',
									marginTop: 8,
									textAlign: 'center',
								}}
							>
								{t('export.andMore', {
									count: selectedQuestions.length - 5,
									defaultValue: `...and ${selectedQuestions.length - 5} more`,
								})}
							</Text>
						)}
					</div>

					{exporting && (
						<div style={{ textAlign: 'center' }}>
							<Progress percent={50} status="active" showInfo={false} />
							<Text type="secondary">{t('export.generating')}</Text>
						</div>
					)}
				</Space>
			)}
		</Modal>
	);
};

export default QuestionExportModal;
