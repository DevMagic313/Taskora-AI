"use client";
export const dynamic = "force-dynamic";

import { Shield } from "lucide-react";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";

export default function RolesPage() {
  return (
    <div className="animate-fade-in">
      <SettingsHeader
        title="Roles & Permissions"
        description="Define custom permission sets for your workspace."
      />
      <SettingsCard>
        <div className="flex flex-col items-center justify-center py-10 
          text-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex 
            items-center justify-center">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold">Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Custom roles and granular permissions are coming in a future 
              update. For now, use the Members page to assign 
              Owner, Admin, Member, or Viewer roles.
            </p>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
