"use client";

import { GetOneInterviewAttempt } from "../../types";
import { ColumnDef } from "@tanstack/react-table";
import {
  CalendarClockIcon,
  CheckCircle2Icon,
  CornerDownRightIcon,
  LoaderCircleIcon,
  MicIcon,
  XCircleIcon,
} from "lucide-react";
import React from "react";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  UPCOMING: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
  IN_PROGRESS:
    "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
  PROCESSING:
    "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100",
  COMPLETED: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
  FAILED: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
};

const statusLabels: Record<string, string> = {
  UPCOMING: "Upcoming",
  IN_PROGRESS: "In Progress",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

const statusIcons: Record<string, React.ReactNode> = {
  UPCOMING: <CalendarClockIcon className="size-3" />,
  IN_PROGRESS: <MicIcon className="size-3" />,
  PROCESSING: <LoaderCircleIcon className="size-3 animate-spin" />,
  COMPLETED: <CheckCircle2Icon className="size-3" />,
  FAILED: <XCircleIcon className="size-3" />,
};

export const columns: ColumnDef<GetOneInterviewAttempt>[] = [
  {
    accessorKey: "attemptName",
    header: "Attempt Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-3">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original!.name}
            className="size-6"
          />
          <span className="font-semibold">{row.original!.name}</span>
        </div>
        <div className="px-2 flex items-center gap-x-2 [&>svg]:size-4 text-muted-foreground">
          <CornerDownRightIcon className="size-3 text-muted-foreground/80" />
          <span className="text-sm text-muted-foreground/80 max-w-[200px] truncate">
            {row.original?.interview.companyName}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant="outline"
          className={`rounded-md font-semibold flex items-center gap-x-1.5 ${statusStyles[status] ?? ""}`}
        >
          {statusIcons[status]}
          {statusLabels[status] ?? status}
        </Badge>
      );
    },
  },
];
