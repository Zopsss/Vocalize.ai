"use client";

import { agentsInsertScehma } from "../../schemas";
import { GetAgent } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";

import { useTRPC } from "@/trpc/client";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: GetAgent;
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getAllAgents.queryOptions()
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getAgent.queryOptions({ id: initialValues.id })
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

  const form = useForm<z.infer<typeof agentsInsertScehma>>({
    resolver: zodResolver(agentsInsertScehma),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending; // later add updateAgent.isPending

  const onSubmit = async (values: z.infer<typeof agentsInsertScehma>) => {
    if (isEdit) {
      toast("Agent Updated");
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <form id="agent-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g Math Tutor"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="instructions"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="instructions">Instructions</FieldLabel>
                <Textarea
                  {...field}
                  id="instructions"
                  aria-invalid={fieldState.invalid}
                  placeholder="You're a helpful math assistant that can answer questions and help with assignments."
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
