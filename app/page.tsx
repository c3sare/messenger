import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./login-form";
import Link from "next/link";
import { RegisterForm } from "./register-form";
import { GoogleIcon } from "@/components/icons/google-icon";
import { GithubIcon } from "@/components/icons/github-icon";
import { signIn } from "@/auth";

type Props = {
  searchParams: {
    variant?: string;
  };
};

export default function Home({ searchParams: { variant } }: Props) {
  const isVisibleRegister = variant === "REGISTER";

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height={48}
          width={48}
          className="mx-auto"
          src="/images/logo.png"
          quality={100}
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow rounded-lg sm:px-10">
          {isVisibleRegister ? <RegisterForm /> : <LoginForm />}
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
            <form className="mt-6 flex gap-2 w-full">
              <Button
                variant="outline"
                className="w-1/2 text-center flex justify-center"
                formAction={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <GoogleIcon width={16} height={16} />
                <span className="sr-only">Google</span>
              </Button>
              <Button
                variant="outline"
                className="w-1/2 text-center flex justify-center"
                formAction={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <GithubIcon width={16} height={16} />
                <span className="sr-only">Github</span>
              </Button>
            </form>
          </div>
          <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500 flex-col sm:flex-row items-center">
            <div>
              {isVisibleRegister
                ? "Already have an account?"
                : "New to messenger?"}
            </div>
            <Link
              href={isVisibleRegister ? "/" : "/?variant=REGISTER"}
              className="underline cursor-pointer"
            >
              {isVisibleRegister ? "Login" : "Create an account"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
