"use client";

import { ReactLenis } from "lenis/react";
import FishCursor from "@/components/FishCursor";
import Navbar from "@/components/Navbar";
import SplitText from "@/components/SplitText";
import { motion } from "framer-motion";

export default function About() {
    return (
        <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true }}>
            <main className="min-h-screen bg-zinc-950 text-slate-50 selection:bg-purple-500/30 relative overflow-x-hidden pb-32">
                <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />
                <FishCursor />
                <Navbar />

                {/* --- HEADER --- */}
                <section className="pt-48 pb-16 px-6 md:px-12 xl:px-24 flex flex-col items-center text-center relative z-10">
                    <p className="tracking-[0.5em] text-xs text-purple-300/70 uppercase mb-6 font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        The Cultivator
                    </p>
                    <SplitText
                        text="BEHIND THE GLASS"
                        delay={30}
                        className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter mix-blend-screen leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]"
                    />
                </section>

                {/* --- CONTENT GRID --- */}
                <section className="px-6 md:px-12 xl:px-24 max-w-5xl mx-auto relative z-10 pointer-events-auto mt-12">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col gap-16"
                    >
                        {/* Block 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-12 border-t border-white/10 pt-12">
                            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">The Origin</h2>
                            <div className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed">
                                <p>
                                    My name is Daniel, and I am currently a Senior studying Computer Science at the University of Alabama.
                                </p>
                                <p className="mt-4">
                                    I built Vector Corals primarily as a canvas to showcase my frontend programming skills and out of a pure enjoyment for web design. While I am highly passionate about the reefing hobby, selling corals is entirely secondary to the engineering behind this platform.
                                </p>
                            </div>
                        </div>

                        {/* Block 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-12 border-t border-white/10 pt-12">
                            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">The Systems</h2>
                            <div className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed">
                                <p>
                                    My primary focus is on cultivating high-end Zoanthids and Mushrooms. I currently run and maintain two distinct systems to do this.
                                </p>
                                <p className="mt-4">
                                    My home system in Huntsville is highly automated, monitored, and controlled via Neptune Apex. Conversely, my local system here in Tuscaloosa is managed with a much more hands-on, manual testing approach to reefkeeping.
                                </p>
                            </div>
                        </div>

                        {/* Block 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-12 border-t border-white/10 pt-12">
                            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">The Philosophy</h2>
                            <div className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed">
                                <p>
                                    My pricing model is simple: it is based entirely on my personal attachment and current inventory. If a piece is abundant and I'm ready to move it, it will be priced below market value. If it is a piece I have a limited amount of, it is priced higher.
                                </p>
                                <p className="mt-4 text-white font-medium">
                                    That being said, everything has a price.
                                </p>
                                <p className="mt-4">
                                    Prices are usually negotiable, and I am always willing to work out custom bundle deals. I offer local pickup around the Huntsville and Tuscaloosa areas, and I can arrange overnight shipping for an additional fee.
                                </p>


                            </div>
                        </div>

                    </motion.div>
                </section>

            </main>
        </ReactLenis>
    );
}