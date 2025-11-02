import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
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
          <span className="text-2xl">🇺🇿</span>
        </div>
        <Input
          ref={ref}
          type="tel"
          value={displayValue}
          onChange={handleChange}
          className={cn("pl-14", className)}
          placeholder="+998 90 123 45 67"
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
