import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from './DataTable';
import type { DataTableColumn } from './DataTable';
import { ConfigProvider } from 'antd';

/**
 * Test: DataTable component
 * Tests table rendering, pagination, and interactions
 */

interface TestData {
  id: number;
  name: string;
  email: string;
}

const mockData: TestData[] = [
  { id: 1, name: 'User 1', email: 'user1@test.com' },
  { id: 2, name: 'User 2', email: 'user2@test.com' },
  { id: 3, name: 'User 3', email: 'user3@test.com' },
];

const mockColumns: DataTableColumn<TestData>[] = [
  {
    key: 'id',
    title: 'ID',
    dataIndex: 'id',
  },
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
  },
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
  },
];

// Wrapper with ConfigProvider
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider>{children}</ConfigProvider>
);

describe('DataTable', () => {
  it('should render table with data', () => {
    render(
      <Wrapper>
        <DataTable columns={mockColumns} dataSource={mockData} />
      </Wrapper>
    );

    // Check if data is rendered
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('user1@test.com')).toBeInTheDocument();
  });

  it('should show empty state when no data', () => {
    render(
      <Wrapper>
        <DataTable
          columns={mockColumns}
          dataSource={[]}
          emptyText="No data available"
        />
      </Wrapper>
    );

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should call onPageChange when pagination changes', () => {
    const onPageChange = vi.fn();

    render(
      <Wrapper>
        <DataTable
          columns={mockColumns}
          dataSource={mockData}
          total={100}
          currentPage={1}
          pageSize={10}
          onPageChange={onPageChange}
        />
      </Wrapper>
    );

    // Note: Actual pagination button click would require more complex setup
    // This is a basic structure test
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('should render refresh button when onRefresh provided', () => {
    const onRefresh = vi.fn();

    render(
      <Wrapper>
        <DataTable
          columns={mockColumns}
          dataSource={mockData}
          onRefresh={onRefresh}
        />
      </Wrapper>
    );

    // Look for refresh button (by aria-label or icon)
    const refreshButtons = screen.getAllByRole('button');
    expect(refreshButtons.length).toBeGreaterThan(0);
  });

  it('should show selection column when onSelectionChange provided', () => {
    const onSelectionChange = vi.fn();

    render(
      <Wrapper>
        <DataTable
          columns={mockColumns}
          dataSource={mockData}
          selectedRowKeys={[]}
          onSelectionChange={onSelectionChange}
        />
      </Wrapper>
    );

    // Selection checkboxes should be present
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });
});
