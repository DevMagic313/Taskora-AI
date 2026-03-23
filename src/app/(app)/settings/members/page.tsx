"use client";

import { Users } from "lucide-react";
import { ComingSoonSettings } from "@/components/ui/ComingSoonSettings";

export default function MembersPage() {
    return (
        <ComingSoonSettings
            title="Team Members"
            description="Invite teammates, manage roles, and control who has access to your workspace."
            icon={Users}
        />
    );
}
