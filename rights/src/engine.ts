import { TIER_RULES, OWNER_KEYS } from "./tierRules";
import { getUser, createUser } from "./userDB";

export async function resolveRights(apiKey: string) {
  // OWNER / DEV / SUPERKEY
  if (OWNER_KEYS.some(prefix => apiKey.startsWith(prefix))) {
    return {
      tier: "sovereign",
      tokens: "UNLIMITED",
      build_access: true,
      video: true,
      image: true,
      depth: 10,
      owner: true
    };
  }

  // Normal user
  let user = await getUser(apiKey);
  if (!user) {
    // auto-create free user
    await createUser(apiKey, "free");
    user = await getUser(apiKey);
  }

  const tier = user.tier as keyof typeof TIER_RULES;
  const rule = TIER_RULES[tier];

  return {
    tier,
    tokens: user.tokens,
    build_access: rule.build_access,
    image: rule.image,
    video: rule.video,
    depth: rule.emergent_depth,
    owner: false
  };
}
