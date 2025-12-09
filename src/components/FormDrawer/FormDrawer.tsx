import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import type { DrawerProps, FormInstance, FormProps } from "antd";
import { App, Button, Drawer, Form, Space } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

/**
 * FormDrawer Component
 * A drawer with integrated form and validation
 * Features:
 * - Zod schema validation
 * - Dirty state tracking (prevent accidental close)
 * - Loading states
 * - Responsive width
 */

interface FormDrawerProps<T extends Record<string, any>> extends Omit<
	DrawerProps,
	"onClose"
> {
	// Form props
	form?: FormInstance<T>;
	initialValues?: Partial<T>;
	onSubmit: (values: T) => void | Promise<void>;
	onClose: () => void;
	// Validation schema (Zod)
	schema?: z.ZodSchema<T>;
	// Loading state
	loading?: boolean;
	// Form layout
	layout?: FormProps["layout"];
	// Children (form fields)
	children: React.ReactNode;
	// Submit button text
	submitText?: string;
	// Show cancel confirmation if form is dirty
	confirmOnClose?: boolean;
}

export function FormDrawer<T extends Record<string, any>>({
	form: externalForm,
	initialValues,
	onSubmit,
	onClose,
	schema,
	loading = false,
	layout = "vertical",
	children,
	submitText,
	confirmOnClose = true,
	title,
	open,
	width = 640,
	...drawerProps
}: FormDrawerProps<T>) {
	const [internalForm] = Form.useForm<T>();
	const form = externalForm || internalForm;
	const { modal } = App.useApp();
	const { t } = useTranslation();

	const effectiveSubmitText = submitText || t("common.save");

	// Track if form is dirty
	const [isDirty, setIsDirty] = React.useState(false);

	// Reset form when drawer opens/closes
	useEffect(() => {
		if (open) {
			form.resetFields();
			if (initialValues) {
				form.setFieldsValue(initialValues as any);
			}
			setIsDirty(false);
		}
	}, [open, initialValues, form]);

	// Handle form submission
	const handleFinish = async (values: T) => {
		try {
			// Validate with Zod schema if provided
			if (schema) {
				const validated = schema.parse(values);
				await onSubmit(validated);
			} else {
				await onSubmit(values);
			}

			// Close drawer on success
			form.resetFields();
			setIsDirty(false);
			onClose();
		} catch (error) {
			// Validation errors are handled by Ant Design Form
			if (error instanceof z.ZodError) {
				const fieldErrors = error.errors.map((err) => ({
					name: err.path,
					errors: [err.message],
				}));
				form.setFields(fieldErrors);
			}
		}
	};

	// Handle close with confirmation if form is dirty
	const handleClose = () => {
		if (confirmOnClose && isDirty) {
			modal.confirm({
				title: t("formDrawer.confirmCloseTitle"),
				content: t("formDrawer.confirmCloseContent"),
				okText: t("common.close"),
				cancelText: t("common.cancel"),
				okButtonProps: { danger: true },
				onOk: () => {
					form.resetFields();
					setIsDirty(false);
					onClose();
				},
			});
		} else {
			form.resetFields();
			setIsDirty(false);
			onClose();
		}
	};

	// Custom validator using Zod schema
	const zodValidator = (_: any, value: any) => {
		if (!schema) return Promise.resolve();

		try {
			schema.parse(form.getFieldsValue());
			return Promise.resolve();
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldError = error.errors.find((err) =>
					err.path.includes(_.field),
				);
				if (fieldError) {
					return Promise.reject(new Error(fieldError.message));
				}
			}
			return Promise.resolve();
		}
	};

	return (
		<Drawer
			{...drawerProps}
			title={title}
			open={open}
			onClose={handleClose}
			width={width}
			styles={{
				body: {
					animation: open ? "slideInRight 300ms ease-out" : undefined,
				},
			}}
			extra={
				<Space>
					<Button onClick={handleClose} icon={<CloseOutlined />}>
						{t("common.cancel")}
					</Button>
					<Button
						type="primary"
						icon={<SaveOutlined />}
						onClick={() => form.submit()}
						loading={loading}
					>
						{effectiveSubmitText}
					</Button>
				</Space>
			}
			// Prevent closing by clicking mask if form is dirty
			maskClosable={!isDirty}
		>
			<Form<T>
				form={form}
				layout={layout}
				onFinish={handleFinish}
				onValuesChange={() => setIsDirty(true)}
				disabled={loading}
			>
				{children}
			</Form>
		</Drawer>
	);
}
