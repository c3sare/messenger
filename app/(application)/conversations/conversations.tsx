import getConversations from "@/actions/getConversations"
import ConversationList from "./components/ConversationList";

export const Conversations = async () => {
    const conversations = await getConversations();
    return (
        <ConversationList initialItems={conversations} />
    )
}