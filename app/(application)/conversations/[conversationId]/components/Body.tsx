"use client";

import useConversation from "@/hooks/useConversation";
import type { FullMessageType } from "@/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";
import getCurrentUser from "@/actions/getCurrentUser";

type BodyProps = {
  initialMessages: FullMessageType[];
  currentUser: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
};

const Body: React.FC<BodyProps> = ({ initialMessages, currentUser }) => {
  const [messages, setMessages] = useState(initialMessages);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    if (scrollAreaRef.current)
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
  }, [messages.length])

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}/seen`, { method: "POST" });
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      pusherClient.subscribe(`conversation-${conversationId.toString()}`);

      const messageHandler = (message: FullMessageType) => {
        fetch(`/api/conversations/${conversationId}/seen`, { method: "POST" });

        setMessages((current) => {
          if (find(current, { id: message.id })) {
            return current;
          }

          return [...current, message];
        });
      };

      const updateMessageHandler = (newMessage: FullMessageType) => {
        setMessages((current) =>
          current.map((currentMessage) => {
            if (currentMessage.id === newMessage.id) {
              return newMessage;
            }

            return currentMessage;
          })
        );
      };

      pusherClient.bind("messages:new", messageHandler);
      pusherClient.bind("message:update", updateMessageHandler);
    }

    return () => {
      if (conversationId) {
        pusherClient.unsubscribe(conversationId.toString());
        pusherClient.unbind("messages:new");
        pusherClient.unbind("message:update");
      }
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default Body;
