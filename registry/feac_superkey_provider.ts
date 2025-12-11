import { FEACSuperKeyRegistry } from "./feac_superkey_registry";

export class FEACSuperKeyProvider {
  private reg: FEACSuperKeyRegistry;

  constructor(reg: FEACSuperKeyRegistry) {
    this.reg = reg;
  }

  async handle(command: string, payload: any) {
    switch (command) {
      case "superkey.exec":
        return await this.reg.execUCI(payload);
      case "superkey.validate":
        return await this.reg.validate();
      case "superkey.meta":
        return await this.reg.meta();
      default:
        return { status: "error", error: "Unknown provider command" };
    }
  }
}
