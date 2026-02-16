"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

// --- 1. CURATED FLOATING GALLERY ---
// Items are spaced vertically using 'top' values from 10% to 180%
// to ensure you scroll "past" them before the hero zoom.
const GALLERY_IMAGES = [
  {
    id: 1,
    src: "/bigjawbreaker.JPEG",
    left: "10%",
    top: "15%",
    width: "16vw",
    speed: 400,
    darken: 0.5,
    aspect: "3/4",
  },
  {
    id: 2,
    src: "/candycrush.JPEG",
    left: "75%",
    top: "10%",
    width: "22vw",
    speed: 700,
    darken: 0.1,
    aspect: "4/5",
  },
  {
    id: 3,
    src: "/deadpool.JPEG",
    left: "5%",
    top: "60%",
    width: "20vw",
    speed: 500,
    darken: 0.3,
    aspect: "16/9",
  },
  {
    id: 4,
    src: "/exosphere.JPEG",
    left: "80%",
    top: "75%",
    width: "12vw",
    speed: 300,
    darken: 0.6,
    aspect: "1/1",
  },
  {
    id: 5,
    src: "/godzilla.JPEG",
    left: "15%",
    top: "110%",
    width: "18vw",
    speed: 450,
    darken: 0.4,
    aspect: "4/5",
  },
  {
    id: 6,
    src: "/littleogbounce.JPEG",
    left: "65%",
    top: "130%",
    width: "26vw",
    speed: 850,
    darken: 0.0,
    aspect: "3/4",
  },
  {
    id: 7,
    src: "/magiccarpet.JPEG",
    left: "10%",
    top: "160%",
    width: "14vw",
    speed: 350,
    darken: 0.5,
    aspect: "1/1",
  },
  {
    id: 8,
    src: "/ogbounce.JPEG",
    left: "70%",
    top: "180%",
    width: "18vw",
    speed: 600,
    darken: 0.2,
    aspect: "16/9",
  },
];

const FloatingImage = ({
  img,
  progress,
}: {
  img: (typeof GALLERY_IMAGES)[0];
  progress: MotionValue<number>;
}) => {
  // Parallax: Global scroll progress * individual speed
  const y = useTransform(progress, [0, 1], [0, -img.speed * 2]);

  // Fade out logic: gallery disappears as hero starts zooming (0.2 to 0.35)
  const opacity = useTransform(progress, [0, 0.25, 0.35], [1, 1, 0]);

  return (
    <motion.div
      style={{
        left: img.left,
        top: img.top,
        width: img.width,
        aspectRatio: img.aspect,
        y,
        opacity,
      }}
      className="absolute overflow-hidden rounded-xl shadow-2xl pointer-events-none transform-gpu will-change-transform"
    >
      <img
        src={img.src}
        alt="Gallery item"
        className="w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: img.darken }}
      />
    </motion.div>
  );
};

export default function StoryScroll() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
  });

  // --- ANIMATION SEQUENCE ---

  // 1. HERO ENTRANCE (Delayed until after gallery items start moving)
  const heroOpacity = useTransform(smoothProgress, [0.1, 0.25], [0, 1]);
  const heroEntranceY = useTransform(
    smoothProgress,
    [0.1, 0.25],
    ["20vh", "0vh"],
  );

  // 2. HERO ZOOM (Matches your preferred logic)
  const heroWidth = useTransform(smoothProgress, [0.3, 0.5], ["30vw", "100vw"]);
  const heroHeight = useTransform(
    smoothProgress,
    [0.3, 0.5],
    ["45vh", "100vh"],
  );
  const heroRadius = useTransform(smoothProgress, [0.3, 0.5], ["24px", "0px"]);

  const overlayOpacity = useTransform(smoothProgress, [0.5, 0.55], [0, 0.6]);

  // 3. TEXT FADES
  const text1Opacity = useTransform(
    smoothProgress,
    [0.55, 0.6, 0.7, 0.75],
    [0, 1, 1, 0],
  );
  const text2Opacity = useTransform(
    smoothProgress,
    [0.75, 0.8, 0.9, 0.95],
    [0, 1, 1, 0],
  );
  const text3Opacity = useTransform(
    smoothProgress,
    [0.95, 0.98, 1, 1],
    [0, 1, 1, 1],
  );

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-zinc-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* --- LAYER 1: FLOATING GALLERY --- */}
        <div className="absolute inset-0 z-0">
          {GALLERY_IMAGES.map((img) => (
            <FloatingImage key={img.id} img={img} progress={smoothProgress} />
          ))}
        </div>

        {/* --- LAYER 2: HERO IMAGE --- */}
        <motion.div
          style={{ y: heroEntranceY, opacity: heroOpacity }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            style={{
              width: heroWidth,
              height: heroHeight,
              borderRadius: heroRadius,
            }}
            className="relative overflow-hidden bg-zinc-800 shadow-2xl pointer-events-auto transform-gpu will-change-[width,height]"
          >
            <img
              src="/coral-macro.jpg"
              alt="Hero Focus"
              className="w-full h-full object-cover"
            />
            <motion.div
              style={{ opacity: overlayOpacity }}
              className="absolute inset-0 bg-black pointer-events-none"
            />
          </motion.div>
        </motion.div>

        {/* --- LAYER 3: TEXT CONTENT --- */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6">
          {/* Phase 1 */}
          <motion.div
            style={{ opacity: text1Opacity }}
            className="absolute text-center max-w-4xl"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-zinc-400 font-mono">01</span>
              <span className="h-[1px] w-12 bg-zinc-600"></span>
              <span className="text-white font-bold tracking-widest uppercase">
                VISION
              </span>
            </div>
            <h2 className="text-5xl md:text-[7rem] font-bold text-white mb-6 tracking-tighter drop-shadow-lg">
              Innovation
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 font-light">
              Vector Corals welcomes innovation through research and technology.
            </p>
          </motion.div>

          {/* Phase 2 */}
          <motion.div
            style={{ opacity: text2Opacity }}
            className="absolute text-center max-w-4xl"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-zinc-400 font-mono">02</span>
              <span className="h-[1px] w-12 bg-zinc-600"></span>
              <span className="text-white font-bold tracking-widest uppercase">
                PROCESS
              </span>
            </div>
            <h2 className="text-5xl md:text-[7rem] font-bold text-white mb-6 tracking-tighter drop-shadow-lg">
              Patience
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 font-light">
              We see technology as a tool, but human touch must drive
              creativity.
            </p>
          </motion.div>

          {/* Phase 3 */}
          <motion.div
            style={{ opacity: text3Opacity }}
            className="absolute text-center max-w-4xl"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-zinc-400 font-mono">03</span>
              <span className="h-[1px] w-12 bg-zinc-600"></span>
              <span className="text-white font-bold tracking-widest uppercase">
                RESULT
              </span>
            </div>
            <h2 className="text-5xl md:text-[7rem] font-bold text-white mb-6 tracking-tighter drop-shadow-lg">
              Resilience
            </h2>
            <p className="text-xl md:text-2xl text-zinc-300 font-light">
              Strict biological patience to cultivate extreme coloration.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
