import type { Confidence } from "../signatures/_types.js";

type EvidenceType = "header" | "body" | "cookie" | "script" | "url";

export type Evidence = {
  type: EvidenceType;
  value: string;
  version: string | undefined;
  confidence: Confidence;
  host?: string;
  sourceUrl?: string;
  // Whether the response/cookie this evidence came from is first-party to the
  // scanned target. Used to avoid implying a target technology from evidence
  // seen only inside a third-party resource (e.g. an ad or form-collector
  // script that merely references a plugin name). Undefined means unknown and
  // is treated as first-party by consumers, matching the `?? true` convention.
  isFirstParty?: boolean;
};

export type Detection = {
  name: string;
  evidences?: Evidence[];
};
