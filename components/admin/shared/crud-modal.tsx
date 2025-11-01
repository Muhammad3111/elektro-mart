"use client";

import { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/language-context";

interface CrudModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    titleUz: string;
    titleRu: string;
    descriptionUz?: string;
    descriptionRu?: string;
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function CrudModal({
    open,
    onOpenChange,
    titleUz,
    titleRu,
    descriptionUz,
    descriptionRu,
    children,
    maxWidth = "2xl",
}: CrudModalProps) {
    const { t } = useLanguage();
    
    const maxWidthClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
    }[maxWidth];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`${maxWidthClass} max-h-[90vh] overflow-y-auto`}
            >
                <DialogHeader>
                    <DialogTitle>{t(titleUz, titleRu)}</DialogTitle>
                    {descriptionUz && descriptionRu && (
                        <DialogDescription>
                            {t(descriptionUz, descriptionRu)}
                        </DialogDescription>
                    )}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
