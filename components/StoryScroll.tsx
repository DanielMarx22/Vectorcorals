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
// The page length will dynamically adapt to exactly how many items are here.
// About 8 images will be generated per "page" of scrolling.
const GALLERY_IMAGE_SOURCES = [
  "/bigjawbreaker.JPEG",
  "/candycrush.JPEG",
  "/deadpool.JPEG",
  "/exosphere.JPEG",
  "/godzilla.JPEG",
  "/littleogbounce.JPEG",
  "/magiccarpet.JPEG",
  "/ogbounce.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
  "/bigjawbreaker.JPEG",
];

interface GalleryItemProps {
  id: number;
  src: string;
  left: string;
  top: string;
  width: string;
  speedFactor: number;
  darken: number;
  aspect: string;
}

// --- 2. DYNAMIC & ORGANIC GALLERY GENERATOR ---
const generateGallery = (sources: string[]) => {
  return sources.map((src, index) => {
    // Made images larger (scale ranges from 0.7 to 1.0)
    const scale = Math.random() * 0.3 + 0.7;

    // SCATTER PATTERN: Left -> Right -> Center
    // This forces consecutive images to opposite sides of the screen, 
    // guaranteeing no immediate overlap.
    const sequence = [2, 65, 33];
    const baseLeft = sequence[index % 3];

    // The random jitter makes it look perfectly organic instead of like a rigid grid
    const jitter = Math.random() * 10;

    return {
      id: index,
      src,
      left: `${baseLeft + jitter}%`,

      // VERTICAL SPACING: Spreads them exactly 12.5vh apart on average
      top: `${index * 12.5 + Math.random() * 5}vh`,

      // LARGER IMAGES: Ranging from ~25vw to ~30vw
      width: `${scale * 14 + 16}vw`,

      // SPEED FACTOR: Tighter speed variance (0.6 to 0.8) ensures that faster 
      // images at the bottom don't "catch up" and overlap slower images above them.
      speedFactor: scale * 0.2 + 0.6,

      darken: 1 - scale + 0.1,
      aspect: Math.random() > 0.5 ? "16/9" : "3/4",
    };
  });
};

const FloatingImage = ({ img, progress, totalVh }: { img: GalleryItemProps, progress: MotionValue<number>, totalVh: number }) => {
  // CONSTANT SPEED MATH: By multiplying the speedFactor by the dynamically generated 
  // totalVh, the images will ALWAYS travel at the exact same physical speed on your 
  // screen, no matter how many images you add to the list.
  const y = useTransform(progress, [0, 1], ["0vh", `-${totalVh * img.speedFactor}vh`]);

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

  const [isMounted, setIsMounted] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItemProps[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setGalleryItems(generateGallery(GALLERY_IMAGE_SOURCES));
  }, []);

  // --- DYNAMIC HEIGHT & TIMELINE MATH ---
  // Calculates exactly how much scroll space is needed for the number of images.
  // We enforce a minimum runway of 210vh so the Hero Entrance always has room to look smooth.
  const runwayVh = Math.max(210, GALLERY_IMAGE_SOURCES.length * 12.5);

  // The end sequence (Zoom + 3 Text Phases) always requires exactly 240vh to feel right.
  const totalVh = runwayVh + 240;

  // Timeline absolute breakpoints based on the calculated heights
  const heroEntranceStartVh = runwayVh - 210;
  const zoomStartVh = runwayVh;
  const zoomEndVh = zoomStartVh + 60;

  const text1StartVh = zoomEndVh;
  const text1EndVh = text1StartVh + 60;

  const text2StartVh = text1EndVh;
  const text2EndVh = text2StartVh + 60;

  const text3StartVh = text2EndVh;
  const text3EndVh = totalVh;

  // Helper function to convert absolute vh heights to 0-1 percentages for Framer Motion
  const p = (vh: number) => Math.max(0, Math.min(1, vh / totalVh));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  // --- ANIMATION TIMELINE ---

  // 1. HERO ENTRANCE
  const heroTop = useTransform(
    smoothProgress,
    [p(heroEntranceStartVh), p(zoomStartVh)],
    ["150%", "50%"]
  );

  // 2. HERO HORIZONTAL ZOOM
  const heroWidth = useTransform(smoothProgress, [p(zoomStartVh), p(zoomEndVh)], ["25vw", "100vw"]);
  const heroHeight = useTransform(smoothProgress, [p(zoomStartVh), p(zoomEndVh)], ["45vh", "110vh"]);
  const heroRadius = useTransform(smoothProgress, [p(zoomStartVh), p(zoomEndVh)], ["24px", "0px"]);

  // Fade out gallery background
  const galleryOpacity = useTransform(smoothProgress, [p(zoomStartVh - 30), p(zoomStartVh)], [1, 0]);

  // 3. VERTICAL PAN & OVERLAY
  const imagePanY = useTransform(smoothProgress, [p(zoomStartVh), 1], ["0%", "-30%"]);
  const overlayOpacity = useTransform(smoothProgress, [p(zoomStartVh), p(zoomStartVh + 30)], [0, 0.6]);

  // 4. TEXT PHASES
  // We use p(12) to calculate exactly a 12vh crossfade transition, so it never overlaps or breaks
  const text1Opacity = useTransform(
    smoothProgress,
    [0, p(text1StartVh), p(text1StartVh) + p(12), p(text1EndVh) - p(12), p(text1EndVh), 1],
    [0, 0, 1, 1, 0, 0]
  );

  const text2Opacity = useTransform(
    smoothProgress,
    [0, p(text2StartVh), p(text2StartVh) + p(12), p(text2EndVh) - p(12), p(text2EndVh), 1],
    [0, 0, 1, 1, 0, 0]
  );

  const text3Opacity = useTransform(
    smoothProgress,
    [0, p(text3StartVh), p(text3StartVh) + p(12), 1],
    [0, 0, 1, 1]
  );

  return (
    // Height is injected dynamically
    <section ref={containerRef} style={{ height: `${totalVh}vh` }} className="relative bg-zinc-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* --- LAYER 1: THE FLOATING GALLERY --- */}
        {isMounted && (
          <motion.div style={{ opacity: galleryOpacity }} className="absolute inset-0 z-0">
            {galleryItems.map((img) => (
              <FloatingImage key={img.id} img={img} progress={smoothProgress} totalVh={totalVh} />
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