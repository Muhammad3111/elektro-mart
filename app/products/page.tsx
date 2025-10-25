"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Grid3x3, List, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const products = [
    {
      id: 1,
      name: "Coaxial Cable RG6",
      price: "$15.99",
      description: "50ft, White",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Ethernet Cable Cat 6",
      price: "$12.50",
      description: "100ft, Blue",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Power Cord NEMA 5-15P",
      price: "$8.99",
      description: "6ft, Black",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "HDMI Cable 2.1",
      price: "$25.00",
      description: "10ft, Black",
      image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Speaker Wire 16 AWG",
      price: "$20.00",
      description: "50ft, Clear",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      name: "USB-C to USB-A Cable",
      price: "$9.99",
      description: "3ft, White",
      image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop"
    },
    {
      id: 7,
      name: "Fiber Optic Cable",
      price: "$35.00",
      description: "10m, Yellow",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=400&fit=crop"
    },
    {
      id: 8,
      name: "BNC Connector",
      price: "$5.50",
      description: "RG59/6",
      image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 space-y-6">
            {/* Sort By */}
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-4">Sort By</h3>
                <Select defaultValue="best">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best">Best Sellers</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardContent className="p-4 space-y-6">
                {/* Category */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Category</h3>
                  <div className="space-y-2">
                    {["Coaxial Cables", "Ethernet Cables", "Power Cords", "Connectors", "Tools"].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox id={cat} />
                        <Label htmlFor={cat} className="font-normal cursor-pointer">
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Min" className="w-full" />
                    <span className="text-muted-foreground">-</span>
                    <Input type="number" placeholder="Max" className="w-full" />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Brand</h3>
                  <div className="space-y-2">
                    {["CableCo", "ConnectX", "PowerUp"].map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={brand} />
                        <Label htmlFor={brand} className="font-normal cursor-pointer">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Apply Filters
                  </Button>
                  <Button variant="outline" className="w-full">
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <h1 className="text-4xl font-black">All Products</h1>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-accent rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="gap-2"
                >
                  <Grid3x3 className="h-4 w-4" />
                  Grid View
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List View
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div 
                      className="aspect-square bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.image})` }}
                    />
                    <CardContent className="p-4 relative">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm font-bold text-primary">{product.price}</p>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <Button
                        size="icon"
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 text-white rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button className="bg-primary text-white hover:bg-primary/90">1</Button>
              <Button variant="ghost">2</Button>
              <Button variant="ghost">3</Button>
              <span className="text-muted-foreground">...</span>
              <Button variant="ghost">10</Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
