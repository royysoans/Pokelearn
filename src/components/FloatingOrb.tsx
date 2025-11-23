import { useMemo, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

// Floating Orb Background Component
export function FloatingOrb({ delay = 0, duration = 20, size = 100, index = 0, followPointer = false }: { delay?: number; duration?: number; size?: number; index?: number; followPointer?: boolean }) {

    // Mouse following logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for following
    const springConfig = { damping: 50, stiffness: 400, mass: 2 }; // "Not aggressive" - smooth and slightly heavy
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        if (!followPointer) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Center the orb on the cursor
            mouseX.set(e.clientX - size / 2);
            mouseY.set(e.clientY - size / 2);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [followPointer, size, mouseX, mouseY]);

    // Calculate waypoints once and store them - use index for better distribution
    const waypoints = useMemo(() => {
        // Distribute orbs in a grid-like pattern to avoid clustering
        const gridX = (index % 4) * 25 + 10; // 4 columns: 10%, 35%, 60%, 85%
        const gridY = Math.floor(index / 4) * 40 + 10; // 2 rows: 10%, 50%

        // Add some randomness to the grid positions
        const startX = gridX + (Math.random() * 10 - 5);
        const startY = gridY + (Math.random() * 10 - 5);

        return {
            x: [
                `${startX}vw`,
                `${Math.random() * 60 + 20}vw`,
                `${Math.random() * 60 + 20}vw`,
                `${Math.random() * 60 + 20}vw`,
                `${startX}vw`
            ],
            y: [
                `${startY}vh`,
                `${Math.random() * 60 + 20}vh`,
                `${Math.random() * 60 + 20}vh`,
                `${Math.random() * 60 + 20}vh`,
                `${startY}vh`
            ],
            startX,
            startY
        };
    }, [index]);

    const color = useMemo(() => [
        'rgba(139, 92, 246, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(251, 146, 60, 0.8)'
    ][Math.floor(Math.random() * 4)], []);

    // If following pointer, use spring values. Otherwise use keyframe animation.
    if (followPointer) {
        return (
            <motion.div
                style={{
                    x,
                    y,
                    width: size,
                    height: size,
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
                }}
                className="fixed pointer-events-none rounded-full blur-xl z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1 }}
            />
        );
    }

    return (
        <motion.div
            initial={{
                x: waypoints.x[0],
                y: waypoints.y[0],
                opacity: 0.9
            }}
            animate={{
                x: waypoints.x,
                y: waypoints.y,
                opacity: [0.9, 0.9, 0.9, 0.9, 0.9]
            }}
            transition={{
                duration: duration * 1.5,
                delay,
                repeat: Infinity,
                ease: "linear"
            }}
            className="absolute pointer-events-none rounded-full blur-xl"
            style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
            }}
        />
    );
}
