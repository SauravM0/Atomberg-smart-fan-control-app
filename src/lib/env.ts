
export function validateEnv() {
    const requiredVars = [
        "SECRET_COOKIE_PASSWORD"
    ];

    const missing = requiredVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    if (process.env.SECRET_COOKIE_PASSWORD && process.env.SECRET_COOKIE_PASSWORD.length < 32) {
        console.warn("WARNING: SECRET_COOKIE_PASSWORD is shorter than 32 characters. It is insecure!");
    }
}
