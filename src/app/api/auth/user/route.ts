
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    if (session.isLoggedIn) {
        return NextResponse.json({
            isLoggedIn: true,
            // We do NOT return the API keys here.
        });
    }

    return NextResponse.json({ isLoggedIn: false });
}
