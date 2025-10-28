"use client";

import { useEffect, useState } from "react";

interface SectionTitleProps {
    children: React.ReactNode;
    highlight?: string; // Highlighted word(s) in primary color
    centered?: boolean;
    withLines?: boolean; // Show decorative lines on sides
    animated?: boolean; // Enable snake animation
}

export function SectionTitle({ 
    children, 
    highlight, 
    centered = true, 
    withLines = true,
    animated = false
}: SectionTitleProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const text = children?.toString() || "";
    
    // Snake wrap animation - runs every 5 seconds
    useEffect(() => {
        if (!animated) return;
        
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 8000);
        }, 10000);
        
        return () => clearInterval(interval);
    }, [animated]);
    
    // If highlight is provided, split the text and highlight that part
    const renderText = () => {
        return children;
    };

    if (withLines) {
        return (
            <div className={`flex items-center gap-4 mb-8 ${centered ? 'justify-center' : ''}`}>
                <div className="h-[2px] bg-linear-to-r from-transparent via-primary/50 to-primary flex-1 max-w-[100px]" />
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center relative">
                    <span className="relative inline-block" style={{ padding: '16px 8px' }}>
                        {renderText()}
                        {isAnimating && (
                            <span 
                                className="absolute pointer-events-none"
                                style={{
                                    top: '-8px',
                                    left: '-8px',
                                    right: '-8px',
                                    bottom: '-8px',
                                }}
                            >
                                {/* Snake element that wraps around text */}
                                <span 
                                    className="absolute w-[6px] h-[6px] rounded-full bg-primary"
                                    style={{
                                        boxShadow: '0 0 15px 3px rgba(3, 22, 151, 0.8), 0 0 30px 6px rgba(3, 22, 151, 0.4)',
                                        animation: 'snake-crawl 8s linear',
                                    }}
                                />
                                {/* Trail effect */}
                                <span 
                                    className="absolute w-[4px] h-[4px] rounded-full bg-primary"
                                    style={{
                                        opacity: 0.6,
                                        boxShadow: '0 0 10px 2px rgba(3, 22, 151, 0.6)',
                                        animation: 'snake-crawl 8s linear 0.05s',
                                    }}
                                />
                                <span 
                                    className="absolute w-[3px] h-[3px] rounded-full bg-primary"
                                    style={{
                                        opacity: 0.4,
                                        boxShadow: '0 0 8px 2px rgba(3, 22, 151, 0.4)',
                                        animation: 'snake-crawl 8s linear 0.1s',
                                    }}
                                />
                            </span>
                        )}
                    </span>
                </h2>
                <div className="h-[2px] bg-linear-to-l from-transparent via-primary/50 to-primary flex-1 max-w-[100px]" />
            </div>
        );
    }

    return (
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-8 relative ${centered ? 'text-center' : ''}`}>
            <span className="relative inline-block" style={{ padding: '16px 8px' }}>
                {renderText()}
                {isAnimating && (
                    <span 
                        className="absolute pointer-events-none"
                        style={{
                            top: '-8px',
                            left: '-8px',
                            right: '-8px',
                            bottom: '-8px',
                        }}
                    >
                        {/* Snake element that wraps around text */}
                        <span 
                            className="absolute w-[6px] h-[6px] rounded-full bg-primary"
                            style={{
                                boxShadow: '0 0 15px 3px rgba(3, 22, 151, 0.8), 0 0 30px 6px rgba(3, 22, 151, 0.4)',
                                animation: 'snake-crawl 8s linear',
                            }}
                        />
                        {/* Trail effect */}
                        <span 
                            className="absolute w-[4px] h-[4px] rounded-full bg-primary"
                            style={{
                                opacity: 0.6,
                                boxShadow: '0 0 10px 2px rgba(3, 22, 151, 0.6)',
                                animation: 'snake-crawl 8s linear 0.05s',
                            }}
                        />
                        <span 
                            className="absolute w-[3px] h-[3px] rounded-full bg-primary"
                            style={{
                                opacity: 0.4,
                                boxShadow: '0 0 8px 2px rgba(3, 22, 151, 0.4)',
                                animation: 'snake-crawl 8s linear 0.1s',
                            }}
                        />
                    </span>
                )}
            </span>
        </h2>
    );
}
