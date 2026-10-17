import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

export type Enquiry = { name: string; phone: string; email: string; speciality: string };
export const SPECIALITIES = ["Skin", "Hair", "Laser", "Other"] as const;

export function validateEnquiry(v: Enquiry) {
  const e: Partial<Record<keyof Enquiry, string>> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13)
    e.phone = "Enter a valid phone number (10–13 digits).";
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = "That email doesn't look right.";
  if (!SPECIALITIES.includes(v.speciality as (typeof SPECIALITIES)[number]))
    e.speciality = "Choose a speciality.";
  return e;
}

/**
 * BACKEND INTEGRATION POINT: replace this demo function with a real call
 * (e.g. a server function saving to a database or emailing the front desk).
 */
async function submitEnquiry(_v: Enquiry): Promise<void> {
  await new Promise((r) => setTimeout(r, 900));
}

export function BookingForm({
  tone = "light",
  compact = false,
  idPrefix,
}: {
  tone?: "light" | "dark";
  compact?: boolean;
  idPrefix: string;
}) {
  const [v, setV] = useState<Enquiry>({ name: "", phone: "", email: "", speciality: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Enquiry, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const dark = tone === "dark";

  const set = (k: keyof Enquiry) => (e: { target: { value: string } }) => {
    setV((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateEnquiry(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    try {
      await submitEnquiry(v);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const field = cn(
    "w-full rounded-xl border px-3.5 py-2.5 text-base sm:px-4 sm:py-3 sm:text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-ring",
    dark
      ? "border-mint/20 bg-forest-deep/40 text-forest-foreground placeholder:text-forest-foreground/50"
      : "border-input bg-card/80 text-foreground placeholder:text-muted-foreground",
  );
  const label = cn(
    "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em]",
    dark ? "text-mint" : "text-muted-foreground",
  );
  const err = "mt-1 text-xs text-destructive";

  if (status === "done") {
    return (
      <div
        role="status"
        className={cn(
          "rounded-2xl p-6 text-center",
          dark ? "text-forest-foreground" : "text-foreground",
        )}
      >
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-turquoise text-forest-deep text-2xl">
          ✓
        </div>
        <p className="font-display text-2xl">Thank you, {v.name.split(" ")[0]}.</p>
        <p
          className={cn(
            "mt-2 text-sm",
            dark ? "text-forest-foreground/75" : "text-muted-foreground",
          )}
        >
          Your consultation enquiry has been recorded. Our clinical team will contact you shortly to
          confirm your preferred appointment slot.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setV({ name: "", phone: "", email: "", speciality: "" });
          }}
          className="mt-5 text-sm font-semibold underline underline-offset-4"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={cn("grid gap-3 sm:gap-4", !compact && "sm:grid-cols-2")}
    >
      <div className={cn(!compact && "sm:col-span-2")}>
        <label htmlFor={`${idPrefix}-name`} className={label}>
          Full name
        </label>
        <input
          id={`${idPrefix}-name`}
          className={field}
          value={v.name}
          onChange={set("name")}
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className={err}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-phone`} className={label}>
          Phone
        </label>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          inputMode="tel"
          className={field}
          value={v.phone}
          onChange={set("phone")}
          autoComplete="tel"
          placeholder="+91 98xxx xxxxx"
          aria-invalid={!!errors.phone}
        />
        {errors.phone && <p className={err}>{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-email`} className={label}>
          Email <span className="normal-case tracking-normal opacity-70">(optional)</span>
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          className={field}
          value={v.email}
          onChange={set("email")}
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className={err}>{errors.email}</p>}
      </div>
      <fieldset className={cn(!compact && "sm:col-span-2")}>
        <legend className={label}>Speciality</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SPECIALITIES.map((s) => (
            <label
              key={s}
              className={cn(
                "cursor-pointer rounded-xl border px-2.5 py-2 sm:px-3 sm:py-2.5 text-center text-xs min-[360px]:text-sm font-medium transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                v.speciality === s
                  ? "border-turquoise bg-turquoise text-forest-deep"
                  : dark
                    ? "border-mint/20 text-forest-foreground hover:border-mint/50"
                    : "border-input hover:border-forest",
              )}
            >
              <input
                type="radio"
                name={`${idPrefix}-spec`}
                value={s}
                checked={v.speciality === s}
                onChange={set("speciality")}
                className="sr-only"
              />
              {s}
            </label>
          ))}
        </div>
        {errors.speciality && <p className={err}>{errors.speciality}</p>}
      </fieldset>
      <div className={cn(!compact && "sm:col-span-2")}>
        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "group relative w-full overflow-hidden rounded-full px-5 py-3.5 sm:px-6 sm:py-4 text-sm font-semibold transition-transform duration-300 active:scale-[0.98] disabled:opacity-70",
            dark ? "bg-turquoise text-forest-deep" : "bg-primary text-primary-foreground",
          )}
        >
          <span className="relative z-10">
            {status === "sending" ? "Sending…" : "Request a consultation →"}
          </span>
          <span
            className={cn(
              "absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0",
              dark ? "bg-mint" : "bg-forest-deep",
            )}
          />
        </button>
        {status === "error" && (
          <p role="alert" className={err}>
            Something went wrong. Please try again or call the clinic.
          </p>
        )}
        <p
          className={cn(
            "mt-2.5 sm:mt-3 text-center text-[11px]",
            dark ? "text-forest-foreground/60" : "text-muted-foreground",
          )}
        >
          Your details are secure. We only contact you regarding your consultation.
        </p>
      </div>
    </form>
  );
}
