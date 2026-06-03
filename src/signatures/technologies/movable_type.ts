import type { ActiveRule, Signature } from "../_types.js";
import { perlSignature } from "./perl.js";

// Probe common install dirs for the mt.cgi admin page. The logout mode avoids
// the redirect to mt-update.cgi on installs that need updating. Each probe
// mirrors the three admin-page markers (MT v2/v3/v4); the version-bearing
// patterns come first so the version is captured when available.
const adminPageRegexes = [
  '/mt\\.js\\?v=([0-9]+(?:\\.[0-9]+)*)', // version (MT v4)
  // version (MT v2.x / v3.x). Capture from the first digit up to the next tag
  // so non-numeric suffixes (e.g. "3.36-ja" on Japanese editions) are kept
  // without greedily spanning later </b> tags.
  "<b>Version ([0-9][^<]*)</b>",
  "<title>MOVABLE TYPE", // MT v2 marker
  'mt\\.cgi"><img alt="Movable Type"', // MT v3 marker
  "Movable Type</title>", // MT v4 marker
];

const activeRules: ActiveRule[] = [
  "/mt.cgi?__mode=logout", // root install (common)
  "/mt/mt.cgi?__mode=logout",
  "/cgi-bin/mt/mt.cgi?__mode=logout",
  "/blog/mt.cgi?__mode=logout",
].map((path) => ({ path, bodyRegexes: adminPageRegexes }));

// Detects Movable Type from public-facing pages (generator meta tag, mt-static
// assets) and, once detected, confirms/extracts the version via the mt.cgi
// admin page probed by the active rules above.
export const movableTypeSignature: Signature = {
  name: "Movable Type",
  description:
    "Movable Type is a weblog publishing system written in Perl by Six Apart.",
  cpe: "cpe:/a:sixapart:movable_type", // CPE 2.2
  rule: {
    // Passive markers that appear on public-facing pages, so detection (and the
    // active mt.cgi probe, which only runs for already-detected technologies)
    // can fire without hitting the admin login page.
    confidence: "high",
    urls: [
      "/mt-static/", // default StaticWebPath, referenced by public templates
    ],
    bodies: [
      // generator meta tag emitted by the default templates, e.g.
      // <meta name="generator" content="Movable Type Pro 7.9.1" />.
      // Anchored to a literal <meta tag so escaped examples (&lt;meta ...) in
      // articles about MT don't match; accepts single or double quotes like the
      // other generator signatures. The trailing optional group captures the
      // version when present.
      "<meta[^>]+name=[\"']generator[\"'][^>]+content=[\"']Movable Type[^\"'0-9]*([0-9]+(?:\\.[0-9]+)*)?",
      'mt\\.cgi"><img alt="Movable Type"', // admin marker, specific enough for passive use
      // Versioned mt.js asset, e.g. src="/mt-static/mt.js?v=7.9.7". On the admin
      // page this is often the only detection + version source (the mt-static
      // URL rule may miss it when subresources aren't captured). No trailing
      // delimiter so single/double quotes and extra query params all work.
      '/mt\\.js\\?v=([0-9]+(?:\\.[0-9]+)*)',
    ],
  },
  activeRules,
  impliedSoftwares: [perlSignature.name], // Movable Type is a Perl CGI application
};
