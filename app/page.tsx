"use client";

import { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import ColorBends from "@/components/ColorBends";
import SplitText from "@/components/SplitText";
import BlurText from "@/components/BlurText";
import ScrollVelocity from "@/components/ScrollVelocity";
import StoryScroll from "@/components/StoryScroll";
import FishCursor from "@/components/FishCursor";
import { ReactLenis } from "lenis/react";
import GradientText from "@/components/GradientText";
import GlassSurface from "@/components/GlassSurface";
import Navbar from "@/components/Navbar";

export default function Home() {
  const containerRef = useRef(null);
  const colorBendsRef = useRef(null);

  const isColorBendsInView = useInView(colorBendsRef, {
    once: false,
    amount: 0,
    margin: "200% 0px 200% 0px",
  });

  const MemoizedColorBends = useMemo(() => <ColorBends />, []);

  // --- FOOTER ANIMATION TIMELINE ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  const scale = useTransform(smoothProgress, [0, 0.35, 1], [1, 1.3, 1.3]);
  const imageOpacity = useTransform(smoothProgress, [0, 0.35, 0.6, 1], [1, 1, 0, 0]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.1, 1], [0, 1, 1]);
  const footerOpacity = useTransform(smoothProgress, [0.5, 0.7, 1], [0, 1, 1]);
  const footerY = useTransform(smoothProgress, [0.5, 0.7, 1], [50, 0, 0]);

  return (
    <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true }}>
      <main className="bg-zinc-950 text-slate-50 selection:bg-purple-500/30 relative">
        <style dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }} />
        <FishCursor />

        <Navbar />

        {/* --- EXPANDED TOP WRAPPER --- */}
        {/* FIXED: Removed overflow-hidden from this relative wrapper to allow sticky positioning */}
        <div className="relative w-full z-0">

          <div
            ref={colorBendsRef}
            className="absolute -top-[100vh] left-0 w-full h-[290vh] z-0 pointer-events-none transform-gpu will-change-transform [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
            style={{ backfaceVisibility: "hidden", perspective: 1000 }}
          >
            {isColorBendsInView && MemoizedColorBends}
          </div>

          <section className="relative h-screen w-full flex flex-col items-center justify-center z-10 border-none">
            <div className="text-center pointer-events-none flex flex-col items-center">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="tracking-[0.5em] text-xs text-purple-300/70 uppercase mb-6 font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                Premium Aquaculture
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(15px)", y: 20 }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0.15] }}
                  transition={{ duration: 3, delay: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-[100%] z-0"
                />
                <GradientText
                  colors={["#00bfff", "#1100ff", "#f200ff"]}
                  animationSpeed={8}
                  showBorder={false}
                  className="text-9xl md:text-[9rem] font-black tracking-tighter"
                >
                  Vector Corals
                </GradientText>
              </motion.div>
            </div>
          </section>

          <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-12 xl:px-24 relative z-10 pb-20 border-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 xl:gap-24 w-full max-w-7xl items-center relative z-20"
            >
              <div className="text-left min-w-0 pr-4 lg:pr-8">
                <BlurText text="Sustainably" delay={30} className="text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-7xl font-light text-white block drop-shadow-[0_4px_16px_rgba(0,0,0,1)] leading-tight" />
                <BlurText text="Aquacultured." delay={30} className="text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-7xl font-bold text-white block italic drop-shadow-[0_4px_16px_rgba(0,0,0,1)] leading-tight" />
              </div>
              <div className="border-l border-white/50 pl-6 sm:pl-8 lg:pl-12 py-2 lg:py-4">
                <p className="text-white text-base sm:text-lg xl:text-xl font-medium leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                  We don't just grow corals. We engineer ecosystems. By combining modern technology with the life inside the reef ecosystem, we cultivate vibration and coloration through uncompromising long-term stability and biological patience.
                </p>
              </div>
            </motion.div>
          </section>

          {/* --- THE SOURCES: STICKY STACK WRAPPER --- */}
          {/* FIXED: Changed to bg-transparent and added -mt-[15vh] so it seamlessly overlaps and blurs into the section above */}
          <div className="relative w-full z-10 bg-transparent -mt-[15vh]">

            {/* STICKY GLASS LABEL */}
            {/* Wrapped in an absolute inset-0 div so it tracks the exact height of the 3 sections below */}
            <div className="absolute inset-0 pointer-events-none z-50">
              <div className="sticky top-32 flex justify-center w-full">
                <GlassSurface className="px-10 py-4 rounded-full bg-zinc-900/40 border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center justify-center">
                  <span className="text-sm font-black font-mono uppercase tracking-[0.5em] text-white drop-shadow-lg pl-2">
                    The Sources
                  </span>
                </GlassSurface>
              </div>
            </div>

            {/* 1. VIDEO LAYER */}
            <div className="relative h-[200vh] w-full z-10">
              <div className="sticky top-0 h-screen w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_100%)]">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" src="/tank-video.mp4" />
              </div>
            </div>

            {/* 2. IMAGE 1 LAYER */}
            <div className="relative h-[200vh] w-full -mt-[100vh] z-20">
              <div className="sticky top-0 h-screen w-full bg-zinc-950 flex items-center justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
                <img src="/8gallonfront.JPEG" alt="Source Image 1" className="w-full h-full object-contain md:object-cover" />
              </div>
            </div>

            {/* 3. IMAGE 2 LAYER */}
            <div className="relative h-[200vh] w-full -mt-[100vh] z-30">
              <div className="sticky top-0 h-screen w-full bg-zinc-950 flex items-center justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
                <img src="/cubefront.JPEG" alt="Source Image 2" className="w-full h-full object-contain md:object-cover" />
              </div>
            </div>

            {/* 4. IMAGE 3 LAYER (Final Layer) */}
            <div className="relative h-screen w-full -mt-[100vh] z-40">
              <div className="sticky top-0 h-screen w-full bg-zinc-950 flex items-center justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
                <img src="/cubetopdown.JPEG" alt="Source Image 3" className="w-full h-full object-contain md:object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-b from-transparent to-zinc-950 pointer-events-none z-50" />
              </div>
            </div>

          </div>
        </div>

        <section className="py-32 overflow-hidden bg-zinc-950 relative flex items-center z-10">
          <div className="absolute inset-0 bg-zinc-950 z-10 pointer-events-none [mask-image:linear-gradient(to_right,black_0%,transparent_15%,transparent_85%,black_100%)]" />
          <ScrollVelocity
            texts={["HIGH END ZOAS, MUSHROOMS, EUPHYLLIA, AND MORE • "]}
            velocity={90}
            className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-700/60 uppercase italic"
          />
        </section>

        <StoryScroll />

        {/* --- FOOTER SECTION --- */}
        <section ref={containerRef} className="relative h-[250vh] z-10 will-change-transform">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950">
            <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 z-0 bg-black" />

            <motion.div style={{ opacity: footerOpacity, y: footerY }} className="absolute inset-0 z-10 flex flex-col items-center justify-between py-24 px-8 pointer-events-auto">
              <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-4xl">
                <p className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase mb-8">Ready to Collect</p>
                <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter mb-12 text-zinc-100 leading-none">Inquire.</h2>

                {/* SOCIAL LINKS */}
                <div className="flex flex-row gap-12 md:gap-24 w-full justify-center border-t border-white/10 pt-12">
                  <a href="https://instagram.com/rodsandreefs" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center cursor-none">
                    <div className="p-5 rounded-full bg-zinc-900/30 border border-white/5 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-500 mb-4">
                      {/* Instagram SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 transition-colors duration-500">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-purple-400 transition-colors uppercase tracking-[0.2em]">Instagram</span>
                  </a>

                  <a href="https://facebook.com/profile.php?id=100088449560840" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center cursor-none">
                    <div className="p-5 rounded-full bg-zinc-900/30 border border-white/5 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 mb-4">
                      {/* Facebook SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-zinc-400 group-hover:text-blue-400 transition-colors duration-500">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">Facebook</span>
                  </a>
                </div>

              </div>
              <div className="w-full flex justify-between text-xs font-mono text-zinc-600 uppercase tracking-widest mt-auto">
                <span>© {new Date().getFullYear()} Vector Corals</span>
                <span>Tuscaloosa, AL</span>
              </div>
            </motion.div>

            <motion.div style={{ scale, opacity: imageOpacity }} className="absolute inset-0 z-20 w-full h-full origin-center pointer-events-none transform-gpu will-change-[transform,opacity]">
              <div className="w-full h-full bg-[url('/jawbreaker.JPEG')] bg-cover bg-center bg-no-repeat" />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 pointer-events-none" />
            </motion.div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
}