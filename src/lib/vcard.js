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

/** Apple Contacts reads X-ABLabel on grouped items for custom field names. */
function pushLabeledItem(lines, itemKey, property, value, label) {
  if (value == null || value === "") return;
  const text = escapeVCardText(value);
  lines.push(foldVCardLine(`${itemKey}.${property}:${text}`));
  pushLine(lines, `${itemKey}.X-ABLabel`, label);
}

function pushLabeledItemRaw(lines, itemKey, property, rawValue, label) {
  if (rawValue == null || rawValue === "") return;
  lines.push(foldVCardLine(`${itemKey}.${property}:${rawValue}`));
  pushLine(lines, `${itemKey}.X-ABLabel`, label);
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
export function buildEmployeeVCard(employee) {
  const displayName = String(employee?.display_name || "").trim();
  const { family, given } = parseStructuredName(displayName);
  const social =
    employee?.social_links && typeof employee.social_links === "object" ? employee.social_links : {};
  const website = typeof social.website === "string" ? social.website.trim() : "";
  const instagram = typeof social.instagram === "string" ? social.instagram.trim() : "";
  const personalInstagram =
    typeof social.personal_instagram === "string" ? social.personal_instagram.trim() : "";
  const googleReviews = typeof social.google_reviews === "string" ? social.google_reviews.trim() : "";
  const officePhone = String(employee?.office_phone || "").trim();
  const directPhone = String(employee?.direct_phone || "").trim();
  const email = String(employee?.email || "").trim();
  const location = String(employee?.location || "").trim();
  const notes = String(employee?.notes || "").trim();
  const title = String(employee?.job_title || "").trim();

  const lines = ["BEGIN:VCARD", "VERSION:3.0"];

  if (displayName) pushLine(lines, "FN", displayName);
  lines.push(
    foldVCardLine(
      `N:${escapeVCardText(family)};${escapeVCardText(given)};;;`,
    ),
  );

  pushLine(lines, "ORG", BRAND.name);
  pushLine(lines, "TITLE", title);

  let itemIndex = 1;
  if (officePhone) {
    pushLabeledItem(lines, `item${itemIndex}`, "TEL;TYPE=VOICE", officePhone, "Business");
    itemIndex += 1;
  }
  if (directPhone) {
    pushLabeledItem(lines, `item${itemIndex}`, "TEL;TYPE=VOICE", directPhone, "Personal");
    itemIndex += 1;
  }
  if (email) {
    pushLabeledItem(lines, `item${itemIndex}`, "EMAIL;TYPE=INTERNET", email, "Email");
    itemIndex += 1;
  }
  if (website) {
    pushLabeledItem(lines, `item${itemIndex}`, "URL", website, "Website");
    itemIndex += 1;
  }

  const adr = parseLocationAdr(location);
  if (adr) {
    pushLabeledItemRaw(lines, `item${itemIndex}`, "ADR", adr, "Location");
    itemIndex += 1;
  }

  if (instagram) {
    pushLabeledItem(lines, `item${itemIndex}`, "URL", instagram, "Business Instagram");
    itemIndex += 1;
  }

  if (personalInstagram) {
    pushLabeledItem(lines, `item${itemIndex}`, "URL", personalInstagram, "Personal Instagram");
    itemIndex += 1;
  }

  if (googleReviews) {
    pushLabeledItem(lines, `item${itemIndex}`, "URL", googleReviews, "Google Reviews");
  }

  if (notes) {
    pushLine(lines, "NOTE", notes);
  }

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}
