export type Evidence = {
  type: "header" | "body";
  value: string;
};

export type Detection = {
  name: string;
  confidence: "high" | "medium" | "low";
  evidences: Evidence[];
};
