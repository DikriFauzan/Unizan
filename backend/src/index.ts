import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ status: "FEAC Backend Online", ver: "8.0.0" })
);

app.use("/v1/ai", aiRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("[FEAC] Backend running on port", PORT);
});
