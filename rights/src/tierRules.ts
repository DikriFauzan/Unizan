export const TIER_RULES = {
  free: {
    monthly_tokens: 2000,
    build_access: false,
    image: true,
    video: false,
    emergent_depth: 2,
  },
  pro: {
    monthly_tokens: 10000,
    build_access: true,
    image: true,
    video: true,
    emergent_depth: 4,
  },
  ultimate: {
    monthly_tokens: 50000,
    build_access: true,
    image: true,
    video: true,
    emergent_depth: 6,
  },
  sovereign: {
    monthly_tokens: "UNLIMITED",
    build_access: true,
    image: true,
    video: true,
    emergent_depth: 10,
  }
};

export const OWNER_KEYS = ["FEAC-SVR", "FEAC-OWNER", "FEAC-DEV"];
