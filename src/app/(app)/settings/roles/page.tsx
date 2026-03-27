"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import {
  Shield,
  Crown,
  Users,
  Eye,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Lock,
} from "lucide-react";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { UpgradeGate } from "@/components/ui/UpgradeGate";
import { useBillingPlan } from "@/features/billing/hooks/useBillingPlan";
import {
  ROLE_PERMISSIONS,
  ROLE_ORDER,
  PERMISSION_LABELS,
  type WorkspaceRole,
} from "@/features/settings/roles/permissions";
import Link from "next/link";

const ROLE_ICONS: Record<WorkspaceRole, React.ReactNode> = {
  owner: <Crown className="h-5 w-5" />,
  admin: <Shield className="h-5 w-5" />,
  member: <Users className="h-5 w-5" />,
  viewer: <Eye className="h-5 w-5" />,
};

const CATEGORIES = ["Tasks", "Members", "Workspace"];

export default function RolesPage() {
  const { isPaid, isLoading: billingLoading } = useBillingPlan();
  const [selectedRole, setSelectedRole] = useState<WorkspaceRole>("owner");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    "Tasks"
  );

  if (billingLoading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="mb-8">
          <div className="h-7 w-48 rounded-lg bg-muted animate-skeleton mb-2" />
          <div className="h-4 w-72 rounded-lg bg-muted animate-skeleton" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-muted animate-skeleton"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isPaid) {
    return (
      <div className="animate-fade-in">
        <SettingsHeader
          title="Roles & Permissions"
          description="Define custom permission sets for your workspace."
        />
        <UpgradeGate
          feature="Roles & Permissions — Pro Feature"
          description="Control exactly what each team member can do. Define permissions for Owners, Admins, Members, and Viewers. Protect sensitive workspace data with granular access control."
          requiredPlan="pro"
        />
      </div>
    );
  }

  const currentRoleData = ROLE_PERMISSIONS[selectedRole];
  const permissionsByCategory = CATEGORIES.map((category) => ({
    category,
    items: Object.entries(PERMISSION_LABELS).filter(
      ([, v]) => v.category === category
    ),
  }));

  return (
    <div className="animate-fade-in space-y-6">
      <SettingsHeader
        title="Roles & Permissions"
        description="View and understand what each role can do in your workspace."
      />

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200/60 bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-900/10 p-4">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
            Role permissions are managed automatically
          </p>
          <p className="text-xs text-blue-600/80 dark:text-blue-500 mt-0.5 leading-relaxed">
            Assign roles to members from the{" "}
            <Link
              href="/settings/members"
              className="underline font-bold hover:text-blue-700"
            >
              Members page
            </Link>
            . Permissions below are enforced automatically based on each
            member's assigned role.
          </p>
        </div>
      </div>

      {/* Role Selector Cards */}
      <SettingsCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          Select a role to view its permissions
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ROLE_ORDER.map((role) => {
            const roleData = ROLE_PERMISSIONS[role];
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-200 text-center ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm scale-[1.02]"
                    : "border-border hover:border-border/80 hover:bg-muted/30"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${roleData.color} text-white flex items-center justify-center shadow-sm`}
                >
                  {ROLE_ICONS[role]}
                </div>
                <div>
                  <p className="text-sm font-bold">{roleData.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                    {roleData.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      {/* Permission Details */}
      <SettingsCard>
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`h-10 w-10 rounded-xl bg-gradient-to-br ${currentRoleData.color} text-white flex items-center justify-center shadow-sm`}
          >
            {ROLE_ICONS[selectedRole]}
          </div>
          <div>
            <h3 className="text-base font-bold">
              {currentRoleData.label} Permissions
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentRoleData.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {permissionsByCategory.map(({ category, items }) => {
            const isExpanded = expandedCategory === category;
            const allowedCount = items.filter(
              ([key]) =>
                currentRoleData.permissions[
                  key as keyof typeof currentRoleData.permissions
                ]
            ).length;

            return (
              <div
                key={category}
                className="rounded-xl border border-border/60 overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : category)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{category}</span>
                    <span
                      className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                        allowedCount === items.length
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : allowedCount === 0
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {allowedCount}/{items.length} allowed
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Permission Items */}
                {isExpanded && (
                  <div className="divide-y divide-border/40">
                    {items.map(([key, { label }]) => {
                      const allowed =
                        currentRoleData.permissions[
                          key as keyof typeof currentRoleData.permissions
                        ];
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between px-4 py-3"
                        >
                          <span className="text-sm font-medium text-foreground">
                            {label}
                          </span>
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              allowed
                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {allowed ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SettingsCard>

      {/* Role Comparison Table */}
      <SettingsCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Full Role Comparison
        </h3>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border/60">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/3">
                  Permission
                </th>
                {ROLE_ORDER.map((role) => (
                  <th key={role} className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${ROLE_PERMISSIONS[role].badgeColor}`}
                    >
                      {ROLE_ICONS[role]}
                      {ROLE_PERMISSIONS[role].label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {Object.entries(PERMISSION_LABELS).map(([key, { label, category }]) => (
                <tr
                  key={key}
                  className="hover:bg-muted/20 transition-colors group"
                >
                  <td className="px-4 py-2.5">
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        {label}
                      </span>
                      <span className="ml-2 text-[10px] text-muted-foreground/60">
                        {category}
                      </span>
                    </div>
                  </td>
                  {ROLE_ORDER.map((role) => {
                    const allowed =
                      ROLE_PERMISSIONS[role].permissions[
                        key as keyof typeof ROLE_PERMISSIONS[typeof role]["permissions"]
                      ];
                    return (
                      <td key={role} className="px-3 py-2.5 text-center">
                        <div className="flex justify-center">
                          {allowed ? (
                            <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                              <X className="h-3 w-3 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      {/* How to assign roles */}
      <SettingsCard>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          How to assign roles
        </h3>
        <div className="space-y-3">
          {[
            {
              step: "1",
              title: "Go to Members page",
              description: "Navigate to Settings → Members to see all workspace members",
              href: "/settings/members",
              linkText: "Go to Members →",
            },
            {
              step: "2",
              title: "Invite a new member",
              description: "Enter their email and select a role before sending the invitation",
            },
            {
              step: "3",
              title: "Change existing member role",
              description: "Use the role dropdown next to any member to change their permissions instantly",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-4 p-3 rounded-xl bg-muted/30 border border-border/40"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-black">
                {item.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {item.description}
                </p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1"
                  >
                    {item.linkText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
