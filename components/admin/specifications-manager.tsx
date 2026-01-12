"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export interface SpecificationItem {
    labelEn: string;
    labelRu: string;
    valueEn: string;
    valueRu: string;
    order?: number;
}

interface SpecificationsManagerProps {
    specifications: SpecificationItem[];
    onChange: (specifications: SpecificationItem[]) => void;
    disabled?: boolean;
}

export function SpecificationsManager({
    specifications,
    onChange,
    disabled,
}: SpecificationsManagerProps) {
    const { t } = useLanguage();

    const addSpecification = () => {
        onChange([
            ...specifications,
            {
                labelEn: "",
                labelRu: "",
                valueEn: "",
                valueRu: "",
                order: specifications.length,
            },
        ]);
    };

    const removeSpecification = (index: number) => {
        const updated = specifications.filter((_, i) => i !== index);
        // Update order
        const reordered = updated.map((spec, i) => ({ ...spec, order: i }));
        onChange(reordered);
    };

    const updateSpecification = (
        index: number,
        field: keyof SpecificationItem,
        value: string
    ) => {
        const updated = [...specifications];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    };

    const moveSpecification = (index: number, direction: "up" | "down") => {
        if (
            (direction === "up" && index === 0) ||
            (direction === "down" && index === specifications.length - 1)
        ) {
            return;
        }

        const updated = [...specifications];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        [updated[index], updated[targetIndex]] = [
            updated[targetIndex],
            updated[index],
        ];

        // Update order
        const reordered = updated.map((spec, i) => ({ ...spec, order: i }));
        onChange(reordered);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                    {t("Texnik xususiyatlar", "Технические характеристики")}
                </Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSpecification}
                    disabled={disabled}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    {t("Qo'shish", "Добавить")}
                </Button>
            </div>

            {specifications.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            {t(
                                "Texnik xususiyatlar qo'shilmagan. Qo'shish tugmasini bosing.",
                                "Технические характеристики не добавлены. Нажмите кнопку добавить."
                            )}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {specifications.map((spec, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {/* Header with drag handle and delete */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        moveSpecification(
                                                            index,
                                                            "up"
                                                        )
                                                    }
                                                    disabled={
                                                        disabled || index === 0
                                                    }
                                                >
                                                    <GripVertical className="h-4 w-4 rotate-180" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() =>
                                                        moveSpecification(
                                                            index,
                                                            "down"
                                                        )
                                                    }
                                                    disabled={
                                                        disabled ||
                                                        index ===
                                                            specifications.length -
                                                                1
                                                    }
                                                >
                                                    <GripVertical className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground">
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() =>
                                                removeSpecification(index)
                                            }
                                            disabled={disabled}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Label fields */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs">
                                                {t(
                                                    "Label (English)",
                                                    "Название (Английский)"
                                                )}
                                            </Label>
                                            <Input
                                                value={spec.labelEn}
                                                onChange={(e) =>
                                                    updateSpecification(
                                                        index,
                                                        "labelEn",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={t(
                                                    "Masalan: Ekran",
                                                    "Например: Экран"
                                                )}
                                                disabled={disabled}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">
                                                {t(
                                                    "Label (Russian)",
                                                    "Название (Русский)"
                                                )}
                                            </Label>
                                            <Input
                                                value={spec.labelRu}
                                                onChange={(e) =>
                                                    updateSpecification(
                                                        index,
                                                        "labelRu",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={t(
                                                    "Masalan: Экран",
                                                    "Например: Экран"
                                                )}
                                                disabled={disabled}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Value fields */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs">
                                                {t(
                                                    "Value (English)",
                                                    "Значение (Английский)"
                                                )}
                                            </Label>
                                            <Input
                                                value={spec.valueEn}
                                                onChange={(e) =>
                                                    updateSpecification(
                                                        index,
                                                        "valueEn",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={t(
                                                    'Masalan: 6.8" AMOLED',
                                                    'Например: 6.8" AMOLED'
                                                )}
                                                disabled={disabled}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">
                                                {t(
                                                    "Value (Russian)",
                                                    "Значение (Русский)"
                                                )}
                                            </Label>
                                            <Input
                                                value={spec.valueRu}
                                                onChange={(e) =>
                                                    updateSpecification(
                                                        index,
                                                        "valueRu",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={t(
                                                    'Masalan: 6.8" AMOLED',
                                                    'Например: 6.8" AMOLED'
                                                )}
                                                disabled={disabled}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
