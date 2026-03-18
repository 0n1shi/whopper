import type { Browser, Page } from "playwright";

export type Headers = Record<string, string>;
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

export type OpenPageOptions = {
  userAgent?: string | undefined;
  locale?: string | undefined;
  extraHTTPHeaders?: Record<string, string> | undefined;
  blockCrossDomainRedirect?: boolean | undefined;
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
