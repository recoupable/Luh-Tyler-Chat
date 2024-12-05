import getFanSegments from "@/lib/getFanSegments";
import getTikTokProfile from "@/lib/getTiktokProfile";
import getVideoComments from "@/lib/getVideoComments";
import saveAnalysis from "@/lib/saveAnalysis";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { SETTING_MODE } from "@/types/Setting";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { STEP_OF_ANALYSIS } from "@/types/Thought";
import getSegmentsIcons from "@/lib/getSegmentsIcons";
import uploadPfp from "@/lib/uploadPfp";
import { useConversationsProvider } from "@/providers/ConverstaionsProvider";
import addArtist from "@/lib/addArtist";
import getArtists from "@/lib/tools/getArtists";

const useTikTokAnalysis = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thought, setThought] = useState(STEP_OF_ANALYSIS.PROFILE);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState<Array<any>>([]);
  const {
    setSettingMode,
    saveSetting,
    setSelectedArtist,
    setArtistActive,
    getArtists,
  } = useArtistProvider();
  const { isPrepared } = useUserProvider();
  const { chat_id: chatId } = useParams();
  const { push } = useRouter();
  const { trackNewTitle } = useConversationsProvider();
  const { email } = useUserProvider();

  useEffect(() => {
    const init = async () => {
      const response = await fetch(`/api/tiktok_analysis?chatId=${chatId}`);
      const data = await response.json();
      if (data?.data) {
        if (email) {
          await addArtist(email || "", data.data.artistId);
          await getArtists();
        }
        setResult(data.data);
        setSegments(data.data.segments);
        setIsLoading(true);
        setThought(STEP_OF_ANALYSIS.FINISHED);
      }
    };
    if (!chatId) return;
    init();
  }, [chatId, email]);

  const handleRetry = () => {
    setResult(null);
    setSegments([]);
    setThought(STEP_OF_ANALYSIS.POSTURLS);
    setProgress(0);
    setUsername("");
    setIsLoading(false);
    push("/funnels/tiktok-account-analysis");
  };
  const handleAnalyze = async () => {
    if (!isPrepared()) return;
    if (!username || isLoading) return;
    let newId = "";
    if (!chatId) {
      newId = uuidV4();
      push(`/funnels/tiktok-account-analysis/${newId}`);
    }
    trackNewTitle(
      {
        title: `TikTok Analysis: ${username}`,
      },
      newId,
    );
    try {
      setIsLoading(true);
      setThought(STEP_OF_ANALYSIS.PROFILE);
      const profile = await getTikTokProfile(username.replaceAll("@", ""));
      setThought(STEP_OF_ANALYSIS.VIDEO_COMMENTS);
      const videoComments = await getVideoComments(
        encodeURIComponent(JSON.stringify(profile?.videos)),
        setThought,
        setProgress,
      );
      const avatar = await uploadPfp(profile.avatar);
      const profileWithComments = {
        ...profile,
        avatar,
        videos: videoComments.videos,
        total_video_comments_count: videoComments.total_video_comments_count,
      };
      setResult(profileWithComments);
      let fanSegmentsWithIcons = [];
      if (videoComments.videos.length > 0) {
        setThought(STEP_OF_ANALYSIS.SEGMENTS);
        const fanSegments = await getFanSegments(profileWithComments);
        fanSegmentsWithIcons = await getSegmentsIcons(fanSegments);
        setSegments([...fanSegmentsWithIcons]);
      }
      setSettingMode(SETTING_MODE.CREATE);
      setThought(STEP_OF_ANALYSIS.CREATING_ARTIST);
      let artistId = "";
      while (1) {
        const artistInfo = await saveSetting(
          profileWithComments.nickname,
          profileWithComments.avatar,
          SETTING_MODE.CREATE,
        );
        if (artistInfo) {
          setSelectedArtist({ ...artistInfo });
          artistId = artistInfo?.id;
          setArtistActive(true);
          break;
        }
      }
      setThought(STEP_OF_ANALYSIS.SAVING_ANALYSIS);
      while (1) {
        const data = await saveAnalysis({
          ...profileWithComments,
          segments: [...fanSegmentsWithIcons],
          chat_id: newId,
          artistId,
        });
        if (data) {
          setResult({
            ...profileWithComments,
            id: data.id,
          });
          break;
        }
      }
      setThought(STEP_OF_ANALYSIS.FINISHED);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  return {
    username,
    setUsername,
    handleAnalyze,
    isLoading,
    setIsLoading,
    thought,
    result,
    setResult,
    progress,
    setProgress,
    segments,
    handleRetry,
  };
};

export default useTikTokAnalysis;
