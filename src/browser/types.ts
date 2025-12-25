export type Headers = Record<string, string>;

export type Response = {
  url: string;
  status: number;
  headers: Headers;
  body?: string;
};
