import React, { useEffect } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to access your account</Text>

          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            onClick={login}
            block
            style={{ height: 48, fontSize: 16 }}
          >
            Sign in with Casdoor
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Login;
