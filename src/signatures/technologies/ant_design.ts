import type { Signature } from "../_types.js";

export const antDesignSignature: Signature = {
  name: "Ant Design",
  description: "Ant Design is a UI library that can be used with data flow solutions and application frameworks in any React ecosystem.",
  rule: {
    confidence: "high",
    bodies: [
      "<[^>]*class=\"ant-(?:btn|col|row|layout|breadcrumb|menu|pagination|steps|select|cascader|checkbox|calendar|form|input-number|input|mention|rate|radio|slider|switch|tree-select|time-picker|transfer|upload|avatar|badge|card|carousel|collapse|list|popover|tooltip|table|tabs|tag|timeline|tree|alert|modal|message|notification|progress|popconfirm|spin|anchor|back-top|divider|drawer)",
      "<i class=\"anticon anticon-",
      "href[^>]+antd(?:@|/)?([\\d\\.]+)?(?:.+|)?\\.css",
      "href[^>]+antd",
    ],
    javascriptVariables: {
      "antd.version": "^([\\d\\.]+)$",
    },
  },
};
