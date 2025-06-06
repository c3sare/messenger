"use client";

import { useValibotForm } from "@/hooks/useValibotForm";
import { FormInput } from "@/components/form/FormInput";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/validators/auth/signInSchema";
import { signInWithCredentials } from "@/actions/auth/signInWithCredentials";
import { toast } from "sonner";

export const LoginForm = () => {
  const form = useValibotForm({
    schema: signInSchema,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const request = await signInWithCredentials(data);

    const response = request?.data;

    if (typeof response?.success === "boolean") toast.error(response.message);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormInput control={form.control} name="email" label="E-mail" />
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
        />
        <Button disabled={form.disabledSubmit} type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </Form>
  );
};
