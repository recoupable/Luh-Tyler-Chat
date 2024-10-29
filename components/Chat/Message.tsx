import useToolCall from "@/hooks/useToolCall";
import { useChatProvider } from "@/providers/ChatProvider";
import { Message as AIMessage } from "ai";
import { UserIcon, TvMinimalPlay, LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import FanTable from "../Tools/FanTable";
import InputArtist from "../Tools/InputArtist";

const Message = ({
  message,
  scroll,
}: {
  message: AIMessage;
  scroll: ({ smooth, y }: { smooth: boolean; y: number }) => void;
}) => {
  const { loading, answer, toolName, context, fans } = useToolCall(message);
  const { pending } = useChatProvider();
  const isHidden =
    pending &&
    message.role === "assistant" &&
    !message.content &&
    message?.toolInvocations;

  const content = message.content || answer;

  const scrollTo = () => scroll({ smooth: true, y: Number.MAX_SAFE_INTEGER });
  useEffect(() => {
    scrollTo();
    setTimeout(() => {
      scrollTo();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, context]);

  return (
    <div className={`p-3 rounded-lg flex w-full gap-2 ${isHidden && "hidden"}`}>
      <div className="size-fit">
        {message.role === "user" ? (
          <UserIcon className="h-6 w-6" />
        ) : (
          <TvMinimalPlay className="h-6 w-6" />
        )}
      </div>
      <div className="grow">
        {context && (
          <>
            {toolName === "getCampaign" && (
              <FanTable fans={fans} scroll={scroll} />
            )}
            {toolName === "createArtist" && <InputArtist context={context} />}
          </>
        )}
        {loading && !content && toolName === "getCampaign" ? (
          <div className="flex gap-2 items-center">
            <p>is thinking...</p>
            <LoaderCircle className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="text-sm font-sans text-pretty break-words">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
