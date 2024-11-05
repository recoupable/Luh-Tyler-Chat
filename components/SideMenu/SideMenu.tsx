import Image from "next/image";
import SideModal from "../SideModal";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowLeftFromLine, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Artists from "../Sidebar/Artists";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import RecentChats from "../Sidebar/RecentChats";
import Introducing from "../Sidebar/Introducing";
import { useState } from "react";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const SideMenu = ({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) => {
  const { push } = useRouter();
  const { artists } = useArtistProvider();
  const { email } = useUserProvider();
  const [isIntroOpen, setIsIntroOpen] = useState(true);

  return (
    <SideModal isVisible={isVisible}>
      <div className="flex items-center gap-4 justify-between">
        <div className="flex gap-2 items-center">
          <div className="w-[45px] h-[45px] relative">
            <Image
              src={"/logo-light.png"}
              alt="logo"
              layout="fill"
              className="rounded-md overflow-hidden w-full h-full object-contain"
            />
          </div>
          <p className={`text-white text-[30px] ${plusJakartaSans.className} `}>
            Recoup
          </p>
        </div>
        <button type="button" onClick={toggleModal}>
          <ArrowLeftFromLine />
        </button>
      </div>
      <button
        type="button"
        className="border-gray-700 border-[1px] rounded-md p-2 mt-8 cursor-pointer w-full"
        onClick={() => push("/")}
      >
        New Chat
      </button>
      <button
        type="button"
        onClick={() => push("/history")}
        className="flex gap-2 items-center my-4"
      >
        <BookOpen />
        Library
      </button>
      <div className="grow overflow-y-auto">
        {artists.length > 0 && <Artists />}
      </div>
      <div className="h-[0.1px] bg-gray-700 w-full my-4" />
      <RecentChats />
      {isIntroOpen && (
        <Introducing toggleVisible={() => setIsIntroOpen(!isIntroOpen)} />
      )}
      <div className="grow flex flex-col justify-end">
        <div className="flex gap-3 items-center">
          <div className="relative w-8 h-8 rounded-md overflow-hidden">
            <Image
              src="https://i.imgur.com/QCdc8Ai.jpg"
              layout="fill"
              alt="not found icon"
            />
          </div>
          <div>
            <p className="text-sm">{email}</p>
            <p className="text-sm">Team Name</p>
          </div>
        </div>
      </div>
    </SideModal>
  );
};

export default SideMenu;