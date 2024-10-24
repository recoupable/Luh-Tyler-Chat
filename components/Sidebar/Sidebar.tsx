"use client";

import { BookOpen, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Tooltip from "../Tooltip";
import useUser from "@/hooks/useUser";

const Sidebar = () => {
  const { push } = useRouter();
  const { isPrepared } = useUser();

  const goToItem = (link?: string) => {
    if (isPrepared()) push(`/${link || ""}`);
  };

  return (
    <div className="border-r-[1px] border-r-gray-700 w-16 flex flex-col py-4 px-2 items-center gap-3 hidden md:block">
      <button type="button" onClick={() => goToItem()} className="mb-6">
        <Image
          src="/logo.jpg"
          width={90}
          height={90}
          alt="not found icon"
          className="rounded-md overflow-hidden"
        />
      </button>
      <div className="flex flex-col gap-3">
        <Tooltip
          id={"new-conversation-tooltip"}
          message="New Chat"
          className="!z-[100]"
        >
          <button
            type="button"
            className="border-gray-700 border-[1px] p-2 rounded-md"
            onClick={() => goToItem()}
          >
            <Plus />
          </button>
        </Tooltip>
        <Tooltip
          id={"chat-history-tooltip"}
          message="Chat History"
          className="!z-[100]"
        >
          <button
            type="button"
            className="border-gray-700 border-[1px] p-2 rounded-md"
            onClick={() => goToItem("history")}
          >
            <BookOpen />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
