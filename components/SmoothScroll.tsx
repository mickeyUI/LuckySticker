"use client"; // uses browser APIs and hooks, so it must be a client component

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // create the Lenis instance when the component mounts
    const lenis = new Lenis({
      duration: 1.5, // how long the scroll "glide" takes (higher = floatier)
      smoothWheel: true,
      anchors: true, // smooth the mouse wheel
    });

    // this function runs every animation frame (~60 times per second)
    let frameId: number;
    function raf(time: number) {
      lenis.raf(time); // tell Lenis a frame happened so it can update the position
      frameId = requestAnimationFrame(raf); // schedule the next frame
    }
    frameId = requestAnimationFrame(raf);

    // cleanup: stop the loop and remove Lenis when the component unmounts
    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []); // empty array = run once on mount

  return null; // renders nothing visible, it only runs the effect
}
