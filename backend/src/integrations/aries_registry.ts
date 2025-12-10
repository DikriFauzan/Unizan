/**
 * Simple Aries registry: map logical model -> provider config
 * Extendable to dynamic registration via DB / admin UI.
 */
export const ARIES_MODELS: Record<string, any> = {
  "aries-small": { id: "aries-small", description: "Lightweight local model", weight: 1 },
  "aries-large": { id: "aries-large", description: "High-quality model (GPU)", weight: 5 }
};

export function getModelConfig(name?: string) {
  if (!name) return ARIES_MODELS["aries-small"];
  return ARIES_MODELS[name] || ARIES_MODELS["aries-large"];
}
