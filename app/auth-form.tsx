"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { toast } from "sonner";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>("LOGIN");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (session?.status === "authenticated") {
            router.push("/users");
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if (variant === "LOGIN") {
            setVariant("REGISTER");
        } else {
            setVariant("LOGIN");
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === "REGISTER") {
            axios
                .post("/api/register", data)
                .then(() => signIn("credentials", data))
                .catch(() => toast.error("Something went wrong!"))
                .finally(() => setIsLoading(false));
        } else if (variant === "LOGIN") {
            signIn("credentials", {
                ...data,
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error("Invalid credentials");
                    }

                    if (callback?.ok && !callback?.error) {
                        toast.success("Logged in!");
                    }
                })
                .finally(() => setIsLoading(false));
        }
    };

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, {
            redirect: false,
        }).then((callback) => {
            if (callback?.error) {
                toast.error("Invalid credentials");
            }

            if (callback?.ok && !callback?.error) {
                toast.success("Logged in!");
                router.push("/users");
            }
        });
    };

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {variant === "REGISTER" && (
                        <Input
                            name="name"
                        />
                    )}
                    <Input
                        name="email"
                    />
                    <Input
                        name="password"

                    />
                    <Button disabled={isLoading} type="submit" className="w-full">
                        {variant === "LOGIN" ? "Sign in" : "Register"}
                    </Button>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <Button
                            variant="outline"
                            className="mx-auto"
                            onClick={() => socialAction("google")}
                        >
                            Google
                        </Button>
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {variant === "LOGIN"
                            ? "New to messenger?"
                            : "Already have an account?"}
                    </div>
                    <div onClick={toggleVariant} className="underline cursor-pointer">
                        {variant === "LOGIN" ? "Create an account" : "Login"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
