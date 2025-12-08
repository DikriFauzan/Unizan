import { routeAI } from "../services/aiRouter";

export async function chat(req: any, res: any) {
  try {
    const msg = req.body.messages.at(-1).content;
    const out = await routeAI(msg, "chat", req.user);
    res.json(out);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
