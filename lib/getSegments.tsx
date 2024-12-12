import getFanSegments from "./getFanSegments";
import getSegmentsIcons from "./getSegmentsIcons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSegments = async (profileWithComments: any) => {
  const fanSegments = await getFanSegments(profileWithComments);
  if (fanSegments?.error) return { error: true };
  const fanSegmentsWithIcons = await getSegmentsIcons(fanSegments);
  if (fanSegmentsWithIcons?.error) return { error: true };
  return fanSegmentsWithIcons;
};

export default getSegments;
