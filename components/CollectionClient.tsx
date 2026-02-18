"use client";

import { useState, useMemo } from "react";
import { ReactLenis } from "lenis/react";
import FishCursor from "@/components/FishCursor";
import SplitText from "@/components/SplitText";
import ProductCard from "@/components/ProductCard";
import Navbar from "./Navbar";

export default function CollectionClient({ corals }: { corals: any[] }) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("featured");

    // Automatically extract unique tags from your active inventory
    const availableTags = useMemo(() => {
        const categoryCorals = activeCategory === "All"
            ? corals
            : corals.filter(c => c.category === activeCategory);

        const tags = categoryCorals.flatMap((c) => c.filterTags || []);
        return Array.from(new Set(tags)).sort();
    }, [corals, activeCategory]);

    // Handle Tag Selection
    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    // Filter and Sort Math
    const filteredAndSortedCorals = useMemo(() => {
        let result = corals;

        // 1. Filter by Category
        if (activeCategory !== "All") {
            result = result.filter((c) => c.category === activeCategory);
        }

        // 2. Filter by Tags (If tags are selected, coral must have at least one)
        if (selectedTags.length > 0) {
            result = result.filter((c) =>
                c.filterTags?.some((t: string) => selectedTags.includes(t))
            );
        }

        // 3. Sort
        result = [...result];
        if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
        if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
        if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "name-desc") result.sort((a, b) => b.name.localeCompare(a.name));

        return result;
    }, [corals, activeCategory, selectedTags, sortBy]);

    return (
        <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true }}>
            <main className="min-h-screen bg-zinc-950 text-slate-50 selection:bg-purple-500/30 relative overflow-x-hidden pb-32">
                <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />
                <FishCursor />

                <Navbar />

                {/* --- HEADER --- */}
                <section className="pt-48 pb-12 px-6 md:px-12 xl:px-24 flex flex-col items-center text-center">
                    <p className="tracking-[0.5em] text-xs text-purple-300/70 uppercase mb-6 font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        Available Stock
                    </p>
                    <SplitText
                        text="THE COLLECTION"
                        delay={30}
                        className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter mix-blend-screen leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                    />
                </section>

                {/* --- MAIN CATEGORY TABS --- */}
                <section className="px-6 md:px-12 xl:px-24 mb-16 flex justify-center gap-4 sm:gap-8 border-b border-white/10 pb-6 relative z-10 pointer-events-auto">
                    {["All", "sps", "lps", "soft"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setSelectedTags([]); // Reset tags when switching main category
                            }}
                            className={`text-sm md:text-base font-mono uppercase tracking-[0.2em] transition-all pb-2 border-b-2 ${activeCategory === cat
                                ? "border-purple-500 text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            {cat === "All" ? "Shop All" : cat}
                        </button>
                    ))}
                </section>

                {/* --- E-COMMERCE LAYOUT (SIDEBAR + GRID) --- */}
                <section className="px-6 md:px-12 xl:px-24 max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-12 relative z-10 pointer-events-auto">

                    {/* LEFT SIDEBAR: Filters & Sorting */}
                    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-10">
                        {/* Sorting */}
                        <div>
                            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Sort By</h3>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-white/10 text-zinc-300 text-sm p-3 rounded-lg outline-none focus:border-purple-500 transition-colors cursor-none"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Alphabetical: A-Z</option>
                                <option value="name-desc">Alphabetical: Z-A</option>
                            </select>
                        </div>

                        {/* Dynamic Tags */}
                        {availableTags.length > 0 && (
                            <div>
                                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Filters</h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map((tag: any) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest border transition-all ${selectedTags.includes(tag)
                                                ? "bg-purple-500/20 border-purple-500 text-white"
                                                : "bg-transparent border-white/10 text-zinc-400 hover:border-white/30"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* RIGHT SIDE: Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
                            {filteredAndSortedCorals.length > 0 ? (
                                filteredAndSortedCorals.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={{ ...product, price: `$${product.price}` }}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center">
                                    <p className="text-zinc-500 font-mono tracking-widest uppercase">
                                        No corals found matching your filters.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </ReactLenis>
    );
}