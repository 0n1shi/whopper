import type { Browser, Page } from "playwright";

export type Headers = Record<string, string>;

export type Cookie = {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: "Strict" | "Lax" | "None";
};

export type Response = {
  url: string;
  status: number;
  headers: Headers;
  body?: string;
};

export type Context = {
  browser: Browser;
  page: Page;
  responses: Response[];
  javascriptVariables: Record<string, any>;
  cookies: Cookie[];
  timeoutMs: number;
  timeoutOccurred: boolean;
};
