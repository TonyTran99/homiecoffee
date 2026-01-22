"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent, MotionValue } from "framer-motion";

const FRAME_COUNT = 64; // Optimized for GitHub upload (64 frames)

export default function CoffeeScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll (0-1) to frame index (1-128)
    const currentIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

    // Preload Images
    useEffect(() => {
        // Prevent double loading in strict mode/dev
        if (images.length > 0) return;

        const loadedImages: HTMLImageElement[] = [];
        let count = 0;

        const onImageLoad = () => {
            count++;
            setLoadedCount(count);
            if (count === FRAME_COUNT) {
                setIsLoading(false);
            }
        };

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            // Pad to 3 digits: 001, 002...
            const filename = `coffee_frame_${i.toString().padStart(3, "0")}.jpg`;
            img.src = `/frames/${filename}`;
            img.onload = onImageLoad;
            // Handle error gracefully?
            img.onerror = () => {
                console.error(`Failed to load ${filename}`);
                onImageLoad(); // Count it anyway to avoid stalling
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Canvas Drawing Logic
    const render = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Safety clamp
        const safeIndex = Math.max(1, Math.min(FRAME_COUNT, Math.floor(index)));
        const img = images[safeIndex - 1];

        if (!img) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate "object-contain" positioning
        // We want the image to cover most of the screen but maintain aspect ratio and be centered
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        // user requested "object-contain logic"
        const ratio = Math.min(hRatio, vRatio);

        // Optional: if the image is too small, maybe we want to scale it up? 
        // "object-contain" usually means "fit within". 
        // Let's stick to standard contain.

        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;

        ctx.drawImage(
            img,
            0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
        );
    };

    // Resize observer to keep canvas sized correctly
    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Immediately re-render current frame on resize
                if (!isLoading) {
                    render(currentIndex.get());
                }
            }
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        return () => window.removeEventListener("resize", resizeCanvas);
    }, [isLoading]);

    // Render Loop based on MotionValue update
    useMotionValueEvent(currentIndex, "change", (latest) => {
        if (!isLoading) {
            requestAnimationFrame(() => render(latest));
        }
    });

    // Initial draw once loaded
    useEffect(() => {
        if (!isLoading) {
            render(currentIndex.get());
        }
    }, [isLoading]);


    return (
        <div ref={containerRef} className="relative h-[600vh] bg-[#00735C]">

            {/* Preloader */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#00735C] text-white">
                    <h1 className="text-4xl font-serif mb-6 tracking-wide">HOMIE.</h1>
                    <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${(loadedCount / FRAME_COUNT) * 100}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                    </div>
                    <p className="mt-4 font-sans text-sm tracking-widest opacity-70">ĐANG PHA CHẾ TRẢI NGHIỆM ({Math.round((loadedCount / FRAME_COUNT) * 100)}%)</p>
                </div>
            )}

            {/* Sticky Canvas Area */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} className="block" />

                {/* Overlays Container */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* 0% - 15% */}
                    <OverlaySection start={0} end={0.15} scrollYProgress={scrollYProgress} align="center">
                        <h2 className="text-6xl md:text-8xl font-serif text-white/90">HOMIE Coffee.</h2>
                        <p className="text-xl md:text-2xl font-sans text-white/70 mt-4 uppercase tracking-widest">Hương vị nguyên bản.</p>
                    </OverlaySection>

                    {/* 25% - 40% */}
                    <OverlaySection start={0.25} end={0.40} scrollYProgress={scrollYProgress} align="left">
                        <h3 className="text-4xl md:text-6xl font-serif text-white/90 max-w-xl">
                            Hành trình bắt đầu từ những quả <span className="text-[#FF6B6B]">chín mọng</span>.
                        </h3>
                    </OverlaySection>

                    {/* 50% - 65% */}
                    <OverlaySection start={0.50} end={0.65} scrollYProgress={scrollYProgress} align="right">
                        <h3 className="text-4xl md:text-6xl font-serif text-white/80 max-w-xl text-right">
                            Rang đậm sâu.<br />
                            <span className="text-white">Xay trọn vị.</span>
                        </h3>
                    </OverlaySection>

                    {/* 80% - 100% */}
                    <OverlaySection start={0.80} end={0.98} scrollYProgress={scrollYProgress} align="center">
                        <div className="text-center">
                            <h2 className="text-5xl md:text-7xl font-serif text-white mb-8">Dành riêng cho Homies.</h2>
                            <a href="tel:0908387238" className="pointer-events-auto inline-block px-8 py-4 bg-white text-[#00735C] font-bold font-sans tracking-wide rounded-full hover:bg-opacity-90 transition-transform hover:scale-105">
                                GỌI ĐẶT NGAY: 0908 38 72 38
                            </a>
                        </div>
                    </OverlaySection>
                </div>
            </div>
        </div>
    );
}

// Helper Component for Text Sections
function OverlaySection({
    children,
    start,
    end,
    scrollYProgress,
    align = "center"
}: {
    children: React.ReactNode,
    start: number,
    end: number,
    scrollYProgress: MotionValue<number>,
    align?: "left" | "center" | "right"
}) {
    // Fade in/out logic
    // Opacity: 0 -> 1 (at start) -> 1 (at end) -> 0
    // We want a small fade transition window.
    const fadeDuration = 0.05;

    const opacity = useTransform(
        scrollYProgress,
        [start - fadeDuration, start, end, end + fadeDuration],
        [0, 1, 1, 0]
    );

    const translateY = useTransform(
        scrollYProgress,
        [start - fadeDuration, start, end, end + fadeDuration],
        [50, 0, 0, -50]
    );

    let justify = "justify-center";
    if (align === "left") justify = "justify-start pl-10 md:pl-20";
    if (align === "right") justify = "justify-end pr-10 md:pr-20";

    return (
        <motion.div
            style={{ opacity, y: translateY }}
            className={`absolute inset-0 flex items-center ${justify}`}
        >
            {children}
        </motion.div>
    );
}
