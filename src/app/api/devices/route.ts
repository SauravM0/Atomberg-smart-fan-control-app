
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/lib/session";
import { AtombergAuth } from "@/lib/atomberg-auth";
import { AppError, AppErrorCode, ErrorHandler } from "@/lib/errors";

export async function GET() {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        if (!session.isLoggedIn) {
            throw new AppError(AppErrorCode.UNAUTHORIZED, "Unauthorized", 401);
        }

        let devices;
        try {
            devices = await AtombergAuth.getDevices(session);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to fetch devices";
            throw new AppError(AppErrorCode.ATOMBERG_API_ERROR, msg, 500);
        }

        // Check if session was updated (token refresh) and save it
        // getDevices modifies the session object in place if it refreshes
        await session.save();

        // Grouping under a "Default Family" as per Requirement/Plan
        const response = {
            families: [
                {
                    id: "default",
                    name: "My Home",
                    devices: devices
                }
            ]
        };

        return NextResponse.json(response);
    } catch (error: unknown) {
        return ErrorHandler.handle(error);
    }
}
