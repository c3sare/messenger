import getConversations from "@/actions/getConversations";
import getUsers from "@/actions/getUsers";
import ConversationList from "./components/ConversationList";

const ConversationsLayout: React.FC<React.PropsWithChildren> = async ({
  children,
}) => {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <>
      <ConversationList users={users} initialItems={conversations} />
      <div className="h-full">{children}</div>
    </>
  );
};

export default ConversationsLayout;
