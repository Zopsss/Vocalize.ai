"use client";

import { useInterviewsFilters } from "../../hooks/use-interview-filters";
import { columns } from "../components/columns";
import DataPagination from "../components/data-pagination";
import { DataTable } from "../components/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { useTRPC } from "@/trpc/client";

export const InterviewView = () => {
  const [filters, setFilters] = useInterviewsFilters();
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.interview.getMany.queryOptions({ ...filters })
  );

  return (
    <div className="flex flex-col gap-y-4 flex-1 pb-4 px-4 md:px-8">
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={(row) => router.push(`/interviews/${row.id}`)}
      />
      <DataPagination
        page={data.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first interview"
          description="Create an interview to practice your skills. The AI Agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};

export const InterviewsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Interviews"
      description="This may take some time"
    />
  );
};

export const InterviewsViewError = () => {
  return (
    <ErrorState
      title="Error while loading Interviews"
      description="Something went wrong"
    />
  );
};
