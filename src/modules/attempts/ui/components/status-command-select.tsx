"use client";

import { useAttemptsFilters } from "../../hooks/use-attempts-filters";
import {
  CircleCheckIcon,
  CircleXIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";

import { CommandSelect } from "@/components/command-select";

import { InterviewStatus } from "@/generated/prisma/enums";

const options = [
  {
    id: InterviewStatus.IN_PROGRESS,
    value: InterviewStatus.IN_PROGRESS,
    children: (
      <div className="flex items-center gap-x-2">
        <VideoIcon className="" />
        <span>In Progress</span>
      </div>
    ),
  },
  {
    id: InterviewStatus.PROCESSING,
    value: InterviewStatus.PROCESSING,
    children: (
      <div className="flex items-center gap-x-2">
        <LoaderIcon className="" />
        <span>Processing</span>
      </div>
    ),
  },
  {
    id: InterviewStatus.COMPLETED,
    value: InterviewStatus.COMPLETED,
    children: (
      <div className="flex items-center gap-x-2">
        <CircleCheckIcon className="" />
        <span>Completed</span>
      </div>
    ),
  },
  {
    id: InterviewStatus.FAILED,
    value: InterviewStatus.FAILED,
    children: (
      <div className="flex items-center gap-x-2">
        <CircleXIcon className="" />
        <span>Failed</span>
      </div>
    ),
  },
];

const StatusCommandSelect = () => {
  const [filters, setFilters] = useAttemptsFilters();

  return (
    <CommandSelect
      placeholder="Status"
      value={filters.status ?? undefined}
      onSelect={(value) =>
        setFilters({ status: value as InterviewStatus, page: 1 })
      }
      options={options}
    />
  );
};

export default StatusCommandSelect;
