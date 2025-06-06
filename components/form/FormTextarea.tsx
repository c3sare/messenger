"use client";

import { Control, FieldValue, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FormTextareaProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  description?: React.ReactNode;
  placeholder?: string;
  label: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: FieldValue<T>;
};

const FormTextarea = <T extends FieldValues>({
  control,
  name,
  description,
  label,
  placeholder,
  className,
  disabled,
  defaultValue,
}: FormTextareaProps<T>) => {
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
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className={cn("resize-none", className)}
              disabled={disabled || isLoading || isSubmitting}
              {...field}
            />
          </FormControl>
          {!!description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextarea;
