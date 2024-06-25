"use client";

import Link from "next/link"
import DesktopItem from "./DesktopItem"
import { usePathname } from "next/navigation";

type Props = {
    href: string;
    children?: React.ReactNode;
}

export const DesktopLinkItem = ({ href, children, ...props }: Props) => {
    const pathname = usePathname();

    const active = pathname.startsWith(href);

    return (
        <DesktopItem asChild className={active ? "bg-gray-100 text-black" : ""} {...props}>
            <Link href={href}>
                {children}
            </Link>
        </DesktopItem>
    )
}