import type { Browser, Page } from "playwright";

export type Headers = Record<string, string>;
export const RedirectPolicy = {
  /** Follow all redirects (default) */
  Any: "any",
  /** Allow redirects within the same registrable domain (e.g. *.example.com) */
  SameSite: "same-site",
  /** Allow redirects only to the exact same host (e.g. example.com) */
  SameHost: "same-host",
} as const;

export type RedirectPolicy =
  (typeof RedirectPolicy)[keyof typeof RedirectPolicy];

export type Cookie = {
  name: string;
  value: string;
  domain: string;
  host: string;
  isFirstParty: boolean;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
};

export type Response = {
  url: string;
  host: string;
  isFirstParty: boolean;
  status: number;
  headers: Headers;
  body?: string;
};

export type Context = {
  browser: Browser;
  page: Page;
  responses: Response[];
  javascriptVariables: Record<string, unknown>;
  cookies: Cookie[];
  timeoutMs: number;
  timeoutOccurred: boolean;
};
