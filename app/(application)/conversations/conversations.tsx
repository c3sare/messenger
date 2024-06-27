import getConversations from "@/actions/getConversations"
import ConversationList from "./components/ConversationList";
import getCurrentUser from "@/actions/getCurrentUser";

export const Conversations = async () => {
    const [conversations, currentUser] = await Promise.all([getConversations(), getCurrentUser()]);

    return (
        <ConversationList currentUser={currentUser!} initialItems={conversations} />
    )
}