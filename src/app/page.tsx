
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Family, FanDevice } from "@/lib/types";
import { DeviceGrid } from "@/components/DeviceGrid";
import { ArrowPathIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Home() {
    const router = useRouter();
    const [families, setFamilies] = useState<Family[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const fetchDevices = async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const { data } = await axios.get("/api/devices");
            setFamilies(data.families);
            setError("");
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                router.push("/login");
                return;
            }
            console.error("Failed to fetch devices", err);
            setError("Failed to load devices. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const userRes = await axios.get("/api/auth/user");
                if (!userRes.data.isLoggedIn) {
                    router.push("/login");
                    return;
                }
                fetchDevices();
            } catch {
                router.push("/login");
            }
        };
        init();
    }, [router]);

    const updateDeviceState = (deviceId: string, newState: Partial<FanDevice['state']>) => {
        setFamilies(prevFamilies => {
            return prevFamilies.map(family => ({
                ...family,
                devices: family.devices.map(device => {
                    if (device.id === deviceId) {
                        return { ...device, state: { ...device.state, ...newState } };
                    }
                    return device;
                })
            }));
        });
    };

    const handleTogglePower = async (device: FanDevice) => {
        const originalState = device.state.power;
        const newState = !originalState;
        updateDeviceState(device.id, { power: newState });

        try {
            await axios.post(`/api/devices/${device.id}/control`, {
                command: { power: newState }
            });
        } catch (error) {
            console.error("Power toggle failed", error);
            updateDeviceState(device.id, { power: originalState });
            alert("Failed to update fan power.");
        }
    };

    const handleSetSpeed = async (device: FanDevice, speed: number) => {
        const originalSpeed = device.state.speed;
        updateDeviceState(device.id, { speed: speed });

        try {
            await axios.post(`/api/devices/${device.id}/control`, {
                command: { speed: speed }
            });
        } catch (error) {
            console.error("Set Speed failed", error);
            updateDeviceState(device.id, { speed: originalSpeed });
            alert("Failed to update fan speed.");
        }
    };

    return (
        <main className="min-h-screen">
            {/* Navbar */}
            <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 rounded-lg p-1.5 shadow-lg shadow-blue-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                Atomberg
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                                <UserCircleIcon className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 pr-1">My Home</span>
                            </div>
                            <button
                                onClick={async () => {
                                    await axios.post("/api/auth/logout");
                                    router.push("/login");
                                }}
                                className="flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                                title="Logout"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-1" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-gray-500 mt-2 font-medium">Manage your smart devices</p>
                    </div>
                    <button
                        onClick={() => fetchDevices(true)}
                        disabled={refreshing}
                        className="group flex items-center justify-center p-2.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all active:scale-95"
                        title="Refresh Devices"
                    >
                        <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    </button>
                </div>

                <DeviceGrid
                    families={families}
                    isLoading={loading && !refreshing}
                    error={error}
                    onTogglePower={handleTogglePower}
                    onSetSpeed={handleSetSpeed}
                />

                {/* Footer */}
                <div className="mt-20 border-t border-gray-200/60 pt-8 text-center">
                    <p className="text-sm text-gray-400">Atomberg Smart Control &copy; 2025</p>
                </div>
            </div>
        </main>
    );
}
