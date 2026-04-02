"use client";

import { GetOneInterviewAttempt } from "../../types";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRightIcon } from "lucide-react";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

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
    header: "status",
    cell: ({ row }) => (
      <Badge
        variant={"outline"}
        className="flex items-center gap-x-2 [&>svg:size-4] rounded-md cursor-pointer hover:bg-muted"
      >
        {row.original.status}{" "}
      </Badge>
    ),
  },
];
