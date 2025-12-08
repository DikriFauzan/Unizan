export const TOKEN_COST = {
  CHAT: 1,
  SHORT: 2,
  MEDIUM: 5,
  LONG: 10,
  CODEGEN: 10,      // adjustable up to 50 in controller
  IMAGE: 50,
  VIDEO: 100,
  BUILD: 1000
};

export class TokenEngine {
  static async bill(user: any, type: keyof typeof TOKEN_COST, custom=0) {
    if (user.bypass) return true;
    const cost = custom > 0 ? custom : TOKEN_COST[type];
    console.log(`[BILLING] User ${user.id} charged ${cost} tokens for ${type}`);
    return true;
  }
}
