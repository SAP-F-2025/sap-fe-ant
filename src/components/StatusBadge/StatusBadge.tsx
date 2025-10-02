import React from 'react';
import { Tag } from 'antd';
import type { TagProps } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

export type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'draft' 
  | 'archived' 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'in-progress';

interface StatusBadgeProps extends Omit<TagProps, 'color' | 'icon'> {
  status: StatusType;
  showIcon?: boolean;
}

const statusConfig: Record<StatusType, { color: string; icon: React.ReactNode; label: string }> = {
  active: {
    color: 'success',
    icon: <CheckCircleOutlined />,
    label: 'Hoạt động',
  },
  inactive: {
    color: 'default',
    icon: <MinusCircleOutlined />,
    label: 'Không hoạt động',
  },
  draft: {
    color: 'default',
    icon: <ClockCircleOutlined />,
    label: 'Nháp',
  },
  archived: {
    color: 'warning',
    icon: <ExclamationCircleOutlined />,
    label: 'Đã lưu trữ',
  },
  pending: {
    color: 'processing',
    icon: <ClockCircleOutlined />,
    label: 'Chờ xử lý',
  },
  completed: {
    color: 'success',
    icon: <CheckCircleOutlined />,
    label: 'Hoàn thành',
  },
  failed: {
    color: 'error',
    icon: <CloseCircleOutlined />,
    label: 'Thất bại',
  },
  'in-progress': {
    color: 'processing',
    icon: <SyncOutlined spin />,
    label: 'Đang xử lý',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  showIcon = true,
  children,
  ...props 
}) => {
  const config = statusConfig[status];

  return (
    <Tag
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      {...props}
    >
      {children || config.label}
    </Tag>
  );
};

export default StatusBadge;
