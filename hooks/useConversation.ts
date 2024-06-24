import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams<{ conversationId?: string }>();

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return null;
    }

    return parseInt(params.conversationId);
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId]
  );
};

export default useConversation;
