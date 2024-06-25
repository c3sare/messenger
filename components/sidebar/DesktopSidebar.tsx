import DesktopItem from "./DesktopItem";
import { users } from "@/drizzle/schema";
import Avatar from "@/components/Avatar";
import SettingsModal from "./SettingsModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { LogOutIcon, MessageCircleMoreIcon, UsersIcon } from "lucide-react";
import { signOut } from "@/auth";
import { DesktopLinkItem } from "./DesktopLinkItem";

interface DesktopSidebarProps {
  currentUser: typeof users.$inferSelect;
}

const routes = [
  {
    label: "Chat",
    href: "/conversations",
    icon: <MessageCircleMoreIcon />,
  },
  {
    label: "Users",
    href: "/users",
    icon: <UsersIcon />,
  }
];

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {

  return (

    <div
      className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between"
    >
      <nav
        className="mt-4 flex flex-col justify-between"
      >
        <form
          role="list"
          className="flex flex-col items-center space-y-1"
        >
          {routes.map((item) => (
            <DesktopLinkItem
              key={item.label}
              aria-label={item.label}
              href={item.href}
            >
              {item.icon}
            </DesktopLinkItem>
          ))}
          <DesktopItem formAction={async () => {
            "use server";
            await signOut();
          }}>
            <LogOutIcon />
          </DesktopItem>
        </form>
      </nav>
      <nav
        className="mt-4 flex flex-col justify-between items-center"
      >
        <Dialog>
          <DialogTrigger asChild>
            <div
              className="cursor-pointer hover:opacity-75 transition"
            >
              <Avatar user={currentUser} />
            </div>
          </DialogTrigger>
          <SettingsModal currentUser={currentUser} />
        </Dialog>
      </nav>
    </div>
  );
};

export default DesktopSidebar;
