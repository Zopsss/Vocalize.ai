"use client";

import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  attemptId: string;
  attemptName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const AttemptIdHeader = ({
  attemptId,
  attemptName,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="text-xl font-medium text-foreground/70"
            >
              <Link href="/attempts">My Attempts</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="text-foreground text-lg font-medium"
            >
              <Link href={`/attempts/${attemptId}`}>{attemptName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem className="hover:cursor-pointer" onClick={onEdit}>
            <EditIcon className="size-4 text-black" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" onClick={onDelete}>
            <TrashIcon className="size-4 text-black" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
