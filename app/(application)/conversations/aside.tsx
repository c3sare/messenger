"use client";

import useConversation from "@/hooks/useConversation";
import { cn } from "@/lib/utils";

export const Aside = ({ children }: { children: React.ReactNode }) => {
    const { isOpen } = useConversation();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200",
                isOpen ? "hidden" : "block w-full left-0"
            )}
        >
            {children}
        </aside>
    )
}