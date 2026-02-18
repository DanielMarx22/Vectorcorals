// components/ProductCard.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: string;
    image: string;
    tag?: string;
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
    return (
        <Link href={`/collection/${product.slug}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col rounded-2xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:border-purple-500/40 transition-colors duration-500 shadow-lg cursor-none"
            >
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

                    {product.tag && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300">
                                {product.tag}
                            </span>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-base font-mono font-bold text-zinc-200 drop-shadow-md">
                            {product.price}
                        </span>
                        <span className="text-xs font-mono uppercase tracking-widest text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-purple-400 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300">
                            View details +
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}