import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Search, 
  Download, 
  MoreHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminTableSkeleton } from './AdminTableSkeleton';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
  minWidth?: string;
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'secondary';
  disabled?: (row: T) => boolean;
}

export interface BulkAction<T = any> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (selectedRows: T[]) => void;
  variant?: 'default' | 'destructive' | 'secondary';
}

interface ResponsiveDataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  
  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T) => string;
  
  // Actions
  actions?: TableAction<T>[];
  bulkActions?: BulkAction<T>[];
  
  // Pagination
  paginated?: boolean;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  
  // Filtering
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Record<string, any>;
  onFilterChange?: (key: string, value: any) => void;
  
  // Export
  exportable?: boolean;
  onExport?: () => void;
  
  // Styling
  className?: string;
  emptyMessage?: string;
  title?: string;
  description?: string;
}

export function ResponsiveDataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error,
  onRefresh,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (row: T) => row.id,
  actions = [],
  bulkActions = [],
  paginated = false,
  pageSize = 10,
  totalItems,
  currentPage = 1,
  onPageChange,
  sortBy,
  sortOrder,
  onSort,
  searchValue = '',
  onSearch,
  searchPlaceholder,
  filters = {},
  onFilterChange,
  exportable = false,
  onExport,
  className,
  emptyMessage,
  title,
  description
}: ResponsiveDataTableProps<T>) {
  const { t, isRTL } = useLanguage();
  const isMobile = useIsMobile();

  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [localFilters, setLocalFilters] = useState(filters);

  // Handle sorting
  const handleSort = (key: string) => {
    if (!onSort) return;
    
    const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(key, newOrder);
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      const allIds = data.map(getRowId);
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      onSelectionChange([...selectedRows, rowId]);
    } else {
      onSelectionChange(selectedRows.filter(id => id !== rowId));
    }
  };

  // Pagination calculations
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : Math.ceil(data.length / pageSize);
  const paginatedData = useMemo(() => {
    if (totalItems) return data; // Server-side pagination
    
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize, totalItems]);

  // Get filterable columns
  const filterableColumns = columns.filter(col => col.filterable);

  if (loading) {
    return (
      <AdminTableSkeleton 
        rows={8}
        columns={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
        showFilters={true}
        showActions={bulkActions.length > 0}
      />
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-destructive mb-4">
            <p className="admin-body">{error}</p>
          </div>
          {onRefresh && (
                    <Button onClick={onRefresh} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t('admin.table.refreshData')}
                    </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)} data-admin-dashboard>
      {/* Header */}
      {(title || description || onSearch || exportable || bulkActions.length > 0) && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                {title && <CardTitle className="admin-subtitle text-foreground">{title}</CardTitle>}
                {description && <p className="admin-caption text-foreground opacity-75 mt-1">{description}</p>}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Search */}
                {onSearch && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground opacity-75" />
                      <Input
                        value={localSearchValue}
                        onChange={(e) => {
                          setLocalSearchValue(e.target.value);
                          onSearch(e.target.value);
                        }}
                        placeholder={searchPlaceholder || t('admin.table.searchPlaceholder')}
                        className="pl-10 w-full sm:w-64 admin-body text-foreground bg-input"
                      />
                    {localSearchValue && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={() => {
                          setLocalSearchValue('');
                          onSearch('');
                        }}
                        aria-label={t('admin.table.clearSearch')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}

                {/* Filters */}
                {filterableColumns.length > 0 && onFilterChange && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="admin-button">
                        <Filter className="h-4 w-4 mr-2" />
                        {t('admin.table.filters')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-popover text-popover-foreground border border-border shadow-lg z-[100] backdrop-blur-sm">
                      <DropdownMenuLabel className="admin-caption text-foreground">{t('admin.table.filterBy')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {filterableColumns.map(column => (
                        <DropdownMenuItem key={column.key} asChild>
                          <div className="flex items-center justify-between p-2">
                            <span className="admin-body text-foreground">{column.title}</span>
                            <Select
                              value={localFilters[column.key] || ''}
                              onValueChange={(value) => {
                                const newFilters = { ...localFilters, [column.key]: value };
                                setLocalFilters(newFilters);
                                onFilterChange(column.key, value);
                              }}
                            >
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover text-popover-foreground border border-border shadow-lg z-[100] backdrop-blur-sm">
                                <SelectItem value="all" className="text-foreground">{t('admin.table.allItems')}</SelectItem>
                                {/* Add dynamic filter options based on data */}
                              </SelectContent>
                            </Select>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Export */}
                {exportable && onExport && (
                  <Button onClick={onExport} variant="outline" size="sm" className="admin-button">
                    <Download className="h-4 w-4 mr-2" />
                    {t('admin.table.exportData')}
                  </Button>
                )}

                {/* Bulk Actions */}
                {bulkActions.length > 0 && selectedRows.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="admin-button">
                        {t('admin.table.bulkActions')} ({selectedRows.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover text-popover-foreground border border-border shadow-lg z-[100] backdrop-blur-sm">
                      {bulkActions.map((action, index) => (
                        <DropdownMenuItem
                          key={index}
                          onClick={() => {
                            const selectedData = data.filter(row => selectedRows.includes(getRowId(row)));
                            action.onClick(selectedData);
                          }}
                          className={cn(
                            "admin-body text-foreground",
                            action.variant === 'destructive' && "text-destructive focus:text-destructive"
                          )}
                        >
                          {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectable && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRows.length === data.length && data.length > 0}
                        onCheckedChange={handleSelectAll}
                        className="mx-auto"
                      />
                    </TableHead>
                  )}
                  {columns.map((column) => (
                     <TableHead 
                      key={column.key}
                      className={cn(
                        "admin-caption font-semibold text-foreground",
                        column.className,
                        column.sortable && "cursor-pointer hover:bg-muted/50 transition-colors"
                      )}
                      style={{ minWidth: column.minWidth }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center gap-1">
                        {column.title}
                        {column.sortable && (
                          <div className="flex flex-col">
                            {sortBy === column.key ? (
                              sortOrder === 'asc' ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )
                            ) : (
                            <ArrowUpDown className="h-3 w-3 text-foreground opacity-75" />
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                   {actions.length > 0 && (
                    <TableHead className="w-16 admin-caption font-semibold text-foreground">
                       {t('admin.table.actions')}
                     </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                      className="text-center py-8"
                    >
                      <div className="admin-body text-foreground">
                        {emptyMessage || t('admin.table.noResults')}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => {
                    const rowId = getRowId(row);
                    const isSelected = selectedRows.includes(rowId);
                    
                    return (
                      <TableRow 
                        key={rowId}
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          isSelected && "bg-muted/50"
                        )}
                      >
                        {selectable && (
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                            />
                          </TableCell>
                        )}
                        {columns.map((column) => (
                          <TableCell 
                            key={column.key}
                            className={cn("admin-body text-foreground", column.className)}
                          >
                            {column.render 
                              ? column.render(row[column.key], row)
                              : row[column.key]
                            }
                          </TableCell>
                        ))}
                        {actions.length > 0 && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-popover text-popover-foreground border border-border shadow-lg z-[100] backdrop-blur-sm">
                                {actions.map((action, index) => (
                                  <DropdownMenuItem
                                    key={index}
                                    onClick={() => action.onClick(row)}
                                    disabled={action.disabled?.(row)}
                                    className={cn(
                                      "admin-body text-foreground",
                                      action.variant === 'destructive' && "text-destructive focus:text-destructive"
                                    )}
                                  >
                                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {paginated && totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="admin-caption text-foreground opacity-75">
                {(() => {
                  const start = (currentPage - 1) * pageSize + 1;
                  const end = Math.min(currentPage * pageSize, totalItems || data.length);
                  const total = totalItems || data.length;
                  return t('admin.table.showingResults') || `${t('admin.table.showing')} ${start} ${t('admin.table.to')} ${end} ${t('admin.table.of')} ${total} ${t('admin.table.results')}`;
                })()}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="admin-button"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {!isMobile && t('admin.table.previous')}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange?.(page)}
                        className="admin-button"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="admin-button"
                >
                  {!isMobile && t('admin.table.next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}