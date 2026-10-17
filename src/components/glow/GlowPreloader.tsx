import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { preloaderState } from "./preloader-state";

interface GlowPreloaderProps {
  /** Called when the curtain begins pulling upward, revealing the content underneath */
  onRevealStart?: () => void;
  /** Called when the preloader has completely finished and the page animations can start */
  onComplete?: () => void;
}

export function GlowPreloader({ onRevealStart, onComplete }: GlowPreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  const onRevealStartRef = useRef(onRevealStart);
  onRevealStartRef.current = onRevealStart;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // If already preloaded in this session/mount, skip immediately
    if (preloaderState.hasLoaded) {
      hasFinishedRef.current = true;
      if (containerRef.current) containerRef.current.style.display = "none";
      onRevealStartRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

    if (isMobile) {
      preloaderState.hasLoaded = true;
      hasFinishedRef.current = true;
      if (containerRef.current) containerRef.current.style.display = "none";
      onRevealStartRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    preloaderState.hasLoaded = true;

    // Lock scroll during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      document.body.style.overflow = originalOverflow;
      hasFinishedRef.current = true;
      if (containerRef.current) containerRef.current.style.display = "none";
      onRevealStartRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    // Curved SVG Curtain Path Morph definitions
    const initialPath = "M0,1005S175,995,500,995s500,5,500,5V0H0Z";
    const curvePath = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
    const flatPath = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

    const ctx = gsap.context(() => {
      // Master timeline: completes in ~2.95s before revealing home page
      const master = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          hasFinishedRef.current = true;
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
          onCompleteRef.current?.();
        },
      });

      // Initial state
      gsap.set(pathRef.current, { attr: { d: initialPath } });
      gsap.set(barFillRef.current, { scaleX: 0, transformOrigin: "left center" });

      // 1. Logo is present on screen from frame 0 with subtle settle (0.35s)
      master.fromTo(
        contentRef.current,
        { scale: 0.95 },
        { scale: 1, duration: 0.35, ease: "power2.out" },
      );

      // 2. Minimalist thin accent bar glides smoothly across (1.75s)
      master.fromTo(
        barFillRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.75, ease: "power1.inOut" },
        "-=0.1",
      );

      // Micro-pause at completion (0.04s)
      master.to({}, { duration: 0.04 });

      // 3. Quick fade out of center logo and top/bottom accents (0.16s)
      master.to([contentRef.current, headerRef.current, footerRef.current], {
        y: -18,
        autoAlpha: 0,
        duration: 0.16,
        ease: "power2.in",
      });

      // 4. Curved SVG Curtain Morphing Reveal (Awwwards curved arch wipe)
      // Step A: Morph bottom edge into an arc / curve pulling upward (0.32s)
      master.to(pathRef.current, {
        duration: 0.32,
        attr: { d: curvePath },
        ease: "power2.inOut",
        onStart: () => {
          if (containerRef.current) {
            containerRef.current.style.pointerEvents = "none";
          }
          onRevealStartRef.current?.();
        },
      });

      // Step B: Flatten curve to top (0.22s)
      master.to(pathRef.current, {
        duration: 0.22,
        attr: { d: flatPath },
        ease: "power2.inOut",
      });

      // Step C: Slide remaining curtain out of view (0.24s)
      master.to(
        containerRef.current,
        {
          yPercent: -130,
          duration: 0.24,
          ease: "power3.inOut",
          onComplete: () => {
            if (containerRef.current) {
              containerRef.current.style.display = "none";
            }
          },
        },
        "-=0.06",
      );
    }, containerRef);

    // Keyboard support: Escape skips the preloader cleanly
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        ctx.revert();
        document.body.style.overflow = originalOverflow;
        if (containerRef.current) {
          containerRef.current.style.display = "none";
        }
        onRevealStartRef.current?.();
        onCompleteRef.current?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, []);

  const handleSkip = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    document.body.style.overflow = "";
    if (containerRef.current) {
      containerRef.current.style.display = "none";
    }
    onRevealStartRef.current?.();
    onCompleteRef.current?.();
  };

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label="Loading GLOW Clinic"
      className="fixed inset-0 z-[100] hidden lg:flex flex-col justify-between overflow-hidden bg-transparent text-forest-foreground select-none will-change-transform"
    >
      {/* Morphing Curved SVG Curtain Background: Pure solid #0B1E1B (no white radial haze!) */}
      <svg
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path ref={pathRef} fill="#0B1E1B" d="M0,1005S175,995,500,995s500,5,500,5V0H0Z" />
      </svg>

      {/* Top Header Bar */}
      <div
        ref={headerRef}
        className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-mint/80">
          <span className="size-1.5 rounded-full bg-turquoise animate-pulse" />
          <span>Clinical Excellence</span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="group rounded-full border border-mint/20 bg-forest/40 px-3.5 py-1 text-[11px] font-medium tracking-wider text-forest-foreground/75 backdrop-blur-md transition-all hover:border-turquoise/50 hover:bg-forest/70 hover:text-turquoise active:scale-95"
        >
          Skip <span className="opacity-50 text-[9px] group-hover:opacity-100">[Esc]</span>
        </button>
      </div>

      {/* Central Brand Showcase: Rendered immediately and solidly (no double-loading!) */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center px-6 text-center"
      >
        {/* Botanical Emblem */}
        <div className="relative mb-6">
          {/* Subtle spinning halo ring */}
          <div
            aria-hidden="true"
            className="absolute -inset-3.5 rounded-full border border-mint/15 border-dashed animate-spin-slow opacity-60"
          />

          {/* Central Emblem Badge */}
          <div className="relative grid size-20 place-items-center rounded-full bg-forest-gradient shadow-[0_0_25px_rgba(92,229,192,0.18)] sm:size-24">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="size-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:size-14"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Central Leaf Petal */}
              <path d="M32 11C23 20 23 31 32 40C41 31 41 20 32 11Z" fill="url(#curved-petal-c)" />
              {/* Left Leaf Petal */}
              <path
                d="M15 28C24 24 33 27 40 35C30 39 21 36 15 28Z"
                fill="url(#curved-petal-l)"
                opacity="0.92"
              />
              {/* Right Leaf Petal */}
              <path
                d="M49 28C40 24 31 27 24 35C34 39 43 36 49 28Z"
                fill="url(#curved-petal-r)"
                opacity="0.92"
              />
              {/* Delicate stem */}
              <path
                d="M32 36V51"
                stroke="url(#curved-stem)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Central glowing core pistil */}
              <circle cx="32" cy="26" r="3.2" fill="#5CE5C0" />
              <circle cx="32" cy="26" r="1.5" fill="#E8FDF7" />
              <defs>
                <linearGradient
                  id="curved-petal-c"
                  x1="32"
                  y1="11"
                  x2="32"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7CE8D0" />
                  <stop offset="1" stopColor="#2D7A6D" />
                </linearGradient>
                <linearGradient
                  id="curved-petal-l"
                  x1="15"
                  y1="28"
                  x2="40"
                  y2="35"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5CE5C0" />
                  <stop offset="1" stopColor="#1B554B" />
                </linearGradient>
                <linearGradient
                  id="curved-petal-r"
                  x1="49"
                  y1="28"
                  x2="24"
                  y2="35"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#A7F4E1" />
                  <stop offset="1" stopColor="#266D60" />
                </linearGradient>
                <linearGradient
                  id="curved-stem"
                  x1="32"
                  y1="36"
                  x2="32"
                  y2="51"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5CE5C0" />
                  <stop offset="1" stopColor="#1B554B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand Name & Subtitle */}
        <h1 className="font-display text-4xl tracking-[0.22em] text-[#E8FDF7] drop-shadow-[0_2px_12px_rgba(92,229,192,0.15)] sm:text-5xl">
          GLOW
        </h1>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.38em] text-mint/80 sm:text-xs">
          Skin & Hair Clinic
        </p>

        {/* Minimalist Thin Accent Bar (No percentage count, no numbers) */}
        <div className="mt-5 w-28 sm:w-36">
          <div className="relative h-[1.5px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              ref={barFillRef}
              className="h-full w-full rounded-full bg-turquoise shadow-[0_0_8px_rgba(92,229,192,0.6)]"
              style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div
        ref={footerRef}
        className="relative z-10 flex flex-col items-center justify-between gap-2 px-6 pb-6 text-center sm:flex-row sm:px-10 sm:pb-8"
      >
        <p className="text-[11px] tracking-widest text-mint/60 uppercase">
          Dermatology · Trichology · Laser
        </p>
        <p className="text-[11px] text-forest-foreground/50">
          Bengaluru · Consultation by Appointment
        </p>
      </div>
    </div>
  );
}
