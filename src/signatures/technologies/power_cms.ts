import type { ActiveRule, Signature } from "../_types.js";
import { movableTypeSignature } from "./movable_type.js";
import { perlSignature } from "./perl.js";

// PowerCMS is an Alfasado CMS built on top of Movable Type, so it shares the
// mt.cgi admin script and mt-static asset path with MT. Detection keys off the
// PowerCMS-specific plugin static path to tell it apart from plain MT, and the
// active mt.cgi admin probe captures the version from the admin footer when
// available (best-effort; admin pages are not always reachable).
const adminPageRegexes = [
  // Admin footer version text, e.g. "PowerCMS version 5.43" / "PowerCMS 4.46".
  // Version-bearing patterns come first so the version is captured when present.
  // PowerCMS version numbers have irregular precision (2.0493 / 4.46 / 5.43),
  // so accept an arbitrary number of dot-separated groups.
  "PowerCMS version ([0-9]+(?:\\.[0-9]+)*)", // v5 footer
  "PowerCMS ([0-9]+(?:\\.[0-9]+)*)", // v4 footer
  // v6/v7 dropped the product-name prefix and show just "version 6.83". This
  // bare fallback is intentionally last so v4/v5 still match the prefixed forms
  // above (first-hit-wins), limiting its blast radius to v6/v7 pages. Requiring
  // at least one dot avoids picking up single-token "version 3" style noise, and
  // the leading \b prevents matching words that merely end in "version"
  // (e.g. "Subversion 1.14.2").
  "\\bversion ([0-9]+\\.[0-9]+(?:\\.[0-9]+)*)", // v6/v7 footer
  "/mt-static/plugins/PowerCMS/", // PowerCMS-specific marker, confirms even without a version
];

const activeRules: ActiveRule[] = [
  "/mt.cgi?__mode=logout", // root install (common)
  "/mt/mt.cgi?__mode=logout",
  "/cgi-bin/mt/mt.cgi?__mode=logout",
  "/blog/mt.cgi?__mode=logout",
].map((path) => ({ path, bodyRegexes: adminPageRegexes }));

// Detects PowerCMS from the PowerCMS-specific plugin static path on public
// pages, then confirms/extracts the version via the mt.cgi admin probe. When
// PowerCMS is detected, Movable Type is excluded from the output to avoid the
// underlying MT being reported alongside the actual product.
export const powerCmsSignature: Signature = {
  name: "PowerCMS",
  description:
    "PowerCMS is a Movable Type-based content management system by Alfasado Inc.",
  cpe: "cpe:/a:alfasado:powercms", // CPE 2.2
  rule: {
    confidence: "high",
    urls: [
      "/mt-static/plugins/PowerCMS/", // distinguishes PowerCMS from plain Movable Type
    ],
    bodies: [
      "/mt-static/plugins/PowerCMS/", // same path referenced inline in public HTML
    ],
  },
  activeRules,
  excludes: [movableTypeSignature.name], // PowerCMS supersedes the underlying Movable Type
  impliedSoftwares: [perlSignature.name], // PowerCMS is a Perl application (like MT)
};
