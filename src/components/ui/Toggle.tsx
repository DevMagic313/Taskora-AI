"use client";

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    id?: string;
}

export function Toggle({ checked, onChange, disabled = false, id }: ToggleProps) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
            } ${checked ? "bg-primary" : "bg-muted"}`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                    checked ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </button>
    );
}
