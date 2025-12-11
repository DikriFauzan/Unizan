import { FEACSuperKeyRegistry } from "./feac_superkey_registry";

export function loadSuperKey() {
  const url = process.env.SUPERKEY_URL;
  const token = process.env.SUPERKEY_TOKEN;

  if (!url || !token) {
    return null;
  }
  return new FEACSuperKeyRegistry({ url, token });
}
