import EmptyState from "@/components/EmptyState";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{
    conversationId?: string;
  }>;
};

const Home = async ({ params }: Props) => {
  const isOpen = !!(await params).conversationId;

  return (
    <div
      className={cn("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
