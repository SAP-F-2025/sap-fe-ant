import React from 'react';
import {
  Card,
  Typography,
  Button,
  Space,
  Avatar,
  Descriptions,
  Divider,
  Tag,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { CasdoorConfig } from '../../config/casdoor';

const { Title, Text } = Typography;

/**
 * Profile Page
 * Displays essential user information and provides a button to update profile in Casdoor
 */
const Profile: React.FC = () => {
  const { user } = useAuth();

  // Create Casdoor account management URL
  const getCasdoorAccountUrl = () => {
    const { serverUrl, appName, organizationName } = CasdoorConfig;
    return `${serverUrl}/account?app=${appName}&organization=${organizationName}`;
  };

  const handleEditProfile = () => {
    window.location.href = getCasdoorAccountUrl();
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <Title level={2}>Hồ sơ cá nhân</Title>

      {/* Main Profile Card */}
      <Card style={{ marginTop: 24 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Avatar and Name Section */}
          <Row gutter={24} align="middle">
            <Col>
              <Avatar size={100} src={user?.avatar} icon={!user?.avatar && <UserOutlined />} />
            </Col>
            <Col flex="auto">
              <Space direction="vertical" size={4}>
                <Space align="center" wrap>
                  <Title level={2} style={{ margin: 0 }}>
                    {user?.displayName || user?.name || 'Người dùng'}
                  </Title>
                  {user?.isAdmin && (
                    <Tag color="red" icon={<SafetyOutlined />}>
                      Admin
                    </Tag>
                  )}
                </Space>
                {user?.name && user?.displayName && user.name !== user.displayName && (
                  <Text type="secondary">@{user.name}</Text>
                )}
                {user?.email && (
                  <Space>
                    <Text type="secondary">
                      <MailOutlined /> {user.email}
                    </Text>
                    {user.emailVerified ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                    )}
                  </Space>
                )}
                {user?.phone && (
                  <Text type="secondary">
                    <PhoneOutlined /> {user.phone}
                  </Text>
                )}
              </Space>
            </Col>
          </Row>

          <Divider />

          {/* Personal & Organization Information */}
          <div>
            <Title level={4}>Thông tin chi tiết</Title>
            <Descriptions column={1} bordered>
              {user?.affiliation && (
                <Descriptions.Item label="Tổ chức">
                  {user.affiliation}
                </Descriptions.Item>
              )}
              {user?.title && (
                <Descriptions.Item label="Chức danh">
                  {user.title}
                </Descriptions.Item>
              )}
              {user?.owner && (
                <Descriptions.Item label="Quản lý bởi">
                  {user.owner}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Vai trò">
                {user?.isAdmin ? (
                  <Tag color="red" icon={<SafetyOutlined />}>
                    Admin
                  </Tag>
                ) : (
                  <Tag color="blue">User</Tag>
                )}
              </Descriptions.Item>
              {user?.createdTime && (
                <Descriptions.Item label="Ngày tạo">
                  <ClockCircleOutlined /> {formatDate(user.createdTime)}
                </Descriptions.Item>
              )}
              {user?.lastSigninTime && (
                <Descriptions.Item label="Đăng nhập lần cuối">
                  <ClockCircleOutlined /> {formatDate(user.lastSigninTime)}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>

          {/* Roles and Permissions */}
          {(user?.roles?.length || user?.permissions?.length) ? (
            <>
              <Divider />
              <div>
                <Title level={4}>Vai trò & Quyền hạn</Title>
                {user?.roles?.length > 0 && (
                  <div style={{ marginBottom: user?.permissions?.length ? 16 : 0 }}>
                    <Text strong>Vai trò:</Text>
                    <div style={{ marginTop: 8 }}>
                      <Space size={[0, 8]} wrap>
                        {user.roles.map((role: any, index: number) => (
                          <Tag key={index} color="blue">
                            {role.displayName || role.name || role}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                )}
                {user?.permissions?.length > 0 && (
                  <div>
                    <Text strong>Quyền hạn:</Text>
                    <div style={{ marginTop: 8 }}>
                      <Space size={[0, 8]} wrap>
                        {user.permissions.map((permission: any, index: number) => (
                          <Tag key={index} color="green">
                            {permission.displayName || permission.name || permission}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}

          <Divider />

          {/* Actions */}
          <div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditProfile}
              size="large"
            >
              Cập nhật thông tin trên Casdoor
            </Button>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Bạn sẽ được chuyển hướng đến Casdoor để cập nhật thông tin cá nhân
              </Text>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Profile;
