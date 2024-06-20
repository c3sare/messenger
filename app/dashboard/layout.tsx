import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-dvh">
      <form className="h-full w-12 bg-slate-300 flex flex-col justify-end">
        <Button
          variant="outline"
          className="p-0"
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          <LogOutIcon />
        </Button>
      </form>
      <div className="flex-1">{children}</div>
    </div>
  );
}
