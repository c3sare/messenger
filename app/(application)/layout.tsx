import { logout } from "@/actions/auth/logout";
import DesktopItem from "@/components/sidebar/DesktopItem";
import { DesktopLinkItem } from "@/components/sidebar/DesktopLinkItem";
import MobileItem from "@/components/sidebar/MobileItem";
import { MobileLinkItem } from "@/components/sidebar/MobileLinkItem";
import { LogOutIcon, MessageCircleMoreIcon, UsersIcon } from "lucide-react";
import { UserForm } from "./user-form";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ActiveStatus from "@/components/ActiveStatus";
import { unstable_noStore } from "next/cache";

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

const ApplicationLayout = ({ children }: React.PropsWithChildren) => {
    unstable_noStore();
    return (
        <>
            <ActiveStatus />
            <div className="h-full">
                <div
                    className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between"
                >
                    <nav className="mt-4 flex flex-col justify-between">
                        <form role="list" className="flex flex-col items-center space-y-1">
                            {routes.map((item) => (
                                <DesktopLinkItem
                                    key={item.label}
                                    aria-label={item.label}
                                    href={item.href}
                                >
                                    {item.icon}
                                </DesktopLinkItem>
                            ))}
                            <DesktopItem formAction={logout}>
                                <LogOutIcon />
                            </DesktopItem>
                        </form>
                    </nav>
                    <nav
                        className="mt-4 flex flex-col justify-between items-center"
                    >
                        <Suspense fallback={<Skeleton className="size-11 rounded-full bg-neutral-200" />}>
                            <UserForm />
                        </Suspense>
                    </nav>
                </div>
                <form className="fixed flex items-center justify-center w-full bottom-0 z-40 bg-white h-[60px] border-t-[1px] lg:hidden">
                    <div className="h-full flex items-center justify-center w-20">
                        <Suspense fallback={<Skeleton className="size-11 rounded-full bg-neutral-200" />}>
                            <UserForm />
                        </Suspense>
                    </div>
                    <div className="w-full justify-between flex items-center h-full">
                        {routes.map((route) => (
                            <MobileLinkItem
                                key={route.href}
                                href={route.href}
                            >
                                {route.icon}
                            </MobileLinkItem>
                        ))}
                        <MobileItem formAction={logout}>
                            <LogOutIcon />
                        </MobileItem>
                    </div>
                </form>
                <main className="lg:pl-20 h-full">{children}</main>
            </div>
        </>
    )
}

export default ApplicationLayout;