import { UAParser } from "ua-parser-js";

// Firefox and Safari doesn't support viewport-width header
// fallback to parsing user-agent
const parseDeviceType = (req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const { type: parsedType } = parser.getDevice();
  const deviceType =
    parsedType === "mobile" || parsedType === "tablet" ? parsedType : "desktop";

  return deviceType;
};

export const getDeviceInfo = (req) => {
  const viewportWidth = req.headers["viewport-width"] ?? null;
  const dpr = req.headers["dpr"] ?? null;

  return {
    viewportWidth,
    dpr,
    deviceType: !viewportWidth ? parseDeviceType(req) : null,
  };
};
