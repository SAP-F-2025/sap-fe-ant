import React, { useState } from 'react';
import { Card, Button, Space, Tag, Alert } from 'antd';
import { CameraOutlined, StopOutlined } from '@ant-design/icons';
import { useCamera } from '../../hooks/useCamera';

export const SimpleCameraTest: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const { videoRef, isActive, error } = useCamera(enabled);

  return (
    <Card title="Step 1: Simple Camera Test">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Space>
          <Button
            type="primary"
            icon={<CameraOutlined />}
            onClick={() => setEnabled(true)}
            disabled={enabled}
          >
            Start Camera
          </Button>
          <Button
            danger
            icon={<StopOutlined />}
            onClick={() => setEnabled(false)}
            disabled={!enabled}
          >
            Stop Camera
          </Button>
          <Tag color={isActive ? 'success' : 'default'}>
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
        </Space>

        {error && (
          <Alert message="Camera Error" description={error} type="error" showIcon />
        )}

        <div style={{ 
          border: '2px solid #d9d9d9', 
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#000'
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              maxWidth: '640px',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      </Space>
    </Card>
  );
};
