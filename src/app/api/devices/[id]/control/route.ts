
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/lib/session";
import { AtombergAuth } from "@/lib/atomberg-auth";
import { AppError, AppErrorCode, ErrorHandler } from "@/lib/errors";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        if (!session.isLoggedIn) {
            throw new AppError(AppErrorCode.UNAUTHORIZED, "Unauthorized", 401);
        }

        // Rate limit control actions (20 per minute per IP) - can also limit by session user ID if available
        const ip = (await headers()).get("x-forwarded-for") || "unknown";
        const { allowed } = checkRateLimit(ip + "_control", 20, 60 * 1000);

        if (!allowed) {
            throw new AppError(AppErrorCode.RATE_LIMIT_EXCEEDED, "Too many commands. Please slow down.", 429);
        }

        const { command } = await request.json();
        const { id: deviceId } = await params;

        if (!deviceId || !command) {
            throw new AppError(AppErrorCode.BAD_REQUEST, "Invalid payload", 400);
        }

        // Basic Validation
        if (command.speed !== undefined && (command.speed < 1 || command.speed > 6)) {
            throw new AppError(AppErrorCode.BAD_REQUEST, "Speed must be between 1 and 6", 400);
        }

        let success = false;
        try {
            success = await AtombergAuth.sendCommand(session, deviceId, command);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to send command";
            throw new AppError(AppErrorCode.ATOMBERG_API_ERROR, msg, 500);
        }

        if (success) {
            await session.save();
            return NextResponse.json({ success: true });
        } else {
            throw new AppError(AppErrorCode.ATOMBERG_API_ERROR, "Command failed at Device", 500);
        }
    } catch (error: unknown) {
        return ErrorHandler.handle(error);
    }
}
