"use client";

import { useInterviewsFilters } from "../../hooks/use-interview-filters";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { InterviewDialog } from "./interview-dialog";
import InterviewSearchbar from "./interview-searchbar";

export const InterviewHeader = () => {
  const [filters, setFilters] = useInterviewsFilters();
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
      <InterviewDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Interviews</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Interview
          </Button>
        </div>
        <div className="flex items-center gap-x-2">
          <InterviewSearchbar />
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
