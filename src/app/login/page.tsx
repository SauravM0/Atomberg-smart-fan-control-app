
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowRightIcon, LockClosedIcon, KeyIcon } from "@heroicons/react/24/solid";

export default function Login() {
    const [apiKey, setApiKey] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post("/api/auth/login", { apiKey, refreshToken });
            router.push("/");
        } catch (err: unknown) {
            let message = "Login failed. Please check your credentials.";
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorators */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-400/20 blur-3xl rounded-full"></div>
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-400/20 blur-3xl rounded-full"></div>
            </div>

            <div className="max-w-md w-full relative z-10 glass-panel p-10 rounded-3xl">
                <div className="text-center mb-10">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Use Atomberg Fans By Using API Key
                    </h2>
                    <p className="mt-3 text-sm text-gray-500">
                        Securely access your smart devices
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-sm font-medium text-red-800">{error}</div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                API Key
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <KeyIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="apiKey"
                                    name="apiKey"
                                    type="password"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition sm:text-sm bg-gray-50/50 focus:bg-white"
                                    placeholder="Enter your API Key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="refreshToken" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                Refresh Token
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="refreshToken"
                                    name="refreshToken"
                                    type="password"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition sm:text-sm bg-gray-50/50 focus:bg-white"
                                    placeholder="Enter your Refresh Token"
                                    value={refreshToken}
                                    onChange={(e) => setRefreshToken(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white 
                bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-200
                ${loading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5'}
            `}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <span className="flex items-center">
                                Sign in securely
                                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
