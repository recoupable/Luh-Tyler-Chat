"use client";

import { useTikTokAnalysisProvider } from "@/providers/TIkTokAnalysisProvider";
import TikTokAccountInput from "./Input";
import AnalysisChat from "./AnalysisChat";
import useCredits from "@/hooks/useCredits";

const TikTokAccountAnalysis = () => {
  const { isLoading } = useTikTokAnalysisProvider();
  useCredits();

  return <>{isLoading ? <AnalysisChat /> : <TikTokAccountInput />}</>;
};

export default TikTokAccountAnalysis;
