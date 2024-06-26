"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import MobileItem from "./MobileItem";

type Props = {
    href: string;
    children?: React.ReactNode;
}

export const MobileLinkItem = ({ href, children, ...props }: Props) => {
    const pathname = usePathname();

    const active = pathname.startsWith(href);

    return (
        <MobileItem asChild className={active ? "bg-gray-100 text-black" : ""} {...props}>
            <Link href={href}>
                {children}
            </Link>
        </MobileItem>
    )
}