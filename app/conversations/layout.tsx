import getConversations from "@/actions/getConversations";
import getUsers from "@/actions/getUsers";
import Sidebar from "@/components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

const ConversationsLayout: React.FC<React.PropsWithChildren> = async ({
  children,
}) => {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <Sidebar>
      <ConversationList users={users} initialItems={conversations} />
      <div className="h-dvh">{children}</div>
    </Sidebar>
  );
};

export default ConversationsLayout;
