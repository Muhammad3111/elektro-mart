import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden border-2 flex flex-col">
            {/* Image Skeleton */}
            <Skeleton className="aspect-square w-full" />

            <CardContent className="p-3 flex flex-col justify-between flex-1 space-y-2">
                <div className="space-y-2 flex-1">
                    {/* Title Skeleton */}
                    <Skeleton className="h-4 w-3/4" />
                    
                    {/* Description Skeleton */}
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />

                    {/* Price Skeleton */}
                    <div className="flex items-center gap-2 pt-2">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>

                {/* Button Skeleton */}
                <Skeleton className="h-9 md:h-10 w-full" />
            </CardContent>
        </Card>
    );
}
