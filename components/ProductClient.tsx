"use client";

import { ReactLenis } from "lenis/react";
import FishCursor from "@/components/FishCursor";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./Navbar";

export default function ProductClient({ coral }: { coral: any }) {
    return (
        <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true }}>
            <main className="min-h-screen bg-zinc-950 text-slate-50 selection:bg-purple-500/30 relative overflow-x-hidden pb-32">
                <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />
                <FishCursor />

                <Navbar />

                {/* BACK BUTTON */}
                <div className="pt-40 px-6 md:px-12 xl:px-24 max-w-[1800px] mx-auto mb-12 relative z-10 pointer-events-auto">
                    <Link href="/collection" className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-purple-400 transition-colors">
                        ← Back to Collection
                    </Link>
                </div>

                {/* SLICK SPLIT LAYOUT */}
                <section className="px-6 md:px-12 xl:px-24 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 relative z-10 pointer-events-auto items-start">

                    {/* LEFT: Sticky Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="sticky top-32 relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                    >
                        <img src={coral.image} alt={coral.name} className="w-full h-full object-cover" />
                        {coral.tag && (
                            <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-zinc-950/60 border border-white/10 backdrop-blur-xl">
                                <span className="text-xs font-mono uppercase tracking-widest text-white drop-shadow-md">
                                    {coral.tag}
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
                    </motion.div>

                    {/* RIGHT: Scrolling Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col pt-4 lg:pt-12"
                    >
                        <div className="flex flex-wrap gap-3 mb-8">
                            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                                {coral.category}
                            </span>
                            {coral.filterTags?.map((tag: string) => (
                                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black tracking-tighter text-white mb-6 leading-[0.9]">
                            {coral.name}
                        </h1>

                        <p className="text-4xl font-mono font-light text-zinc-300 mb-12">
                            ${coral.price}
                        </p>

                        {/* Dynamic Description */}
                        {coral.description && (
                            <div className="mb-12 border-l border-white/20 pl-6">
                                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                                    {coral.description}
                                </p>
                            </div>
                        )}

                        {/* INQUIRY SECTION */}
                        <div className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-md mt-4">
                            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-[0.3em] mb-4">Acquisition</h3>
                            <p className="text-zinc-300 font-light leading-relaxed mb-8 text-sm">
                                To ensure the highest level of care, all acquisitions are handled directly. Reach out via your preferred method below with the name of this piece to secure it.
                            </p>

                            <div className="flex flex-col gap-1">
                                <a href="https://instagram.com/rodsandreefs" target="_blank" className="flex justify-between items-center group border-b border-white/5 py-4 hover:border-purple-500/50 transition-colors cursor-none">
                                    <span className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-400 group-hover:text-purple-400 transition-colors">Instagram</span>
                                    <span className="text-zinc-600 group-hover:text-purple-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 duration-300">↗</span>
                                </a>
                                <a href="https://facebook.com/profile.php?id=100088449560840" target="_blank" className="flex justify-between items-center group border-b border-white/5 py-4 hover:border-blue-500/50 transition-colors cursor-none">
                                    <span className="text-sm font-mono uppercase tracking-[0.2em] text-zinc-400 group-hover:text-blue-400 transition-colors">Facebook</span>
                                    <span className="text-zinc-600 group-hover:text-blue-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 duration-300">↗</span>
                                </a>

                            </div>
                        </div>

                        <div className="mt-12 flex flex-col gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-loose">
                            <p>• Local pickup available in north Alabama.</p>
                            <p>• Next Day Air shipping available.</p>
                        </div>
                    </motion.div>

                </section>
            </main>
        </ReactLenis>
    );
}