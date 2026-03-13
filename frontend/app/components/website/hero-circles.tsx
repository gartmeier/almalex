import { useRef } from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import { useMouseParallax } from "~/hooks/use-mouse-parallax";

let circles = [
  // Backdrop – very large
  { x: "-5%", y: "-10%", size: 420, color: "#3B82C4", opacity: 0.04, depth: 0.05 },
  { x: "65%", y: "50%", size: 380, color: "#6B9E7A", opacity: 0.035, depth: 0.08 },

  // Background – large circles
  { x: "3%", y: "8%", size: 160, color: "#3B82C4", opacity: 0.07, depth: 0.1 },
  { x: "78%", y: "3%", size: 180, color: "#1E3A5F", opacity: 0.06, depth: 0.15 },
  { x: "88%", y: "55%", size: 140, color: "#6B9E7A", opacity: 0.07, depth: 0.2 },
  { x: "18%", y: "65%", size: 170, color: "#3B82C4", opacity: 0.05, depth: 0.25 },

  // Midground – medium circles
  { x: "55%", y: "12%", size: 70, color: "#6B9E7A", opacity: 0.1, depth: 0.35 },
  { x: "8%", y: "40%", size: 50, color: "#F5A623", opacity: 0.09, depth: 0.4 },
  { x: "84%", y: "30%", size: 60, color: "#3B82C4", opacity: 0.09, depth: 0.45 },
  { x: "38%", y: "78%", size: 45, color: "#1E3A5F", opacity: 0.08, depth: 0.5 },
  { x: "68%", y: "50%", size: 55, color: "#6B9E7A", opacity: 0.08, depth: 0.42 },
  { x: "25%", y: "30%", size: 40, color: "#F5A623", opacity: 0.1, depth: 0.48 },

  // Foreground – small dots
  { x: "30%", y: "18%", size: 14, color: "#6B9E7A", opacity: 0.18, depth: 0.7 },
  { x: "65%", y: "72%", size: 10, color: "#F5A623", opacity: 0.18, depth: 0.8 },
  { x: "86%", y: "12%", size: 12, color: "#3B82C4", opacity: 0.16, depth: 0.75 },
  { x: "48%", y: "48%", size: 10, color: "#F5A623", opacity: 0.14, depth: 0.9 },
  { x: "15%", y: "58%", size: 8, color: "#3B82C4", opacity: 0.16, depth: 0.85 },
  { x: "72%", y: "25%", size: 11, color: "#1E3A5F", opacity: 0.15, depth: 0.78 },
  { x: "42%", y: "88%", size: 9, color: "#6B9E7A", opacity: 0.14, depth: 0.82 },
  { x: "92%", y: "45%", size: 7, color: "#F5A623", opacity: 0.17, depth: 0.88 },
  { x: "58%", y: "38%", size: 6, color: "#3B82C4", opacity: 0.13, depth: 0.72 },
  { x: "5%", y: "82%", size: 10, color: "#1E3A5F", opacity: 0.15, depth: 0.76 },
] as const;

let depths = circles.map((c) => c.depth);

export function HeroCircles() {
  let isMobile = useIsMobile();
  let refs = useRef<(HTMLDivElement | null)[]>([]);

  useMouseParallax(refs, depths);

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {circles.map((c, i) => (
        <div
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className={isMobile ? "animate-hero-float" : ""}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            width: c.size,
            height: c.size,
            borderRadius: "50%",
            backgroundColor: c.color,
            opacity: c.opacity,
            willChange: "transform",
            animationDelay: isMobile ? `${i * 0.4}s` : undefined,
            animationDuration: isMobile ? `${4 + (i % 4) * 0.8}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}
