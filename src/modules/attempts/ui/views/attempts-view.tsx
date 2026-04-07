"use client";

import { useAttemptsFilters } from "../../hooks/use-attempts-filters";
import { columns } from "../components/columns";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { DataPagination } from "@/modules/interviews/ui/components/data-pagination";
import { DataTable } from "@/modules/interviews/ui/components/data-table";
import { useTRPC } from "@/trpc/client";

export const AttemptsView = () => {
  const [filters, setFilters] = useAttemptsFilters();
  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery({
    ...trpc.interviewAttempts.getMany.queryOptions({ ...filters }),
    refetchInterval: (query) => {
      const items = query.state.data?.items ?? [];
      const hasActiveAttempt = items.some(
        (item) => item.status === "IN_PROGRESS"
      );
      return hasActiveAttempt ? 2000 : false;
    },
  });

  return (
    <div className="flex flex-col gap-y-4 flex-1 pb-4 px-4 md:px-8">
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={(row) => router.push(`/attempts/${row.id}`)}
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

export const AttemptsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Interview Attempts"
      description="This may take some time"
    />
  );
};

export const AttemptsViewError = () => {
  return (
    <ErrorState
      title="Error while loading Interview Attempts"
      description="Something went wrong"
    />
  );
};
