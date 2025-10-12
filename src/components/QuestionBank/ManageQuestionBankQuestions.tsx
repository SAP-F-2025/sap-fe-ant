import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Tag,
  Popconfirm,
  Select,
  Input,
  Row,
  Col,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  Question,
  QuestionType,
  DifficultyLevel,
  PaginationParams,
} from '../../types';
import questionBankService from '../../services/questionBankService';
import questionService from '../../services/questionService';
import { showSuccess } from '../../utils/errorHandler';

const { Text } = Typography;

interface Props {
  bankId: number;
  onQuestionsChange?: () => void;
}

const difficultyColors = {
  [DifficultyLevel.Easy]: 'success',
  [DifficultyLevel.Medium]: 'warning',
  [DifficultyLevel.Hard]: 'error',
};

const difficultyLabels = {
  [DifficultyLevel.Easy]: 'Dễ',
  [DifficultyLevel.Medium]: 'Trung bình',
  [DifficultyLevel.Hard]: 'Khó',
};

const typeLabels = {
  [QuestionType.MultipleChoice]: 'Trắc nghiệm',
  [QuestionType.TrueFalse]: 'Đúng/Sai',
  [QuestionType.Essay]: 'Tự luận',
  [QuestionType.FillBlank]: 'Điền khuyết',
  [QuestionType.Matching]: 'Nối cặp',
  [QuestionType.Ordering]: 'Sắp xếp',
  [QuestionType.ShortAnswer]: 'Trả lời ngắn',
};

export const ManageQuestionBankQuestions: React.FC<Props> = ({
  bankId,
  onQuestionsChange,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterDifficulty, setFilterDifficulty] = useState<string | undefined>();
  const [bankPagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [availablePagination, setAvailablePagination] = useState({ page: 1, size: 10, total: 0 });

  useEffect(() => {
    fetchQuestions();
  }, [bankId, bankPagination.page, bankPagination.size]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await questionBankService.getQuestionBankQuestions(bankId, {
        page: bankPagination.page,
        size: bankPagination.size,
      });
      setQuestions(data.questions);
      setPagination({
        page: bankPagination.page,
        size: data.size,
        total: data.total,
      });
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableQuestions = async (params?: PaginationParams) => {
    try {
      const data = await questionService.getQuestions({
        page: params?.page || 1,
        size: params?.size || 10,
        search: searchText || undefined,
        type: filterType,
        difficulty: filterDifficulty,
      });
      setAvailableQuestions(data.questions);
      setAvailablePagination({ page: params?.page || 1, size: data.size, total: data.total });
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleAddQuestions = async () => {
    setAddLoading(true);
    try {
      await questionBankService.addQuestionsToBank(bankId, {
        question_ids: selectedQuestions,
      });
      showSuccess('Thêm câu hỏi thành công');
      setAddModalVisible(false);
      setSelectedQuestions([]);
      fetchQuestions();
      onQuestionsChange?.();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveQuestions = async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      await questionBankService.removeQuestionsFromBank(bankId, {
        question_ids: selectedRowKeys as number[],
      });
      showSuccess('Xóa câu hỏi thành công');
      setSelectedRowKeys([]);
      fetchQuestions();
      onQuestionsChange?.();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const columns: ColumnsType<Question> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'text',
      ellipsis: true,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 150,
      render: (type: QuestionType) => <Tag>{typeLabels[type]}</Tag>,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      width: 120,
      render: (difficulty: DifficultyLevel) => (
        <Tag color={difficultyColors[difficulty]}>{difficultyLabels[difficulty]}</Tag>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      width: 80,
    },
  ];

  const availableColumns: ColumnsType<Question> = [
    {
      title: 'Câu hỏi',
      dataIndex: 'text',
      ellipsis: true,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 150,
      render: (type: QuestionType) => <Tag>{typeLabels[type]}</Tag>,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      width: 120,
      render: (difficulty: DifficultyLevel) => (
        <Tag color={difficultyColors[difficulty]}>{difficultyLabels[difficulty]}</Tag>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      width: 80,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  return (
    <>
      <Card
        title={`Câu hỏi (${bankPagination.total})`}
        extra={
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="Xóa câu hỏi?"
                description={`Bạn có chắc muốn xóa ${selectedRowKeys.length} câu hỏi khỏi ngân hàng?`}
                onConfirm={handleRemoveQuestions}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button danger icon={<DeleteOutlined />}>
                  Xóa ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setAddModalVisible(true);
                fetchAvailableQuestions();
              }}
            >
              Thêm câu hỏi
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            current: bankPagination.page,
            pageSize: bankPagination.size,
            total: bankPagination.total,
            onChange: (page, size) => {
              setPagination({ ...bankPagination, page, size });
            },
          }}
          locale={{
            emptyText: 'Chưa có câu hỏi nào',
          }}
        />
      </Card>

      <Modal
        title="Thêm câu hỏi vào ngân hàng"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          setSelectedQuestions([]);
        }}
        onOk={handleAddQuestions}
        okText="Thêm"
        cancelText="Hủy"
        width={900}
        confirmLoading={addLoading}
        okButtonProps={{ disabled: selectedQuestions.length === 0 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: 16 }}>
          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={() => fetchAvailableQuestions({ page: 1, size: 10 })}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Lọc theo loại"
                allowClear
                style={{ width: '100%' }}
                value={filterType}
                onChange={(value) => setFilterType(value)}
              >
                {Object.entries(typeLabels).map(([key, label]) => (
                  <Select.Option key={key} value={key}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="Lọc theo độ khó"
                allowClear
                style={{ width: '100%' }}
                value={filterDifficulty}
                onChange={(value) => setFilterDifficulty(value)}
              >
                {Object.entries(difficultyLabels).map(([key, label]) => (
                  <Select.Option key={key} value={key}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Button
            icon={<FilterOutlined />}
            onClick={() => fetchAvailableQuestions({ page: 1, size: 10 })}
          >
            Lọc
          </Button>

          <Table
            columns={availableColumns}
            dataSource={availableQuestions}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedQuestions,
              onChange: (keys) => setSelectedQuestions(keys as number[]),
            }}
            pagination={{
              current: availablePagination.page,
              pageSize: availablePagination.size,
              total: availablePagination.total,
              onChange: (page, size) => {
                fetchAvailableQuestions({ page, size });
              },
            }}
          />
        </Space>
      </Modal>
    </>
  );
};

export default ManageQuestionBankQuestions;
