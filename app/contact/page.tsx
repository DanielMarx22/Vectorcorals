"use client";

import { ReactLenis } from "lenis/react";
import FishCursor from "@/components/FishCursor";
import Navbar from "@/components/Navbar";
import SplitText from "@/components/SplitText";
import { motion } from "framer-motion";

export default function Contact() {
    return (
        <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true }}>
            <main className="min-h-screen bg-zinc-950 text-slate-50 selection:bg-purple-500/30 relative overflow-x-hidden">
                <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />
                <FishCursor />
                <Navbar />

                <section className="pt-48 pb-24 px-6 md:px-12 xl:px-24 flex flex-col items-center text-center min-h-screen justify-center relative z-10">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="tracking-[0.5em] text-xs text-purple-300/70 uppercase mb-6 font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    >
                        Direct Line
                    </motion.p>

                    <SplitText
                        text="REACH OUT"
                        delay={30}
                        className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter mix-blend-screen leading-none drop-shadow-[0_0_25px_rgba(255,255,255,0.1)] mb-8"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-zinc-400 font-light max-w-xl text-lg mb-16"
                    >
                        For bundle deals, shipping quotes, or questions about specific pieces, send a direct message on your preferred platform.
                    </motion.p>

                    <div className="grid grid-cols-2 gap-3 md:gap-6 w-full max-w-4xl relative z-20 pointer-events-auto">

                        {/* INSTAGRAM CARD */}
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            href="https://instagram.com/rodsandreefs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex flex-col items-center justify-center p-6 sm:p-16 rounded-3xl bg-zinc-900/20 border border-white/5 overflow-hidden backdrop-blur-md hover:border-purple-500/40 transition-all duration-500 cursor-none"
                        >
                            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-700 blur-2xl" />
                            <div className="relative z-10 p-4 sm:p-5 rounded-full bg-zinc-950/50 border border-white/10 group-hover:scale-110 group-hover:border-purple-500/50 transition-all duration-500 mb-4 sm:mb-6 shadow-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10 text-zinc-400 group-hover:text-purple-400 transition-colors duration-500"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                            </div>
                            <h3 className="relative z-10 text-lg sm:text-2xl font-black tracking-tight text-white mb-1 sm:mb-2">Instagram</h3>
                            <p className="relative z-10 text-[9px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest group-hover:text-purple-300 transition-colors">RodsandReefs</p>
                        </motion.a>

                        {/* FACEBOOK CARD */}
                        <motion.a
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            href="https://facebook.com/profile.php?id=100088449560840"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex flex-col items-center justify-center p-6 sm:p-16 rounded-3xl bg-zinc-900/20 border border-white/5 overflow-hidden backdrop-blur-md hover:border-blue-500/40 transition-all duration-500 cursor-none"
                        >
                            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-700 blur-2xl" />
                            <div className="relative z-10 p-4 sm:p-5 rounded-full bg-zinc-950/50 border border-white/10 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500 mb-4 sm:mb-6 shadow-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 sm:w-10 sm:h-10 text-zinc-400 group-hover:text-blue-400 transition-colors duration-500"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </div>
                            <h3 className="relative z-10 text-lg sm:text-2xl font-black tracking-tight text-white mb-1 sm:mb-2">Facebook</h3>
                            <p className="relative z-10 text-[9px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest group-hover:text-blue-300 transition-colors">Daniel Marx</p>
                        </motion.a>

                    </div>
                </section>
            </main>
        </ReactLenis>
    );
}