import { DownloadOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, Empty, Space, Table, Tooltip, Typography } from 'antd';
import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import Papa from 'papaparse';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createTransition } from '../../styles/animations';
import { useThemeToken } from '../../theme/ThemeProvider';

/**
 * Advanced DataTable Component
 * Features:
 * - Server-side pagination, sorting, filtering
 * - Row selection with bulk actions
 * - Column visibility toggle
 * - CSV export
 * - Responsive design
 * - Empty states
 * - Loading skeletons
 */

interface DataTableColumn<T> extends Omit<ColumnsType<T>[number], 'key'> {
	key: string;
	title: string;
	dataIndex?: string | string[];
	exportable?: boolean; // Include in CSV export
	hideable?: boolean; // Can be hidden by user
}

export interface DataTableProps<T extends Record<string, any>> extends Omit<
	TableProps<T>,
	'columns'
> {
	columns: DataTableColumn<T>[];
	// Server-side pagination
	total?: number;
	currentPage?: number;
	pageSize?: number;
	onPageChange?: (page: number, pageSize: number) => void;
	// Server-side sorting
	onSortChange?: (field: string | null, order: 'ascend' | 'descend' | null) => void;
	// Server-side filtering
	onFilterChange?: (filters: Record<string, FilterValue | null>) => void;
	// Row selection
	selectedRowKeys?: React.Key[];
	onSelectionChange?: (keys: React.Key[], rows: T[]) => void;
	// Bulk actions
	bulkActions?: Array<{
		key: string;
		label: string;
		icon?: React.ReactNode;
		danger?: boolean;
		onClick: (selectedRows: T[]) => void;
	}>;
	// CSV export
	exportFileName?: string;
	enableExport?: boolean;
	// Column visibility
	enableColumnToggle?: boolean;
	// Refresh
	onRefresh?: () => void;
	// Empty state
	emptyText?: string;
	emptyDescription?: string;
}

export function DataTable<T extends Record<string, any>>({
	columns: initialColumns,
	dataSource,
	loading,
	total = 0,
	currentPage = 1,
	pageSize = 10,
	onPageChange,
	onSortChange,
	onFilterChange,
	selectedRowKeys,
	onSelectionChange,
	bulkActions,
	exportFileName = 'export',
	enableExport = true,
	enableColumnToggle = true,
	onRefresh,
	emptyText,
	emptyDescription,
	rowKey = 'id',
	...tableProps
}: DataTableProps<T>) {
	const { token } = useThemeToken();
	const { t } = useTranslation();
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		() => new Set(initialColumns.map((col) => col.key))
	);

	// Filter columns based on visibility
	const columns = initialColumns.filter((col) => visibleColumns.has(col.key)) as ColumnsType<T>;

	// Handle table change (pagination, filters, sorter)
	const handleTableChange = (
		pagination: TablePaginationConfig,
		filters: Record<string, FilterValue | null>,
		sorter: SorterResult<T> | SorterResult<T>[]
	) => {
		// Handle pagination
		if (onPageChange && pagination.current && pagination.pageSize) {
			onPageChange(pagination.current, pagination.pageSize);
		}

		// Handle sorting
		if (onSortChange) {
			const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
			if (singleSorter.field && singleSorter.order) {
				onSortChange(
					String(singleSorter.field),
					singleSorter.order as 'ascend' | 'descend'
				);
			} else {
				onSortChange(null, null);
			}
		}

		// Handle filtering
		if (onFilterChange) {
			onFilterChange(filters);
		}
	};

	// Row selection configuration
	const rowSelection = onSelectionChange
		? {
				selectedRowKeys,
				onChange: (keys: React.Key[], rows: T[]) => {
					onSelectionChange(keys, rows);
				},
				selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
			}
		: undefined;

	// Export to CSV
	const handleExport = () => {
		if (!dataSource || dataSource.length === 0) return;

		// Get exportable columns
		const exportColumns = initialColumns.filter(
			(col) => col.exportable !== false && visibleColumns.has(col.key)
		);

		// Prepare data
		const exportData = dataSource.map((row) => {
			const exportRow: Record<string, any> = {};
			exportColumns.forEach((col) => {
				const value = col.dataIndex
					? Array.isArray(col.dataIndex)
						? col.dataIndex.reduce((obj, key) => obj?.[key], row)
						: row[col.dataIndex]
					: null;
				exportRow[col.title as string] = value;
			});
			return exportRow;
		});

		// Generate CSV
		const csv = Papa.unparse(exportData);
		const blob = new Blob(['\uFEFF' + csv], {
			type: 'text/csv;charset=utf-8;',
		});
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `${exportFileName}_${new Date().getTime()}.csv`;
		link.click();
	};

	// Column visibility toggle
	const columnToggleMenu = {
		items: initialColumns
			.filter((col) => col.hideable !== false)
			.map((col) => ({
				key: col.key,
				label: (
					<Checkbox
						checked={visibleColumns.has(col.key)}
						onChange={(e) => {
							const newVisible = new Set(visibleColumns);
							if (e.target.checked) {
								newVisible.add(col.key);
							} else {
								newVisible.delete(col.key);
							}
							setVisibleColumns(newVisible);
						}}
					>
						{col.title as string}
					</Checkbox>
				),
			})),
	};

	// Get selected rows
	const selectedRows =
		dataSource?.filter((row) =>
			selectedRowKeys?.includes(typeof rowKey === 'function' ? rowKey(row) : row[rowKey])
		) || [];

	return (
		<div style={{ animation: 'fadeIn 300ms ease-in-out' }}>
			{/* Toolbar */}
			<div
				style={{
					marginBottom: token.marginMD,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: token.marginSM,
				}}
			>
				{/* Bulk actions */}
				<Space>
					{bulkActions && selectedRowKeys && selectedRowKeys.length > 0 && (
						<>
							<Typography.Text type="secondary">
								{t('common.selectedItems', {
									count: selectedRowKeys.length,
								})}
							</Typography.Text>
							{bulkActions.map((action) => (
								<Button
									key={action.key}
									icon={action.icon}
									danger={action.danger}
									onClick={() => action.onClick(selectedRows)}
								>
									{action.label}
								</Button>
							))}
						</>
					)}
				</Space>

				{/* Toolbar actions */}
				<Space>
					{onRefresh && (
						<Tooltip title={t('common.refresh')}>
							<Button
								icon={<ReloadOutlined spin={loading} />}
								onClick={onRefresh}
								loading={loading}
								style={{
									transition: createTransition(['all'], 'fast'),
								}}
							/>
						</Tooltip>
					)}
					{enableExport && (
						<Tooltip title={t('common.exportCsv')}>
							<Button
								icon={<DownloadOutlined />}
								onClick={handleExport}
								disabled={!dataSource || dataSource.length === 0}
								style={{
									transition: createTransition(['all'], 'fast'),
								}}
							/>
						</Tooltip>
					)}
					{enableColumnToggle && (
						<Dropdown menu={columnToggleMenu} trigger={['click']}>
							<Button
								icon={<SettingOutlined />}
								style={{
									transition: createTransition(['all'], 'fast'),
								}}
							/>
						</Dropdown>
					)}
				</Space>
			</div>

			{/* Table */}
			<Table<T>
				{...tableProps}
				columns={columns}
				dataSource={dataSource}
				rowKey={rowKey}
				loading={loading}
				rowSelection={rowSelection}
				onChange={handleTableChange}
				pagination={{
					current: currentPage,
					pageSize,
					total,
					showSizeChanger: true,
					showTotal: (total, range) =>
						t('dataTable.pagination', {
							start: range[0],
							end: range[1],
							total,
						}),
					pageSizeOptions: ['10', '20', '50', '100'],
				}}
				scroll={{ x: 'max-content' }}
				locale={{
					emptyText: (
						<Empty
							description={
								<>
									<Typography.Text strong>{emptyText}</Typography.Text>
									{emptyDescription && (
										<div>
											<Typography.Text type="secondary">
												{emptyDescription}
											</Typography.Text>
										</div>
									)}
								</>
							}
						/>
					),
				}}
			/>
		</div>
	);
}
