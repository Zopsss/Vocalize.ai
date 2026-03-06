"use client";

import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { AgentsDialog } from "./agents-dialog";
import AgentsSearchbar from "./agents-searchbar";

export const AgentsHeader = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isFiltered = !!filters.search;

  const onClearFilter = () => {
    setFilters({
      search: "",
      page: filters.page,
    });
  };

  return (
    <>
      <AgentsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Agents</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className="flex items-center gap-x-2">
          <AgentsSearchbar />
          {isFiltered && (
            <Button variant={"outline"} onClick={onClearFilter}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
