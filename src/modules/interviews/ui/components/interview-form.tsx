"use client";

import { interviewInsertScehma } from "../../schemas";
import { GetInterview } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
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

interface InterviewFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: GetInterview;
}

export const InterviewForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: InterviewFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: resume } = useQuery(trpc.resume.get.queryOptions());

  const createInterview = useMutation(
    trpc.interview.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interview.getMany.queryOptions({})
        );

        // TODO: Invalidate free tier usage
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
        onCancel?.();

        // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
      },
    })
  );

  const updateInterview = useMutation(
    trpc.interview.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.interview.getMany.queryOptions({})
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.interview.getOne.queryOptions({ id: initialValues.id })
          );
        }

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
        onCancel?.();

        // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
      },
    })
  );

  const form = useForm<z.infer<typeof interviewInsertScehma>>({
    resolver: zodResolver(interviewInsertScehma),
    defaultValues: {
      companyName: initialValues?.companyName ?? "",
      jobRole: initialValues?.jobRole ?? "",
      jobDescription: initialValues?.jobDescription ?? "",
      resumeId: initialValues?.resumeId ?? resume?.id ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createInterview.isPending || updateInterview.isPending;
  const hasResume = !!resume?.id;

  const onSubmit = async (values: z.infer<typeof interviewInsertScehma>) => {
    if (isEdit) {
      updateInterview.mutate({ ...values, id: initialValues.id });
    } else {
      createInterview.mutate({ ...values, resumeId: resume!.id });
    }
  };

  return (
    <form id="interview-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <GeneratedAvatar
          seed={useWatch({ control: form.control, name: "companyName" })}
          variant="botttsNeutral"
          className="border size-16"
        />

        {!isEdit && !hasResume && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            You need to upload your resume before creating an interview. Go to
            your profile settings to upload one.
          </div>
        )}

        <Controller
          name="companyName"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                <Input
                  {...field}
                  id="companyName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Google"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="jobRole"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="jobRole">Job Role</FieldLabel>
                <Input
                  {...field}
                  id="jobRole"
                  aria-invalid={fieldState.invalid}
                  placeholder="Software Engineer III"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="jobDescription"
          control={form.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="jobDescription">
                  Job Description
                </FieldLabel>
                <Textarea
                  {...field}
                  id="jobDescription"
                  aria-invalid={fieldState.invalid}
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
          <Button type="submit" disabled={isPending || (!isEdit && !hasResume)}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};
