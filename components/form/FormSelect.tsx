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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormSelectProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  description?: React.ReactNode;
  placeholder?: string;
  label: string;
  className?: string;
  defaultValue?: FieldValue<T>;
  options: (
    | {
        label: string;
        value: string | number | null;
      }
    | string
  )[];
  disabled?: boolean;
  onChange?: (value: string) => void;
};

const FormSelect = <T extends FieldValues>({
  description,
  control,
  label,
  placeholder,
  name,
  options,
  disabled,
  defaultValue,
  onChange,
}: FormSelectProps<T>) => {
  const isNumber =
    typeof options[0] === "object"
      ? typeof options[0].value === "number"
      : typeof options[0] === "number";

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
          <Select
            onValueChange={(value) =>
              onChange
                ? onChange(value)
                : field.onChange(isNumber ? Number(value) : value)
            }
            value={String(field.value)}
            disabled={disabled || isLoading || isSubmitting}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => {
                const value =
                  typeof option === "string" ? option : option.value;
                const label =
                  typeof option === "string" ? option : option.label;
                return (
                  <SelectItem key={value} value={String(value)}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {!!description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
