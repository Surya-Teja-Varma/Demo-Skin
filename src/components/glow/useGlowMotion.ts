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
 *  data-stagger       – children cascade in as section enters
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

  // 1. Core Scroll Triggers & Page Motion (Initialized ONCE on mount — never torn down or thrashed)
  useEffect(() => {
    if (!scope.current) return;
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

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

        // Section Heading & Element Reveals
        q("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: desktop ? 45 : 18,
            autoAlpha: 0,
            duration: desktop ? 0.85 : 0.5,
            ease: desktop ? "power3.out" : "power2.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: {
              trigger: el,
              start: desktop ? "top 88%" : "top 88%",
              once: true,
            },
          }),
        );

        // Image Clip-path Wipes
        const clips: Record<string, string> = {
          left: "inset(0% 100% 0% 0%)",
          right: "inset(0% 0% 0% 100%)",
          up: "inset(100% 0% 0% 0%)",
          down: "inset(0% 0% 100% 0%)",
        };
        q("[data-clip]").forEach((el) => {
          const dir = el.getAttribute("data-clip") || "up";
          const t = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: desktop ? "top 85%" : "top 86%",
              once: true,
            },
          });
          t.from(el, {
            clipPath: clips[dir] ?? clips["up"]!,
            duration: desktop ? 1.1 : 0.6,
            ease: desktop ? "expo.inOut" : "power2.out",
            clearProps: "clipPath",
          });
          const img = el.querySelector("img");
          if (img) {
            t.from(
              img,
              {
                scale: desktop ? 1.25 : 1.04,
                duration: desktop ? 1.3 : 0.6,
                ease: desktop ? "expo.out" : "power2.out",
                clearProps: "transform",
              },
              0.05,
            );
          }
        });

        // Group / Card Staggers: Section container triggers the cascade smoothly
        q("[data-stagger]").forEach((el) =>
          gsap.from(el.children, {
            y: desktop ? 60 : 20,
            autoAlpha: 0,
            rotateX: desktop ? -12 : 0,
            transformPerspective: 900,
            duration: desktop ? 0.85 : 0.55,
            stagger: desktop ? 0.08 : 0.04,
            ease: desktop ? "power3.out" : "power2.out",
            clearProps: "transform,opacity,visibility",
            scrollTrigger: {
              trigger: el,
              start: desktop ? "top 82%" : "top 86%",
              once: true,
            },
          }),
        );

        // Word-by-word Scrub
        q("[data-words-scrub]").forEach((el) =>
          gsap.fromTo(
            el.querySelectorAll("span"),
            { opacity: 0.18 },
            {
              opacity: 1,
              stagger: desktop ? 0.1 : 0.05,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: desktop ? "top 80%" : "top 85%",
                end: "bottom 45%",
                scrub: desktop ? true : 0.4,
              },
            },
          ),
        );

        // Section Progress Line
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

        // Desktop-only Features (Parallax & Tilt)
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

        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
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

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("pointermove", onMove);
      mm.revert();
    };
  }, [scope]);

  // 2. Hero Intro: On Mobile, visible from frame 0 behind the opaque curtain. On Desktop, editorial entrance when ready.
  useEffect(() => {
    if (!scope.current) return;
    const q = gsap.utils.selector(scope.current);
    const isDesktop =
      typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set(q("[data-hero-word], [data-hero-fade], [data-hero-img]"), { clearProps: "all" });
      return;
    }

    if (!isDesktop) {
      // Mobile: Swift, elegant entrance for hero text, buttons, and image
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(
        q("[data-hero-word]"),
        { yPercent: 60, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.02,
          clearProps: "transform,opacity,visibility",
        },
      )
        .fromTo(
          q("[data-hero-fade]"),
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.04,
            clearProps: "transform,opacity,visibility",
          },
          "-=0.4",
        )
        .fromTo(
          q("[data-hero-img]"),
          { clipPath: "inset(25% 0% 0% 0% round 40px)", scale: 1.05, autoAlpha: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            autoAlpha: 1,
            duration: 0.65,
            clearProps: "clipPath,transform,opacity,visibility",
          },
          "-=0.45",
        );

      return () => {
        tl.kill();
      };
    }

    // Desktop: Wait for preloader reveal before animating in
    if (!isReady) {
      gsap.set(q("[data-hero-word]"), { yPercent: 110, rotate: 3, autoAlpha: 0 });
      gsap.set(q("[data-hero-fade]"), { y: 20, autoAlpha: 0 });
      gsap.set(q("[data-hero-img]"), {
        clipPath: "inset(100% 0% 0% 0% round 200px)",
        scale: 1.15,
        autoAlpha: 0,
      });
      return;
    }

    // Desktop intro animation
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(
      q("[data-hero-word]"),
      { yPercent: 110, rotate: 3, autoAlpha: 0 },
      {
        yPercent: 0,
        rotate: 0,
        autoAlpha: 1,
        duration: 0.85,
        stagger: 0.035,
        clearProps: "transform,opacity,visibility",
      },
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
        { clipPath: "inset(100% 0% 0% 0% round 200px)", scale: 1.1, autoAlpha: 0 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          scale: 1,
          autoAlpha: 1,
          duration: 0.95,
          ease: "expo.out",
          clearProps: "clipPath,transform,opacity,visibility",
        },
        0,
      );

    return () => {
      tl.kill();
    };
  }, [scope, isReady]);
}
