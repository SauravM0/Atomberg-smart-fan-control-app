
export interface AtombergDevice {
    device_id: string;
    name: string;
    model: string;
    series: string;
    is_online: boolean; // Note: API might return string or boolean, usually boolean in normalized JSON
    state: {
        power: boolean;
        speed: number;
        sleep_mode?: boolean;
        led?: boolean;
        light_mode?: string;
    };
}

export interface FanDevice {
    id: string;
    name: string;
    model: string;
    isOnline: boolean;
    state: {
        power: boolean;
        speed: number;
    };
}

export interface Family {
    id: string;
    name: string;
    devices: FanDevice[];
}
