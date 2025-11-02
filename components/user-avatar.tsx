"use client";

import { useMemo } from "react";

interface UserAvatarProps {
    firstName: string;
    lastName?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

// Generate consistent color based on name
const generateColorFromName = (name: string): string => {
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-amber-500",
        "bg-yellow-500",
        "bg-lime-500",
        "bg-green-500",
        "bg-emerald-500",
        "bg-teal-500",
        "bg-cyan-500",
        "bg-sky-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-violet-500",
        "bg-purple-500",
        "bg-fuchsia-500",
        "bg-pink-500",
        "bg-rose-500",
    ];

    // Generate a hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use the hash to select a color
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

export function UserAvatar({ firstName, lastName, size = "md", className = "" }: UserAvatarProps) {
    const initials = useMemo(() => {
        const first = firstName?.charAt(0)?.toUpperCase() || "";
        const last = lastName?.charAt(0)?.toUpperCase() || "";
        return first + last;
    }, [firstName, lastName]);

    const bgColor = useMemo(() => {
        return generateColorFromName(firstName + (lastName || ""));
    }, [firstName, lastName]);

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
    };

    return (
        <div
            className={`${sizeClasses[size]} ${bgColor} rounded-full flex items-center justify-center text-white font-bold shadow-md ${className}`}
        >
            {initials}
        </div>
    );
}
