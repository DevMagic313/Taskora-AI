"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Camera, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsHeader } from "@/components/ui/SettingsHeader";
import { SettingsCard } from "@/components/ui/SettingsCard";
import { SettingsFormSkeleton } from "@/components/ui/SettingsSkeleton";
import type { Profile, ProfileFormValues } from "@/features/settings/types";

const profileSchema = z.object({
    full_name: z.string().min(1, "Display name is required").max(50),
    bio: z.string().max(160, "Bio must be 160 characters or fewer"),
    timezone: z.string().min(1, "Timezone is required"),
    language: z.string(),
});

const TIMEZONES = Intl.supportedValuesOf("timeZone");
const LANGUAGES = [
    { value: "en", label: "English" },
    { value: "ur", label: "Urdu (اردو)" },
];

export const dynamic = "force-dynamic";

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const supabase = createClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [tzSearch, setTzSearch] = useState("");
    const [tzOpen, setTzOpen] = useState(false);
    const [emailChangeOpen, setEmailChangeOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [sendingEmailChange, setSendingEmailChange] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: "",
            bio: "",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: "en",
        },
    });

    const bioValue = watch("bio");
    const timezoneValue = watch("timezone");

    // ─── Load profile ───
    const loadProfile = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .maybeSingle();
            if (error) throw error;
            if (data) {
                const p = data as Profile;
                setProfile(p);
                setAvatarPreview(p.avatar_url);
                reset({
                    full_name: p.full_name || "",
                    bio: p.bio || "",
                    timezone: p.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                    language: p.language || "en",
                });
            }
        } catch {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [user, supabase, reset]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    // ─── Avatar handling ───
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB");
            return;
        }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    // ─── Save ───
    const onSubmit = async (values: ProfileFormValues) => {
        if (!user) return;
        setSaving(true);
        try {
            let avatarUrl = profile?.avatar_url || null;

            // Upload avatar if changed
            if (avatarFile) {
                const ext = avatarFile.name.split(".").pop();
                const path = `avatars/${user.id}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from("avatars")
                    .upload(path, avatarFile, { upsert: true });
                if (uploadError) throw uploadError;
                const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
                avatarUrl = urlData.publicUrl;
            }

            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    full_name: values.full_name,
                    bio: values.bio,
                    timezone: values.timezone,
                    language: values.language,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            toast.success("Profile updated successfully");
            setAvatarFile(null);
            setUser({ ...user, name: values.full_name, avatar_url: avatarUrl || user.avatar_url });
            await loadProfile();
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleChangeEmail = () => {
        setEmailChangeOpen(!emailChangeOpen);
        setNewEmail("");
    };

    const handleSendEmailChange = async () => {
        if (!newEmail.trim()) {
            toast.error("Please enter a new email address");
            return;
        }

        setSendingEmailChange(true);
        try {
            const { error } = await supabase.auth.updateUser({
                email: newEmail.trim(),
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success(`A confirmation link has been sent to ${newEmail}. Please check your inbox.`);
                setEmailChangeOpen(false);
                setNewEmail("");
            }
        } catch (err) {
            toast.error("Failed to send email change request");
        } finally {
            setSendingEmailChange(false);
        }
    };

    // Filtered timezones
    const filteredTz = TIMEZONES.filter((tz) =>
        tz.toLowerCase().includes(tzSearch.toLowerCase())
    );

    if (loading) return <SettingsFormSkeleton />;

    const avatarInitials = (profile?.full_name || user?.name || "U")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="animate-fade-in">
            <SettingsHeader
                title="Profile"
                description="Manage your personal information and preferences."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Avatar */}
                <SettingsCard>
                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                        Avatar
                    </label>
                    <div className="flex items-center gap-5">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="relative h-20 w-20 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center group shrink-0"
                        >
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-xl font-bold">{avatarInitials}</span>
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-5 w-5 text-white" />
                            </div>
                        </button>
                        <div>
                            <p className="text-sm font-medium">Upload a photo</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                JPG, PNG or WebP. Max 2MB.
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                </SettingsCard>

                {/* Basic Info */}
                <SettingsCard className="space-y-5">
                    {/* Display Name */}
                    <div>
                        <label htmlFor="full_name" className="text-sm font-medium mb-1.5 block">
                            Display Name
                        </label>
                        <input
                            id="full_name"
                            {...register("full_name")}
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                            placeholder="Your name"
                        />
                        {errors.full_name && (
                            <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>
                        )}
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Email</label>
                        <div className="flex gap-2">
                            <div className="flex-1 h-10 rounded-lg border border-border bg-muted px-3 flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-2 shrink-0" />
                                {profile?.email || user?.email || "—"}
                            </div>
                            <button
                                type="button"
                                onClick={handleChangeEmail}
                                className="h-10 rounded-lg border border-border px-3 text-sm font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap"
                            >
                                {emailChangeOpen ? "Cancel" : "Change Email"}
                            </button>
                        </div>

                        {/* Email change form */}
                        {emailChangeOpen && (
                            <div className="mt-3 p-4 rounded-lg border border-border bg-muted/30 space-y-3">
                                <div>
                                    <label htmlFor="new_email" className="text-xs font-medium text-muted-foreground block mb-1.5">
                                        New Email Address
                                    </label>
                                    <input
                                        id="new_email"
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                        placeholder="Enter new email address"
                                        disabled={sendingEmailChange}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSendEmailChange}
                                    disabled={!newEmail.trim() || sendingEmailChange}
                                    className="h-9 rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sendingEmailChange ? "Sending..." : "Send Change Link"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label htmlFor="bio" className="text-sm font-medium">
                                Bio
                            </label>
                            <span
                                className={`text-xs ${
                                    (bioValue?.length || 0) > 160
                                        ? "text-red-500"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {bioValue?.length || 0}/160
                            </span>
                        </div>
                        <textarea
                            id="bio"
                            {...register("bio")}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors"
                            placeholder="Tell us about yourself..."
                        />
                        {errors.bio && (
                            <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
                        )}
                    </div>
                </SettingsCard>

                {/* Preferences */}
                <SettingsCard className="space-y-5">
                    {/* Timezone */}
                    <div className="relative">
                        <label htmlFor="timezone" className="text-sm font-medium mb-1.5 block">
                            Timezone
                        </label>
                        <button
                            type="button"
                            onClick={() => setTzOpen(!tzOpen)}
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-left focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        >
                            {timezoneValue || "Select timezone"}
                        </button>
                        {tzOpen && (
                            <div className="absolute z-20 mt-1 w-full max-h-60 rounded-lg border border-border bg-card shadow-xl overflow-hidden">
                                <div className="p-2 border-b border-border">
                                    <input
                                        type="text"
                                        value={tzSearch}
                                        onChange={(e) => setTzSearch(e.target.value)}
                                        className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs focus:outline-none"
                                        placeholder="Search timezones..."
                                        autoFocus
                                    />
                                </div>
                                <div className="overflow-y-auto max-h-48">
                                    {filteredTz.slice(0, 50).map((tz) => (
                                        <button
                                            key={tz}
                                            type="button"
                                            onClick={() => {
                                                setValue("timezone", tz, { shouldDirty: true });
                                                setTzOpen(false);
                                                setTzSearch("");
                                            }}
                                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${
                                                tz === timezoneValue ? "bg-primary/10 text-primary font-medium" : ""
                                            }`}
                                        >
                                            {tz}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Language */}
                    <div>
                        <label htmlFor="language" className="text-sm font-medium mb-1.5 block">
                            Language
                        </label>
                        <select
                            id="language"
                            {...register("language")}
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </SettingsCard>

                {/* Save button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!isDirty && !avatarFile || saving}
                        className="h-10 rounded-lg bg-primary text-primary-foreground px-6 text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
