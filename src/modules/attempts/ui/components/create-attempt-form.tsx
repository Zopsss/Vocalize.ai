"use client";

import { attemptInsertScehma } from "../../schemas";
import { GetOneInterviewAttempt } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { SelectInterviewCommand } from "./select-interview-command";
import { useTRPC } from "@/trpc/client";

interface CreateAttemptFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: GetOneInterviewAttempt;
}

export const CreateAttemptForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: CreateAttemptFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [interviewSearch, setInterviewSearch] = useState("");

  const { data: interviewData } = useQuery(
    trpc.interview.getMany.queryOptions({
      search: interviewSearch,
    })
  );

  const items = interviewData?.items ?? [];

  const createInterviewAttempt = useMutation(
    trpc.interviewAttempts.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interviewAttempts.getMany.queryOptions({})
        );

        // TODO: Invalidate free tier usage
        onSuccess?.();
      },
      onError: (error) => {
        // toast(error.message);
        toast.error(error.message);
        onCancel?.();

        // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
      },
    })
  );

  const updateInterviewAttempt = useMutation(
    trpc.interviewAttempts.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interviewAttempts.getMany.queryOptions({})
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.interviewAttempts.getOne.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
      },
      onError: (error) => {
        // toast(error.message);
        toast.error(error.message);
        onCancel?.();

        // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
      },
    })
  );

  const form = useForm<z.infer<typeof attemptInsertScehma>>({
    resolver: zodResolver(attemptInsertScehma),
    defaultValues: {
      interviewId: initialValues?.interview.id ?? "",
      name: initialValues?.name ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending =
    createInterviewAttempt.isPending || updateInterviewAttempt.isPending;

  const onSubmit = async (values: z.infer<typeof attemptInsertScehma>) => {
    console.log("values: ", values);
    if (isEdit) {
      updateInterviewAttempt.mutate({ ...values, id: initialValues.id });
    } else {
      createInterviewAttempt.mutate(values);
    }
  };

  return (
    <form id="interview-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <GeneratedAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="border size-16"
        />
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Attempt Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Software Engineer III at Google (Attempt 2)"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        {/* TODO: Handle the edge case when there is no interview created */}
        <Controller
          name="interviewId"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Select Interview</FieldLabel>

                <SelectInterviewCommand
                  placeholder="Select an interview"
                  value={field.value}
                  onSelect={field.onChange}
                  onSearch={(val) => setInterviewSearch(val)}
                  options={items.map((item) => ({
                    id: item.id,
                    value: item.id,
                    children: (
                      <div className="flex items-center gap-x-2">
                        <GeneratedAvatar
                          variant="botttsNeutral"
                          seed={item.companyName}
                          className="size-6 shrink-0"
                        />
                        <span>
                          {item.jobRole} at {item.companyName}
                        </span>
                      </div>
                    ),
                  }))}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />

        <Field orientation={"horizontal"} className="justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};
