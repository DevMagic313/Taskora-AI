"use client";

import { ShieldCheck } from "lucide-react";
import { ComingSoonSettings } from "@/components/ui/ComingSoonSettings";

export default function RolesPage() {
    return (
        <ComingSoonSettings
            title="Roles & Permissions"
            description="Define custom permission sets for owners, admins, members, and viewers."
            icon={ShieldCheck}
        />
    );
}
