import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central motion system. Elements opt in with data attributes:
 *  data-hero-word     – hero headline words (intro timeline)
 *  data-hero-fade     – hero supporting elements (intro timeline)
 *  data-reveal        – fade/slide up on enter
 *  data-clip="left|right|up|down" – clip-path image wipe on enter (+ inner img scale)
 *  data-parallax="n"  – scrubbed vertical drift (yPercent n), desktop only
 *  data-stagger       – children stagger in on enter
 *  data-tilt          – restrained 3D rotateX settle on scroll (desktop)
 *  data-progress      – scaleX scrubbed by section scroll
 *  data-words-scrub   – words inside light up as you scroll
 * Content is fully visible without JS; gsap.from only runs after mount.
 */
export interface GlowMotionOptions {
  /** When provided, hero intro waits until isReady is true before playing */
  isReady?: boolean;
}

export function useGlowMotion(scope: RefObject<HTMLElement | null>, options?: GlowMotionOptions) {
  const isReady = options?.isReady ?? true;

  useEffect(() => {
    if (!scope.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 1024px)",
      },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;
        const q = gsap.utils.selector(scope.current);

        // Hero intro & page animations: wait until preloader is completely finished
        if (!isReady) {
          gsap.set(q("[data-hero-word]"), { yPercent: 110, rotate: 4 });
          gsap.set(q("[data-hero-fade]"), { y: 24, autoAlpha: 0 });
          gsap.set(q("[data-hero-img]"), {
            clipPath: "inset(100% 0% 0% 0% round 200px)",
            scale: 1.15,
          });
          return;
        }

        // Hero intro & page animations: start immediately once preloader is finished
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(
          q("[data-hero-word]"),
          { yPercent: 110, rotate: 3 },
          { yPercent: 0, rotate: 0, duration: 0.85, stagger: 0.035, clearProps: "transform" },
        )
          .fromTo(
            q("[data-hero-fade]"),
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.65,
              stagger: 0.05,
              clearProps: "transform,opacity,visibility",
            },
            "-=0.7",
          )
          .fromTo(
            q("[data-hero-img]"),
            { clipPath: "inset(100% 0% 0% 0% round 200px)", scale: 1.1 },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              scale: 1,
              duration: 0.95,
              ease: "expo.out",
              clearProps: "clipPath,transform",
            },
            0,
          );

        q("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
        );

        const clips: Record<string, string> = {
          left: "inset(0% 100% 0% 0%)",
          right: "inset(0% 0% 0% 100%)",
          up: "inset(100% 0% 0% 0%)",
          down: "inset(0% 0% 100% 0%)",
        };
        q("[data-clip]").forEach((el) => {
          const dir = el.getAttribute("data-clip") || "up";
          const t = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          t.from(el, { clipPath: clips[dir] ?? clips["up"]!, duration: 1.3, ease: "expo.inOut" });
          const img = el.querySelector("img");
          if (img) t.from(img, { scale: 1.3, duration: 1.6, ease: "expo.out" }, 0.1);
        });

        q("[data-stagger]").forEach((el) =>
          gsap.from(el.children, {
            y: 70,
            autoAlpha: 0,
            rotateX: desktop ? -12 : 0,
            transformPerspective: 900,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          }),
        );

        q("[data-words-scrub]").forEach((el) =>
          gsap.fromTo(
            el.querySelectorAll("span"),
            { opacity: 0.18 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
            },
          ),
        );

        q("[data-progress]").forEach((el) =>
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("section"),
                start: "top 60%",
                end: "bottom 70%",
                scrub: true,
              },
            },
          ),
        );

        if (desktop) {
          q("[data-parallax]").forEach((el) => {
            const amt = parseFloat(el.getAttribute("data-parallax") || "10");
            gsap.to(el, {
              yPercent: amt,
              ease: "none",
              scrollTrigger: {
                trigger: el.closest("section") ?? el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });
          q("[data-tilt]").forEach((el) =>
            gsap.fromTo(
              el,
              { rotateX: 18, scale: 0.92, transformPerspective: 1400, transformOrigin: "50% 100%" },
              {
                rotateX: 0,
                scale: 1,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top 95%", end: "top 40%", scrub: true },
              },
            ),
          );
        }
      },
    );

    // Pointer depth for hero layers (desktop pointer only)
    const fine = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;
    const layers = Array.from(scope.current.querySelectorAll<HTMLElement>("[data-depth]"));
    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        const d = parseFloat(l.dataset["depth"] || "10");
        gsap.to(l, { x: x * d, y: y * d, duration: 1.2, ease: "power3.out", overwrite: "auto" });
      });
    };
    if (fine && layers.length) window.addEventListener("pointermove", onMove);

    // Recalculate trigger positions as fonts/lazy images change layout
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(scope.current);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      mm.revert();
    };
  }, [scope, isReady]);
}
