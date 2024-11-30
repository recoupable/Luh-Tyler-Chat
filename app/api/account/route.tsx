import { getSupabaseServerAdminClient } from "@/packages/supabase/src/clients/server-admin-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body.email;
  const client = getSupabaseServerAdminClient();

  try {
    const { data } = await client.from("tiktok_analysis").select("*");
    console.log("ZIAD OKAY", data);

    const { data: found } = await client
      .from("accounts")
      .select("*")
      .eq("email", email);

    if (found?.length)
      return Response.json({ data: found[0] }, { status: 200 });

    const { data: newAccount } = await client
      .from("accounts")
      .insert({
        email,
        timestamp: Date.now(),
        artistIds: [],
      })
      .select("*")
      .single();

    return Response.json({ data: newAccount }, { status: 200 });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "failed";
    return Response.json({ message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
