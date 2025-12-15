
import React, { useState } from 'react';
import { FanDevice } from '@/lib/types';
import { BoltIcon, SignalIcon, SignalSlashIcon, PowerIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface FanCardProps {
    device: FanDevice;
    onTogglePower: (device: FanDevice) => Promise<void>;
    onSetSpeed: (device: FanDevice, speed: number) => Promise<void>;
}

export const FanCard: React.FC<FanCardProps> = ({ device, onTogglePower, onSetSpeed }) => {
    const [loading, setLoading] = useState(false);

    const isOnline = device.isOnline;
    const isOn = device.state.power;
    const currentSpeed = device.state.speed;

    const handlePower = async () => {
        if (!isOnline || loading) return;
        setLoading(true);
        try {
            await onTogglePower(device);
        } finally {
            setLoading(false);
        }
    };

    const handleSpeed = async (speed: number) => {
        if (!isOnline || !isOn || loading || speed === currentSpeed) return;
        setLoading(true);
        try {
            await onSetSpeed(device, speed);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`
        relative overflow-hidden rounded-2xl border p-6 transition-all duration-300
        ${isOnline
                ? 'glass-panel border-white/50 hover:shadow-2xl hover:-translate-y-1'
                : 'bg-gray-100 border-gray-200 opacity-80 grayscale-[0.8]'
            }
    `}>
            {/* Background Decorator for ON state */}
            {isOnline && isOn && (
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isOn && isOnline ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                        <SparklesIcon className={`w-6 h-6 ${isOn && isOnline ? 'animate-spin-slow' : ''}`} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{device.name}</h3>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{device.model}</p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${isOnline ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {isOnline ? <SignalIcon className="w-3 h-3" /> : <SignalSlashIcon className="w-3 h-3" />}
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {/* Power Control */}
                <div className="flex items-center justify-between bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                        <PowerIcon className={`w-5 h-5 ${isOn ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="text-sm font-semibold text-gray-700">Power</span>
                    </div>

                    <button
                        onClick={handlePower}
                        disabled={!isOnline || loading}
                        aria-label={isOn ? "Turn fan off" : "Turn fan on"}
                        className={`
                relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isOn ? 'bg-blue-600' : 'bg-gray-300'} 
                ${(!isOnline || loading) ? 'opacity-50 cursor-not-allowed' : ''}
             `}
                    >
                        <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                </div>

                {/* Speed Control */}
                <div>
                    <div className="flex justify-between mb-3 px-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Speed Control</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {isOn && isOnline ? `Level ${currentSpeed}` : 'OFF'}
                        </span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                        {[1, 2, 3, 4, 5, 6].map((level) => (
                            <button
                                key={level}
                                onClick={() => handleSpeed(level)}
                                disabled={!isOnline || !isOn || loading}
                                aria-label={`Set speed to ${level}`}
                                className={`
                            h-10 rounded-lg text-sm font-bold transition-all duration-200 transform active:scale-95
                            ${currentSpeed === level && isOn && isOnline
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-600 ring-offset-1'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                                    }
                            ${(!isOnline || !isOn || loading) ? 'opacity-40 cursor-not-allowed hover:border-gray-200 hover:text-gray-700' : ''}
                        `}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20 rounded-2xl">
                    <BoltIcon className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
            )}
        </div>
    );
};
