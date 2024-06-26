"use client";

import useConversation from "@/hooks/useConversation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ConversationBox from "./ConversationBox";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import getConversations from "@/actions/getConversations";

type Conversation = Awaited<ReturnType<typeof getConversations>>[number];

type ConversationListProps = {
  initialItems: Conversation[];
};

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const router = useRouter();

  const { conversationId } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.id;
  }, [session.data?.user?.id]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: Conversation) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: Conversation) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const removeHandler = (conversation: Conversation) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [conversationId, pusherKey, router]);
  return items.map((item) => (
    <ConversationBox
      key={item.id}
      data={item}
      selected={conversationId === item.id}
    />
  ));
};

export default ConversationList;
