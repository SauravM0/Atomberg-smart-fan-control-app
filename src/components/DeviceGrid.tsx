
import React from 'react';
import { Family, FanDevice } from '@/lib/types';
import { FanCard } from './FanCard';
import { ExclamationCircleIcon, HomeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface DeviceGridProps {
    families: Family[];
    isLoading: boolean;
    error?: string;
    onTogglePower: (device: FanDevice) => Promise<void>;
    onSetSpeed: (device: FanDevice, speed: number) => Promise<void>;
}

export const DeviceGrid: React.FC<DeviceGridProps> = ({ families, isLoading, error, onTogglePower, onSetSpeed }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-200/50 rounded-2xl border border-gray-100"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-red-50/50 rounded-3xl border border-red-100 border-dashed">
                <ExclamationCircleIcon className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-800 font-semibold mb-2">Oops! Something went wrong.</p>
                <p className="text-red-500 text-sm max-w-md text-center px-4">{error}</p>
            </div>
        );
    }

    if (!families.length || families.every(f => f.devices.length === 0)) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <HomeIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Devices Found</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm text-center">
                    We couldn't find any Atomberg fans linked to your account. Please ensuring they are set up in the main app.
                </p>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Add Device</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {families.map((family) => (
                <div key={family.id}>
                    <div className="flex items-center gap-3 mb-6">
                        <HomeIcon className="w-6 h-6 text-gray-400" />
                        <h2 className="text-xl font-bold text-gray-800">{family.name}</h2>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {family.devices.length} {family.devices.length === 1 ? 'Device' : 'Devices'}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {family.devices.map((device) => (
                            <FanCard
                                key={device.id}
                                device={device}
                                onTogglePower={onTogglePower}
                                onSetSpeed={onSetSpeed}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
