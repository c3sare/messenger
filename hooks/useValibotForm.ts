import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";

type PropsType<Z extends Parameters<typeof valibotResolver>[0]> = Omit<
  NonNullable<Parameters<typeof useForm<v.InferInput<Z>>>[0]>,
  "resolver"
> & {
  schema: Z;
};

export const useValibotForm = <
  Z extends Parameters<typeof valibotResolver>[0]
>({
  schema,
  ...props
}: PropsType<Z>) => {
  const [isLoading, startTransition] = useTransition();
  const form = useForm<v.InferInput<typeof schema>>({
    resolver: valibotResolver(schema),
    ...props,
  });

  return {
    ...form,
    isLoading,
    handleSubmit: (
      onValid: Parameters<typeof form.handleSubmit>[0],
      onInvalid?: Parameters<typeof form.handleSubmit>[1]
    ) =>
      form.handleSubmit(
        (data) =>
          startTransition(() => {
            onValid(data);
          }),
        onInvalid
          ? (data) =>
              startTransition(() => {
                onInvalid(data);
              })
          : undefined
      ),
  };
};
