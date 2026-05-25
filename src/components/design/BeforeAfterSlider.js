"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function dist2(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Fullscreen inspect: pinch can zoom out slightly below 1; wheel uses same bounds. */
const INSPECT_SCALE_MIN = 0.65;
const INSPECT_SCALE_MAX = 4;

/** Keep transform pan inside the clip box so pinch/pan never widens the page. */
function normalizeInspect(state, width, height) {
  const s = clamp(state.s, INSPECT_SCALE_MIN, INSPECT_SCALE_MAX);
  if (s <= 1.02) {
    return { s, x: 0, y: 0 };
  }
  const maxX = width ? (width * (s - 1)) / 2 : 0;
  const maxY = height ? (height * (s - 1)) / 2 : 0;
  return {
    s,
    x: maxX ? clamp(state.x, -maxX, maxX) : 0,
    y: maxY ? clamp(state.y, -maxY, maxY) : 0,
  };
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = "Before",
  afterLabel = "After",
  initial = 48,
  aspect = "16/9",
  allowDrag = true,
  onChange,
  onUserInteract,
  className = "",
  showRange = false,
  chromeless = false,
  /** When true, only dragging the center handle moves the divider. */
  handleOnlyDrag = false,
  /** When true with handleOnlyDrag, fullscreen-style pinch/pan/zoom on the comparison layer. */
  allowPinchZoom = false,
  /** Hero / above-the-fold: load images immediately (fixes blank hero on slow mobile networks). */
  eagerImages = false,
  /** Bumped by parent after fullscreen exit to force a clean remeasure. */
  layoutResetToken = 0,
  /** Tailwind object-position class for uploaded images (e.g. object-[center_40%]). */
  imageObjectClass = "object-center",
}) {
  const [value, setValue] = useState(clamp(Number(initial) || 50, 0, 100));
  const rootRef = useRef(null);
  const zoomLayerRef = useRef(null);
  const draggingRef = useRef(false);
  const windowDragCleanupRef = useRef(null);
  const pct = useMemo(() => clamp(value, 0, 100), [value]);
  const valueRef = useRef(pct);

  useLayoutEffect(() => {
    valueRef.current = pct;
  }, [pct]);

  function cleanupWindowDragListeners() {
    windowDragCleanupRef.current?.();
    windowDragCleanupRef.current = null;
  }

  /** Ensures drag ends if pointerup/cancel fires outside the slider (capture quirks, iOS, etc.). */
  function armWindowDragListeners(pointerId, captureTarget) {
    cleanupWindowDragListeners();
    if (typeof window === "undefined") return;
    const fn = (ev) => {
      if (ev.pointerId !== pointerId) return;
      draggingRef.current = false;
      cleanupWindowDragListeners();
      try {
        captureTarget.releasePointerCapture?.(pointerId);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("pointerup", fn, true);
    window.addEventListener("pointercancel", fn, true);
    windowDragCleanupRef.current = () => {
      window.removeEventListener("pointerup", fn, true);
      window.removeEventListener("pointercancel", fn, true);
    };
  }

  const isInspectMode = Boolean(handleOnlyDrag && allowPinchZoom);
  const [inspect, setInspect] = useState({ s: 1, x: 0, y: 0 });
  const inspectRef = useRef(inspect);

  useLayoutEffect(() => {
    inspectRef.current = inspect;
  }, [inspect]);

  const pointersRef = useRef(new Map());
  const pinchRef = useRef(null);
  const panRef = useRef(null);
  const inspectActiveRef = useRef(false);
  const rootBoxRef = useRef({ w: 0, h: 0 });
  const remeasureRafRef = useRef(0);
  const onChangeRef = useRef(onChange);

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [rootBox, setRootBox] = useState({ w: 0, h: 0 });

  function setInspectBoth(next) {
    const root = rootRef.current;
    const normalized = normalizeInspect(
      next,
      root?.clientWidth ?? 0,
      root?.clientHeight ?? 0,
    );
    setInspect(normalized);
    inspectRef.current = normalized;
  }

  const hasBefore = Boolean(beforeUrl);
  const hasAfter = Boolean(afterUrl);
  const hasAny = hasBefore || hasAfter;
  const canCompare = hasBefore && hasAfter;

  function notifyChange(nextPct) {
    onChangeRef.current?.(nextPct);
  }

  useEffect(() => {
    return () => {
      cleanupWindowDragListeners();
      draggingRef.current = false;
    };
  }, []);

  /** Sync external `initial` without fighting drag or pinch/pan (avoids parent echo loops). */
  useEffect(() => {
    if (initial === undefined || initial === null) return;
    if (draggingRef.current || inspectActiveRef.current) return;
    const n = Number(initial);
    if (!Number.isFinite(n)) return;
    const next = clamp(n, 0, 100);
    queueMicrotask(() => {
      if (draggingRef.current || inspectActiveRef.current) return;
      setValue((prev) => (Math.abs(prev - next) < 0.05 ? prev : next));
    });
  }, [initial]);

  function setFromClientX(clientX) {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    if (!rect.width) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setValue(clamp(next, 0, 100));
  }

  function setInspectActive(active) {
    inspectActiveRef.current = active;
  }

  function syncInspectPointers() {
    const active = pointersRef.current.size > 0;
    setInspectActive(active);
  }

  function onTrackPointerDown(e) {
    if (!allowDrag || handleOnlyDrag || !canCompare) return;
    onUserInteract?.();
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    armWindowDragListeners(e.pointerId, e.currentTarget);
    setFromClientX(e.clientX);
  }

  function onTrackPointerMove(e) {
    if (!allowDrag || handleOnlyDrag) return;
    if (!draggingRef.current) return;
    onUserInteract?.();
    setFromClientX(e.clientX);
  }

  function onTrackPointerUp(e) {
    if (!allowDrag || handleOnlyDrag) return;
    cleanupWindowDragListeners();
    const wasDragging = draggingRef.current;
    draggingRef.current = false;
    if (wasDragging) notifyChange(valueRef.current);
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function onInspectPointerDown(e) {
    if (!isInspectMode) return;
    if (e.target.closest("[data-ba-handle]")) return;
    e.stopPropagation();
    if (draggingRef.current) {
      draggingRef.current = false;
      cleanupWindowDragListeners();
    }
    const el = zoomLayerRef.current;
    if (el?.setPointerCapture) {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2) {
      const pts = Array.from(pointersRef.current.values()).slice(0, 2);
      pinchRef.current = {
        d0: dist2(pts[0], pts[1]),
        s0: inspectRef.current.s,
      };
      panRef.current = null;
    } else if (pointersRef.current.size === 1) {
      startInspectPan(e.clientX, e.clientY);
    }
    syncInspectPointers();
    if (pointersRef.current.size >= 1) e.preventDefault();
  }

  function startInspectPan(clientX, clientY) {
    if (inspectRef.current.s <= 1.02) {
      panRef.current = null;
      return;
    }
    panRef.current = {
      cx: clientX,
      cy: clientY,
      ox: inspectRef.current.x,
      oy: inspectRef.current.y,
    };
    pinchRef.current = null;
  }

  function onInspectPointerMove(e) {
    if (!isInspectMode) return;
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const pts = Array.from(pointersRef.current.values()).slice(0, 2);
      const d = dist2(pts[0], pts[1]);
      const { d0, s0 } = pinchRef.current;
      if (d0 > 4) {
        const ratio = d / d0;
        const s = clamp(s0 * ratio, INSPECT_SCALE_MIN, INSPECT_SCALE_MAX);
        setInspectBoth({ ...inspectRef.current, s });
      }
    } else if (pointersRef.current.size === 1 && panRef.current) {
      const p = panRef.current;
      setInspectBoth({
        ...inspectRef.current,
        x: p.ox + (e.clientX - p.cx),
        y: p.oy + (e.clientY - p.cy),
      });
    }
    if (pointersRef.current.size >= 1) e.preventDefault();
  }

  function onInspectPointerUp(e) {
    if (!isInspectMode) return;
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      pinchRef.current = null;
      if (pointersRef.current.size === 1) {
        const remaining = Array.from(pointersRef.current.values())[0];
        startInspectPan(remaining.x, remaining.y);
      }
    }
    if (pointersRef.current.size === 0) {
      panRef.current = null;
      queueMicrotask(() => notifyChange(valueRef.current));
    }
    syncInspectPointers();
    const el = zoomLayerRef.current;
    if (el?.releasePointerCapture) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
  }

  useEffect(() => {
    if (!isInspectMode) return;
    const el = zoomLayerRef.current;
    if (!el) return;
    function onWheel(ev) {
      if (!ev.ctrlKey && !ev.metaKey) return;
      ev.preventDefault();
      const cur = inspectRef.current;
      const nextS = clamp(cur.s + -ev.deltaY * 0.009, INSPECT_SCALE_MIN, INSPECT_SCALE_MAX);
      setInspectBoth({ ...cur, s: nextS });
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isInspectMode]);

  function remeasureRoot(force = false) {
    const root = rootRef.current;
    if (!root) return;

    const w = root.clientWidth;
    const h = root.clientHeight;
    const prev = rootBoxRef.current;

    if (!force && Math.abs(prev.w - w) < 1 && Math.abs(prev.h - h) < 1) {
      return;
    }

    rootBoxRef.current = { w, h };

    if (isInspectMode) {
      setRootBox({ w, h });
      setInspectBoth({ s: 1, x: 0, y: 0 });
    }

    if (force) {
      draggingRef.current = false;
      cleanupWindowDragListeners();
      pointersRef.current.clear();
      pinchRef.current = null;
      panRef.current = null;
      setInspectActive(false);
    }
  }

  function scheduleRemeasure(force = false) {
    if (typeof window === "undefined") return;
    window.cancelAnimationFrame(remeasureRafRef.current);
    remeasureRafRef.current = window.requestAnimationFrame(() => {
      remeasureRoot(force);
    });
  }

  /** Track root size for screen-fixed divider clip + re-clamp pan on resize (fullscreen inspect only). */
  useLayoutEffect(() => {
    if (isInspectMode) {
      scheduleRemeasure(true);
    }
  }, [layoutResetToken, isInspectMode]);

  useEffect(() => {
    if (!isInspectMode) return;
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      scheduleRemeasure(false);
    });
    ro.observe(root);
    return () => {
      ro.disconnect();
      window.cancelAnimationFrame(remeasureRafRef.current);
    };
  }, [isInspectMode]);

  useEffect(() => {
    if (!isInspectMode || typeof window === "undefined") return;
    function onViewportChange() {
      scheduleRemeasure(false);
    }
    window.addEventListener("resize", onViewportChange);
    window.visualViewport?.addEventListener("resize", onViewportChange);
    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.visualViewport?.removeEventListener("resize", onViewportChange);
      window.cancelAnimationFrame(remeasureRafRef.current);
    };
  }, [isInspectMode]);

  const trackTouchClass = isInspectMode ? "touch-none" : "touch-pan-y-safe";

  function onHandlePointerDown(e) {
    if (!allowDrag || !canCompare) return;
    if (inspectActiveRef.current) return;
    onUserInteract?.();
    e.stopPropagation();
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    armWindowDragListeners(e.pointerId, e.currentTarget);
    setFromClientX(e.clientX);
  }

  function onHandlePointerMove(e) {
    if (!allowDrag || !canCompare) return;
    if (!draggingRef.current) return;
    onUserInteract?.();
    setFromClientX(e.clientX);
  }

  function onHandlePointerUp(e) {
    cleanupWindowDragListeners();
    if (!draggingRef.current) {
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {
        /* ignore */
      }
      return;
    }
    draggingRef.current = false;
    notifyChange(valueRef.current);
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function onDragLostPointerCapture() {
    cleanupWindowDragListeners();
    const wasDragging = draggingRef.current;
    draggingRef.current = false;
    if (wasDragging) notifyChange(valueRef.current);
  }

  const zoomTransform = {
    transform: `translate(${inspect.x}px, ${inspect.y}px) scale(${inspect.s})`,
    transformOrigin: "50% 50%",
  };

  const afterImg = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={afterUrl || beforeUrl}
      alt=""
      draggable={false}
      decoding="async"
      loading={eagerImages ? "eager" : "lazy"}
      fetchPriority={eagerImages ? "high" : undefined}
      className={cx(
        "yc-uploaded-photo pointer-events-none absolute inset-0 h-full w-full select-none object-cover",
        imageObjectClass,
      )}
    />
  );

  const beforeImg = hasBefore ? (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={beforeUrl}
      alt=""
      draggable={false}
      decoding="async"
      loading={eagerImages ? "eager" : "lazy"}
      fetchPriority={eagerImages ? "high" : undefined}
      className={cx(
        "yc-uploaded-photo pointer-events-none absolute inset-0 h-full w-full select-none object-cover",
        imageObjectClass,
      )}
    />
  ) : null;

  const dividerOverlay =
    canCompare ? (
      <div
        className="pointer-events-none absolute inset-y-0 z-30"
        style={{ left: `calc(${pct}% - 0.5px)` }}
      >
        <div className="h-full w-px bg-white/45 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]" />
        <button
          type="button"
          data-ba-handle
          role="slider"
          tabIndex={0}
          aria-label="Drag to compare before and after"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          className={[
            handleOnlyDrag ? "pointer-events-auto touch-manipulation" : "pointer-events-none",
            "absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/28 bg-black/45 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:h-12 sm:w-12",
          ].join(" ")}
          onPointerDown={handleOnlyDrag ? onHandlePointerDown : undefined}
          onPointerMove={handleOnlyDrag ? onHandlePointerMove : undefined}
          onPointerUp={handleOnlyDrag ? onHandlePointerUp : undefined}
          onPointerCancel={handleOnlyDrag ? onHandlePointerUp : undefined}
          onLostPointerCapture={handleOnlyDrag ? onDragLostPointerCapture : undefined}
        >
          <span className="absolute inset-0 grid place-items-center text-white/85">
            <HandleArrows />
          </span>
        </button>
      </div>
    ) : null;

  const comparisonInner = (
    <>
      {afterImg}
      {hasBefore ? (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - pct}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - pct}% 0 0)`,
          }}
        >
          {beforeImg}
        </div>
      ) : null}
      {!isInspectMode ? dividerOverlay : null}
    </>
  );


  return (
    <div
      className={[
        chromeless
          ? "relative h-full w-full"
          : "rounded-3xl border border-card-border bg-black/10 p-3 sm:p-4",
        className,
      ].join(" ")}
    >
      <div
        ref={rootRef}
        role="group"
        aria-label="Before and after image comparison"
        className={[
          "relative isolate overflow-hidden",
          trackTouchClass,
          aspect === "fill" ? "h-full min-h-full min-h-[240px]" : "",
          chromeless
            ? "h-full w-full bg-black"
            : "rounded-2xl border border-card-border bg-black/20 shadow-[0_0_0_1px_rgba(0,0,0,0.35),0_24px_60px_-45px_rgba(0,0,0,0.8)]",
        ].join(" ")}
        style={{
          ...(aspect === "fill" ? {} : { aspectRatio: aspect }),
          ...(isInspectMode && rootBox.w > 0 ? { "--ba-root-w": `${rootBox.w}px` } : {}),
        }}
        onPointerDown={handleOnlyDrag ? undefined : onTrackPointerDown}
        onPointerMove={handleOnlyDrag ? undefined : onTrackPointerMove}
        onPointerUp={handleOnlyDrag ? undefined : onTrackPointerUp}
        onPointerCancel={handleOnlyDrag ? undefined : onTrackPointerUp}
        onLostPointerCapture={handleOnlyDrag ? undefined : onDragLostPointerCapture}
      >
        {hasAny ? (
          <>
            {isInspectMode ? (
              <>
                <div
                  ref={zoomLayerRef}
                  className="touch-none absolute inset-0 h-full w-full"
                  onPointerDown={onInspectPointerDown}
                  onPointerMove={onInspectPointerMove}
                  onPointerUp={onInspectPointerUp}
                  onPointerCancel={onInspectPointerUp}
                >
                  <div
                    className="absolute inset-0 h-full will-change-transform"
                    style={zoomTransform}
                  >
                    {afterImg}
                  </div>
                  {hasBefore ? (
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 z-[1] overflow-hidden"
                      style={{ width: `${pct}%` }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full w-[var(--ba-root-w,100%)] will-change-transform"
                        style={zoomTransform}
                      >
                        {beforeImg}
                      </div>
                    </div>
                  ) : null}
                </div>
                {dividerOverlay}
              </>
            ) : (
              <div className="relative h-full w-full">{comparisonInner}</div>
            )}

            {canCompare ? (
              <>
                <div
                  className={[
                    "pointer-events-none absolute left-4 z-20 rounded-full border border-white/14 bg-black/35 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.12em] uppercase text-white/80 backdrop-blur-sm shadow-[0_8px_24px_-18px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)]",
                    chromeless ? "top-4" : "top-4",
                  ].join(" ")}
                >
                  {beforeLabel}
                </div>
                <div
                  className={[
                    "pointer-events-none absolute right-4 z-20 rounded-full border border-white/14 bg-black/35 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.12em] uppercase text-white/80 backdrop-blur-sm shadow-[0_8px_24px_-18px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)]",
                    chromeless ? "top-4" : "top-4",
                  ].join(" ")}
                >
                  {afterLabel}
                </div>
              </>
            ) : null}
          </>
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-xs text-muted">
            Add before/after images to see the comparison.
          </div>
        )}
      </div>

      {showRange && !chromeless ? (
        <div className="mt-4 flex items-center gap-4 px-1">
          <div className="text-[11px] font-medium tracking-wide text-muted">Reveal</div>
          <input
            aria-label="Before/after slider"
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={(e) => {
              onUserInteract?.();
              setValue(Number(e.target.value));
            }}
            className="w-full accent-[color-mix(in_oklab,var(--gold)_55%,var(--green))]"
            disabled={!canCompare}
          />
          <div className="w-10 text-right text-[11px] tabular-nums text-muted">
            {pct}%
          </div>
        </div>
      ) : null}
    </div>
  );
}

function HandleArrows() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M6 12h12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
