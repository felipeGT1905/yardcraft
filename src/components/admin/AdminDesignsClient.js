"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { ToastHost } from "@/components/ui/ToastHost";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { validateBrowserFile } from "@/lib/uploadImage";
import { previewUrlWithCacheBust, uploadDesignImage } from "@/lib/adminUploadClient";
import { dedupeDesignsByNumber } from "@/lib/designSlug";
import {
  formatDesignNumber,
  getDesignNumber,
  getNextDesignSlug,
  isValidDesignSlug,
  resolveDesignSlug,
} from "@/lib/designSlug";
import { formatDisplayDate, formatDisplayDateTime } from "@/lib/formatDate";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function isUrl(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function computeStatus(d) {
  const before = Boolean(d?.before_image);
  const after = Boolean(d?.after_image);
  if (before && after) return { key: "ready", label: "Ready", pct: 100, tone: "ready" };
  if (before && !after) return { key: "missing_after", label: "Missing after", pct: 50, tone: "warn" };
  if (!before && after) return { key: "missing_before", label: "Missing before", pct: 50, tone: "warn" };
  return { key: "draft", label: "Draft", pct: 0, tone: "muted" };
}

function toneClasses(tone) {
  if (tone === "ready") {
    return "border-[color-mix(in_oklab,var(--green)_45%,var(--card-border))] bg-[color-mix(in_oklab,var(--green)_12%,transparent)] text-foreground";
  }
  if (tone === "warn") {
    return "border-[color-mix(in_oklab,var(--gold)_40%,var(--card-border))] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)] text-foreground";
  }
  return "border-card-border bg-black/10 text-muted";
}

function slugNumericOrder(slug) {
  const n = getDesignNumber(slug);
  return n != null ? n : Number.POSITIVE_INFINITY;
}

function compareSlugNumericAsc(a, b) {
  const na = slugNumericOrder(a.slug);
  const nb = slugNumericOrder(b.slug);
  if (na !== nb) return na - nb;
  return (a.slug || "").localeCompare(b.slug || "", undefined, { numeric: true, sensitivity: "base" });
}

function designCreatedAtMs(d) {
  const raw = d?.created_at || d?.updated_at;
  if (!raw) return null;
  const ms = new Date(raw).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function parseDateRangeStart(dateStr) {
  if (!dateStr) return null;
  const ms = new Date(`${dateStr}T00:00:00`).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function parseDateRangeEnd(dateStr) {
  if (!dateStr) return null;
  const ms = new Date(`${dateStr}T23:59:59.999`).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function matchesCreatedRange(d, fromStr, toStr) {
  const fromMs = parseDateRangeStart(fromStr);
  const toMs = parseDateRangeEnd(toStr);
  if (fromMs == null && toMs == null) return true;
  const created = designCreatedAtMs(d);
  if (created == null) return false;
  if (fromMs != null && created < fromMs) return false;
  if (toMs != null && created > toMs) return false;
  return true;
}

function matchesDesignNumberRange(slug, minStr, maxStr) {
  const minRaw = minStr.trim();
  const maxRaw = maxStr.trim();
  if (!minRaw && !maxRaw) return true;
  const num = slugNumericOrder(slug);
  if (num === Number.POSITIVE_INFINITY) return false;
  let min = minRaw ? Number.parseInt(minRaw, 10) : null;
  let max = maxRaw ? Number.parseInt(maxRaw, 10) : null;
  if (min != null && Number.isNaN(min)) min = null;
  if (max != null && Number.isNaN(max)) max = null;
  if (min != null && max != null && min > max) [min, max] = [max, min];
  if (min != null && num < min) return false;
  if (max != null && num > max) return false;
  return true;
}

const RANGE_INPUT_CLASS =
  "w-full rounded-xl border border-card-border bg-card px-3 py-2 text-[12px] text-foreground placeholder:text-muted shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-gold/50";

function sortDesigns(designs, sortKey) {
  const copy = designs.slice();
  const byUpdated = (a, b) => {
    const at = new Date(a.updated_at || a.created_at || 0).getTime();
    const bt = new Date(b.updated_at || b.created_at || 0).getTime();
    return bt - at;
  };

  if (sortKey === "completion") {
    return copy.sort((a, b) => {
      const sa = computeStatus(a).pct;
      const sb = computeStatus(b).pct;
      if (sb !== sa) return sb - sa;
      return compareSlugNumericAsc(a, b);
    });
  }

  if (sortKey === "recent") {
    return copy.sort(byUpdated);
  }

  // default: slug number ascending (design 1, 2, 3…)
  return copy.sort(compareSlugNumericAsc);
}

export function AdminDesignsClient({ initialDesigns }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlug = useMemo(
    () => resolveDesignSlug(searchParams.get("slug") ?? "") ?? "",
    [searchParams],
  );
  const [query, setQuery] = useState("");

  function selectSlug(slug) {
    const next = resolveDesignSlug(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("slug", next);
    else params.delete("slug");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }
  const [designs, setDesigns] = useState(() =>
    dedupeDesignsByNumber(Array.isArray(initialDesigns) ? initialDesigns : []),
  );
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);
  const [progressByKey, setProgressByKey] = useState({});
  const [previewVersion, setPreviewVersion] = useState({});
  const [filter, setFilter] = useState("all"); // all | ready | draft | needs
  const [sort, setSort] = useState("slug"); // slug | recent | completion
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [designNumMin, setDesignNumMin] = useState("");
  const [designNumMax, setDesignNumMax] = useState("");

  const toastIdRef = useRef(0);
  const activeUploadRef = useRef(null);
  const uploadAbortRef = useRef(null);

  function mergeDesignRecord(prev, next) {
    if (!next?.slug) return prev;
    const idx = prev.findIndex((d) => d.slug === next.slug);
    let merged;
    if (idx === -1) {
      merged = [next, ...prev];
    } else {
      merged = prev.slice();
      merged[idx] = next;
    }
    return dedupeDesignsByNumber(merged);
  }

  useEffect(() => {
    return () => uploadAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    const canonical = resolveDesignSlug(selectedSlug);
    if (canonical && selectedSlug && canonical !== selectedSlug) {
      selectSlug(canonical);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- normalize legacy padded slugs once
  }, [selectedSlug]);

  function pushToast(toast) {
    const id = `${Date.now()}-${toastIdRef.current++}`;
    setToasts((prev) => [...prev, { id, durationMs: 2600, ...toast }]);
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  const filtered = useMemo(() => {
    const q = query.trim();
    let list = designs.filter((d) => isValidDesignSlug(d.slug));
    if (q) {
      if (/^\d+$/.test(q)) {
        const num = Number.parseInt(q, 10);
        list = list.filter((d) => getDesignNumber(d.slug) === num);
      } else {
        list = [];
      }
    }
    if (filter === "ready") list = list.filter((d) => computeStatus(d).key === "ready");
    if (filter === "draft") list = list.filter((d) => computeStatus(d).key === "draft");
    if (filter === "needs") {
      list = list.filter((d) => {
        const st = computeStatus(d).key;
        return st === "missing_before" || st === "missing_after";
      });
    }
    if (createdFrom || createdTo) {
      list = list.filter((d) => matchesCreatedRange(d, createdFrom, createdTo));
    }
    if (designNumMin.trim() || designNumMax.trim()) {
      list = list.filter((d) => matchesDesignNumberRange(d.slug, designNumMin, designNumMax));
    }
    return sortDesigns(list, sort);
  }, [designs, filter, query, sort, createdFrom, createdTo, designNumMin, designNumMax]);

  const hasRangeFilters = Boolean(
    createdFrom || createdTo || designNumMin.trim() || designNumMax.trim(),
  );

  const selected = useMemo(() => {
    const slug = resolveDesignSlug(selectedSlug);
    if (!slug) return null;
    return designs.find((d) => resolveDesignSlug(d.slug) === slug) ?? null;
  }, [designs, selectedSlug]);

  const selectedStatus = useMemo(() => computeStatus(selected), [selected]);
  const publicUrl = useMemo(() => (selected?.slug ? `/design/${selected.slug}` : ""), [selected]);

  const activeUploadKey = selected?.slug
    ? [`before:${resolveDesignSlug(selected.slug)}`, `after:${resolveDesignSlug(selected.slug)}`].find(
        (key) => progressByKey[key] != null,
      )
    : null;
  const activeUploadProgress = activeUploadKey ? progressByKey[activeUploadKey] : null;
  const activeUploadLabel = activeUploadKey?.startsWith("before:") ? "Before" : "After";

  function clearUploadProgress(key) {
    setProgressByKey((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function upload(kind, file) {
    setError("");
    const slug = resolveDesignSlug(selectedSlug);
    if (!slug) {
      setError("Pick a property number first.");
      pushToast({ type: "error", title: "Select a property first" });
      return;
    }
    if (!file) {
      setError("Choose a file to upload.");
      pushToast({ type: "error", title: "Choose a file" });
      return;
    }

    const uploadKey = `${kind}:${slug}`;
    if (activeUploadRef.current === uploadKey) {
      pushToast({ type: "error", title: "Upload in progress", message: "Please wait for the current upload." });
      return;
    }

    uploadAbortRef.current?.abort();
    const controller = new AbortController();
    uploadAbortRef.current = controller;
    activeUploadRef.current = uploadKey;

    setBusy(uploadKey);
    setProgressByKey((prev) => ({ ...prev, [uploadKey]: 0 }));

    try {
      const json = await uploadDesignImage({
        slug,
        kind,
        file,
        signal: controller.signal,
        onProgress: (pct) => {
          setProgressByKey((prev) => ({ ...prev, [uploadKey]: pct }));
        },
      });

      const next = json.design;
      setDesigns((prev) => mergeDesignRecord(prev, next));
      setPreviewVersion((prev) => ({
        ...prev,
        [`${kind}:${next.slug}`]: Date.now(),
      }));

      if (next.slug && resolveDesignSlug(next.slug) !== slug) {
        selectSlug(next.slug);
      } else if (next.slug && selectedSlug !== next.slug) {
        selectSlug(next.slug);
      }

      pushToast({
        type: "success",
        title: `${kind === "before" ? "Before" : "After"} image saved`,
        message: formatDesignNumber(next.slug || slug),
      });
    } catch (e) {
      if (controller.signal.aborted) return;
      const message = e?.message || "Upload failed";
      setError(message);
      pushToast({
        type: "error",
        title: "Upload failed",
        message,
      });
    } finally {
      if (activeUploadRef.current === uploadKey) activeUploadRef.current = null;
      setBusy(null);
      clearUploadProgress(uploadKey);
    }
  }

  async function createNewSlug() {
    const slug = getNextDesignSlug(designs);
    setError("");
    setBusy(`create:${slug}`);
    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to create slug");
      const next = json.design;
      setDesigns((prev) => mergeDesignRecord(prev, next));
      selectSlug(next.slug);
      pushToast({
        type: "success",
        title: "Property created",
        message: formatDesignNumber(next.slug),
      });
    } catch (e) {
      pushToast({ type: "error", title: "Create failed", message: e?.message || "Try again" });
      setError(e?.message || "Create failed");
    } finally {
      setBusy(null);
    }
  }

  async function clearImage(kind) {
    const slug = resolveDesignSlug(selectedSlug);
    if (!slug) return;
    setError("");
    setBusy(`clear:${kind}:${slug}`);
    try {
      const res = await fetch(`/api/designs/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(kind === "before" ? { before_image: null } : { after_image: null }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to remove image");

      const next = json.design;
      setDesigns((prev) => mergeDesignRecord(prev, next));
      setPreviewVersion((prev) => ({
        ...prev,
        [`${kind}:${next.slug}`]: Date.now(),
      }));
      pushToast({ type: "success", title: "Image removed", message: formatDesignNumber(slug) });
    } catch (e) {
      pushToast({ type: "error", title: "Remove failed", message: e?.message || "Try again" });
      setError(e?.message || "Remove failed");
    } finally {
      setBusy(null);
    }
  }

  const selectedCanonicalSlug = useMemo(
    () => resolveDesignSlug(selected?.slug || selectedSlug) || "",
    [selected?.slug, selectedSlug],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <ToastHost toasts={toasts} onRemove={removeToast} />

      {/* LEFT: Property manager — below asset manager on mobile, left on desktop */}
      <div className="order-2 xl:order-1 rounded-3xl border border-card-border bg-black/10 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.25),0_22px_60px_-52px_rgba(0,0,0,0.9)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold tracking-wide text-muted">Properties</div>
            <div className="mt-1 text-base font-semibold tracking-tight text-foreground">
              Slug manager
            </div>
            <div className="mt-1 text-xs text-muted">
              Scan faster. Upload faster. Launch ready pages.
            </div>
          </div>
          <span className="rounded-full border border-card-border bg-background/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted">
            {filtered.length === designs.length
              ? `${designs.length} total`
              : `${filtered.length} of ${designs.length}`}
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={String(busy || "").startsWith("create:")}
            onClick={createNewSlug}
            className="w-full justify-center"
          >
            Add Slug
          </Button>

          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by number…"
              className="w-full rounded-2xl border border-card-border bg-card px-10 py-3 text-sm text-foreground placeholder:text-muted shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <div className="pointer-events-none -mt-9 ml-3 h-6 w-6 text-muted">
              <SearchIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
              All
            </FilterPill>
            <FilterPill active={filter === "needs"} onClick={() => setFilter("needs")}>
              Needs images
            </FilterPill>
            <FilterPill active={filter === "ready"} onClick={() => setFilter("ready")}>
              Ready
            </FilterPill>
            <FilterPill active={filter === "draft"} onClick={() => setFilter("draft")}>
              Draft
            </FilterPill>

            <span className="ml-auto inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide text-muted">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-card-border bg-card px-3 py-1 text-[11px] text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="slug">Slug (1, 2, 3…)</option>
                <option value="recent">Recently updated</option>
                <option value="completion">Completion</option>
              </select>
            </span>
          </div>

          <div className="rounded-2xl border border-card-border bg-card/40 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Filters
            </div>

            <div className="mt-2.5">
              <label className="text-[11px] font-medium text-muted">Created between</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={createdFrom}
                  onChange={(e) => setCreatedFrom(e.target.value)}
                  aria-label="Created from date"
                  className={RANGE_INPUT_CLASS}
                />
                <input
                  type="date"
                  value={createdTo}
                  onChange={(e) => setCreatedTo(e.target.value)}
                  aria-label="Created to date"
                  className={RANGE_INPUT_CLASS}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-[11px] font-medium text-muted">Design number</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={designNumMin}
                  onChange={(e) => setDesignNumMin(e.target.value)}
                  placeholder="From (e.g. 20)"
                  aria-label="Design number from"
                  className={RANGE_INPUT_CLASS}
                />
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={designNumMax}
                  onChange={(e) => setDesignNumMax(e.target.value)}
                  placeholder="To (e.g. 40)"
                  aria-label="Design number to"
                  className={RANGE_INPUT_CLASS}
                />
              </div>
            </div>

            {hasRangeFilters ? (
              <button
                type="button"
                onClick={() => {
                  setCreatedFrom("");
                  setCreatedTo("");
                  setDesignNumMin("");
                  setDesignNumMax("");
                }}
                className="mt-3 text-[11px] font-semibold text-muted underline-offset-2 transition hover:text-foreground hover:underline"
              >
                Clear range filters
              </button>
            ) : null}
          </div>
        </div>

        <div className="lux-scrollbar mt-4 max-h-[560px] overflow-auto pr-1">
          <Stagger className="flex flex-col gap-2" selector="[data-stagger]" stagger={0.04} y={10}>
            {filtered.map((d) => {
              const active = resolveDesignSlug(d.slug) === resolveDesignSlug(selectedSlug);
              const st = computeStatus(d);
              const updatedAt = d.updated_at || d.created_at || null;
              const thumb = d.after_image || d.before_image || "";

              return (
                <button
                  data-stagger
                  key={d.slug}
                  type="button"
                  onClick={() => selectSlug(d.slug)}
                  className={cx(
                    "w-full rounded-3xl border px-3 py-3 text-left transition",
                    active
                      ? "border-[color-mix(in_oklab,var(--gold)_28%,var(--card-border))] bg-white/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--gold)_18%,transparent),0_22px_60px_-50px_rgba(0,0,0,0.95)]"
                      : "border-card-border bg-black/10 hover:bg-white/5 hover:-translate-y-px",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-card-border bg-black/15">
                      {isUrl(thumb) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-[11px] text-muted">
                          —
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.35))]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-lg font-semibold tabular-nums tracking-tight text-foreground">
                          {formatDesignNumber(d.slug)}
                        </div>
                        <span
                          className={cx(
                            "rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide",
                            toneClasses(st.tone),
                          )}
                        >
                          {st.label}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <CheckIcon ok={Boolean(d.before_image)} />
                          <span>Before</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CheckIcon ok={Boolean(d.after_image)} />
                          <span>After</span>
                        </span>
                        {updatedAt ? (
                          <span className="ml-auto text-muted/80">Updated {formatDisplayDate(updatedAt)}</span>
                        ) : null}
                      </div>

                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/15">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--green)_70%,var(--gold)),var(--gold))]"
                          style={{ width: `${st.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {filtered.length === 0 ? (
              <div data-stagger className="rounded-3xl border border-card-border bg-card px-4 py-4 text-sm text-muted">
                No properties match your search/filters.
              </div>
            ) : null}
          </Stagger>
        </div>

        <div className="mt-4 rounded-2xl border border-card-border bg-card px-4 py-3 text-xs text-muted">
          Tip: “Ready” means both images are set. Uploading also creates the property if it doesn’t exist yet.
        </div>
      </div>

      {/* CENTER: Asset manager — first on mobile, right on desktop */}
      <div className="order-1 xl:order-2 rounded-3xl border border-card-border bg-black/10 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.25),0_22px_60px_-52px_rgba(0,0,0,0.9)]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-wide text-muted">Selected property</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <div className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                  {selected?.slug ? formatDesignNumber(selected.slug) : "—"}
                </div>
                {selected?.slug ? (
                  <span
                    className={cx(
                      "rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide",
                      toneClasses(selectedStatus.tone),
                    )}
                  >
                    {selectedStatus.label} • {selectedStatus.pct}%
                  </span>
                ) : null}
              </div>
              {selected?.slug ? (
                <div className="mt-2 text-xs text-muted">
                  Last modified:{" "}
                  <span className="text-foreground">
                    {formatDisplayDateTime(selected.updated_at || selected.created_at || null) || "—"}
                  </span>
                </div>
              ) : (
                <div className="mt-2 text-xs text-muted">
                  Pick a property number on the left to manage before/after assets.
                </div>
              )}
            </div>

            {selected?.slug ? (
              <div className="flex flex-wrap gap-2">
                <Button href={publicUrl} variant="secondary">
                  Preview page
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    const url = `${window.location.origin}${publicUrl}`;
                    navigator.clipboard?.writeText(url);
                    pushToast({
                      type: "success",
                      title: "Copied link",
                      message: formatDesignNumber(selected.slug),
                    });
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-card-border bg-card px-4 py-3 text-sm font-semibold tracking-tight text-foreground transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  Copy link
                </button>
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center justify-center rounded-full border border-card-border bg-black/10 px-4 py-3 text-sm font-semibold tracking-tight text-muted opacity-70"
                  title="Archive coming soon"
                >
                  Archive
                </button>
              </div>
            ) : null}
          </div>

          {activeUploadProgress != null ? (
            <Reveal className="rounded-2xl border border-card-border bg-card px-4 py-3 text-xs text-muted">
              Uploading {activeUploadLabel}…{" "}
              <span className="text-foreground">{activeUploadProgress}%</span>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[color-mix(in_oklab,var(--green)_75%,var(--gold))] transition-[width] duration-200"
                  style={{ width: `${activeUploadProgress}%` }}
                />
              </div>
            </Reveal>
          ) : null}

          {error ? (
            <Reveal className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </Reveal>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <AssetCard
              title="Before"
              kind="before"
              url={selected?.before_image || ""}
              previewVersion={previewVersion[`before:${selectedCanonicalSlug}`] || 0}
              uploadProgress={progressByKey[`before:${selectedCanonicalSlug}`]}
              disabled={!selected?.slug}
              busy={
                busy === `before:${selectedCanonicalSlug}` ||
                busy === `clear:before:${selectedCanonicalSlug}`
              }
              updatedAt={selected?.updated_at || selected?.created_at || null}
              updatedBy={selected?.updated_by || null}
              guidance="Recommended: 1600×1000+ • JPG/PNG/WebP • Max 20 MB"
              onUpload={(file) => upload("before", file)}
              onClear={() => clearImage("before")}
              onValidationError={(message) => {
                setError(message);
                pushToast({ type: "error", title: "Invalid image", message });
              }}
            />
            <AssetCard
              title="After"
              kind="after"
              url={selected?.after_image || ""}
              previewVersion={previewVersion[`after:${selectedCanonicalSlug}`] || 0}
              uploadProgress={progressByKey[`after:${selectedCanonicalSlug}`]}
              disabled={!selected?.slug}
              busy={
                busy === `after:${selectedCanonicalSlug}` ||
                busy === `clear:after:${selectedCanonicalSlug}`
              }
              updatedAt={selected?.updated_at || selected?.created_at || null}
              updatedBy={selected?.updated_by || null}
              guidance="Recommended: 1600×1000+ • JPG/PNG/WebP • Max 20 MB"
              onUpload={(file) => upload("after", file)}
              onClear={() => clearImage("after")}
              onValidationError={(message) => {
                setError(message);
                pushToast({ type: "error", title: "Invalid image", message });
              }}
            />
          </div>

          <div className="rounded-2xl border border-card-border bg-card px-4 py-3 text-xs text-muted">
            Workflow: <span className="text-foreground">Select</span> →{" "}
            <span className="text-foreground">Upload before</span> →{" "}
            <span className="text-foreground">Upload after</span> →{" "}
            <span className="text-foreground">Preview</span> →{" "}
            <span className="text-foreground">Launch</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide transition",
        active
          ? "border-[color-mix(in_oklab,var(--gold)_28%,var(--card-border))] bg-white/10 text-foreground"
          : "border-card-border bg-black/10 text-muted hover:bg-white/5 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function AssetCard({
  title,
  kind,
  url,
  previewVersion = 0,
  uploadProgress,
  disabled,
  busy,
  updatedAt,
  updatedBy,
  guidance,
  onUpload,
  onClear,
  onValidationError,
}) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadTick, setUploadTick] = useState(0);
  const inputRef = useRef(null);

  const displayUrl = url ? previewUrlWithCacheBust(url, previewVersion || uploadTick) : "";

  function pickFile(nextFile) {
    if (!nextFile) return;
    const validation = validateBrowserFile(nextFile);
    if (!validation.ok) {
      onValidationError?.(validation.message);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setFile(nextFile);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer?.files?.[0] || null);
  }

  async function handleUploadClick() {
    if (!file) return;
    try {
      await onUpload(file);
      setFile(null);
      setUploadTick(Date.now());
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      // Parent handles errors/toasts.
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-card-border bg-card p-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-20 h-[220px] w-[220px] rounded-full bg-gold/8 blur-3xl" />
        <div className="absolute -left-20 bottom-[-110px] h-[260px] w-[260px] rounded-full bg-green/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.18),transparent_65%)]" />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="relative">
          <div className="text-xs font-semibold tracking-wide text-muted">{title} image</div>
          <div className="mt-1 text-[11px] text-muted">
            {url ? (
              <span className="text-foreground">Saved</span>
            ) : (
              <span className="text-muted">Not set</span>
            )}
            {updatedAt ? <span className="ml-2 text-muted/80">• {formatDisplayDateTime(updatedAt)}</span> : null}
            {updatedBy ? <span className="ml-2 text-muted/80">• By {String(updatedBy).slice(0, 8)}…</span> : null}
          </div>
          <div className="mt-2 text-[11px] text-muted/85">{guidance}</div>
        </div>
        <span className="rounded-full border border-card-border bg-black/10 px-3 py-1 text-[11px] text-muted">
          {kind}
        </span>
      </div>

      <div className="relative mt-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cx(
            "relative overflow-hidden rounded-2xl border border-card-border bg-black/10 transition",
            dragOver ? "bg-white/5 border-[color-mix(in_oklab,var(--green)_35%,var(--card-border))]" : "",
          )}
        >
          {displayUrl ? (
            <a
              href={displayUrl}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displayUrl} alt="" className="h-44 w-full object-cover" />
            </a>
          ) : (
            <div className="flex h-44 items-center justify-center px-6 text-center text-xs text-muted">
              Drag & drop an image here, or choose a file below.
            </div>
          )}

          <div
            className={cx(
              "pointer-events-none absolute inset-0 grid place-items-center bg-black/40 text-xs font-semibold tracking-wide text-foreground transition",
              dragOver ? "opacity-100" : "opacity-0",
            )}
          >
            Drop to select file
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex flex-col gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={disabled || busy}
          onChange={(e) => pickFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-white/15"
        />

        {uploadProgress != null ? (
          <div className="text-[11px] text-muted">
            Uploading… <span className="text-foreground">{uploadProgress}%</span>
          </div>
        ) : null}

        {file ? (
          <div className="rounded-2xl border border-card-border bg-black/10 px-3 py-2 text-[11px] text-muted">
            Selected: <span className="text-foreground">{file.name}</span>
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            disabled={disabled || busy || !file}
            onClick={handleUploadClick}
            className="w-full justify-center"
          >
            {busy ? "Working…" : url ? "Replace image" : "Upload image"}
          </Button>
          <button
            type="button"
            disabled={disabled || busy || !url}
            onClick={onClear}
            className={cx(
              "inline-flex items-center justify-center rounded-full border px-6 py-3.5 text-[13px] font-medium tracking-[0.04em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
              url
                ? "border-card-border bg-black/10 text-foreground hover:bg-white/5"
                : "border-card-border bg-black/10 text-muted opacity-60",
            )}
          >
            Remove
          </button>
        </div>

        {url ? (
          <div className="break-all rounded-2xl border border-card-border bg-black/10 px-4 py-3 text-[11px] text-muted">
            {url}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon({ ok }) {
  return (
    <span
      className={cx(
        "inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]",
        ok
          ? "border-[color-mix(in_oklab,var(--green)_45%,var(--card-border))] bg-[color-mix(in_oklab,var(--green)_16%,transparent)] text-foreground"
          : "border-card-border bg-black/10 text-muted",
      )}
      aria-hidden="true"
    >
      {ok ? "✓" : "—"}
    </span>
  );
}

