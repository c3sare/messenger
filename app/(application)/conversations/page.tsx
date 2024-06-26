import EmptyState from "@/components/EmptyState";
import { cn } from "@/lib/utils";

type Props = {
  params: {
    conversationId?: string;
  };
};

const Home = ({ params: { conversationId } }: Props) => {
  const isOpen = !!conversationId;

  return (
    <div
      className={cn("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
