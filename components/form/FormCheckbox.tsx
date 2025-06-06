"use client";

import { Control, FieldValue, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type FormInput<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  description?: React.ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: FieldValue<T>;
};

const FormCheckbox = <T extends FieldValues>({
  control,
  name,
  description,
  label,
  className,
  disabled,
  defaultValue,
}: FormInput<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({
        field: { value, onChange, disabled, ...rest },
        formState: { isLoading, isSubmitting },
      }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow",
            className
          )}
        >
          <FormControl>
            <Checkbox
              checked={value}
              onCheckedChange={onChange}
              disabled={disabled || isLoading || isSubmitting}
              {...rest}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormCheckbox;
