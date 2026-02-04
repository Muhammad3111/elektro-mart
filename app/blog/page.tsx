"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { blogsAPI } from "@/lib/api";
import { getImageUrl } from "@/lib/s3/get-image-url";
import type { Blog } from "@/types/blog";
import { Calendar } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function BlogPage() {
    const { t, language } = useLanguage();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                setLoading(true);
                const result = await blogsAPI.getAll({
                    isActive: true,
                    limit: 50,
                });
                setBlogs(result.data);

                // Load image URLs
                const urls: Record<string, string> = {};
                for (const blog of result.data) {
                    if (blog.image) {
                        urls[blog.id] = await getImageUrl(blog.image);
                    }
                }
                setImageUrls(urls);
            } catch (error) {
                console.error("Error loading blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, []);

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-background">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-4xl font-bold mb-8">
                            {t("News & Articles", "Новости и статьи")}
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <div className="aspect-video bg-muted" />
                                    <CardContent className="p-4">
                                        <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                                        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-muted rounded w-full" />
                                        <div className="h-4 bg-muted rounded w-2/3 mt-1" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold mb-8">
                        {t("News & Articles", "Новости и статьи")}
                    </h1>

                    {blogs.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {t("No articles yet", "Статей пока нет")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.map((blog) => (
                                <Link key={blog.id} href={`/blog/${blog.slug}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                                        <div className="aspect-video relative bg-muted">
                                            {imageUrls[blog.id] ? (
                                                <Image
                                                    src={imageUrls[blog.id]}
                                                    alt={
                                                        language === "en"
                                                            ? blog.titleEn
                                                            : blog.titleRu
                                                    }
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                    <span className="text-4xl font-bold text-primary/30">
                                                        {(language === "en"
                                                            ? blog.titleEn
                                                            : blog.titleRu
                                                        ).charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(
                                                        blog.createdAt,
                                                    ).toLocaleDateString(
                                                        language === "en"
                                                            ? "en-US"
                                                            : "ru-RU",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                                                {language === "en"
                                                    ? blog.titleEn
                                                    : blog.titleRu}
                                            </h2>
                                            <div
                                                className="text-muted-foreground line-clamp-3 text-sm"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        (language === "en"
                                                            ? blog.descriptionEn
                                                            : blog.descriptionRu
                                                        )
                                                            .replace(
                                                                /<[^>]*>/g,
                                                                "",
                                                            )
                                                            .substring(0, 150) +
                                                        "...",
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
