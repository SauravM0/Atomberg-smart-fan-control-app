
import { SessionOptions } from "iron-session";

export interface SessionData {
  apiKey?: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiresAt?: number; // Timestamp in milliseconds
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "atomberg_auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Start 15.0.0+ requires awaiting session()
// We'll use getIronSession in the route handlers
