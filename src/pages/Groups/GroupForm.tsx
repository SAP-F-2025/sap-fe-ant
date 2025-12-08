import { ArrowLeftOutlined, SaveOutlined, TeamOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Flex,
	Form,
	Input,
	Select,
	Space,
	Spin,
	Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import groupService from '../../services/groupService';
import { elevation } from '../../styles/elevation';
import { GroupCreateRequest, GroupUpdateRequest } from '../../types';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Title, Text } = Typography;

const GroupForm: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const isEdit = !!id;
	const groupId = parseInt(id || '0');

	useEffect(() => {
		if (isEdit && groupId) {
			fetchGroup();
		}
	}, [groupId]);

	const fetchGroup = async () => {
		setLoading(true);
		try {
			const data = await groupService.getGroup(groupId);
			form.setFieldsValue({
				name: data.name,
				display_name: data.display_name,
				description: data.description,
				type: data.type,
			});
		} catch (error) {
			showError(t('groups.loadDetailError'));
			navigate('/groups');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (values: GroupCreateRequest | GroupUpdateRequest) => {
		setSaving(true);
		try {
			if (isEdit) {
				await groupService.updateGroup(groupId, values as GroupUpdateRequest);
				showSuccess(t('groups.updateSuccess'));
			} else {
				await groupService.createGroup(values as GroupCreateRequest);
				showSuccess(t('groups.createSuccess'));
			}
			navigate('/groups');
		} catch (error) {
			// handled by interceptor
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<Flex justify="center" align="center" style={{ minHeight: 400 }}>
				<Spin size="large" />
			</Flex>
		);
	}

	return (
		<Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 800 }}>
			{/* Header */}
			<Flex justify="space-between" align="center">
				<Space>
					<Button
						icon={<ArrowLeftOutlined />}
						onClick={() => navigate('/groups')}
					>
						{t('common.back')}
					</Button>
					<Title level={2} style={{ margin: 0 }}>
						<TeamOutlined style={{ marginRight: 8 }} />
						{isEdit ? t('groups.editGroup') : t('groups.createGroup')}
					</Title>
				</Space>
			</Flex>

			{/* Form */}
			<Card style={{ ...elevation[1], borderRadius: 16 }}>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					initialValues={{ type: 'class' }}
				>
					<Form.Item
						name="name"
						label={t('groups.form.name')}
						rules={[
							{ required: true, message: t('groups.form.nameRequired') },
							{ pattern: /^[a-z0-9-]+$/, message: t('groups.form.namePattern') },
						]}
						extra={t('groups.form.nameExtra')}
					>
						<Input
							placeholder={t('groups.form.namePlaceholder')}
							disabled={isEdit}
							style={{ maxWidth: 300 }}
						/>
					</Form.Item>

					<Form.Item
						name="display_name"
						label={t('groups.form.displayName')}
						rules={[{ required: true, message: t('groups.form.displayNameRequired') }]}
					>
						<Input placeholder={t('groups.form.displayNamePlaceholder')} />
					</Form.Item>

					<Form.Item
						name="type"
						label={t('groups.form.type')}
						rules={[{ required: true, message: t('groups.form.typeRequired') }]}
					>
						<Select
							style={{ maxWidth: 200 }}
							options={[
								{ label: t('groups.type.class'), value: 'class' },
								{ label: t('groups.type.studyGroup'), value: 'study-group' },
							]}
						/>
					</Form.Item>

					<Form.Item
						name="description"
						label={t('groups.form.description')}
					>
						<Input.TextArea
							rows={4}
							placeholder={t('groups.form.descriptionPlaceholder')}
						/>
					</Form.Item>

					<Form.Item style={{ marginBottom: 0 }}>
						<Space>
							<Button onClick={() => navigate('/groups')}>
								{t('common.cancel')}
							</Button>
							<Button
								type="primary"
								htmlType="submit"
								loading={saving}
								icon={<SaveOutlined />}
							>
								{isEdit ? t('common.save') : t('groups.createModal.submitCreate')}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Card>
		</Space>
	);
};

export default GroupForm;
