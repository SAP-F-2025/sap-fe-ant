import React from 'react';
import { Modal, Space, Typography, Radio } from 'antd';
import { CameraOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface CameraConsentModalProps {
  open: boolean;
  onConsent: (consent: 'once' | 'always') => void;
  onReject: () => void;
}

export const CameraConsentModal: React.FC<CameraConsentModalProps> = React.memo(({
  open,
  onConsent,
  onReject
}) => {
  const [choice, setChoice] = React.useState<'once' | 'always'>('once');

  if (!open) return null;

  return (
    <Modal
      open={open}
      title={
        <Space>
          <CameraOutlined />
          <span>Yêu cầu quyền truy cập camera</span>
        </Space>
      }
      okText="Cho phép"
      cancelText="Từ chối"
      onOk={() => onConsent(choice)}
      onCancel={onReject}
      closable={false}
      maskClosable={false}
      width="100%"
      style={{ top: 0, maxWidth: 'none', margin: 0, paddingBottom: 0, height: '100vh' }}
      styles={{ 
        body: { 
          minHeight: 'calc(100vh - 110px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        mask: { position: 'fixed' }
      }}
      getContainer={false}
      zIndex={9999}
    >
      <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: '600px' }}>
        <Paragraph>
          Bài kiểm tra này yêu cầu giám sát qua camera để đảm bảo tính trung thực.
        </Paragraph>

        <Radio.Group value={choice} onChange={(e) => setChoice(e.target.value)}>
          <Space direction="vertical">
            <Radio value="once">
              <Text>Cho phép lần này</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Hệ thống sẽ hỏi lại ở lần làm bài tiếp theo
              </Text>
            </Radio>
            <Radio value="always">
              <Text>Luôn cho phép</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Không hỏi lại cho đến khi bạn thay đổi cài đặt
              </Text>
            </Radio>
          </Space>
        </Radio.Group>

        <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 16 }}>
          Lưu ý: Nếu từ chối, bạn sẽ không thể bắt đầu bài kiểm tra này.
        </Paragraph>
      </Space>
    </Modal>
  );
});
