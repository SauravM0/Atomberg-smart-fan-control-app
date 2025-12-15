
import axios, { AxiosError } from "axios";
import { SessionData } from "./session";
import { AtombergDevice, FanDevice } from "./types";

const ATOMBERG_BASE_URL = "https://api.developer.atomberg-iot.com";

interface AccessTokenResponse {
    status: string;
    message: {
        access_token: string;
        expires_in?: number; // API docs say 24h, but we can verify response
    };
}

interface DeviceListResponse {
    status: string;
    message: {
        devices_list: AtombergDevice[];
    };
}

export class AtombergAuth {
    /**
     * Validates credentials by attempting to fetch an access token.
     * returns the access token on success.
     */
    static async login(refreshToken: string, apiKey: string): Promise<string> {
        try {
            // Note: The community integration usually uses a GET request, but 500 errors suggest POST might be required or the server is strict.
            // Endpoint: /v1/get_access_token
            // Endpoint: /v1/get_access_token

            // Try POST first as it is more standard for token generation
            const response = await axios.post<AccessTokenResponse>(
                `${ATOMBERG_BASE_URL}/v1/get_access_token`,
                {}, // Empty body
                {
                    headers: {
                        "X-API-Key": apiKey,
                        "Authorization": `Bearer ${refreshToken}`,
                    },
                }
            );

            if (
                response.data.status === "Success" &&
                response.data.message?.access_token
            ) {
                return response.data.message.access_token;
            } else {
                // console.error("[AtombergAuth] Invalid response structure:", response.data);
                throw new Error("Invalid response from Atomberg API");
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // console.error("Atomberg Login Error:", error.response?.status);
                if (error.response?.status === 401) {
                    throw new Error("Invalid Credentials (Unauthorized)");
                }
            }
            throw error;
        }
    }

    /**
     * Refreshes the access token if needed.
     * This logic is usually handled on the Server Side before making a request.
     */
    static async refreshAccessTokenIfNeeded(session: SessionData): Promise<string | null> {
        if (!session.refreshToken || !session.apiKey) {
            return null;
        }

        // Check if expired or about to expire (within 5 minutes)
        const now = Date.now();
        // Default expiration is 24h, if we don't have a stored expiration, assume we might need a refresh or just try.
        // Ideally we store expiration. For now, let's assume if we call this, we want a valid token.
        if (session.tokenExpiresAt && session.tokenExpiresAt > now + 5 * 60 * 1000) {
            return session.accessToken || null;
        }

        try {
            const accessToken = await this.login(session.refreshToken, session.apiKey);
            // Update session object in memory (caller needs to save it)
            session.accessToken = accessToken;
            session.tokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
            return accessToken;
        } catch (error: unknown) {
            // console.error("Failed to refresh token", error);
            return null; // Force logout or similar handled by caller
        }
    }

    /**
   * Fetches the list of devices.
   */
    static async getDevices(session: SessionData): Promise<FanDevice[]> {
        const accessToken = await this.refreshAccessTokenIfNeeded(session);
        if (!accessToken) {
            throw new Error("Authentication failed: Unable to refresh token");
        }

        try {
            // Mock Data Fallback for Development/Demo purposes if env var is set or if API fails in a specific way
            // For this task, we will try real API.
            // If we encounter 404/500 repeatedly, we might fallback if configured.

            const response = await axios.get<DeviceListResponse>(
                `${ATOMBERG_BASE_URL}/v1/get_list_of_devices`,
                {
                    headers: {
                        "X-API-Key": session.apiKey,
                        "Authorization": `Bearer ${accessToken}`,
                    }
                }
            );

            if (response.data.status === "Success") {
                const rawDevices = response.data.message.devices_list || [];
                // Normalize
                return rawDevices.map((d) => ({
                    id: d.device_id,
                    name: d.name || "Unknown Fan",
                    model: d.model,
                    isOnline: d.is_online,
                    state: {
                        power: d.state?.power || false,
                        speed: d.state?.speed || 0,
                    }
                }));
                // Mock data fallback removed for production
                return [];
            }

            return [];
        } catch (error: unknown) {
            // console.error("Get Devices Error:", error);
            // Mock data fallback removed for production
            throw new Error("Failed to fetch devices");
        }
    }


    /**
     * Sends a command to a specific device.
     */
    static async sendCommand(session: SessionData, deviceId: string, command: Record<string, any>): Promise<boolean> {
        const accessToken = await this.refreshAccessTokenIfNeeded(session);
        if (!accessToken) {
            throw new Error("Authentication failed: Unable to refresh token");
        }

        try {
            // Mock Mode removed for production

            const response = await axios.post(
                `${ATOMBERG_BASE_URL}/v1/send_command`,
                {
                    device_id: deviceId,
                    command: command
                },
                {
                    headers: {
                        "X-API-Key": session.apiKey,
                        "Authorization": `Bearer ${accessToken}`,
                    }
                }
            );

            if (response.data.status === "Success") {
                return true;
            }

            // console.error("Command failed:", response.data);
            return false;
        } catch (error: unknown) {
            // console.error("Send Command Error:", error);
            // Mock fallback removed
            throw new Error("Failed to send command");
        }
    }

    private static getMockDevices(): FanDevice[] {

        return [
            {
                id: "mock_1",
                name: "Living Room Fan",
                model: "Renesa",
                isOnline: true,
                state: { power: true, speed: 3 }
            },
            {
                id: "mock_2",
                name: "Bedroom Fan",
                model: "Aris",
                isOnline: false,
                state: { power: false, speed: 0 }
            }
        ];
    }
}
