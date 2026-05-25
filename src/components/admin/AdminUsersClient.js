"use client";

import { useRef, useState } from "react";

import { formatDisplayDateLong } from "@/lib/formatDate";

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

function initials(email) {
  const parts = (email || "").split("@")[0].split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function AdminUsersClient({ initialUsers = [], currentUserId }) {
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(null);
  // null | userId — shows the confirm step before permanent delete
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef(null);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function createAdmin(e) {
    e.preventDefault();
    clearMessages();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to create admin.");
      if (json.warning) setError(`Warning: ${json.warning}`);
      else setSuccess(`Admin account created for ${trimmedEmail}. Share the password with them so they can log in.`);
      setEmail("");
      setPassword("");
      if (json.user) {
        setUsers((prev) => {
          if (prev.some((u) => u.id === json.user.id)) return prev;
          return [{ ...json.user, confirmed: true, lastSignIn: null, invitedAt: new Date().toISOString() }, ...prev];
        });
      }
    } catch (err) {
      setError(err.message || "Failed to create admin.");
    } finally {
      setBusy(false);
      emailRef.current?.focus();
    }
  }

  async function deleteUser(userId) {
    clearMessages();
    setDeleting(userId);
    setConfirmDelete(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed.");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSuccess("User deleted.");
    } catch (err) {
      setError(err.message || "Delete failed.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">

      {/* LEFT: Create admin form */}
      <div className="rounded-3xl border border-card-border bg-black/10 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.25),0_22px_60px_-52px_rgba(0,0,0,0.9)]">
        <div className="relative">
          <div className="text-xs font-semibold tracking-wide text-muted">Create admin</div>
          <div className="mt-1 text-base font-semibold tracking-tight text-foreground">Add a team member</div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Set the email and password yourself, then share the credentials. The account is active immediately.
          </p>
        </div>

        <form onSubmit={createAdmin} className="mt-5 grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted">Email</span>
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              autoComplete="off"
              required
              disabled={busy}
              className="w-full rounded-2xl border border-card-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                autoComplete="new-password"
                required
                minLength={8}
                disabled={busy}
                className="w-full rounded-2xl border border-card-border bg-card px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={busy || !email.trim() || password.length < 8}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--green)_40%,var(--card-border))] bg-[color-mix(in_oklab,var(--green)_14%,transparent)] px-6 py-3 text-sm font-semibold tracking-tight text-foreground transition hover:bg-[color-mix(in_oklab,var(--green)_22%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            {busy ? (
              <>
                <Spinner />
                Creating…
              </>
            ) : (
              "Create admin"
            )}
          </button>
        </form>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs leading-relaxed text-red-200">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mt-4 rounded-2xl border border-[color-mix(in_oklab,var(--green)_35%,var(--card-border))] bg-[color-mix(in_oklab,var(--green)_10%,transparent)] px-4 py-3 text-xs leading-relaxed text-foreground">
            {success}
          </div>
        ) : null}

        <div className="mt-5 rounded-2xl border border-card-border bg-card px-4 py-3 text-xs leading-relaxed text-muted">
          New admins can log in immediately at <span className="font-mono text-foreground/80">/admin/login</span> with the credentials you set.
        </div>
      </div>

      {/* RIGHT: Users list */}
      <div className="rounded-3xl border border-card-border bg-black/10 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.25),0_22px_60px_-52px_rgba(0,0,0,0.9)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold tracking-wide text-muted">Current admins</div>
            <div className="mt-1 text-base font-semibold tracking-tight text-foreground">
              {users.length} {users.length === 1 ? "member" : "members"}
            </div>
          </div>
          <span className="rounded-full border border-card-border bg-background/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted">
            Admin only
          </span>
        </div>

        {users.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-card-border bg-card px-4 py-8 text-center text-sm text-muted">
            No admins yet — create one using the form.
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              const isDeleting = deleting === u.id;
              const isConfirming = confirmDelete === u.id;
              const lastSeen = u.lastSignIn ? formatDisplayDateLong(u.lastSignIn) : null;

              return (
                <div
                  key={u.id}
                  className="flex items-center gap-3 rounded-2xl border border-card-border bg-card px-4 py-3"
                >
                  {/* Avatar */}
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-card-border bg-white/5 text-sm font-semibold tracking-tight text-foreground">
                    {initials(u.email) || "?"}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                        {u.email}
                      </span>
                      {isSelf ? (
                        <span className="rounded-full border border-card-border bg-black/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted">
                          You
                        </span>
                      ) : null}
                      <span
                        className={cx(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
                          u.confirmed
                            ? "border-[color-mix(in_oklab,var(--green)_40%,var(--card-border))] bg-[color-mix(in_oklab,var(--green)_10%,transparent)] text-foreground"
                            : "border-[color-mix(in_oklab,var(--gold)_35%,var(--card-border))] bg-[color-mix(in_oklab,var(--gold)_8%,transparent)] text-foreground",
                        )}
                      >
                        {u.confirmed ? "Active" : "Pending"}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted">
                      {lastSeen ? `Last sign in: ${lastSeen}` : "Never signed in"}
                    </div>
                  </div>

                  {/* Delete — two-step confirm */}
                  {!isSelf ? (
                    <div className="flex shrink-0 items-center gap-1.5">
                      {isConfirming ? (
                        <>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => deleteUser(u.id)}
                            className="rounded-full border border-red-500/50 bg-red-500/15 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-red-300 transition hover:bg-red-500/25 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                          >
                            {isDeleting ? "Deleting…" : "Confirm"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-full border border-card-border bg-black/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => { clearMessages(); setConfirmDelete(u.id); }}
                          className="shrink-0 rounded-full border border-card-border bg-black/10 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-muted transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
