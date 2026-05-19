import React from 'react';
import {
  Card,
  CardContent,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
} from '@workspace/ui';
import { Search, RotateCcw, Calendar, Filter } from 'lucide-react';
import { categoryLabels } from '../constants';
import type { AlertsFilterState } from '../types';

interface AlertsFiltersProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  filters: AlertsFilterState;
  setFilters: React.Dispatch<React.SetStateAction<AlertsFilterState>>;
  resetFilters: () => void;
}

export function AlertsFilters({
  searchInput,
  setSearchInput,
  filters,
  setFilters,
  resetFilters,
}: AlertsFiltersProps) {
  return (
    <Card className="border border-border/30 bg-card/15 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span>INCIDENT FILTERS & TRIAGE CONTROLS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Real-time Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search incident, source, IP..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 w-full bg-background/50 border-border/60 hover:bg-background/80 focus:bg-background transition-all rounded-lg"
            />
          </div>

          {/* Severity Select */}
          <div>
            <Select
              value={filters.severity}
              onValueChange={(val) =>
                setFilters((prev) => ({ ...prev, severity: val, page: 1 }))
              }
            >
              <SelectTrigger className="w-full h-9 bg-background/50 border-border/60 rounded-lg">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div>
            <Select
              value={filters.status}
              onValueChange={(val) =>
                setFilters((prev) => ({ ...prev, status: val, page: 1 }))
              }
            >
              <SelectTrigger className="w-full h-9 bg-background/50 border-border/60 rounded-lg">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="false_positive">False Positive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Select */}
          <div>
            <Select
              value={filters.category}
              onValueChange={(val) =>
                setFilters((prev) => ({ ...prev, category: val, page: 1 }))
              }
            >
              <SelectTrigger className="w-full h-9 bg-background/50 border-border/60 rounded-lg">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="h-9 w-full gap-1.5 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all rounded-lg text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Controls
            </Button>
          </div>
        </div>

        {/* Premium Date Range Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-3 border-t border-border/25">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/75" />
            <span>Incident Timeline Range:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Start</span>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                    page: 1,
                  }))
                }
                className="h-8 py-1 px-2.5 bg-background/40 border-border/60 rounded-md text-xs w-[140px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">End</span>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                    page: 1,
                  }))
                }
                className="h-8 py-1 px-2.5 bg-background/40 border-border/60 rounded-md text-xs w-[140px]"
              />
            </div>

            {(filters.startDate || filters.endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: '',
                    endDate: '',
                    page: 1,
                  }))
                }
                className="h-7 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-2.5 rounded-md"
              >
                Clear Range
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
