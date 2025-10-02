import React from 'react';
import { Card, Flex, Avatar, Typography } from 'antd';
import { useThemeToken } from '../../theme/ThemeProvider';
import { gradients, getTextColor } from '../../theme/gradients';
import { createTransition, getStaggerDelay } from '../../styles/animations';

const { Title, Text } = Typography;

export interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  gradient: keyof typeof gradients;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

/**
 * Statistic Card Component
 * Consistent card design for displaying statistics
 */
export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  gradient,
  trend,
}) => {
  const token = useThemeToken();
  const textColor = getTextColor(gradient);
  const isLight = textColor === '#333333';

  return (
    <Card
      bordered={false}
      style={{
        background: gradients[gradient],
        borderRadius: token.borderRadiusLG,
        minHeight: 140,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        transition: createTransition(['all', 'transform', 'box-shadow'], 'normal'),
        animation: 'slideInUp 400ms ease-out',
      }}
      styles={{
        body: {
          padding: token.paddingLG,
          height: '100%',
        },
      }}
      hoverable
      className="stat-card"
    >
      <Flex vertical gap={token.marginSM} style={{ height: '100%' }}>
        <Flex justify="space-between" align="start">
          <div>
            <Title
              level={2}
              style={{
                color: textColor,
                margin: 0,
                fontSize: 32,
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Title>
            <Text
              style={{
                color: isLight ? '#666' : 'rgba(255,255,255,0.85)',
                fontSize: 14,
                fontWeight: 500,
                display: 'block',
                marginTop: token.marginXS,
              }}
            >
              {label}
            </Text>
            {trend && (
              <Text
                style={{
                  color: isLight ? '#888' : 'rgba(255,255,255,0.7)',
                  fontSize: 12,
                  display: 'block',
                  marginTop: 4,
                }}
              >
                {trend.value}
              </Text>
            )}
          </div>
          <Avatar
            size={56}
            icon={icon}
            style={{
              backgroundColor: isLight
                ? 'rgba(0,0,0,0.06)'
                : 'rgba(255,255,255,0.2)',
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default StatCard;
