"use client";

import { useAttemptsFilters } from "../../hooks/use-attempts-filters";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { useTRPC } from "@/trpc/client";

export const InterviewCommandSelect = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useAttemptsFilters();
  const [search, setSearch] = useState("");

  const { data } = useQuery(trpc.interview.getMany.queryOptions({ search }));

  const items = data?.items ?? [];

  return (
    <CommandSelect
      placeholder="Interview"
      value={filters.interviewId ?? undefined}
      onSelect={(value) =>
        setFilters({ interviewId: value, page: 1 })
      }
      onSearch={setSearch}
      options={items.map((item) => ({
        id: item.id,
        value: item.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar
              variant="botttsNeutral"
              seed={item.companyName}
              className="size-5 shrink-0"
            />
            <span>
              {item.jobRole} at {item.companyName}
            </span>
          </div>
        ),
      }))}
    />
  );
};
