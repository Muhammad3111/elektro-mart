"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageLoading() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
            <div className="h-full bg-primary animate-[loading_0.5s_ease-in-out]" 
                 style={{
                     animation: 'loading 0.5s ease-in-out',
                     width: '100%'
                 }}
            />
            <style jsx>{`
                @keyframes loading {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            `}</style>
        </div>
    );
}
