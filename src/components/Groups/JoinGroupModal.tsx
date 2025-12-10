import { LoginOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import groupService from '../../services/groupService';
import { showError, showSuccess } from '../../utils/errorHandler';

const { Text } = Typography;

interface JoinGroupModalProps {
    open: boolean;
    onClose: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleJoin = async (values: { code: string }) => {
        setLoading(true);
        try {
            const code = values.code.toUpperCase().trim();
            const response = await groupService.joinViaCode(code);
            showSuccess(t('groups.join.success'));
            form.resetFields();
            onClose();
            // Navigate to the joined group
            navigate(`/groups/${response.id}`);
        } catch (error: any) {
            // Handle specific error messages
            const errorMessage = error?.response?.data?.message || '';
            if (errorMessage.includes('expired')) {
                showError(t('groups.join.expired'));
            } else if (errorMessage.includes('exhausted') || errorMessage.includes('maximum')) {
                showError(t('groups.join.exhausted'));
            } else if (errorMessage.includes('not found')) {
                showError(t('groups.join.notFound'));
            } else if (errorMessage.includes('already a member')) {
                showError(t('groups.join.alreadyMember'));
            } else {
                showError(t('groups.join.error'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <LoginOutlined />
                    {t('groups.join.title')}
                </Space>
            }
            open={open}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            destroyOnClose
            width={400}
        >
            <Form form={form} layout="vertical" onFinish={handleJoin}>
                <Form.Item
                    name="code"
                    label={t('groups.join.joinViaCode')}
                    rules={[
                        { required: true, message: t('groups.join.invalidCode') },
                        { min: 6, max: 8, message: t('groups.join.invalidCode') },
                    ]}
                    extra={
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {t('groups.join.codePlaceholder')}
                        </Text>
                    }
                >
                    <Input
                        placeholder="ABC123"
                        maxLength={8}
                        style={{
                            textTransform: 'uppercase',
                            letterSpacing: 4,
                            fontSize: 18,
                            textAlign: 'center',
                            fontFamily: 'monospace',
                        }}
                        autoComplete="off"
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={onClose}>{t('common.cancel')}</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {loading ? t('groups.join.joining') : t('groups.join.joinButton')}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default JoinGroupModal;
