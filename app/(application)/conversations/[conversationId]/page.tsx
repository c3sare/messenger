import getConversationById from "@/actions/getConversationById";
import EmptyState from "@/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/MessageForm";
import getCurrentUser from "@/actions/getCurrentUser";

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const [currentUser, conversation] = await Promise.all([getCurrentUser(), getConversationById(parseInt(params.conversationId))]);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} currentUser={currentUser!} />
        <Body initialMessages={conversation.messages} currentUser={currentUser!} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
