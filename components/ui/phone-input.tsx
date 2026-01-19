import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange"
> {
    value?: string;
    onChange?: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ className, value = "", onChange, ...props }, ref) => {
        // Display formatted value
        const [displayValue, setDisplayValue] = React.useState("");

        React.useEffect(() => {
            // Format incoming value for display
            const digits = value.replace(/\D/g, "");
            if (digits.length >= 3) {
                let formatted = "+998";
                if (digits.length > 3) {
                    formatted += " " + digits.slice(3, 5);
                }
                if (digits.length > 5) {
                    formatted += " " + digits.slice(5, 8);
                }
                if (digits.length > 8) {
                    formatted += " " + digits.slice(8, 10);
                }
                if (digits.length > 10) {
                    formatted += " " + digits.slice(10, 12);
                }
                setDisplayValue(formatted);
            } else {
                setDisplayValue("+998 ");
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let input = e.target.value.replace(/\D/g, ""); // Remove non-digits

            // Ensure it starts with 998
            if (!input.startsWith("998")) {
                if (input.length > 0) {
                    input = "998" + input;
                } else {
                    input = "998";
                }
            }

            // Limit to 12 digits (998 + 9 digits)
            if (input.length > 12) {
                input = input.slice(0, 12);
            }

            // Format for display: +998 XX XXX XX XX
            let formatted = "+998";
            if (input.length > 3) {
                formatted += " " + input.slice(3, 5);
            }
            if (input.length > 5) {
                formatted += " " + input.slice(5, 8);
            }
            if (input.length > 8) {
                formatted += " " + input.slice(8, 10);
            }
            if (input.length > 10) {
                formatted += " " + input.slice(10, 12);
            }

            setDisplayValue(formatted);

            // Send clean value to parent: +998XXXXXXXXX (no spaces)
            if (onChange) {
                const cleanValue = input.length >= 3 ? `+${input}` : "+998";
                onChange(cleanValue);
            }
        };

        return (
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 480"
                        className="w-6 h-4 rounded-sm"
                    >
                        <path fill="#1eb53a" d="M0 320h640v160H0z" />
                        <path fill="#0099b5" d="M0 0h640v160H0z" />
                        <path fill="#ce1126" d="M0 153.6h640v172.8H0z" />
                        <path fill="#fff" d="M0 163.2h640v153.6H0z" />
                        <circle cx="134.4" cy="76.8" r="57.6" fill="#fff" />
                        <circle cx="153.6" cy="76.8" r="57.6" fill="#0099b5" />
                        <g
                            fill="#fff"
                            transform="translate(261.1 28.8)scale(1.92)"
                        >
                            <g id="uz-e">
                                <g id="uz-d">
                                    <g id="uz-c">
                                        <g id="uz-b">
                                            <path
                                                id="uz-a"
                                                d="M0-6-1.9-.3 1 .7"
                                            />
                                            <use
                                                xlinkHref="#uz-a"
                                                transform="scale(-1 1)"
                                            />
                                        </g>
                                        <use
                                            xlinkHref="#uz-b"
                                            transform="rotate(72)"
                                        />
                                    </g>
                                    <use
                                        xlinkHref="#uz-b"
                                        transform="rotate(-72)"
                                    />
                                    <use
                                        xlinkHref="#uz-c"
                                        transform="rotate(144)"
                                    />
                                </g>
                                <use xlinkHref="#uz-d" y="24" />
                            </g>
                            <use xlinkHref="#uz-e" x="24" />
                            <use xlinkHref="#uz-e" x="48" />
                            <use xlinkHref="#uz-d" x="48" y="48" />
                            <use xlinkHref="#uz-d" x="24" y="48" />
                            <use xlinkHref="#uz-d" x="24" y="24" />
                        </g>
                    </svg>
                </div>
                <Input
                    ref={ref}
                    type="tel"
                    value={displayValue}
                    onChange={handleChange}
                    className={cn("pl-12", className)}
                    placeholder="+998 90 123 45 67"
                    {...props}
                />
            </div>
        );
    },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
