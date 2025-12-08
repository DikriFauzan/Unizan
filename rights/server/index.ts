import express from "express";
import cors from "cors";
import { resolveRights } from "../src/engine";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/status", async (req, res) => {
  const { api_key } = req.body;
  if (!api_key) return res.status(400).json({ error: "Missing API Key" });

  const info = await resolveRights(api_key);
  res.json(info);
});

const PORT = process.env.RIGHTS_PORT || 9004;
app.listen(PORT, () => {
  console.log("[Rights Engine] Online at port", PORT);
});
