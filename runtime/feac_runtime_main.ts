import { loadSuperKey } from "../registry/feac_superkey_loader";
import { FEACSuperKeyProvider } from "../registry/feac_superkey_provider";

const SK = loadSuperKey();
let provider: FEACSuperKeyProvider | null = null;

if (SK) {
  provider = new FEACSuperKeyProvider(SK);
  console.log("[FEAC] SuperKey provider enabled");
} else {
  console.log("[FEAC] SuperKey provider disabled (missing env)");
}

export async function feacRuntimeDispatch(cmd: string, payload: any) {
  if (provider) {
    const result = await provider.handle(cmd, payload);
    if (result && typeof result === "object") return result;
  }

  return { status: "error", error: "Unknown FEAC runtime command" };
}
