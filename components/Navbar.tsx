"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { name: "Home", path: "/" },
        { name: "Collection", path: "/collection" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <motion.div
            initial={{ y: -50, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="fixed top-8 left-1/2 z-50 pointer-events-auto"
        >
            <nav className="flex items-center gap-16 px-10 py-4 rounded-full bg-zinc-950/40 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-colors hover:bg-zinc-900/60">
                {links.map((link) => {
                    const isActive = pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`text-[11px] font-mono uppercase tracking-[0.2em] transition-all hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] cursor-none ${isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-zinc-400"
                                }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </motion.div>
    );
}