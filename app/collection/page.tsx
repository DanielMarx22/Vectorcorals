"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import LightPillar from "@/components/LightPillar";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";
import ScrollVelocity from "@/components/ScrollVelocity";
import Particles from "@/components/Particles";
import { ReactLenis } from 'lenis/react';

export default function Home() {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const ethosRef = useRef(null);

    // --- SMOOTH DIRECTIONAL FISH CURSOR ---
    const fishX = useSpring(-100, { stiffness: 500, damping: 35 });
    const fishY = useSpring(-100, { stiffness: 500, damping: 35 });
    const fishRotation = useSpring(0, { stiffness: 200, damping: 30 });
    const fishScaleY = useSpring(1, { stiffness: 400, damping: 30 });

    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const moveFish = (e: MouseEvent) => {
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;

            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                let currentRotation = fishRotation.get();
                let targetRotation = angle;

                while (targetRotation - currentRotation > 180) targetRotation -= 360;
                while (targetRotation - currentRotation < -180) targetRotation += 360;

                fishRotation.set(targetRotation);

                if (dx < 0) fishScaleY.set(-1);
                else if (dx > 0) fishScaleY.set(1);
            }

            fishX.set(e.clientX - 32);
            fishY.set(e.clientY - 32);
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("mousemove", moveFish, { passive: true });
        return () => window.removeEventListener("mousemove", moveFish);
    }, [fishX, fishY, fishRotation, fishScaleY]);

    // --- ETHOS SCROLL HOOKS ---
    const { scrollYProgress: ethosScroll } = useScroll({
        target: ethosRef,
        offset: ["start 90%", "center center"],
    });
    const ethosOpacity = useTransform(ethosScroll, [0, 1], [0, 1]);
    const ethosY = useTransform(ethosScroll, [0, 1], [40, 0]);

    // --- SHOWCASE ANIMATION HOOKS ---
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 2.5, 2.5]);
    const imageOpacity = useTransform(scrollYProgress, [0, 0.15, 0.6, 0.85, 1], [0, 1, 1, 0, 0]);
    const blurRaw = useTransform(scrollYProgress, [0.6, 0.85, 1], [0, 40, 40]);
    const imageBlur = useMotionTemplate`blur(${blurRaw}px)`;
    const bgOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [0, 1, 1]);
    const footerOpacity = useTransform(scrollYProgress, [0.75, 0.9, 1], [0, 1, 1]);
    const footerY = useTransform(scrollYProgress, [0.75, 0.9, 1], [50, 0, 0]);

    // --- VIDEO PARALLAX HOOK ---
    const { scrollYProgress: videoScroll } = useScroll({
        target: videoRef,
        offset: ["start end", "end start"],
    });
    const videoY = useTransform(videoScroll, [0, 1], ["-15%", "15%"]);

    return (
        <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true }}>
            <main className="bg-zinc-950 text-slate-50 selection:bg-purple-500/30 cursor-none relative">

                {/* REALISTIC CLOWNFISH CURSOR */}
                <motion.div
                    className="fixed top-0 left-0 w-16 h-16 pointer-events-none z-[100] drop-shadow-[0_8px_12px_rgba(0,0,0,0.6)]"
                    style={{ x: fishX, y: fishY, rotate: fishRotation, scaleY: fishScaleY }}
                >
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <defs>
                            <linearGradient id="realFishGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#FF7A00" />
                                <stop offset="100%" stopColor="#B33000" />
                            </linearGradient>
                        </defs>
                        <path d="M 22 22 C 30 10 42 12 46 24" fill="url(#realFishGrad)" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M 24 42 C 30 54 44 50 46 40" fill="url(#realFishGrad)" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M 16 32 L 2 18 C 6 32 6 32 2 46 L 16 32 Z" fill="url(#realFishGrad)" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M 60 32 C 60 16 38 10 16 24 C 12 28 10 30 10 32 C 10 34 12 36 16 40 C 38 54 60 48 60 32 Z" fill="url(#realFishGrad)" stroke="black" strokeWidth="1.5" />
                        <path d="M 46 20 C 52 24 52 40 46 44 C 43 38 43 26 46 20 Z" fill="white" stroke="black" strokeWidth="1.5" />
                        <path d="M 32 16 C 36 20 36 44 32 48 C 28 40 28 24 32 16 Z" fill="white" stroke="black" strokeWidth="1.5" />
                        <path d="M 16 25 C 19 28 19 36 16 39 C 14 35 14 29 16 25 Z" fill="white" stroke="black" strokeWidth="1.5" />
                        <circle cx="52" cy="27" r="2.5" fill="white" stroke="black" strokeWidth="0.5" />
                        <circle cx="52.5" cy="26.5" r="1.5" fill="black" />
                        <circle cx="53" cy="26" r="0.5" fill="white" />
                        <path d="M 36 32 C 44 34 42 42 34 38 Z" fill="url(#realFishGrad)" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                </motion.div>

                {/* COMBINED HERO & ETHOS WRAPPER */}
                <div className="relative w-full overflow-hidden">

                    {/* SHARED BACKGROUND LAYER */}
                    <div className="absolute inset-0 z-0">
                        <LightPillar />
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

                    {/* BOTTOM FADE TO BLACK (Ensures hard transition to video section) */}
                    <div className="absolute inset-x-0 bottom-0 h-[50vh] bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950 z-[1]" />

                    {/* 1. THE SURFACE (Transparent) */}
                    <section className="relative h-screen w-full flex flex-col items-center justify-center z-10">
                        <div className="text-center pointer-events-none flex flex-col items-center">
                            <p className="tracking-[0.5em] text-xs text-purple-300/70 uppercase mb-6 font-mono">Premium Aquaculture</p>
                            <SplitText
                                text="VECTOR CORALS"
                                className="text-7xl md:text-[9rem] font-black tracking-tighter mix-blend-screen leading-none"
                                delay={40}
                            />
                        </div>
                    </section>

                    {/* 2. THE ETHOS (Transparent background allows light to show through) */}
                    <section ref={ethosRef} className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-24 relative z-10 pb-20">
                        <motion.div
                            style={{ opacity: ethosOpacity, y: ethosY }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full max-w-7xl items-center"
                        >
                            <div className="text-left">
                                <BlurText text="Sustainably" delay={30} className="text-5xl md:text-7xl font-light text-zinc-400 block" />
                                <BlurText text="Aquacultured." delay={30} className="text-5xl md:text-7xl font-bold text-zinc-100 block italic" />
                            </div>
                            <div className="border-l border-white/10 pl-8 md:pl-12 py-4">
                                <p className="text-zinc-400 text-lg md:text-xl font-light leading-relaxed drop-shadow-md">
                                    We don't just grow corals. We engineer ecosystems. Cultivating extreme vibration and coloration through uncompromising stability and strict biological patience.
                                </p>
                            </div>
                        </motion.div>
                    </section>

                </div> {/* END COMBINED WRAPPER */}

                {/* 3. THE SOURCE */}
                <section ref={videoRef} className="relative h-screen w-full overflow-hidden bg-zinc-950 border-y border-white/5">
                    <motion.video
                        style={{ y: videoY }}
                        autoPlay loop muted playsInline
                        className="absolute inset-0 w-full h-[130%] -top-[15%] object-cover opacity-80 will-change-transform"
                        src="/tank-video.mp4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
                </section>

                {/* 4. THE VALUE */}
                <section className="py-32 overflow-hidden bg-zinc-950 relative">
                    <div className="absolute inset-0 bg-zinc-950/80 z-10 pointer-events-none [mask-image:linear-gradient(to_right,black,transparent_20%,transparent_80%,black)]" />
                    <ScrollVelocity
                        texts={["HIGH END LPS • BOUTIQUE QUALITY • RARE MORPHS • "]}
                        velocity={45}
                        className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-800/80 uppercase italic"
                    />
                </section>

                {/* 5. THE SWARM */}
                <section className="relative h-[90vh] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden z-20 border-t border-white/5">
                    <div className="absolute inset-0 z-0 opacity-40">
                        <Particles
                            particleColors={['#a855f7', '#3b82f6']}
                            particleCount={500}
                            particleSpread={7}
                            speed={0.15}
                            moveParticlesOnHover={true}
                        />
                    </div>
                    <div className="z-10 text-center pointer-events-none mix-blend-difference">
                        <h2 className="text-sm tracking-[0.4em] font-mono text-zinc-400 mb-4">INTERACTIVE</h2>
                        <p className="text-4xl md:text-5xl font-light tracking-wide text-zinc-200">Disturb the flow.</p>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-zinc-950 z-[1] pointer-events-none" />
                </section>

                {/* 6 & 7. SHOWCASE REVEAL & FOOTER */}
                <section ref={containerRef} className="relative h-[400vh] z-10">
                    <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950">
                        <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 z-0 bg-black" />

                        <motion.div
                            style={{ opacity: footerOpacity, y: footerY }}
                            className="absolute inset-0 z-0 flex flex-col items-center justify-between py-24 px-8 pointer-events-auto"
                        >
                            <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-4xl">
                                <p className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase mb-8">Ready to Collect</p>
                                <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter mb-12 text-zinc-100 leading-none">Acquire.</h2>
                                <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full justify-center border-t border-white/10 pt-12">
                                    <a href="mailto:contact@vectorcorals.com" className="group flex flex-col items-center">
                                        <span className="text-sm font-mono text-zinc-500 mb-2 group-hover:text-purple-400 transition-colors">INQUIRIES</span>
                                        <span className="text-2xl font-light text-zinc-300 group-hover:text-white transition-colors">contact@vectorcorals.com</span>
                                    </a>
                                    <button className="group flex flex-col items-center">
                                        <span className="text-sm font-mono text-zinc-500 mb-2 group-hover:text-blue-400 transition-colors">PAYMENT</span>
                                        <span className="text-2xl font-light text-zinc-300 group-hover:text-white transition-colors">Venmo QR</span>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full flex justify-between text-xs font-mono text-zinc-600 uppercase tracking-widest mt-auto">
                                <span>© {new Date().getFullYear()} Vector Corals</span>
                                <span>Tuscaloosa, AL</span>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ scale, opacity: imageOpacity, filter: imageBlur }}
                            className="absolute inset-0 z-10 w-full h-full origin-center pointer-events-none will-change-transform"
                        >
                            <img src="/coral-macro.jpg" alt="Premium Coral Focus" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
                        </motion.div>
                    </div>
                </section>

            </main>
        </ReactLenis>
    );
}