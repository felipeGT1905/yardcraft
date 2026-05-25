"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BeforeAfterSlider } from "@/components/design/BeforeAfterSlider";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

const FULLSCREEN_CLOSE_MS = 520;

function useBodyScrollLock(active) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    const html = document.documentElement;
    const body = document.body;
    scrollYRef.current = window.scrollY;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      const restoreY = scrollYRef.current;
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";

      requestAnimationFrame(() => {
        window.scrollTo(0, restoreY);
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event("resize"));
          window.visualViewport?.dispatchEvent(new Event("resize"));
        });
      });
    };
  }, [active]);
}

function subscribePortraitMobileHint(onStoreChange) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(orientation: portrait)");
  mql.addEventListener("change", onStoreChange);
  window.addEventListener("resize", onStoreChange);
  return () => {
    mql.removeEventListener("change", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getPortraitMobileHintSnapshot() {
  if (typeof window === "undefined") return false;
  const isMobile = window.innerWidth < 768;
  const mql = window.matchMedia?.("(orientation: portrait)");
  const isPortrait = mql?.matches ?? window.innerHeight >= window.innerWidth;
  return isMobile && isPortrait;
}

function getPortraitMobileHintServerSnapshot() {
  return false;
}

const LANDSCAPE_MQ = "(orientation: landscape) and (max-height: 600px)";

function subscribeLandscapeMobile(onChange) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(LANDSCAPE_MQ);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getLandscapeMobileSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(LANDSCAPE_MQ).matches;
}

export function PremiumBeforeAfter({
  beforeUrl,
  afterUrl,
  className = "",
  initial = 52,
  beforeLabel = "Before",
  afterLabel = "After",
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [inlineKey, setInlineKey] = useState(0);
  const sliderValueRef = useRef(Number(initial) || 52);
  const closeTimerRef = useRef(0);

  const modalActive = open || closing;

  const portraitMobileHint = useSyncExternalStore(
    subscribePortraitMobileHint,
    getPortraitMobileHintSnapshot,
    getPortraitMobileHintServerSnapshot,
  );

  const isLandscapeMobile = useSyncExternalStore(
    subscribeLandscapeMobile,
    getLandscapeMobileSnapshot,
    () => false,
  );

  const hasAny = Boolean(beforeUrl || afterUrl);
  const canCompare = Boolean(beforeUrl && afterUrl);
  const showRotateHint = modalActive && portraitMobileHint && canCompare;
  const onChange = useCallback((pct) => {
    sliderValueRef.current = pct;
  }, []);

  /** Mobile portrait: fixed 16/9 frame (landscape photos fit naturally). Desktop/tablet: dvh fill. */
  const useMobileAspectFrame = isLandscapeMobile || portraitMobileHint;

  const openFullscreen = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    setClosing(false);
    setOpen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    if (!modalActive) return;
    setFullscreenVisible(false);
    setClosing(true);
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setInlineKey((k) => k + 1);
    }, FULLSCREEN_CLOSE_MS);
  }, [modalActive]);

  useEffect(() => {
    return () => window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => setFullscreenVisible(false));
      return;
    }
    let raf = 0;
    queueMicrotask(() => {
      setFullscreenVisible(false);
      raf = requestAnimationFrame(() => setFullscreenVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!modalActive) return;
    function onKey(e) {
      if (e.key === "Escape") closeFullscreen();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalActive, closeFullscreen]);

  useBodyScrollLock(modalActive);

  const outerClass = cx(
    "touch-pan-y-safe relative w-full",
    useMobileAspectFrame ? undefined : className,
  );

  const sharedSliderProps = {
    beforeUrl,
    afterUrl,
    beforeLabel,
    afterLabel,
    initial: sliderValueRef.current,
    onChange,
    chromeless: true,
    handleOnlyDrag: true,
    eagerImages: true,
    layoutResetToken: inlineKey,
    imageObjectClass: portraitMobileHint ? "object-[center_42%]" : "object-center",
  };

  function renderInlineSlider(aspect) {
    if (modalActive) {
      if (aspect === "fill") {
        return <div className="h-full w-full bg-black" aria-hidden="true" />;
      }
      return <div className="aspect-video w-full bg-black" aria-hidden="true" />;
    }
    return (
      <BeforeAfterSlider
        key={`inline-${inlineKey}`}
        {...sharedSliderProps}
        aspect={aspect}
        className={aspect === "fill" ? "h-full min-h-0 w-full bg-black" : "w-full"}
      />
    );
  }

  return (
    <>
      <div className={outerClass}>
        {useMobileAspectFrame ? (
          <div className="relative w-full overflow-hidden rounded-b-2xl shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">
            {renderInlineSlider("16/9")}
            {portraitMobileHint && !canCompare ? (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 bg-linear-to-t from-black/45 to-transparent"
                aria-hidden="true"
              />
            ) : null}
            {hasAny && canCompare && !modalActive ? <FullscreenButton onClick={openFullscreen} /> : null}
            <RotateHint visible={!modalActive && portraitMobileHint && canCompare} />
          </div>
        ) : (
          <div className="relative h-full min-h-0 w-full overflow-hidden">
            {renderInlineSlider("fill")}
            {hasAny && canCompare && !modalActive ? <FullscreenButton onClick={openFullscreen} /> : null}
            <RotateHint visible={!modalActive && portraitMobileHint && canCompare} />
          </div>
        )}
      </div>

      {modalActive ? (
        <div
          className={cx(
            "fixed inset-0 z-100 touch-none overflow-hidden overscroll-none bg-black/91 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
            fullscreenVisible ? "opacity-100" : "opacity-0",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen before and after comparison"
        >
          <div className="absolute inset-0 z-0" onClick={closeFullscreen} />
          <div
            className={cx(
              "absolute inset-0 z-10 overflow-hidden transition duration-500 ease-in-out",
              fullscreenVisible ? "scale-100 opacity-100" : "scale-[0.96] opacity-0",
            )}
          >
            <div className="relative h-full w-full">
              <BeforeAfterSlider
                key="fullscreen"
                {...sharedSliderProps}
                aspect="fill"
                allowPinchZoom
                className="h-full w-full"
              />
              <RotateHint visible={showRotateHint} fullscreen />
            </div>
          </div>

          <button
            type="button"
            onClick={closeFullscreen}
            className="absolute right-4 top-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            aria-label="Close fullscreen comparison"
          >
            <CloseIcon />
          </button>
        </div>
      ) : null}
    </>
  );
}

function FullscreenButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-4 bottom-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/60 text-white shadow-[0_10px_36px_-14px_rgba(0,0,0,0.88),0_0_0_1px_rgba(255,255,255,0.12)_inset] backdrop-blur-sm transition hover:border-white/48 hover:bg-black/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14 lg:bottom-6 lg:right-6"
      aria-label="Open fullscreen comparison"
    >
      <FullscreenIcon className="h-6 w-6 sm:h-7 sm:w-7" />
    </button>
  );
}

function FullscreenIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function RotateHint({ visible, fullscreen = false }) {
  if (!visible) return null;
  return (
    <div
      className={cx(
        "lux-rotate-hint pointer-events-none absolute left-1/2 z-30 flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center rounded-full border border-white/22 bg-black/65 px-5 py-2.5 text-[12px] font-semibold tracking-[0.12em] text-white shadow-[0_20px_50px_-28px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.1)_inset] backdrop-blur-sm sm:px-6 sm:text-[13px] md:hidden",
        fullscreen
          ? "bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
          : "bottom-3 sm:bottom-4",
      )}
    >
      <span className="mr-2.5 inline-flex h-5 w-5 shrink-0 items-center justify-center sm:h-6 sm:w-6">
        <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" aria-hidden="true">
          <path d="M7 4h10a3 3 0 0 1 3 3v3" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
          <path d="M17 20H7a3 3 0 0 1-3-3v-3" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" />
          <path d="M5 7 3.5 5.5 2 7" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
          <path d="M19 17 20.5 18.5 22 17" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" />
        </svg>
      </span>
      <span className="text-white/95">Rotate for full view</span>
    </div>
  );
}
