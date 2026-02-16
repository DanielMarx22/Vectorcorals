"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import LightPillar from "@/components/LightPillar";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";
import ScrollVelocity from "@/components/ScrollVelocity";
import Particles from "@/components/Particles";
import FishCursor from "@/components/FishCursor";
import { ReactLenis } from 'lenis/react';

export default function Home() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const particlesRef = useRef(null);
  const lightPillarRef = useRef(null);

  // --- ONLY RUN HEAVY COMPONENTS WHEN THEY ARE NEAR THE VIEWPORT ---
  // LightPillar: huge element, disable when far out of view (margin negative)
  const isLightPillarInView = useInView(lightPillarRef, {
    once: false,
    amount: 0,
    margin: "-50% 0px -50% 0px"  // only render when within 50% of viewport top/bottom
  });

  // Particles: only render when the section is visible
  const isParticlesInView = useInView(particlesRef, { once: false, amount: 0.1 });

  // --- SMOOTH SCROLL PROGRESS (prevents jank) ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });

  // --- SHOWCASE ANIMATIONS (corrected: image starts fully visible) ---
  const scale = useTransform(smoothProgress, [0, 0.6, 1], [1, 1.3, 1.3]);
  const imageOpacity = useTransform(smoothProgress, [0, 0.6, 0.85, 1], [1, 1, 0, 0]); // No initial fade‑in
  const bgOpacity = useTransform(smoothProgress, [0, 0.15, 1], [0, 1, 1]);
  const footerOpacity = useTransform(smoothProgress, [0.75, 0.9, 1], [0, 1, 1]);
  const footerY = useTransform(smoothProgress, [0.75, 0.9, 1], [50, 0, 0]);

  // --- VIDEO PARALLAX (smoothed) ---
  const { scrollYProgress: videoScrollRaw } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });
  const videoScroll = useSpring(videoScrollRaw, { damping: 20, stiffness: 100 });
  const videoY = useTransform(videoScroll, [0, 1], ["-15%", "15%"]);

  return (
    <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true }}>
      <main className="bg-zinc-950 text-slate-50 selection:bg-purple-500/30 cursor-none relative">

        <FishCursor />

        {/* COMBINED HERO & ETHOS WRAPPER */}
        <div className="relative w-full overflow-hidden">

          {/* Background grid – always visible, cheap */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

          {/* LIGHT PILLAR – only active when near viewport */}
          <div ref={lightPillarRef} className="absolute -top-[100vh] left-0 w-full h-[300vh] z-0 pointer-events-none">
            {isLightPillarInView && <LightPillar />}
          </div>

          {/* BOTTOM FADE TO BLACK */}
          <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-b from-transparent via-zinc-950/90 to-zinc-950 z-[1]" />

          {/* 1. THE SURFACE */}
          <section className="relative h-screen w-full flex flex-col items-center justify-center z-10 border-none">
            <div className="text-center pointer-events-none flex flex-col items-center">
              <p className="tracking-[0.5em] text-xs text-purple-300/70 uppercase mb-6 font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Premium Aquaculture</p>
              <SplitText
                text="VECTOR CORALS"
                className="text-7xl md:text-[9rem] font-black tracking-tighter mix-blend-screen leading-none"
                delay={40}
              />
            </div>
          </section>

          {/* 2. THE ETHOS */}
          <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-24 relative z-10 pb-20 border-none">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none -z-10" />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full max-w-7xl items-center relative z-20"
            >
              <div className="text-left">
                <BlurText
                  text="Sustainably"
                  delay={30}
                  className="text-5xl md:text-7xl font-light text-white block drop-shadow-[0_4px_16px_rgba(0,0,0,1)]"
                />
                <BlurText
                  text="Aquacultured."
                  delay={30}
                  className="text-5xl md:text-7xl font-bold text-white block italic drop-shadow-[0_4px_16px_rgba(0,0,0,1)]"
                />
              </div>
              <div className="border-l border-white/50 pl-8 md:pl-12 py-4">
                <p className="text-white text-lg md:text-xl font-medium leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                  We don't just grow corals. We engineer ecosystems. Cultivating extreme vibration and coloration through uncompromising stability and strict biological patience.
                </p>
              </div>
            </motion.div>
          </section>

        </div> {/* END COMBINED WRAPPER */}

        {/* 3. THE SOURCE */}
        <section ref={videoRef} className="relative h-screen w-full overflow-hidden bg-zinc-950">
          <motion.video
            style={{ y: videoY }}
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-[130%] -top-[15%] object-cover opacity-80 will-change-transform"
            src="/tank-video.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
        </section>

        {/* 4. THE VALUE */}
        <section className="py-32 overflow-hidden bg-zinc-950 relative flex items-center">
          <div className="absolute inset-0 bg-zinc-950 z-10 pointer-events-none [mask-image:linear-gradient(to_right,black_0%,transparent_15%,transparent_85%,black_100%)]" />
          <ScrollVelocity
            texts={["HIGH END LPS • BOUTIQUE QUALITY • RARE MORPHS • "]}
            velocity={45}
            className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-700/60 uppercase italic"
          />
        </section>

        {/* 5. THE SWARM */}
        <section ref={particlesRef} className="relative h-[90vh] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden z-20">
          <div className="absolute inset-0 z-0 opacity-50 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]">
            {isParticlesInView && (
              <Particles
                particleColors={['#a855f7', '#3b82f6']}
                particleCount={150}
                particleSpread={7}
                speed={0.15}
                moveParticlesOnHover={true}
              />
            )}
          </div>
          <div className="z-30 text-center pointer-events-none relative">
            <h2 className="text-sm tracking-[0.4em] font-mono text-zinc-300 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">INTERACTIVE</h2>
            <p className="text-4xl md:text-5xl font-light tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">Disturb the flow.</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-zinc-950 z-10 pointer-events-none" />
        </section>

        {/* 6 & 7. SHOWCASE REVEAL & FOOTER (now with correct image timing) */}
        <section ref={containerRef} className="relative h-[400vh] z-10 will-change-transform">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950">
            <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 z-0 bg-black" />

            {/* TEXT REVEAL / FOOTER LAYER – same scroll‑linked animation, now smooth */}
            <motion.div
              style={{ opacity: footerOpacity, y: footerY }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-between py-24 px-8 pointer-events-auto"
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

            {/* CORAL IMAGE – visible from the start (opacity 1) */}
            <motion.div
              style={{ scale, opacity: imageOpacity }}
              className="absolute inset-0 z-20 w-full h-full origin-center pointer-events-none transform-gpu will-change-[transform,opacity]"
            >
              <div className="w-full h-full bg-[url('/coral-macro.jpg')] bg-cover bg-center bg-no-repeat" />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 pointer-events-none" />
            </motion.div>

          </div>
        </section>

      </main>
    </ReactLenis>
  );
}