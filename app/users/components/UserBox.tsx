import Avatar from "@/components/Avatar";
import LoadingModal from "@/components/LoadingModal";
import { users } from "@/drizzle/schema";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type UserBoxProps = {
  data: (typeof users.$inferSelect);
};

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        userId: data.id,
      })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        className="w-full relative my-2 flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
        onClick={handleClick}
      >
        <Avatar user={data} />
        <div
          className="min-w-0 flex-1"
        >
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
