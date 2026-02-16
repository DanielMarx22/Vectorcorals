"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

// --- 1. MASTER IMAGE LIST ---
const GALLERY_IMAGE_SOURCES = [
  "/bigjawbreaker.JPEG",
  "/candycrush.JPEG",
  "/deadpool.JPEG",
  "/exosphere.JPEG",
  "/godzilla.JPEG",
  "/littleogbounce.JPEG",
  "/magiccarpet.JPEG",
  "/ogbounce.JPEG",
];

interface GalleryItemProps {
  id: number;
  src: string;
  left: string;
  top: string;
  width: string;
  scale: number;
  speed: number;
  darken: number;
  aspect: string;
}

// --- 2. HIGH-SPEED, DENSE GALLERY GENERATOR ---
const generateGallery = (sources: string[]) => {
  // 48 images to ensure the 60% scroll window is packed with content
  const extendedSources = Array(8).fill(sources).flat().slice(0, 48);

  return extendedSources.map((src, index) => {
    // Keep images large (scale 0.6 to 1.0)
    const scale = Math.random() * 0.4 + 0.6;

    // Strict 3-Lane System prevents horizontal overlap
    const col = index % 3;
    const baseLeft = col === 0 ? 5 : col === 1 ? 38 : 72;

    return {
      id: index,
      src,
      left: `${baseLeft + Math.random() * 4}%`,

      // Spawn them deep down a 1000vh virtual track so they don't run out
      top: `${index * 20 + Math.random() * 10}vh`,

      // Large widths (18vw to 30vw)
      width: `${scale * 16 + 14}vw`,

      // HIGH SPEED: They will travel between 700vh and 1200vh upwards
      // over the course of the scroll, making them zip by rapidly.
      speed: scale * 600 + 600,

      darken: 1 - scale + 0.1,
      aspect: Math.random() > 0.5 ? "16/9" : "3/4",
    };
  });
};

const FloatingImage = ({ img, progress }: { img: GalleryItemProps, progress: MotionValue<number> }) => {
  // Uses explicit vh values for guaranteed, fast travel distances
  const y = useTransform(progress, [0, 1], ["0vh", `-${img.speed}vh`]);

  return (
    <motion.div
      style={{ left: img.left, top: img.top, width: img.width, aspectRatio: img.aspect, y }}
      className="absolute overflow-hidden rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] pointer-events-none transform-gpu will-change-transform"
    >
      <img src={img.src} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black" style={{ opacity: img.darken }} />
    </motion.div>
  );
};

export default function StoryScroll() {
  const containerRef = useRef(null);

  // Hydration Fix
  const [isMounted, setIsMounted] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItemProps[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setGalleryItems(generateGallery(GALLERY_IMAGE_SOURCES));
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  // --- PERFECTLY PACED 600vh TIMELINE ---

  // 1. HERO ENTRANCE (Smoothed out!)
  // Instead of snapping in quickly, it starts drifting up from the very beginning (25%) 
  // and slowly locks into the center at 60%. This makes it feel heavy and majestic.
  const heroTop = useTransform(smoothProgress, [0.25, 0.6], ["150%", "50%"]);

  // 2. HERO HORIZONTAL ZOOM (60% to 70%)
  const heroWidth = useTransform(smoothProgress, [0.6, 0.7], ["25vw", "100vw"]);
  const heroHeight = useTransform(smoothProgress, [0.6, 0.7], ["45vh", "110vh"]);
  const heroRadius = useTransform(smoothProgress, [0.6, 0.7], ["24px", "0px"]);

  // Fade out gallery background just before the zoom finishes
  const galleryOpacity = useTransform(smoothProgress, [0.65, 0.7], [1, 0]);

  // 3. VERTICAL PAN & OVERLAY (70% to 100%)
  const imagePanY = useTransform(smoothProgress, [0.7, 1], ["0%", "-30%"]);
  const overlayOpacity = useTransform(smoothProgress, [0.7, 0.75], [0, 0.6]);

  // 4. TEXT PHASES (Your exact working 3-page configuration)
  const text1Opacity = useTransform(smoothProgress, [0.70, 0.72, 0.78, 0.80], [0, 1, 1, 0]);
  const text2Opacity = useTransform(smoothProgress, [0.80, 0.82, 0.88, 0.90], [0, 1, 1, 0]);
  const text3Opacity = useTransform(smoothProgress, [0.90, 0.92, 1, 1], [0, 1, 1, 1]);

  return (
    // 600vh ensures the overall scroll speed perfectly matches ReactLenis
    <section ref={containerRef} className="relative h-[600vh] bg-zinc-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* --- LAYER 1: THE FLOATING GALLERY --- */}
        {isMounted && (
          <motion.div style={{ opacity: galleryOpacity }} className="absolute inset-0 z-0">
            {galleryItems.map((img) => (
              <FloatingImage key={img.id} img={img} progress={smoothProgress} />
            ))}
          </motion.div>
        )}

        {/* --- LAYER 2: THE HERO IMAGE --- */}
        <motion.div
          className="absolute z-10 flex items-center justify-center pointer-events-none shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          style={{
            top: heroTop,
            left: "50%",
            x: "-50%",
            y: "-50%",
            width: heroWidth,
            height: heroHeight,
            borderRadius: heroRadius,
            overflow: "hidden"
          }}
        >
          <div className="w-full h-full relative bg-zinc-900 pointer-events-auto">
            {/* The Image panning internally */}
            <motion.img
              src="/coral-macro.jpg"
              style={{ y: imagePanY }}
              className="absolute top-0 left-0 w-full h-[150%] object-cover transform-gpu"
            />
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute inset-0 bg-black pointer-events-none"
            />
          </div>
        </motion.div>

        {/* --- LAYER 3: TEXT CONTENT --- */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6">

          <motion.div style={{ opacity: text1Opacity }} className="absolute text-center max-w-4xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-zinc-400 font-mono">01</span>
              <span className="h-[1px] w-12 bg-zinc-600"></span>
              <span className="text-white font-bold tracking-widest uppercase">VISION</span>
            </div>
            <h2 className="text-5xl md:text-[7rem] font-bold text-white mb-6 tracking-tighter drop-shadow-lg">
              Innovation
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 font-light drop-shadow-md">
              Vector Corals welcomes innovation through research and technology.
            </p>
          </motion.div>

          <motion.div style={{ opacity: text2Opacity }} className="absolute text-center max-w-4xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-zinc-400 font-mono">02</span>
              <span className="h-[1px] w-12 bg-zinc-600"></span>
              <span className="text-white font-bold tracking-widest uppercase">PROCESS</span>
            </div>
            <h2 className="text-5xl md:text-[7rem] font-bold text-white mb-6 tracking-tighter drop-shadow-lg">
              Patience
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 font-light drop-shadow-md">
              We see technology as a tool, but human touch must drive creativity.
            </p>
          </motion.div>

          <motion.div style={{ opacity: text3Opacity }} className="absolute text-center max-w-4xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-zinc-400 font-mono">03</span>
              <span className="h-[1px] w-12 bg-zinc-600"></span>
              <span className="text-white font-bold tracking-widest uppercase">RESULT</span>
            </div>
            <h2 className="text-5xl md:text-[7rem] font-bold text-white mb-6 tracking-tighter drop-shadow-lg">
              Resilience
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 font-light drop-shadow-md">
              Strict biological patience to cultivate extreme coloration.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}