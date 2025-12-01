import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Modal,
  Alert,
  Spin,
  App,
} from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CameraOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { CasdoorConfig } from '../../config/casdoor';
import { getUserRole } from '../../utils/roleChecker';
import faceVerificationService from '../../services/faceVerificationService';

const { Title, Text } = Typography;

/**
 * Profile Page
 * Displays essential user information and provides a button to update profile in Casdoor
 */
const Profile: React.FC = () => {
  const { user } = useAuth();
  const { modal, message } = App.useApp();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const [cameraReady, setCameraReady] = useState(false);
  const [registering, setRegistering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { data: registrationStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['face-registration-status'],
    queryFn: () => faceVerificationService.checkRegistrationStatus(),
  });

  const deleteFaceMutation = useMutation({
    mutationFn: () => faceVerificationService.deleteFace(),
    onSuccess: () => {
      message.success('Đã xóa dữ liệu khuôn mặt');
      queryClient.invalidateQueries({ queryKey: ['face-registration-status'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Lỗi khi xóa dữ liệu khuôn mặt');
    },
  });

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (err) {
      message.error('Không thể truy cập camera');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  };

  const captureFrame = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        reject(new Error('Video not ready'));
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -canvas.width, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to capture image'));
      }, 'image/jpeg', 0.95);
    });
  };

  const handleRegisterFace = async () => {
    setRegistering(true);
    try {
      const imageBlob = await captureFrame();
      await faceVerificationService.registerFace(imageBlob);
      message.success('Đăng ký khuôn mặt thành công');
      setRegisterModalOpen(false);
      stopCamera();
      queryClient.invalidateQueries({ queryKey: ['face-registration-status'] });
    } catch (err: any) {
      message.error(err.response?.data?.detail || 'Lỗi đăng ký khuôn mặt');
    } finally {
      setRegistering(false);
    }
  };

  const handleDeleteFace = () => {
    modal.confirm({
      title: 'Xóa dữ liệu khuôn mặt?',
      content: 'Bạn sẽ cần đăng ký lại để sử dụng tính năng xác thực khuôn mặt.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => deleteFaceMutation.mutate(),
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
                  {getUserRole(user) === 'admin' && (
                    <Tag color="red" icon={<SafetyOutlined />}>
                      Admin
                    </Tag>
                  )}
                  {getUserRole(user) === 'teacher' && (
                    <Tag color="blue">
                      Giáo viên
                    </Tag>
                  )}
                  {getUserRole(user) === 'student' && (
                    <Tag color="green">
                      Học sinh
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
              {user?.id && (
                <Descriptions.Item label="ID">
                  {user.id}
                </Descriptions.Item>
              )}
              {(user as any)?.education && (
                <Descriptions.Item label="Trường">
                  {(user as any).education}
                </Descriptions.Item>
              )}
              {user?.owner && (
                <Descriptions.Item label="Tổ chức quản lý">
                  {user.owner}
                </Descriptions.Item>
              )}
              {(user as any)?.countryCode && (
                <Descriptions.Item label="Quốc gia">
                  {(user as any).countryCode}
                </Descriptions.Item>
              )}
              {(user as any)?.type && (
                <Descriptions.Item label="Loại tài khoản">
                  {(user as any).type}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Vai trò">
                {getUserRole(user) === 'admin' && (
                  <Tag color="red" icon={<SafetyOutlined />}>
                    Admin
                  </Tag>
                )}
                {getUserRole(user) === 'teacher' && (
                  <Tag color="blue">
                    Giáo viên
                  </Tag>
                )}
                {getUserRole(user) === 'student' && (
                  <Tag color="green">
                    Học sinh
                  </Tag>
                )}
              </Descriptions.Item>
              {user?.createdTime && (
                <Descriptions.Item label="Ngày tạo tài khoản">
                  <ClockCircleOutlined /> {formatDate(user.createdTime)}
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

          {/* Face Registration Section */}
          <div>
            <Title level={4}>Xác thực khuôn mặt</Title>
            {statusLoading ? (
              <Spin />
            ) : registrationStatus?.registered ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="Đã đăng ký khuôn mặt"
                  description="Bạn có thể sử dụng tính năng xác thực khuôn mặt cho các bài kiểm tra."
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteFace}
                  loading={deleteFaceMutation.isPending}
                >
                  Xóa dữ liệu khuôn mặt
                </Button>
              </Space>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="Chưa đăng ký khuôn mặt"
                  description="Đăng ký khuôn mặt để sử dụng tính năng xác thực trong các bài kiểm tra."
                  type="info"
                  showIcon
                />
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={() => {
                    setRegisterModalOpen(true);
                    setTimeout(startCamera, 100);
                  }}
                >
                  Đăng ký khuôn mặt
                </Button>
              </Space>
            )}
          </div>

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

      {/* Face Registration Modal */}
      <Modal
        title="Đăng ký khuôn mặt"
        open={registerModalOpen}
        onCancel={() => {
          setRegisterModalOpen(false);
          stopCamera();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setRegisterModalOpen(false);
            stopCamera();
          }}>
            Hủy
          </Button>,
          <Button
            key="register"
            type="primary"
            icon={<CameraOutlined />}
            onClick={handleRegisterFace}
            loading={registering}
            disabled={!cameraReady}
          >
            Đăng ký
          </Button>,
        ]}
        width={600}
        maskClosable={false}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message="Hướng dẫn"
            description="Đặt khuôn mặt vào khung hình, đảm bảo ánh sáng tốt và nhìn thẳng vào camera."
            type="info"
            showIcon
          />
          <div style={{ textAlign: 'center' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                maxWidth: '480px',
                borderRadius: '8px',
                border: '2px solid #d9d9d9',
                transform: 'scaleX(-1)',
              }}
            />
            {!cameraReady && (
              <div style={{ marginTop: 16 }}>
                <Spin />
                <div style={{ marginTop: 8 }}>
                  <Typography.Text type="secondary">Đang khởi động camera...</Typography.Text>
                </div>
              </div>
            )}
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default Profile;
