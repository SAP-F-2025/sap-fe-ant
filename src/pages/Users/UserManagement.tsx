import React from 'react';
import {
  Card,
  Space,
  Button,
  Typography,
  Row,
  Col,
  Alert,
  Divider,
} from 'antd';
import {
  TeamOutlined,
  SafetyOutlined,
  UserOutlined,
  ArrowRightOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { CasdoorConfig } from '../../config/casdoor';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

/**
 * User Management Page
 * Redirects admins to Casdoor for user management
 */
const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Create Casdoor users management URL
  const getCasdoorUsersUrl = () => {
    const { serverUrl, organizationName } = CasdoorConfig;
    return `${serverUrl}/users/${organizationName}`;
  };

  const handleManageUsers = () => {
    window.location.href = getCasdoorUsersUrl();
  };

  // If not admin, show access denied
  if (!user?.isAdmin) {
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>
          <TeamOutlined /> Quản lý người dùng
        </Title>

        <Alert
          message="Không có quyền truy cập"
          description="Bạn cần quyền admin để truy cập trang này."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/dashboard')}>
              Về trang chủ
            </Button>
          }
        />
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>
          <TeamOutlined /> Quản lý người dùng
        </Title>
        <Text type="secondary">
          Quản lý người dùng thông qua Casdoor - Nền tảng quản lý danh tính tập trung
        </Text>
      </div>

      {/* Main Card */}
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}>
              <SettingOutlined /> Casdoor User Management
            </Title>
            <Paragraph>
              Hệ thống sử dụng Casdoor để quản lý người dùng tập trung. Tất cả các thao tác quản lý
              người dùng như thêm, sửa, xóa, phân quyền được thực hiện trên nền tảng Casdoor.
            </Paragraph>
          </div>

          <Divider />

          {/* Features */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="small">
                  <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <Text strong>Tạo người dùng</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Thêm người dùng mới vào hệ thống
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="small">
                  <SafetyOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <Text strong>Phân quyền</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Quản lý vai trò và quyền hạn
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="small">
                  <TeamOutlined style={{ fontSize: 32, color: '#faad14' }} />
                  <Text strong>Quản lý nhóm</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tổ chức người dùng theo nhóm
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <Space direction="vertical" size="small">
                  <SettingOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                  <Text strong>Cấu hình</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Thiết lập chính sách bảo mật
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Action Button */}
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={handleManageUsers}
            >
              Mở Casdoor User Management
            </Button>
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Bạn sẽ được chuyển hướng đến trang quản lý người dùng của Casdoor
              </Text>
            </div>
          </div>

          <Alert
            message="Thông tin"
            description="Casdoor cung cấp giao diện quản lý người dùng đầy đủ với các tính năng: tìm kiếm, lọc, phân quyền, quản lý nhóm, và nhiều tính năng khác."
            type="info"
            showIcon
          />
        </Space>
      </Card>
    </Space>
  );
};

export default UserManagement;
