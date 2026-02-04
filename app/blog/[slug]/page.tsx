"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { blogsAPI } from "@/lib/api";
import { getImageUrl } from "@/lib/s3/get-image-url";
import type { Blog } from "@/types/blog";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const { t, language } = useLanguage();
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const loadBlog = async () => {
            try {
                setLoading(true);
                const data = await blogsAPI.getBySlug(slug);
                setBlog(data);

                if (data.image) {
                    const url = await getImageUrl(data.image);
                    setImageUrl(url);
                }
            } catch (error) {
                console.error("Error loading blog:", error);
                router.push("/blog");
            } finally {
                setLoading(false);
            }
        };
        loadBlog();
    }, [slug, router]);

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-background">
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="animate-pulse">
                                <div className="h-8 bg-muted rounded w-1/4 mb-4" />
                                <div className="aspect-video bg-muted rounded-lg mb-6" />
                                <div className="h-10 bg-muted rounded w-3/4 mb-4" />
                                <div className="h-4 bg-muted rounded w-1/4 mb-8" />
                                <div className="space-y-3">
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="h-4 bg-muted rounded w-full" />
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!blog) {
        return (
            <>
                <Header />
                <main className="min-h-screen bg-background">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {t("Article not found", "Статья не найдена")}
                            </p>
                            <Button asChild className="mt-4">
                                <Link href="/blog">
                                    {t("Back to Blog", "Назад к блогу")}
                                </Link>
                            </Button>
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
                    <div className="max-w-4xl mx-auto">
                        {/* Back button */}
                        <Button
                            variant="ghost"
                            className="mb-6"
                            onClick={() => router.push("/blog")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t("Back to Blog", "Назад к блогу")}
                        </Button>

                        {/* Image */}
                        {imageUrl && (
                            <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                                <Image
                                    src={imageUrl}
                                    alt={
                                        language === "en"
                                            ? blog.titleEn
                                            : blog.titleRu
                                    }
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-4xl font-bold mb-4">
                            {language === "en" ? blog.titleEn : blog.titleRu}
                        </h1>

                        {/* Meta info */}
                        <div className="flex items-center gap-6 text-muted-foreground mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(
                                        blog.createdAt,
                                    ).toLocaleDateString(
                                        language === "en" ? "en-US" : "ru-RU",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        },
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>
                                    {blog.viewsCount} {t("views", "просмотров")}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none dark:prose-invert"
                            dangerouslySetInnerHTML={{
                                __html:
                                    language === "en"
                                        ? blog.descriptionEn
                                        : blog.descriptionRu,
                            }}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
