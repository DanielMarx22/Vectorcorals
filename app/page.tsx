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

export default function Home() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
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

  const imageOpacity = useTransform(
    smoothProgress,
    [0, 0.35, 0.6, 1],
    [1, 1, 0, 0],
  );

  const bgOpacity = useTransform(smoothProgress, [0, 0.1, 1], [0, 1, 1]);

  const footerOpacity = useTransform(smoothProgress, [0.5, 0.7, 1], [0, 1, 1]);
  const footerY = useTransform(smoothProgress, [0.5, 0.7, 1], [50, 0, 0]);

  // --- VIDEO ANIMATION ---
  const { scrollYProgress: videoScrollRaw } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });
  const videoScroll = useSpring(videoScrollRaw, {
    damping: 20,
    stiffness: 100,
  });
  const videoY = useTransform(videoScroll, [0, 1], ["-15%", "15%"]);

  return (
    <ReactLenis root options={{ lerp: 0.04, duration: 1.5, smoothWheel: true }}>
      <main className="bg-zinc-950 text-slate-50 selection:bg-purple-500/30 relative">
        {/* Bulletproof CSS rule to ensure no browser cursor EVER overrides your fish */}
        <style
          dangerouslySetInnerHTML={{ __html: `* { cursor: none !important; }` }}
        />

        <FishCursor />

        {/* --- FLOATING NAVBAR --- */}
        <motion.div
          initial={{ y: -50, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="fixed top-8 left-1/2 z-50 pointer-events-auto"
        >
          <nav className="flex items-center gap-16 px-10 py-4 rounded-full bg-zinc-950/40 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-colors hover:bg-zinc-900/60">
            <a
              href="/"
              className="text-[11px] font-mono text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all uppercase tracking-[0.2em]"
            >
              Home
            </a>
            <a
              href="/collection"
              className="text-[11px] font-mono text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all uppercase tracking-[0.2em]"
            >
              Collection
            </a>
            <a
              href="mailto:contact@vectorcorals.com"
              className="text-[11px] font-mono text-zinc-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all uppercase tracking-[0.2em]"
            >
              Contact
            </a>
          </nav>
        </motion.div>

        {/* --- EXPANDED TOP WRAPPER --- */}
        <div className="relative w-full overflow-hidden z-0">
          {/* --- COLOR BENDS BACKGROUND --- */}
          <div
            ref={colorBendsRef}
            className="absolute -top-[100vh] left-0 w-full h-[290vh] z-0 pointer-events-none transform-gpu will-change-transform [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
            style={{ backfaceVisibility: "hidden", perspective: 1000 }}
          >
            {isColorBendsInView && MemoizedColorBends}
          </div>

          {/* --- HERO SECTION --- */}
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

              {/* Cinematic Flare Reveal */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  filter: "blur(15px)",
                  y: 20,
                }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 1.4,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1,
                }}
                className="relative"
              >
                {/* Breathing purple aura behind the title */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0.15] }}
                  transition={{
                    duration: 3,
                    delay: 0.8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-[100%] z-0"
                />
                <GradientText
                  colors={["#00bfff", "#1100ff", "#f200ff"]}
                  animationSpeed={8}
                  showBorder={false}
                  className="text-9xl md:text-[9rem] font-black tracking-tighter "
                >
                  Vector Corals
                </GradientText>
              </motion.div>
            </div>
          </section>

          {/* --- SUSTAINABLY SECTION --- */}
          <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-12 xl:px-24 relative z-10 pb-20 border-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              // FIXED: Changed to lg:grid-cols-[1.3fr_1fr] to give the long title more space, and delayed the split to 'lg' screens.
              className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 xl:gap-24 w-full max-w-7xl items-center relative z-20"
            >
              {/* FIXED: Added min-w-0 to prevent grid blowout, and added right padding for a safety buffer */}
              <div className="text-left min-w-0 pr-4 lg:pr-8">
                <BlurText
                  text="Sustainably"
                  delay={30}
                  // FIXED: Scaled typography gracefully across breakpoints
                  className="text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-7xl font-light text-white block drop-shadow-[0_4px_16px_rgba(0,0,0,1)] leading-tight"
                />
                <BlurText
                  text="Aquacultured."
                  delay={30}
                  className="text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-7xl font-bold text-white block italic drop-shadow-[0_4px_16px_rgba(0,0,0,1)] leading-tight"
                />
              </div>
              <div className="border-l border-white/50 pl-6 sm:pl-8 lg:pl-12 py-2 lg:py-4">
                <p className="text-white text-base sm:text-lg xl:text-xl font-medium leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                  We don't just grow corals. We engineer ecosystems. By
                  combining modern technology with the life inside the reef
                  ecosystem, we cultivate vibration and coloration through
                  uncompromising long-term stability and biological patience.
                </p>
              </div>
            </motion.div>
          </section>

          {/* --- VIDEO SECTION --- */}
          <section
            ref={videoRef}
            // The container section remains the anchor point for the transition
            className="relative h-screen w-full bg-transparent z-10 [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_85%,transparent_100%)]"
          >
            {/* WRAPPER: Increased height and adjusted offset so the label is visible immediately */}
            <motion.div
              style={{ y: videoY }}
              className="absolute inset-0 w-full h-[160%] -top-[25%] will-change-transform"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-100"
                src="/tank-video.mp4"
              />

              {/* --- GLASS LABEL --- */}
              <div className="absolute top-[22%] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <GlassSurface className="px-0 py-4 rounded-full bg-zinc-900/40 border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center justify-center">
                  <span className="text-sm font-black font-mono uppercase tracking-[0.5em] text-white drop-shadow-lg pl-2">
                    The Source
                  </span>
                </GlassSurface>
              </div>
            </motion.div>

            {/* Blends the bottom of the video cleanly into the solid black ticker section */}
            <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-b from-transparent to-zinc-950 pointer-events-none z-20" />
          </section>
        </div>

        <section className="py-32 overflow-hidden bg-zinc-950 relative flex items-center z-10">
          <div className="absolute inset-0 bg-zinc-950 z-10 pointer-events-none [mask-image:linear-gradient(to_right,black_0%,transparent_15%,transparent_85%,black_100%)]" />
          <ScrollVelocity
            texts={["HIGH END ZOAS, MUSHROOMS, EUPHYLLIA, AND MORE • "]}
            velocity={90}
            className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-700/60 uppercase italic"
          />
        </section>

        {/* --- NEW PARALLAX STORY SECTION --- */}
        <StoryScroll />

        {/* --- FOOTER SECTION --- */}
        <section
          ref={containerRef}
          className="relative h-[250vh] z-10 will-change-transform"
        >
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950">
            <motion.div
              style={{ opacity: bgOpacity }}
              className="absolute inset-0 z-0 bg-black"
            />

            <motion.div
              style={{ opacity: footerOpacity, y: footerY }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-between py-24 px-8 pointer-events-auto"
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center w-full max-w-4xl">
                <p className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase mb-8">
                  Ready to Collect
                </p>
                <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter mb-12 text-zinc-100 leading-none">
                  Acquire.
                </h2>
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full justify-center border-t border-white/10 pt-12">
                  <a
                    href="mailto:contact@vectorcorals.com"
                    className="group flex flex-col items-center"
                  >
                    <span className="text-sm font-mono text-zinc-500 mb-2 group-hover:text-purple-400 transition-colors">
                      INQUIRIES
                    </span>
                    <span className="text-2xl font-light text-zinc-300 group-hover:text-white transition-colors">
                      contact@vectorcorals.com
                    </span>
                  </a>
                </div>
              </div>
              <div className="w-full flex justify-between text-xs font-mono text-zinc-600 uppercase tracking-widest mt-auto">
                <span>© {new Date().getFullYear()} Vector Corals</span>
                <span>Tuscaloosa, AL</span>
              </div>
            </motion.div>

            <motion.div
              style={{ scale, opacity: imageOpacity }}
              className="absolute inset-0 z-20 w-full h-full origin-center pointer-events-none transform-gpu will-change-[transform,opacity]"
            >
              <div className="w-full h-full bg-[url('/jawbreaker.JPEG')] bg-cover bg-center bg-no-repeat" />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 pointer-events-none" />
            </motion.div>
          </div>
        </section>
      </main>
    </ReactLenis>
  );
}
