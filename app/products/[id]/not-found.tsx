import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <div className="text-8xl mb-4">📦</div>
          <h1 className="text-3xl font-bold">Mahsulot topilmadi</h1>
          <p className="text-muted-foreground text-lg">
            Kechirasiz, siz qidirayotgan mahsulot mavjud emas yoki o&apos;chirilgan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/catalog">
              <Search className="mr-2 h-5 w-5" />
              Katalogga o&apos;tish
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Bosh sahifa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
