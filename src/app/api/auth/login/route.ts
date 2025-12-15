
import { getIronSession } from "iron-session";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/lib/session";
import { AtombergAuth } from "@/lib/atomberg-auth";
import { AppError, AppErrorCode, ErrorHandler } from "@/lib/errors";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    try {
        const ip = (await headers()).get("x-forwarded-for") || "unknown";
        const { allowed, remaining } = checkRateLimit(ip, 5, 60 * 1000); // 5 attempts per minute

        if (!allowed) {
            throw new AppError(AppErrorCode.RATE_LIMIT_EXCEEDED, "Too many login attempts. Please try again later.", 429);
        }

        const { apiKey, refreshToken } = await request.json();

        if (!apiKey || !refreshToken) {
            throw new AppError(AppErrorCode.BAD_REQUEST, "API Key and Refresh Token are required", 400);
        }

        // 1. Validate credentials with Atomberg
        // This throws if invalid
        let accessToken;
        try {
            accessToken = await AtombergAuth.login(refreshToken, apiKey);
        } catch (err: unknown) {
            // For debugging: log the real error
            console.error("Login route error:", err);
            throw err;
        }

        // 2. Create Session
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

        // 3. Store Data in Encrypted Cookie
        session.apiKey = apiKey;
        session.refreshToken = refreshToken;
        session.accessToken = accessToken;
        session.isLoggedIn = true;
        session.tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // Approx 24h

        await session.save();

        const response = NextResponse.json({ success: true });
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        return response;

    } catch (error: unknown) {
        return ErrorHandler.handle(error);
    }
}
