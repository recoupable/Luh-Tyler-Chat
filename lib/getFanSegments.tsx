import { AGENT_API } from "./consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFanSegments = async (context: any) => {
  try {
    const response = await fetch(`${AGENT_API}/api/get_segments`, {
      method: "POST",
      body: JSON.stringify(context),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return { error: true };
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export default getFanSegments;
