"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
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
  scale: number;
  speedFactor: number;
  darken: number;
  aspect: string;
}

// --- 2. ORGANIC, LOW-OVERLAP GALLERY GENERATOR ---
const generateGallery = (sources: string[]) => {
  return sources.map((src, index) => {
    const scale = Math.random() * 0.3 + 0.7;

    const sequence = [2, 65, 33];
    const baseLeft = sequence[index % 3];
    const jitter = Math.random() * 10;

    return {
      id: index,
      src,
      left: `${baseLeft + jitter}%`,
      top: `${index * 12.5 + Math.random() * 5}vh`,
      width: `${scale * 14 + 16}vmin`,
      scale,
      speedFactor: scale * 0.2 + 0.6,
      darken: 1 - scale + 0.1,
      aspect: Math.random() > 0.5 ? "16/9" : "3/4",
    };
  });
};

const FloatingImage = ({
  img,
  progress,
  totalVh,
  mouseX,
  mouseY,
  hoveredId,
  setHoveredId
}: {
  img: GalleryItemProps,
  progress: MotionValue<number>,
  totalVh: number,
  mouseX: MotionValue<number>,
  mouseY: MotionValue<number>,
  hoveredId: number | null,
  setHoveredId: (id: number | null) => void
}) => {
  const scrollY = useTransform(progress, [0, 1], ["0vh", `-${totalVh * img.speedFactor}vh`]);

  const moveRange = img.scale * 60;
  const x = useTransform(mouseX, [-1, 1], [moveRange, -moveRange]);
  const y = useTransform(mouseY, [-1, 1], [moveRange, -moveRange]);

  // Hover States
  const isHovered = hoveredId === img.id;
  const isOthersHovered = hoveredId !== null && hoveredId !== img.id;

  return (
    <motion.div
      // FIXED: onHoverStart/End ignores touch inputs entirely so desktop hover is perfect.
      // onClick acts as a toggle so mobile users can tap to activate, and tap to deactivate.
      onHoverStart={() => setHoveredId(img.id)}
      onHoverEnd={() => setHoveredId(null)}
      onClick={() => setHoveredId(isHovered ? null : img.id)}
      style={{
        left: img.left,
        top: img.top,
        width: img.width,
        aspectRatio: img.aspect,
        y: scrollY,
        zIndex: isHovered ? 50 : 1
      }}
      className="absolute transform-gpu will-change-transform"
    >
      <motion.div
        style={{ x, y }}
        animate={{
          scale: isHovered ? 1.15 : 1,
          filter: isOthersHovered ? "blur(6px)" : "blur(0px)",
          opacity: isOthersHovered ? 0.3 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-full overflow-hidden rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] transform-gpu will-change-transform"
      >
        <img src={img.src} alt="" className="w-full h-full object-cover" />
        <motion.div
          animate={{ opacity: isHovered ? 0 : img.darken }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-black"
        />
      </motion.div>
    </motion.div>
  );
};

export default function StoryScroll() {
  const containerRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItemProps[]>([]);

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // --- MOUSE TRACKING ---
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const smoothMouseX = useSpring(rawMouseX, { damping: 25, stiffness: 150 });
  const smoothMouseY = useSpring(rawMouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    setIsMounted(true);
    setGalleryItems(generateGallery(GALLERY_IMAGE_SOURCES));

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      rawMouseX.set(x);
      rawMouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  // --- DYNAMIC HEIGHT & TIMELINE MATH ---
  const runwayVh = Math.max(210, GALLERY_IMAGE_SOURCES.length * 12.5);
  const totalVh = runwayVh + 240;

  const heroEntranceStartVh = runwayVh - 210;
  const zoomStartVh = runwayVh;
  const zoomEndVh = zoomStartVh + 60;

  const text1StartVh = zoomEndVh;
  const text1EndVh = text1StartVh + 60;

  const text2StartVh = text1EndVh;
  const text2EndVh = text2StartVh + 60;

  const text3StartVh = text2EndVh;
  const text3EndVh = totalVh;

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
    <section ref={containerRef} style={{ height: `${totalVh}vh` }} className="relative bg-zinc-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* --- LAYER 1: THE FLOATING GALLERY --- */}
        {isMounted && (
          <motion.div style={{ opacity: galleryOpacity }} className="absolute inset-0 z-0">
            {galleryItems.map((img) => (
              <FloatingImage
                key={img.id}
                img={img}
                progress={scrollYProgress}
                totalVh={totalVh}
                mouseX={smoothMouseX}
                mouseY={smoothMouseY}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
              />
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
            minWidth: "min(60vw, 350px)",
            height: heroHeight,
            borderRadius: heroRadius,
            overflow: "hidden"
          }}
        >
          <div className="w-full h-full relative bg-zinc-900 pointer-events-auto">
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
              Strict biological patience to cultivate extreme coloration.
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
              Resolve for only the best, both in care and in product.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}