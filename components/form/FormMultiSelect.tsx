"use client";

import { Control, FieldValues, Path, type PathValue } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "../ui/multi-select";

type FormMultiSelect<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  description?: React.ReactNode;
  placeholder?: string;
  label: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  onChange?: (value: string[]) => void;
  options: {
    value: string;
    label: string;
  }[];
};

export const FormMultiSelect = <T extends FieldValues>({
  control,
  name,
  description,
  placeholder,
  label,
  className,
  disabled,
  defaultValue,
  onChange,
  options,
}: FormMultiSelect<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({
        field: { disabled, ...field },
        formState: { isLoading, isSubmitting },
      }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <MultiSelect
              placeholder={placeholder}
              disabled={disabled || isLoading || isSubmitting}
              {...field}
              defaultValue={field.value}
              options={options}
              onValueChange={(value) => {
                void field.onChange(value);
                if (onChange) {
                  onChange(value);
                }
              }}
            />
          </FormControl>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
