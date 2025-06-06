import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMemo } from "react";
import { FieldValues, useForm, UseFormProps } from "react-hook-form";
import * as v from "valibot";

type PropsType<TFormValues extends FieldValues> = Omit<
  UseFormProps<TFormValues>,
  "resolver"
> & {
  schema: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | v.BaseSchema<TFormValues, TFormValues, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | v.BaseSchemaAsync<TFormValues, TFormValues, any>;
};

export const useValibotForm = <Z extends FieldValues>({
  schema,
  ...props
}: PropsType<Z>) => {
  const form = useForm<Z>({
    resolver: valibotResolver(schema),
    ...props,
  });

  const { isDirty, isLoading, isSubmitting, isValidating } = form.formState;

  const disabledSubmit = useMemo(
    () => !isDirty || isLoading || isSubmitting || isValidating,
    [isDirty, isLoading, isSubmitting, isValidating]
  );

  return { ...form, disabledSubmit };
};
