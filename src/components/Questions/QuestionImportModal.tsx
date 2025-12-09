import React, { useState } from "react";
import {
	Modal,
	Upload,
	Button,
	Space,
	Typography,
	Alert,
	Progress,
	Table,
	Tag,
	Divider,
	message,
	Tooltip,
	Steps,
} from "antd";
import {
	UploadOutlined,
	DownloadOutlined,
	FileExcelOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	InfoCircleOutlined,
	FileTextOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import importExportService, {
	ImportValidationError,
	ImportResult,
} from "../../services/importExportService";

const { Text, Title, Paragraph } = Typography;

interface QuestionImportModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

const QuestionImportModal: React.FC<QuestionImportModalProps> = ({
	open,
	onClose,
	onSuccess,
}) => {
	const { t } = useTranslation();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploading, setUploading] = useState(false);
	const [importResult, setImportResult] = useState<ImportResult | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [downloadingTemplate, setDownloadingTemplate] = useState(false);

	const handleDownloadTemplate = async () => {
		setDownloadingTemplate(true);
		try {
			const blob = await importExportService.downloadTemplate();
			importExportService.downloadFile(
				blob,
				"questions_import_template.xlsx",
			);
			message.success(t("import.templateDownloaded"));
		} catch (error) {
			message.error(t("import.templateError"));
		} finally {
			setDownloadingTemplate(false);
		}
	};

	const handleUpload = async () => {
		if (fileList.length === 0) {
			message.warning(t("import.selectFile"));
			return;
		}

		const file = fileList[0].originFileObj as File;
		setUploading(true);
		setCurrentStep(1);

		try {
			const response = await importExportService.importQuestions(file);
			setImportResult(response.data);
			setCurrentStep(2);

			if (response.data.success_count > 0) {
				message.success(
					t("import.success", { count: response.data.success_count }),
				);
				onSuccess?.();
			}
		} catch (error: any) {
			message.error(error.response?.data?.message || t("import.error"));
			setCurrentStep(0);
		} finally {
			setUploading(false);
		}
	};

	const uploadProps: UploadProps = {
		onRemove: () => {
			setFileList([]);
			setImportResult(null);
			setCurrentStep(0);
		},
		beforeUpload: (file) => {
			const isValidType =
				file.type ===
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
				file.type === "application/vnd.ms-excel" ||
				file.type === "text/csv" ||
				file.name.endsWith(".xlsx") ||
				file.name.endsWith(".xls") ||
				file.name.endsWith(".csv");

			if (!isValidType) {
				message.error(t("import.invalidFileType"));
				return Upload.LIST_IGNORE;
			}

			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				message.error(t("import.fileTooLarge"));
				return Upload.LIST_IGNORE;
			}

			// Create proper UploadFile object with originFileObj
			const uploadFile: UploadFile = {
				uid: file.uid || `-${Date.now()}`,
				name: file.name,
				status: "done",
				size: file.size,
				type: file.type,
				originFileObj: file as any,
			};
			setFileList([uploadFile]);
			setImportResult(null);
			return false;
		},
		fileList,
		maxCount: 1,
		accept: ".xlsx,.xls,.csv",
	};

	const errorColumns: ColumnsType<ImportValidationError> = [
		{
			title: t("import.row"),
			dataIndex: "row",
			key: "row",
			width: 80,
		},
		{
			title: t("import.column"),
			dataIndex: "column",
			key: "column",
			width: 120,
		},
		{
			title: t("import.errorCode"),
			dataIndex: "code",
			key: "code",
			width: 120,
			render: (code: string) => <Tag color="error">{code}</Tag>,
		},
		{
			title: t("import.message"),
			dataIndex: "message",
			key: "message",
		},
		{
			title: t("import.value"),
			dataIndex: "value",
			key: "value",
			width: 150,
			ellipsis: true,
			render: (value: string) => (
				<Tooltip title={value}>
					<Text type="secondary" style={{ fontSize: 12 }}>
						{value
							? value.length > 20
								? value.substring(0, 20) + "..."
								: value
							: "-"}
					</Text>
				</Tooltip>
			),
		},
	];

	const handleClose = () => {
		setFileList([]);
		setImportResult(null);
		setCurrentStep(0);
		onClose();
	};

	return (
		<Modal
			title={
				<Space>
					<FileExcelOutlined style={{ color: "#52c41a" }} />
					<span>{t("import.title")}</span>
				</Space>
			}
			open={open}
			onCancel={handleClose}
			width={800}
			footer={[
				<Button key="cancel" onClick={handleClose}>
					{t("common.close")}
				</Button>,
				currentStep < 2 && (
					<Button
						key="upload"
						type="primary"
						loading={uploading}
						onClick={handleUpload}
						disabled={fileList.length === 0}
						icon={<UploadOutlined />}
					>
						{uploading ? t("import.uploading") : t("import.start")}
					</Button>
				),
			]}
		>
			<Steps
				current={currentStep}
				size="small"
				style={{ marginBottom: 24 }}
				items={[
					{ title: t("import.step1") },
					{ title: t("import.step2") },
					{ title: t("import.step3") },
				]}
			/>

			{currentStep === 0 && (
				<Space
					direction="vertical"
					size="large"
					style={{ width: "100%" }}
				>
					{/* Template download section */}
					<Alert
						message={t("import.templateInfo")}
						description={
							<Space direction="vertical" size="small">
								<Text>{t("import.templateDesc")}</Text>
								<Button
									icon={<DownloadOutlined />}
									onClick={handleDownloadTemplate}
									loading={downloadingTemplate}
									type="link"
									style={{ padding: 0 }}
								>
									{t("import.downloadTemplate")}
								</Button>
							</Space>
						}
						type="info"
						showIcon
						icon={<FileTextOutlined />}
					/>

					{/* Upload section */}
					<div>
						<Upload.Dragger {...uploadProps}>
							<p className="ant-upload-drag-icon">
								<FileExcelOutlined
									style={{ fontSize: 48, color: "#52c41a" }}
								/>
							</p>
							<p className="ant-upload-text">
								{t("import.dragText")}
							</p>
							<p className="ant-upload-hint">
								{t("import.supportedFormats")}
							</p>
						</Upload.Dragger>
					</div>

					{/* Supported question types */}
					<Alert
						message={t("import.supportedTypes")}
						description={
							<Space wrap>
								<Tag color="blue">Multiple Choice</Tag>
								<Tag color="green">True/False</Tag>
								<Tag color="purple">Essay</Tag>
								<Tag color="geekblue">Short Answer</Tag>
								<Tag color="orange">Fill in Blank</Tag>
								<Tag color="cyan">Matching</Tag>
								<Tag color="magenta">Ordering</Tag>
							</Space>
						}
						type="success"
						showIcon
						icon={<InfoCircleOutlined />}
					/>
				</Space>
			)}

			{currentStep === 1 && (
				<div style={{ textAlign: "center", padding: 40 }}>
					<Progress
						type="circle"
						percent={uploading ? 50 : 0}
						status="active"
					/>
					<Paragraph style={{ marginTop: 16 }}>
						{t("import.processing")}
					</Paragraph>
				</div>
			)}

			{currentStep === 2 && importResult && (
				<Space
					direction="vertical"
					size="large"
					style={{ width: "100%" }}
				>
					{/* Summary */}
					<Space size="large" wrap>
						<div style={{ textAlign: "center" }}>
							<Title
								level={3}
								style={{ margin: 0, color: "#52c41a" }}
							>
								{importResult.success_count}
							</Title>
							<Text type="secondary">
								{t("import.successCount")}
							</Text>
						</div>
						<div style={{ textAlign: "center" }}>
							<Title
								level={3}
								style={{ margin: 0, color: "#ff4d4f" }}
							>
								{importResult.error_count}
							</Title>
							<Text type="secondary">
								{t("import.errorCount")}
							</Text>
						</div>
						<div style={{ textAlign: "center" }}>
							<Title
								level={3}
								style={{ margin: 0, color: "#1890ff" }}
							>
								{importResult.total_rows}
							</Title>
							<Text type="secondary">
								{t("import.totalRows")}
							</Text>
						</div>
					</Space>

					{importResult.success_count > 0 && (
						<Alert
							message={t("import.successMessage")}
							type="success"
							showIcon
							icon={<CheckCircleOutlined />}
						/>
					)}

					{importResult.error_count > 0 && (
						<>
							<Alert
								message={t("import.errorsFound")}
								description={t("import.errorsDesc")}
								type="warning"
								showIcon
								icon={<CloseCircleOutlined />}
							/>
							<Divider>{t("import.errorDetails")}</Divider>
							<Table
								columns={errorColumns}
								dataSource={importResult.errors}
								rowKey={(record, index) =>
									`${record.row}-${record.column}-${index}`
								}
								size="small"
								pagination={{ pageSize: 5 }}
								scroll={{ x: 600 }}
							/>
						</>
					)}
				</Space>
			)}
		</Modal>
	);
};

export default QuestionImportModal;
