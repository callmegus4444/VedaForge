"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function ClickBurst() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Create a container for the burst
      const burstContainer = document.createElement("div");
      burstContainer.style.position = "fixed";
      burstContainer.style.left = `${e.clientX}px`;
      burstContainer.style.top = `${e.clientY}px`;
      burstContainer.style.pointerEvents = "none";
      burstContainer.style.zIndex = "9999";
      document.body.appendChild(burstContainer);

      // Create 4 rays
      const rays: HTMLDivElement[] = [];
      const angles = [-90, -45, 45, 90]; // West, NW, NE, East
      const numRays = angles.length;
      const radius = 45; // Distance to travel

      for (let i = 0; i < numRays; i++) {
        const ray = document.createElement("div");
        ray.style.position = "absolute";
        ray.style.width = "2px";
        ray.style.height = "16px";
        ray.style.backgroundColor = "#000000";
        ray.style.borderRadius = "1px";
        
        // Initial setup at center
        ray.style.transformOrigin = "center top";
        ray.style.left = "-1px"; // center it
        ray.style.top = "0px";
        
        burstContainer.appendChild(ray);
        rays.push(ray);

        // Calculate rotation for each ray based on our 180 degree array
        const angle = angles[i];
        const angleRad = (angle * Math.PI) / 180;

        const destX = Math.sin(angleRad) * radius;
        const destY = -Math.cos(angleRad) * radius; // Negative Y is up in DOM

        gsap.fromTo(
          ray,
          {
            x: 0,
            y: 0,
            rotation: angle,
            scaleY: 1,
            opacity: 1,
          },
          {
            x: destX,
            y: destY,
            scaleY: 0,
            opacity: 0,
            duration: 0.65,
            ease: "power2.out",
          }
        );
      }

      // Cleanup
      setTimeout(() => {
        burstContainer.remove();
      }, 500);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return null;
}
