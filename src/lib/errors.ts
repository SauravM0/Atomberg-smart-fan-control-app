
import { NextResponse } from "next/server";

export enum AppErrorCode {
    UNAUTHORIZED = "UNAUTHORIZED",
    BAD_REQUEST = "BAD_REQUEST",
    NOT_FOUND = "NOT_FOUND",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    ATOMBERG_API_ERROR = "ATOMBERG_API_ERROR",
}

export class AppError extends Error {
    public readonly code: AppErrorCode;
    public readonly statusCode: number;

    constructor(code: AppErrorCode, message: string, statusCode: number = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class ErrorHandler {
    static handle(error: unknown) {
        console.error("[ErrorHandler] Caught error:", error);

        if (error instanceof AppError) {
            return NextResponse.json(
                { message: error.message, code: error.code },
                { status: error.statusCode }
            );
        }

        // Handle generic errors safely
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json(
            { message: "Internal Server Error", debugMessage: process.env.NODE_ENV === 'development' ? message : undefined },
            { status: 500 }
        );
    }
}
