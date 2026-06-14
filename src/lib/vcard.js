import { BRAND } from "@/lib/brand";

/** Escape special characters per vCard 3.0 (RFC 2426). */
function escapeVCardText(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n/g, "\\n");
}

/** Fold long lines at 75 octets (vCard 3.0). */
function foldVCardLine(line) {
  const max = 75;
  if (line.length <= max) return line;

  const parts = [line.slice(0, max)];
  let rest = line.slice(max);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, max - 1)}`);
    rest = rest.slice(max - 1);
  }
  return parts.join("\r\n");
}

function pushLine(lines, name, value) {
  if (value == null || value === "") return;
  const text = escapeVCardText(value);
  lines.push(foldVCardLine(`${name}:${text}`));
}

function parseStructuredName(displayName) {
  const parts = String(displayName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return { family: "", given: "" };
  if (parts.length === 1) return { family: parts[0], given: "" };
  return {
    family: parts[parts.length - 1],
    given: parts.slice(0, -1).join(" "),
  };
}

function pushPhotoLine(lines, photo) {
  const base64 = String(photo?.base64 || "").trim();
  const type = String(photo?.type || "").trim();
  if (!base64 || !type) return;

  lines.push(foldVCardLine(`PHOTO;ENCODING=b;TYPE=${type}:${base64}`));
}

function parseLocationAdr(location) {
  const raw = String(location || "").trim();
  if (!raw) return null;

  const commaParts = raw.split(",").map((part) => part.trim()).filter(Boolean);
  if (commaParts.length >= 2) {
    const region = commaParts[commaParts.length - 1];
    const locality = commaParts.slice(0, -1).join(", ");
    return `;;;${escapeVCardText(locality)};${escapeVCardText(region)};;`;
  }

  return `;;;${escapeVCardText(raw)};;;`;
}

/** Build a vCard 3.0 document for a published employee record. */
export function buildEmployeeVCard(employee, photo = null) {
  const displayName = String(employee?.display_name || "").trim();
  const { family, given } = parseStructuredName(displayName);
  const social =
    employee?.social_links && typeof employee.social_links === "object" ? employee.social_links : {};
  const website = typeof social.website === "string" ? social.website.trim() : "";
  const officePhone = String(employee?.office_phone || "").trim();
  const directPhone = String(employee?.direct_phone || "").trim();
  const email = String(employee?.email || "").trim();
  const location = String(employee?.location || "").trim();
  const title = String(employee?.job_title || "").trim();
  // Keep NOTE to one line so iOS contact import shows add/save actions without scrolling.
  const briefNote = website
    ? `${BRAND.name} | ${BRAND.tagline} — ${website}`
    : `${BRAND.name} | ${BRAND.tagline}`;

  const lines = ["BEGIN:VCARD", "VERSION:3.0"];

  if (displayName) pushLine(lines, "FN", displayName);
  lines.push(
    foldVCardLine(
      `N:${escapeVCardText(family)};${escapeVCardText(given)};;;`,
    ),
  );

  pushPhotoLine(lines, photo);

  pushLine(lines, "ORG", BRAND.name);
  pushLine(lines, "TITLE", title);

  if (officePhone) {
    lines.push(foldVCardLine(`TEL;TYPE=WORK,VOICE:${escapeVCardText(officePhone)}`));
  }
  if (directPhone) {
    lines.push(foldVCardLine(`TEL;TYPE=CELL,VOICE:${escapeVCardText(directPhone)}`));
  }

  if (email) {
    lines.push(foldVCardLine(`EMAIL;TYPE=INTERNET,WORK:${escapeVCardText(email)}`));
  }

  const adr = parseLocationAdr(location);
  if (adr) {
    lines.push(foldVCardLine(`ADR;TYPE=WORK:${adr}`));
  }

  if (website) {
    pushLine(lines, "URL", website);
  }

  pushLine(lines, "NOTE", briefNote);

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}
