import { z } from "zod";
import { tool } from "ai";
import getTiktokTrends from "../apify/getTiktokTrends";
import { ArtistToolResponse } from "@/types/Tool";
import getTikTokContext from "../apify/getTikTokContext";

const getArtistAnalysis = (question: string) =>
  tool({
    description: `IMPORTANT: Always call this tool for question related to artist ANALYTICS:
    Do NOT attempt to answer questions on these topics without calling this tool first.

    Example questions that MUST trigger this tool:
    - "Analyze [tiktok username of artist]"
    - "Analyze my musician."
    - "Analyze my artists' TikTok account."
    - "Analyze @[tiktok username of artist]."`,
    parameters: z.object({
      user_name: z
        .string()
        .optional()
        .describe("The TikTok username of artist or musician to be analyzed."),
    }),
    execute: async ({ user_name }) => {
      if (!user_name)
        return {
          context: {
            status: ArtistToolResponse.MISSING_ARTIST_TIKTOK_USERNAME,
            answer: "Please provide the TikTok username to proceed.",
            username: user_name,
          },
          question,
        };
      const trends = await getTiktokTrends(user_name);
      const trendsContext = getTikTokContext(trends);
      return {
        context: {
          status: ArtistToolResponse.TIKTOK_TRENDS,
          trends: trendsContext,
          username: user_name,
        },
        question,
      };
    },
  });

export default getArtistAnalysis;