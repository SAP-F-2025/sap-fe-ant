import React, { useEffect } from 'react';
import { Modal, Space, Typography, Alert, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useBrowserTamperDetection } from '../../hooks/useBrowserTamperDetection';

const { Text } = Typography;

interface TamperCheckModalProps {
  open: boolean;
  onPass: () => void;
  onCancel: () => void;
}

export const TamperCheckModal: React.FC<TamperCheckModalProps> = ({ open, onPass, onCancel }) => {
  const { tamperStatus, hasTampering, performCheck, isBypassed } = useBrowserTamperDetection();

  useEffect(() => {
    if (open) {
      performCheck();
    }
  }, [open, performCheck]);

  const CheckItem = ({ label, passed }: { label: string; passed: boolean }) => (
    <Space>
      {passed ? (
        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
      ) : (
        <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
      )}
      <Text>{label}</Text>
    </Space>
  );

  return (
    <Modal
      title="Kiểm tra bảo mật"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="recheck" onClick={performCheck}>
          Kiểm tra lại
        </Button>,
        <Button key="start" type="primary" disabled={hasTampering} onClick={onPass}>
          Bắt đầu làm bài
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {isBypassed && (
          <Alert
            message="Chế độ phát triển"
            description="Kiểm tra bảo mật đã được tắt trong môi trường phát triển."
            type="info"
            showIcon
          />
        )}

        {hasTampering && !isBypassed && (
          <Alert
            message="Phát hiện vấn đề bảo mật"
            description="Vui lòng khắc phục các vấn đề dưới đây trước khi bắt đầu làm bài."
            type="error"
            showIcon
            icon={<WarningOutlined />}
          />
        )}

        <Space direction="vertical" style={{ width: '100%' }}>
          <CheckItem label="DevTools đã đóng" passed={!tamperStatus.devTools} />
          <CheckItem label="Console không bị can thiệp" passed={!tamperStatus.consoleOverride} />
          <CheckItem label="Không có tiện ích mở rộng đáng ngờ" passed={!tamperStatus.suspiciousExtensions} />
        </Space>

        {!isBypassed && hasTampering && (
          <Alert
            message="Hướng dẫn khắc phục"
            description={
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {tamperStatus.devTools && <li>Đóng DevTools (F12)</li>}
                {tamperStatus.consoleOverride && <li>Tải lại trang để khôi phục console</li>}
                {tamperStatus.suspiciousExtensions && <li>Tắt các tiện ích mở rộng không cần thiết</li>}
              </ul>
            }
            type="warning"
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
};
