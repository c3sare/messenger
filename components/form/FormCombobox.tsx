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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

type FormComboboxProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label: string;
  description?: React.ReactNode;
  options: {
    value: FieldValue<T>;
    label: string;
  }[];
  disabled?: boolean;
  defaultValue?: FieldValue<T>;
};

const FormCombobox = <T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  description,
  options,
  disabled,
  defaultValue,
}: FormComboboxProps<T>) => {
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
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger
              asChild
              disabled={disabled || isLoading || isSubmitting}
            >
              <FormControl>
                <Button
                  name={field.name}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options.find((option) => option.value === field.value)
                        ?.label
                    : placeholder}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                  onBlur={field.onBlur}
                />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      value={option.label}
                      key={option.value}
                      onSelect={() => {
                        field.onChange(name, option.value);
                      }}
                    >
                      {option.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          option.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {!!description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormCombobox;
