"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import {
  Resolver,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ZodSchema, z } from "zod";

type PropsType<Z extends ZodSchema> = Omit<
  NonNullable<Parameters<typeof useForm<z.infer<Z>>>[0]>,
  "resolver"
> & {
  schema: Z;
};

export const useZodForm = <Z extends ZodSchema>({
  schema,
  ...props
}: PropsType<Z>) => {
  const [isLoading, startTransition] = useTransition();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as Resolver<z.TypeOf<Z>, any>,
    ...props,
  });

  return {
    ...form,
    isLoading,
    handleSubmit: (
      onValid: SubmitHandler<z.TypeOf<Z>>,
      onInvalid?: SubmitErrorHandler<z.TypeOf<Z>> | undefined
    ) =>
      form.handleSubmit(
        (data) =>
          startTransition(async () => {
            onValid(data);
          }),
        onInvalid
          ? (data) =>
              startTransition(async () => {
                onInvalid(data);
              })
          : undefined
      ),
  };
};
