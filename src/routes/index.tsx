import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useGlowMotion } from "@/components/glow/useGlowMotion";
import { GlowPreloader } from "@/components/glow/GlowPreloader";
import { BookingForm } from "@/components/glow/BookingForm";
import hero from "@/assets/hero.jpg";
import clinic from "@/assets/clinic.jpg";
import hair from "@/assets/hair.jpg";
import serum from "@/assets/serum.jpg";
import facial from "@/assets/facial.jpg";
import laser from "@/assets/laser.jpg";
import restoration from "@/assets/restoration.jpg";
import doc1 from "@/assets/doc1.jpg";
import doc2 from "@/assets/doc2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GLOW Skin & Hair Clinic — Dermatology & Trichology Care" },
      {
        name: "description",
        content:
          "GLOW is a premier skin and hair clinic: acne, pigmentation, hair fall, laser and rejuvenation consultations with personalised treatment plans.",
      },
      { property: "og:title", content: "GLOW Skin & Hair Clinic" },
      {
        property: "og:description",
        content:
          "Healthy skin. Stronger hair. Care that understands you. Book a consultation enquiry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { href: "#home", label: "Home" },
  { href: "#treatments", label: "Treatments" },
  { href: "#doctors", label: "Our Doctors" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span data-hero-word className="inline-block">
            {w}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
}

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        "mb-4 sm:mb-5 inline-flex items-center gap-2.5 sm:gap-3 text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em]",
        light ? "text-mint" : "text-forest",
      )}
    >
      <span className={cn("h-px w-6 sm:w-8", light ? "bg-mint" : "bg-forest")} />
      {children}
    </p>
  );
}

function GlowBotanicalLogo({ className = "size-9" }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-full bg-forest-gradient shadow-sm overflow-hidden shrink-0",
        className,
      )}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Central Leaf / Petal */}
        <path d="M32 11C23 20 23 31 32 40C41 31 41 20 32 11Z" fill="url(#nav-petal-c)" />
        {/* Left Leaf Petal */}
        <path
          d="M15 28C24 24 33 27 40 35C30 39 21 36 15 28Z"
          fill="url(#nav-petal-l)"
          opacity="0.9"
        />
        {/* Right Leaf Petal */}
        <path
          d="M49 28C40 24 31 27 24 35C34 39 43 36 49 28Z"
          fill="url(#nav-petal-r)"
          opacity="0.9"
        />
        {/* Delicate stem */}
        <path d="M32 36V51" stroke="url(#nav-stem)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Central glowing pistil */}
        <circle cx="32" cy="26" r="3.2" fill="#5CE5C0" />
        <circle cx="32" cy="26" r="1.5" fill="#E8FDF7" />
        <defs>
          <linearGradient
            id="nav-petal-c"
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
            id="nav-petal-l"
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
            id="nav-petal-r"
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
            id="nav-stem"
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
    </span>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    document.body.style.overflow = open ? "hidden" : "";
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6",
          scrolled ? "glass shadow-soft" : "bg-transparent",
        )}
      >
        <a href="#home" className="group flex items-center gap-2.5" aria-label="GLOW home">
          <GlowBotanicalLogo className="size-9 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-display text-2xl tracking-tight text-forest-deep">GLOW</span>
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-mint hover:text-forest-deep"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a
            href="#book"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-forest-deep active:scale-95 sm:inline-flex"
          >
            Book Appointment
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className={cn(
              "relative grid size-11 place-items-center rounded-full transition-colors duration-300 lg:hidden",
              open ? "bg-turquoise text-forest-deep" : "bg-forest-deep text-forest-foreground",
            )}
          >
            <span
              className={cn(
                "absolute h-0.5 w-5 bg-current transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-5 bg-current transition-opacity",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-5 bg-current transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-1.5",
              )}
            />
          </button>
        </div>
      </nav>
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 -z-10 flex flex-col justify-between overflow-y-auto bg-forest-gradient px-6 py-20 transition-[clip-path] duration-700 ease-[var(--ease-out)] sm:px-10 lg:hidden",
          open
            ? "[clip-path:circle(150%_at_100%_0%)]"
            : "pointer-events-none invisible [clip-path:circle(0%_at_100%_0%)]",
        )}
      >
        <div className="my-auto py-4">
          <ul className="space-y-3 sm:space-y-4">
            {NAV.map((n, i) => (
              <li
                key={n.href}
                style={{ transitionDelay: open ? `${150 + i * 50}ms` : "0ms" }}
                className={cn(
                  "transition-all duration-500",
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
              >
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="inline-block font-display text-3xl text-forest-foreground transition-colors hover:text-turquoise min-[380px]:text-4xl sm:text-5xl"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-4 border-t border-mint/15 sm:mt-10">
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full bg-turquoise px-7 py-4 text-center font-semibold text-forest-deep transition-transform active:scale-95 sm:w-fit"
            >
              Book Appointment
            </a>
            <div className="mt-6 flex flex-col gap-1 text-xs text-forest-foreground/75">
              <a href="tel:+910000000000" className="hover:text-turquoise">
                +91 00000 00000
              </a>
              <p>124 Lotus Boulevard, Indiranagar, Bengaluru</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-24 pb-14 sm:pt-32 lg:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[28rem] rounded-full bg-mint opacity-70 blur-3xl sm:size-[38rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 size-[20rem] rounded-full bg-turquoise/20 blur-3xl sm:size-[28rem]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7 lg:pt-10">
          <p
            data-hero-fade
            className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-forest/20 bg-card/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-forest sm:px-4"
          >
            <span className="size-2 rounded-full bg-turquoise" /> Skin · Hair · Laser
          </p>
          <h1 className="text-fluid-hero text-forest-deep">
            <Words text="Healthy Skin." />
            <br />
            <Words text="Stronger Hair." className="italic text-forest" />
            <br />
            <Words
              text="Care That Understands You."
              className="mt-3 block text-[0.42em] leading-tight text-foreground/80"
            />
          </h1>
          <p
            data-hero-fade
            className="mt-5 sm:mt-7 max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            GLOW pairs careful dermatology consultations with treatment plans shaped around your
            skin, your scalp and your everyday life — explained clearly, at every step.
          </p>
          <div data-hero-fade className="mt-7 flex flex-col gap-3 min-[440px]:flex-row sm:mt-8">
            <a
              href="#book"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary py-2.5 pr-2 pl-6 font-semibold text-primary-foreground shadow-soft transition-all hover:bg-forest-deep active:scale-95"
            >
              Book a consultation
              <span className="grid size-9 sm:size-10 place-items-center rounded-full bg-turquoise text-forest-deep transition-transform group-hover:rotate-45">
                ↗
              </span>
            </a>
            <a
              href="#treatments"
              className="inline-flex items-center justify-center rounded-full border border-forest/30 px-6 py-3 font-semibold text-forest-deep transition-colors hover:bg-mint active:scale-95"
            >
              Explore treatments
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div
            data-hero-img
            className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-t-[999px] rounded-b-4xl shadow-lift sm:max-w-md lg:max-w-none"
          >
            <img
              src={hero}
              alt="Woman with healthy, radiant skin"
              width={1024}
              height={1344}
              className="size-full object-cover"
              data-parallax="-6"
            />
          </div>
          <div
            data-hero-fade
            data-depth="24"
            aria-hidden
            className="absolute -top-3 left-0 sm:-top-4 sm:-left-8"
          >
            <div className="animate-float grid size-20 place-items-center rounded-full bg-forest-gradient text-center sm:size-28">
              <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
                <defs>
                  <path id="c" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-mint text-[9px] tracking-[0.3em] uppercase">
                  <textPath href="#c">Dermatology · Trichology · Laser ·</textPath>
                </text>
              </svg>
              <span className="font-display text-xl sm:text-2xl text-forest-foreground">✦</span>
            </div>
          </div>
          <div
            data-hero-fade
            data-depth="-18"
            className="glass relative mx-auto mt-6 w-full max-w-sm rounded-3xl p-5 shadow-lift sm:mt-8 lg:absolute lg:mt-0 lg:mx-0 lg:-bottom-6 lg:-left-10 xl:-left-16 lg:w-80"
          >
            <div className="flex items-center gap-3.5 border-b border-forest/10 pb-3.5">
              <div className="relative shrink-0">
                <img
                  src={doc1}
                  alt="Dr. A. Sharma, Specialist Dermatologist"
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover ring-2 ring-forest/20 shadow-sm"
                />
                <span className="absolute -bottom-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-forest text-[9px] font-bold text-turquoise ring-2 ring-card">
                  ✓
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 text-xs tracking-tight">★★★★★</span>
                  <span className="text-xs font-bold text-forest-deep">4.9/5</span>
                </div>
                <p className="text-xs font-semibold text-forest-deep truncate">
                  Dr. A. Sharma & Specialists
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  12,000+ patient consultations
                </p>
              </div>
            </div>

            <div className="pt-3">
              <div className="flex items-center justify-between text-xs font-semibold text-forest-deep">
                <span className="inline-flex items-center gap-1.5 text-forest">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Slots open this week
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">Indiranagar</span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Personalised skin & hair care plans with certified specialists.
              </p>

              <a
                href="#book"
                className="group relative mt-3.5 flex w-full items-center justify-between overflow-hidden rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft transition-transform duration-300 active:scale-[0.98]"
              >
                <span className="relative z-10">Quick consultation enquiry</span>
                <span className="relative z-10 grid size-6 place-items-center rounded-full bg-turquoise text-forest-deep transition-transform duration-300 group-hover:rotate-45">
                  ↗
                </span>
                <span className="absolute inset-0 -translate-x-full bg-forest-deep transition-transform duration-500 ease-out group-hover:translate-x-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Acne care",
    "Pigmentation",
    "Scalp health",
    "Laser hair reduction",
    "Rejuvenation",
    "Hair restoration",
  ];
  return (
    <div className="relative z-10 -rotate-1 overflow-hidden bg-forest-deep py-4 text-forest-foreground mt-8 sm:mt-16 sm:py-5">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-2xl italic sm:gap-10 sm:text-4xl">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-8 sm:gap-10">
            {t}
            <span className="text-turquoise not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Intro() {
  const text =
    "Every face and every scalp tells a different story. We listen first, examine carefully, and then build a plan you understand — no rushed decisions, no one-size-fits-all routines.";
  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Eyebrow>About GLOW</Eyebrow>
        <p
          data-words-scrub
          className="max-w-5xl font-display text-[clamp(1.4rem,0.95rem+2.2vw,3.6rem)] leading-[1.15] text-forest-deep"
        >
          {text.split(" ").map((w, i) => (
            <span key={i}>{w} </span>
          ))}
        </p>
        <div className="mt-12 grid items-end gap-6 md:grid-cols-12 sm:mt-16">
          <div data-tilt className="md:col-span-8">
            <div
              data-clip="left"
              className="aspect-[16/10] overflow-hidden rounded-3xl sm:rounded-4xl shadow-lift"
            >
              <img
                src={clinic}
                alt="Calm GLOW treatment room"
                loading="lazy"
                width={1344}
                height={896}
                className="size-full object-cover"
              />
            </div>
          </div>
          <div
            className="md:col-span-4 md:-ml-16 lg:-ml-24 md:mb-8 lg:mb-12 relative max-w-xs mx-auto md:max-w-none"
            data-parallax="-20"
          >
            <div
              data-clip="up"
              className="aspect-square overflow-hidden rounded-[999px] border-4 sm:border-8 border-background shadow-lift"
            >
              <img
                src={serum}
                alt="Skincare serums on stone"
                loading="lazy"
                width={1024}
                height={1024}
                className="size-full object-cover"
              />
            </div>
            <p
              data-reveal
              className="mt-4 sm:mt-6 text-sm sm:text-base text-muted-foreground text-center md:text-left"
            >
              A quiet, unhurried space designed for honest conversations about your skin and hair.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const TREATMENTS = [
  {
    t: "Acne & acne-scar care",
    d: "Assessment of active breakouts and textural scarring, with staged plans that may combine medical and in-clinic options.",
    img: facial,
    cls: "md:col-span-4 md:row-span-2",
    tall: true,
  },
  {
    t: "Pigmentation & uneven tone",
    d: "Understanding triggers like sun, hormones or inflammation before choosing gentle, appropriate approaches.",
    img: serum,
    cls: "md:col-span-2",
  },
  {
    t: "Hair fall & scalp consults",
    d: "Scalp examination and history-taking to explore why shedding is happening.",
    img: hair,
    cls: "md:col-span-2",
  },
  {
    t: "Laser hair reduction",
    d: "Suitability checks and test patches first, with sessions planned around your skin type.",
    img: laser,
    cls: "md:col-span-2",
  },
  {
    t: "Rejuvenation & hydra-style facials",
    d: "Hydrating, resurfacing treatments chosen to support your skin's barrier.",
    img: clinic,
    cls: "md:col-span-2",
  },
  {
    t: "Hair restoration consults",
    d: "Honest discussion of medical, procedural and lifestyle options — and their limits.",
    img: restoration,
    cls: "md:col-span-2",
  },
];

function Treatments() {
  return (
    <section id="treatments" className="relative bg-muted py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-14 md:flex-row md:items-end">
          <div>
            <Eyebrow>Treatments</Eyebrow>
            <h2 data-reveal className="text-fluid-xl text-forest-deep">
              Focused care for
              <br />
              <span className="italic text-forest">skin & scalp</span>
            </h2>
          </div>
          <p data-reveal className="max-w-sm text-sm sm:text-base text-muted-foreground">
            Every treatment begins with a consultation. Results vary between individuals, and your
            doctor will discuss what's realistic for you.
          </p>
        </div>
        <div
          data-stagger
          className="grid auto-rows-[minmax(14rem,auto)] gap-4 md:grid-cols-6 lg:auto-rows-[17rem]"
          style={{ perspective: 1200 }}
        >
          {TREATMENTS.map((x, i) => (
            <a
              key={x.t}
              href="#book"
              className={cn(
                "group relative flex flex-col justify-end overflow-hidden rounded-3xl p-5 sm:p-6 transition-[translate,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-2 hover:shadow-lift focus-visible:-translate-y-2",
                x.cls,
                x.img
                  ? "text-forest-foreground"
                  : x.dark
                    ? "bg-forest-gradient text-forest-foreground"
                    : "bg-mint text-forest-deep",
                x.tall ? "min-h-[20rem] sm:min-h-[26rem]" : "min-h-[14rem]",
              )}
            >
              {x.img && (
                <>
                  <img
                    src={x.img}
                    alt={x.t}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/50 to-transparent" />
                </>
              )}
              <span className="absolute top-4 left-5 sm:top-5 sm:left-6 font-display text-sm opacity-70">
                0{i + 1}
              </span>
              <span className="absolute top-4 right-4 sm:top-5 sm:right-5 grid size-9 sm:size-10 place-items-center rounded-full bg-turquoise text-forest-deep transition-transform duration-500 group-hover:rotate-45">
                ↗
              </span>
              <div className="relative">
                <h3
                  className={cn(
                    "font-display",
                    x.tall ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl lg:text-2xl",
                  )}
                >
                  {x.t}
                </h3>
                <p
                  className={cn(
                    "mt-2 max-w-md text-xs sm:text-sm opacity-80 transition-all duration-500",
                    !x.tall &&
                      "lg:max-h-0 lg:opacity-0 lg:group-hover:max-h-32 lg:group-hover:opacity-80 lg:group-focus-visible:max-h-32 lg:group-focus-visible:opacity-80",
                  )}
                >
                  {x.d}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    t: "Personalised consultation",
    d: "Time to talk through history, concerns and goals — your skin and scalp are examined properly.",
  },
  {
    t: "Clear communication",
    d: "We explain what we see in plain language, including options we don't recommend and why.",
  },
  {
    t: "A plan built for you",
    d: "Treatment plans account for skin type, lifestyle, budget and recovery time.",
  },
  {
    t: "Easy enquiries",
    d: "Request a consultation online or by phone; the front desk arranges a suitable time.",
  },
];

function Why() {
  return (
    <section className="grain relative overflow-hidden bg-forest-gradient py-16 text-forest-foreground sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow light>Why choose us</Eyebrow>
          <h2 data-reveal className="text-fluid-xl">
            Care that
            <br />
            <span className="italic text-turquoise">takes its time.</span>
          </h2>
          <div
            data-clip="right"
            className="mt-8 hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block sm:mt-10"
          >
            <img
              src={hair}
              alt="Doctor examining a patient's scalp"
              loading="lazy"
              className="size-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="mb-8 h-px w-full bg-mint/20 sm:mb-10">
            <div data-progress className="h-px origin-left bg-turquoise" />
          </div>
          <ol data-stagger className="space-y-3 sm:space-y-4">
            {STEPS.map((s, i) => (
              <li
                key={s.t}
                className="glass-dark group rounded-2xl sm:rounded-3xl p-5 transition-colors duration-500 hover:bg-forest/70 sm:p-9"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="font-display text-3xl sm:text-5xl shrink-0 text-outline [-webkit-text-stroke-color:var(--turquoise)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg sm:text-2xl break-words">{s.t}</h3>
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-forest-foreground/70">
                      {s.d}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const DOCS = [
  {
    n: "Dr. A. Sharma",
    r: "Consultant Dermatologist",
    f: "Acne, pigmentation, skin rejuvenation",
    img: doc1,
  },
  {
    n: "Dr. Ramesh Kumar",
    r: "Trichologist",
    f: "Hair fall, scalp conditions, restoration consults",
    img: doc2,
  },
];

function Doctors() {
  return (
    <section id="doctors" className="relative py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <Eyebrow>Our Doctors</Eyebrow>
          <h2 data-reveal className="text-fluid-xl text-forest-deep">
            Meet the <span className="italic text-forest">specialists</span>
          </h2>
          <p
            data-reveal
            className="mx-auto mt-3 max-w-md text-xs sm:text-sm text-muted-foreground sm:mt-4"
          >
            Experienced, board-certified specialists dedicated to evidence-based dermatology and
            trichology care.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 md:gap-8">
          {DOCS.map((d, i) => (
            <article key={d.n} className={cn("group", i === 1 && "md:mt-24")}>
              <div
                data-clip={i ? "down" : "up"}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:rounded-4xl bg-mint"
              >
                <img
                  src={d.img}
                  alt={`Portrait of ${d.n}`}
                  loading="lazy"
                  width={832}
                  height={1024}
                  className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-105"
                />
                <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold text-forest-deep">
                  Specialist
                </span>
              </div>
              <div
                data-reveal
                className="glass relative mx-2 -mt-12 rounded-2xl p-5 shadow-soft sm:mx-4 sm:-mt-16 sm:rounded-3xl sm:p-6"
              >
                <h3 className="font-display text-2xl sm:text-3xl text-forest-deep">{d.n}</h3>
                <p className="text-xs sm:text-sm font-semibold text-forest mt-0.5">{d.r}</p>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Focus: {d.f}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
const QUOTES = [
  {
    q: "The doctor explained my pigmentation in a way that finally made sense. I left with a plan, not a pile of products.",
    a: "Ananya S., 29",
  },
  {
    q: "I appreciated being told what wouldn't help my hair fall as much as what might.",
    a: "Rahul M., 34",
  },
  {
    q: "Calm clinic, clear follow-ups, and no pressure to add treatments I didn't need.",
    a: "Priyanka K., 41",
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  return (
    <section className="relative overflow-hidden bg-mint py-16 sm:py-24 lg:py-32">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 font-display text-[clamp(8rem,24vw,26rem)] leading-none text-forest/10 select-none"
      >
        "
      </span>
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-8">
        <Eyebrow>Patient voices</Eyebrow>
        <p className="mb-6 sm:mb-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Verified Patient Experiences
        </p>
        <div
          aria-live="polite"
          className="min-h-[14rem] sm:min-h-[10rem] flex flex-col justify-center"
        >
          <blockquote key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="font-display text-[clamp(1.35rem,0.95rem+1.8vw,2.75rem)] leading-snug text-forest-deep">
              "{QUOTES[i]!.q}"
            </p>
            <footer className="mt-4 sm:mt-6 text-xs sm:text-sm font-semibold text-forest">
              — {QUOTES[i]!.a}
            </footer>
          </blockquote>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          {QUOTES.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Show testimonial ${k + 1}`}
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className={cn(
                "h-3 rounded-full transition-all duration-500",
                k === i ? "w-10 bg-forest" : "w-3 bg-forest/30 hover:bg-forest/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const ARTICLES = [
  {
    t: "Sunscreen, decoded: choosing one you'll actually wear",
    c: "Skin",
    img: serum,
    e: "Texture, finish and reapplication matter more than the number on the bottle.",
  },
  {
    t: "Is my hair fall normal? Signs worth a consultation",
    c: "Hair",
    img: hair,
    e: "Daily shedding varies. Here's when a scalp check can help.",
  },
  {
    t: "Preparing for your first laser session",
    c: "Laser",
    img: facial,
    e: "What to avoid beforehand and questions to ask your doctor.",
  },
];

function Articles() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-10 sm:mb-12 flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Journal</Eyebrow>
            <h2 data-reveal className="text-fluid-xl text-forest-deep">
              Skin & hair <span className="italic text-forest">notes</span>
            </h2>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <article key={a.t} className={cn("group", i === 1 && "md:translate-y-12")}>
              <div
                data-clip={["left", "up", "right"][i]}
                className="aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl"
              >
                <img
                  src={a.img}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div data-reveal className="pt-4 sm:pt-5">
                <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest-deep">
                  {a.c}
                </span>
                <h3 className="mt-2.5 sm:mt-3 font-display text-xl sm:text-2xl text-forest-deep transition-colors group-hover:text-forest">
                  {a.t}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{a.e}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-forest">
                  Clinical Guide · 3 min read
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Booking() {
  return (
    <section id="book" className="relative px-3 py-10 sm:px-6 sm:py-20">
      <div className="grain relative mx-auto grid max-w-7xl overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-forest-gradient text-forest-foreground lg:grid-cols-2">
        <div className="relative min-h-60 sm:min-h-72 lg:min-h-full">
          <div data-clip="left" className="absolute inset-0">
            <img src={hero} alt="" loading="lazy" className="size-full object-cover object-top" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-forest-deep" />
        </div>
        <div className="relative p-5 sm:p-12 lg:p-16">
          <Eyebrow light>Appointment enquiry</Eyebrow>
          <h2 data-reveal className="text-fluid-xl">
            Let's start with
            <br />
            <span className="italic text-turquoise">a conversation.</span>
          </h2>
          <p
            data-reveal
            className="mt-3 sm:mt-4 mb-6 sm:mb-8 max-w-md text-xs sm:text-base text-forest-foreground/75"
          >
            Share a few details and choose a speciality. Our clinic will contact you to find a
            suitable consultation slot.
          </p>
          <BookingForm tone="dark" idPrefix="book" />
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const info = [
    { k: "Address", v: "124 Lotus Boulevard, Indiranagar, Bengaluru, 560038" },
    { k: "Phone", v: "+91 00000 00000", href: "tel:+910000000000" },
    { k: "Email", v: "hello@glow-clinic.example", href: "mailto:hello@glow-clinic.example" },
    { k: "Hours", v: "Mon–Sat 10:00–19:00 · Sun closed" },
  ];
  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-8 lg:grid-cols-5 lg:gap-10">
        <div className="lg:col-span-2">
          <Eyebrow>Contact</Eyebrow>
          <h2 data-reveal className="text-fluid-xl text-forest-deep">
            Visit <span className="italic text-forest">GLOW</span>
          </h2>
          <dl data-stagger className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
            {info.map((x) => (
              <div key={x.k} className="border-b pb-4 sm:pb-5">
                <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {x.k}
                </dt>
                <dd className="mt-1 text-base sm:text-lg text-forest-deep break-words">
                  {x.href ? (
                    <a href={x.href} className="hover:text-forest hover:underline">
                      {x.v}
                    </a>
                  ) : (
                    x.v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div
          data-clip="right"
          className="relative min-h-[380px] sm:min-h-[460px] overflow-hidden rounded-3xl sm:rounded-4xl bg-muted/60 shadow-lift border border-forest/10 lg:col-span-3"
        >
          {/* Live Free Interactive Map */}
          <iframe
            title="GLOW Skin & Hair Clinic Indiranagar Location Map"
            src="https://maps.google.com/maps?q=124+Lotus+Boulevard,+Indiranagar,+Bengaluru,+560038&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 size-full border-0 filter contrast-[1.03] brightness-[0.98]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label="Interactive map showing GLOW clinic location in Indiranagar, Bengaluru"
          />

          {/* Hospital Location Pin Overlay with Pulse */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative -translate-y-5 flex flex-col items-center">
              {/* Outer pulsing ping */}
              <span className="absolute -inset-2.5 rounded-full bg-emerald-500/35 animate-ping" />
              {/* Pin badge pill */}
              <div className="relative flex items-center gap-1.5 rounded-full bg-forest-deep px-3.5 py-1.5 text-xs font-semibold text-forest-foreground shadow-lift ring-2 ring-turquoise">
                <span className="grid size-5 place-items-center rounded-full bg-turquoise text-[11px] font-black text-forest-deep">
                  ✚
                </span>
                <span>GLOW Clinic</span>
                <span className="rounded bg-emerald-500/20 px-1 py-0.5 text-[9px] font-bold text-turquoise uppercase tracking-wider">
                  Open
                </span>
              </div>
              {/* Pointer triangle */}
              <div className="size-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-forest-deep drop-shadow-sm" />
              {/* Ripple dot */}
              <span className="mt-0.5 size-2 rounded-full bg-forest-deep/60 blur-[1px]" />
            </div>
          </div>

          {/* Floating Hospital Info Card on Map */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-xs z-10">
            <div className="glass rounded-2xl p-4 shadow-lift backdrop-blur-md border border-card/60">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-forest-gradient text-turquoise shadow-sm text-base">
                  🏥
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-display text-sm font-bold text-forest-deep">
                      GLOW Indiranagar
                    </p>
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    124 Lotus Blvd, Bengaluru
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-forest/10 pt-2.5 text-xs">
                <span className="text-[11px] font-medium text-forest">
                  Valet & parking available
                </span>
                <a
                  href="https://maps.google.com/?q=124+Lotus+Boulevard,+Indiranagar,+Bengaluru,+560038"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-forest-deep hover:text-turquoise underline flex items-center gap-0.5"
                >
                  Directions ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="overflow-hidden bg-forest-deep pt-16 pb-8 text-forest-foreground sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end sm:gap-8">
          <div className="max-w-xl">
            <GlowBotanicalLogo className="size-11 mb-4" />
            <p className="font-display text-2xl sm:text-3xl md:text-4xl">
              Ready when you are.{" "}
              <span className="italic text-turquoise">Your skin, your pace.</span>
            </p>
          </div>
          <a
            href="#book"
            className="inline-flex w-fit rounded-full bg-turquoise px-6 py-3.5 sm:px-7 sm:py-4 font-semibold text-forest-deep transition-transform hover:scale-105 active:scale-95"
          >
            Book Appointment
          </a>
        </div>
        <p
          aria-hidden
          data-reveal
          className="mt-12 sm:mt-16 select-none font-display text-[clamp(4.25rem,24vw,22rem)] leading-[0.8] text-forest"
        >
          GLOW
        </p>
        <div className="mt-8 flex flex-col gap-4 border-t border-mint/15 pt-6 text-xs sm:text-sm text-forest-foreground/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} GLOW Skin & Hair Clinic. All rights reserved.</p>
          <ul className="flex gap-5">
            {["Instagram", "Facebook", "YouTube"].map((s) => (
              <li key={s}>
                <a href="#" className="hover:text-turquoise">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  const ref = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useGlowMotion(ref, { isReady });

  return (
    <>
      {showPreloader && (
        <GlowPreloader
          onRevealStart={() => {
            setIsReady(true);
          }}
          onComplete={() => {
            setShowPreloader(false);
            setIsReady(true);
            requestAnimationFrame(() => {
              window.dispatchEvent(new Event("resize"));
            });
          }}
        />
      )}
      <Nav />
      <main ref={ref}>
        <Hero />
        <Marquee />
        <Intro />
        <Treatments />
        <Why />
        <Doctors />
        <Testimonials />
        <Articles />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
