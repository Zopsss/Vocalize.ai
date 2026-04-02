"use client";

import { useAttemptsFilters } from "../../hooks/use-attempts-filters";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { AttemptsSearchbar } from "./attempts-searchbar";
import { CreateAttemptDialog } from "./create-attempts-dialog";

export const AttemptsHeader = () => {
  const [filters, setFilters] = useAttemptsFilters();
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
      <CreateAttemptDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Interviews</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            Attempt an interview
          </Button>
        </div>
        <div className="flex items-center gap-x-2">
          <AttemptsSearchbar />
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
