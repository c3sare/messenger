"use client";

import useConversation from "@/hooks/useConversation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ConversationBox from "./ConversationBox";
import { pusherClient } from "@/lib/pusher";
import getConversations from "@/actions/getConversations";
import getCurrentUser from "@/actions/getCurrentUser";

type Conversation = Awaited<ReturnType<typeof getConversations>>[number];

type ConversationListProps = {
  initialItems: Conversation[];
  currentUser: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
};

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  currentUser,
}) => {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();

  const { conversationId } = useConversation();

  const pusherKey = useMemo(() => {
    return currentUser.id;
  }, [currentUser.id]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: Conversation) => {
      setItems((current) => {
        if (current.find((item) => item.id === conversation.id)) {
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
              lastMessageAt: conversation.lastMessageAt,
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
  return items
    .sort((a, b) => {
      if ((a.lastMessageAt ?? new Date()) > (b.lastMessageAt ?? new Date()))
        return -1;
      else if (
        (a.lastMessageAt ?? new Date()) < (b.lastMessageAt ?? new Date())
      )
        return 1;
      return 0;
    })
    .map((item) => (
      <ConversationBox
        key={item.id}
        data={item}
        selected={conversationId === item.id}
        currentUser={currentUser}
      />
    ));
};

export default ConversationList;
