"use client";

import { GetInterview } from "../../types";
import { ColumnDef } from "@tanstack/react-table";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<GetInterview>[] = [
  {
    accessorKey: "name",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-3">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original!.companyName}
            className="size-6"
          />
          <span className="font-semibold">{row.original!.companyName}</span>
        </div>
        <div className="px-2 flex items-center gap-x-2 [&>svg]:size-4 text-muted-foreground">
          <CornerDownRightIcon className="size-3 text-muted-foreground/80" />
          <span className="text-sm text-muted-foreground/80 max-w-[200px] truncate">
            {row.original?.jobRole}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "attempt",
    header: "attempt",
    cell: ({ row }) => (
      <Badge
        variant={"outline"}
        className="flex items-center gap-x-2 [&>svg:size-4] rounded-md cursor-pointer hover:bg-muted"
      >
        <VideoIcon className="text-blue-700" />
        {row.original.attemptsCount > 0 ? row.original.attemptsCount : 0}{" "}
        {row.original.attemptsCount > 0 ? "Attempts" : "Attempt"}
      </Badge>
    ),
  },
];
