import Link from "next/link";
import MobileItem from "./MobileItem";
import { LogOutIcon, MessageCircleMoreIcon, UsersIcon } from "lucide-react";
import { signOut } from "@/auth";

const routes = [
  {
    label: "Chat",
    href: "/conversations",
    icon: <MessageCircleMoreIcon />,
  },
  {
    label: "Users",
    href: "/users",
    icon: <UsersIcon />
  },
];

const MobileFooter = () => {
  const logout = async () => {
    "use server";
    await signOut();
  }

  return (
    <form
      className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden"
    >
      {routes.map((route) => (
        <MobileItem
          key={route.href}
          asChild
        >
          <Link href={route.href}>
            {route.icon}
          </Link>
        </MobileItem>
      ))}
      <MobileItem formAction={logout}>
        <LogOutIcon />
      </MobileItem>
    </form>
  );
};

export default MobileFooter;
