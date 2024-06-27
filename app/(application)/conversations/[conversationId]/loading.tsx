import React from "react";
import { Loader } from "lucide-react";

const ConversationLoading = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <Loader className="animate-spin text-primary" />
        </div>
    );
}

export default ConversationLoading;