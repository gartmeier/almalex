import { useEffect, useRef } from "react";

export function useMouseParallax(
  elements: React.RefObject<(HTMLDivElement | null)[]>,
  depths: number[],
  maxOffset = 30,
) {
  let mouse = useRef({ x: 0, y: 0 });
  let influence = useRef({ x: 0, y: 0 });
  let rafId = useRef(0);
  let startTime = useRef(0);

  useEffect(() => {
    let isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    startTime.current = performance.now();

    function onMouseMove(e: MouseEvent) {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    }

    function tick(now: number) {
      // mouse slowly biases the drift, not snapping to it
      let m = mouse.current;
      let inf = influence.current;
      inf.x += (m.x - inf.x) * 0.008;
      inf.y += (m.y - inf.y) * 0.008;

      let elapsed = (now - startTime.current) / 1000;

      let els = elements.current;
      if (els) {
        for (let i = 0; i < els.length; i++) {
          let el = els[i];
          if (!el) continue;
          let d = depths[i] ?? 0.5;
          let phase = i * 1.7;
          let speed = 0.4 + d * 0.25;
          let amp = 35 + d * 25;
          let driftX = Math.sin(elapsed * speed + phase + inf.x * d) * amp;
          let driftY =
            Math.cos(elapsed * speed * 0.7 + phase * 0.6 + inf.y * d) *
            amp *
            0.7;
          let dx = driftX + inf.x * maxOffset * d;
          let dy = driftY + inf.y * maxOffset * d;
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      }

      rafId.current = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [elements, depths, maxOffset]);
}
