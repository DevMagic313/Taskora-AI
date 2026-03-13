"use client";

import { SettingsSidebar } from "@/features/settings/components/SettingsSidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
            <SettingsSidebar />
            <div className="flex-1 overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
