"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
    onItemsPerPageChange?: (items: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    onItemsPerPageChange,
}: PaginationProps) {
    const { t } = useLanguage();

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        const validTotalPages = totalPages > 0 ? totalPages : 1;

        if (validTotalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= validTotalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(validTotalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < validTotalPages - 2) {
                pages.push("...");
            }

            // Always show last page
            pages.push(validTotalPages);
        }

        return pages;
    };

    const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
    const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {/* Info */}
            {totalItems && itemsPerPage && (
                <div className="text-sm text-muted-foreground">
                    {t(
                        `${startItem}-${endItem} / ${totalItems} ta natija`,
                        `${startItem}-${endItem} из ${totalItems} результатов`
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                {/* First Page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-muted-foreground"
                                >
                                    ...
                                </span>
                            );
                        }

                        return (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="icon"
                                onClick={() => onPageChange(page as number)}
                                className="w-10 h-10"
                            >
                                {page}
                            </Button>
                        );
                    })}
                </div>

                {/* Next Page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
                </div>

                {/* Items Per Page Selector */}
                {onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {t("Ko'rsatish:", "Показать:")}
                        </span>
                        <Select
                            value={itemsPerPage?.toString() || "10"}
                            onValueChange={(value) => onItemsPerPageChange(Number(value))}
                        >
                            <SelectTrigger className="w-20 h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>
        </div>
    );
}
