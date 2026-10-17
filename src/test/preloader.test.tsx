import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { GlowPreloader } from "@/components/glow/GlowPreloader";
import { preloaderState } from "@/components/glow/preloader-state";

describe("GlowPreloader", () => {
  beforeEach(() => {
    preloaderState.reset();
    // Default matchMedia mock (standard motion)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("renders with status accessibility role, brand name, and skip button", () => {
    render(<GlowPreloader />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("GLOW")).toBeInTheDocument();
    expect(screen.getByText(/Skin & Hair Clinic/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /skip/i })).toBeInTheDocument();
  });

  it("triggers onComplete when Skip is clicked", () => {
    const onComplete = vi.fn();

    render(<GlowPreloader onComplete={onComplete} />);

    const skipButton = screen.getByRole("button", { name: /skip/i });
    fireEvent.click(skipButton);

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("honors prefers-reduced-motion by bypassing immediately", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const onComplete = vi.fn();

    render(<GlowPreloader onComplete={onComplete} />);

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
