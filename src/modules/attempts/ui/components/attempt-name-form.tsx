"use client";

import { attemptInsertScehma } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useTRPC } from "@/trpc/client";

const attemptNameSchema = attemptInsertScehma.pick({ name: true });

interface Props {
  attemptId: string;
  initialName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AttemptNameForm = ({
  attemptId,
  initialName,
  onSuccess,
  onCancel,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateAttempt = useMutation(
    trpc.interviewAttempts.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interviewAttempts.getOne.queryOptions({ id: attemptId })
        );
        await queryClient.invalidateQueries(
          trpc.interviewAttempts.getMany.queryOptions({})
        );
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<z.infer<typeof attemptNameSchema>>({
    resolver: zodResolver(attemptNameSchema),
    defaultValues: { name: initialName },
  });

  const onSubmit = (values: z.infer<typeof attemptNameSchema>) => {
    updateAttempt.mutate({ id: attemptId, ...values });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Attempt Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="My interview attempt"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field orientation="horizontal" className="justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateAttempt.isPending}>
            Save
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};
