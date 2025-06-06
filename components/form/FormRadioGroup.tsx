"use client";

import { Control, FieldValue, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type FormInput<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  description?: React.ReactNode;
  label: string;
  className?: string;
  defaultValue?: FieldValue<T>;
  options: (
    | {
        value: string;
        label: string;
      }
    | string
  )[];
  disabled?: boolean;
};

const FormRadioGroup = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  options,
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
        field: { disabled, ...field },
        formState: { isLoading, isSubmitting },
      }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled || isLoading || isSubmitting}
              className={cn("flex flex-col space-y-1", className)}
            >
              {options.map((option) => {
                const value =
                  typeof option === "string" ? option : option.value;
                const label =
                  typeof option === "string" ? option : option.label;
                return (
                  <FormItem
                    key={value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={value} />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormRadioGroup;
