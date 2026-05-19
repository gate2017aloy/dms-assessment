import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Skeleton,
  Button,
} from '@workspace/ui';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  RotateCcw,
  Filter,
  UserCheck,
} from 'lucide-react';
import { SEVERITY_CONFIG as severityConfig, STATUS_CONFIG as statusConfig, CATEGORY_CONFIG } from '@/lib/constants';
import type { Alert, AlertsFilterState } from '../types';

interface AlertsTableProps {
  alertsList: Alert[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  totalPages: number;
  filters: AlertsFilterState;
  setFilters: React.Dispatch<React.SetStateAction<AlertsFilterState>>;
  resetFilters: () => void;
  handleRowClick: (id: string) => void;
}

const columnHelper = createColumnHelper<Alert>();

export function AlertsTable({
  alertsList,
  isLoading,
  isError,
  refetch,
  totalPages,
  filters,
  setFilters,
  resetFilters,
  handleRowClick,
}: AlertsTableProps) {
  // React Table definition
  const columns = useMemo(
    () => [
      columnHelper.accessor('severity', {
        header: 'Severity',
        cell: (info) => {
          const val = info.getValue();
          const cfg = severityConfig[val] || severityConfig.info;
          const Icon = cfg.icon;
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${cfg.bg}`}
            >
              <Icon className="h-3 w-3 shrink-0" />
              {cfg.label}
            </span>
          );
        },
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: (info) => (
          <div className="max-w-[280px] sm:max-w-[360px] truncate font-medium text-foreground">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <span className="text-muted-foreground text-sm font-medium">
            {CATEGORY_CONFIG[info.getValue() as keyof typeof CATEGORY_CONFIG]?.label || info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const val = info.getValue();
          const cfg = statusConfig[val] || statusConfig.new;
          return (
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${cfg.bg}`}
            >
              {cfg.label}
            </span>
          );
        },
      }),
      columnHelper.accessor('source', {
        header: 'Source',
        cell: (info) => (
          <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted/65 text-muted-foreground border border-border/20">
            {info.getValue()}
          </code>
        ),
      }),
      columnHelper.accessor('timestamp', {
        header: 'Timestamp',
        cell: (info) => (
          <span className="text-muted-foreground text-sm tabular-nums">
            {new Date(info.getValue()).toLocaleString()}
          </span>
        ),
      }),
      columnHelper.accessor('assignee', {
        header: 'Assignee',
        cell: (info) => {
          const val = info.getValue();
          return val ? (
            <span className="inline-flex items-center gap-1 text-xs text-foreground bg-accent/70 px-2 py-0.5 rounded-md border border-border/20 font-medium">
              <UserCheck className="h-3 w-3 text-muted-foreground" />
              {val}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground/50 italic">
              Unassigned
            </span>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: alertsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSortClick = (columnId: string) => {
    if (columnId === 'timestamp') {
      setFilters((prev) => ({
        ...prev,
        sort:
          prev.sort === 'timestamp_desc' ? 'timestamp_asc' : 'timestamp_desc',
        page: 1,
      }));
    } else if (columnId === 'severity') {
      setFilters((prev) => ({
        ...prev,
        sort: prev.sort === 'severity_desc' ? 'severity_asc' : 'severity_desc',
        page: 1,
      }));
    }
  };

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const isSortable = ['timestamp', 'severity'].includes(
                    header.column.id
                  );
                  return (
                    <TableHead
                      key={header.id}
                      onClick={() =>
                        isSortable && handleSortClick(header.column.id)
                      }
                      className={`py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground ${isSortable
                          ? 'cursor-pointer select-none hover:bg-muted/65 transition-all text-foreground'
                          : ''
                        }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.id === 'timestamp' &&
                          (filters.sort === 'timestamp_desc' ? (
                            <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : filters.sort === 'timestamp_asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                          ))}

                        {header.column.id === 'severity' &&
                          (filters.sort === 'severity_desc' ? (
                            <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : filters.sort === 'severity_asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                          ))}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Clean skeleton placeholders for loading phase
              Array.from({ length: 8 }).map((_, rIdx) => (
                <TableRow key={rIdx} className="border-b border-border/25">
                  {Array.from({ length: 7 }).map((_, cIdx) => (
                    <TableCell key={cIdx} className="p-4">
                      <Skeleton className="h-5 w-full max-w-[120px] rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              // Beautiful full-table error display
              <TableRow>
                <TableCell colSpan={7} className="h-72 text-center p-6">
                  <div className="flex flex-col items-center justify-center space-y-3.5 max-w-sm mx-auto">
                    <div className="rounded-full bg-red-500/10 p-3 text-red-500 ring-1 ring-red-500/25">
                      <ShieldAlert className="h-6 w-6 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">
                        Failed to Load Incidents
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        An error occurred while connecting to the SIEM alerts
                        repository API stream.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => refetch()}
                      className="gap-1.5 rounded-lg border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Re-connect Stream
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : alertsList.length === 0 ? (
              // Elegant empty state when query returns nothing
              <TableRow>
                <TableCell colSpan={7} className="h-72 text-center p-6">
                  <div className="flex flex-col items-center justify-center space-y-3.5 max-w-md mx-auto">
                    <div className="rounded-full bg-muted/60 p-3 text-muted-foreground ring-1 ring-border/20">
                      <Filter className="h-6 w-6 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">
                        No alerts found
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        No telemetry alerts match your current filter parameters or
                        timeline window range.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={resetFilters}
                      className="gap-1.5 rounded-lg text-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Clear Filter Controls
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // High-performance rows with visual feedbacks
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original.id)}
                  className="border-b border-border/25 hover:bg-muted/40 cursor-pointer active:bg-muted/60 transition-colors group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dynamic Pagination Footer Control */}
      {!isLoading && !isError && alertsList.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-border/30 bg-muted/20">
          <div className="text-xs text-muted-foreground font-semibold">
            Showing page{' '}
            <span className="text-foreground font-bold tabular-nums">
              {filters.page}
            </span>{' '}
            of{' '}
            <span className="text-foreground font-bold tabular-nums">
              {totalPages}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="gap-1.5 h-8 border-border/60 hover:bg-muted/40 rounded-lg text-xs font-semibold"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                // Elegant slide-window for pagination numbers
                let pageNum = idx + 1;
                if (filters.page > 3 && totalPages > 5) {
                  pageNum = filters.page - 3 + idx;
                  if (pageNum + (4 - idx) > totalPages) {
                    pageNum = totalPages - 4 + idx;
                  }
                }

                return (
                  <Button
                    key={idx}
                    variant={filters.page === pageNum ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, page: pageNum }))}
                    className={`h-8 w-8 rounded-lg text-xs font-bold ${filters.page === pageNum
                        ? 'shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={filters.page === totalPages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="gap-1.5 h-8 border-border/60 hover:bg-muted/40 rounded-lg text-xs font-semibold"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
