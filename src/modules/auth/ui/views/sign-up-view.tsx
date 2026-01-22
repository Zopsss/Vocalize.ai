"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaGithub, FaGoogle } from "react-icons/fa";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be 3 characters long")
      .max(20, "Name can be at most 20 characters long"),
    email: z.email(),
    password: z.string().min(1, "Password is required."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setIsSubmitting(false);
          setError(error.message);
        },
      }
    );
  };

  const onSocial = async (provider: "github" | "google") => {
    setIsSubmitting(true);
    setError(null);

    await authClient.signIn.social(
      {
        provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
        },
        onError: ({ error }) => {
          setIsSubmitting(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            id="sign-up-form"
            className="p-6 md:p-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Let&apos;s Get Started</h1>
                <p className="text-muted-foreground text-balance text-xs">
                  Create your account
                </p>
              </div>

              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel htmlFor="name" className="font-semibold">
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        aria-invalid={fieldState.invalid}
                        placeholder="John Doe"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-2">
                      <FieldLabel htmlFor="email" className="font-semibold">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        aria-invalid={fieldState.invalid}
                        type="email"
                        placeholder="m@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Field className="grid grid-cols-2 gap-4">
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="gap-2"
                      >
                        <FieldLabel
                          htmlFor="password"
                          className="font-semibold"
                        >
                          Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="password"
                          aria-invalid={fieldState.invalid}
                          type="password"
                          // placeholder="●●●●●●●●"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="gap-2"
                      >
                        <FieldLabel
                          htmlFor="confirmPassword"
                          className="font-semibold"
                        >
                          Confirm Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="confirmPassword"
                          aria-invalid={fieldState.invalid}
                          type="password"
                          // placeholder="●●●●●●●●"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </Field>

                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 text-destructive!" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Field>
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    form="sign-up-form"
                    className="w-full cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </Field>

                <Field>
                  <FieldSeparator className="mb-1">
                    Or continue with
                  </FieldSeparator>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => onSocial("google")}
                      disabled={isSubmitting}
                      variant={"outline"}
                      type="button"
                      className="w-full cursor-pointer"
                    >
                      <FaGoogle />
                    </Button>
                    <Button
                      onClick={() => onSocial("github")}
                      disabled={isSubmitting}
                      variant={"outline"}
                      type="button"
                      className="w-full cursor-pointer"
                    >
                      <FaGithub />
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href={"/sign-in"}
                      className="underline underline-offset-4"
                    >
                      Sign In
                    </Link>
                  </div>
                </Field>
              </FieldGroup>
            </div>
          </form>

          <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src={"/logo.svg"} alt="Image" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Vocalize.AI</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
