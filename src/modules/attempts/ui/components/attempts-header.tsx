"use client";

import { useAttemptsFilters } from "../../hooks/use-attempts-filters";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { AttemptsSearchbar } from "./attempts-searchbar";
import { CreateAttemptDialog } from "./create-attempts-dialog";
import { InterviewCommandSelect } from "./interview-command-select";
import StatusCommandSelect from "./status-command-select";

export const AttemptsHeader = () => {
  const [filters, setFilters] = useAttemptsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isFiltered =
    !!filters.search || !!filters.interviewId || !!filters.status;

  const onClearFilter = () => {
    setFilters({
      search: null,
      interviewId: null,
      status: null,
      page: 1,
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
          <InterviewCommandSelect />
          <StatusCommandSelect />
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
