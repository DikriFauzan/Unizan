import express from "express";
import cors from "cors";

import authRoute from "./routes/authRoute";
import buildRoute from "./routes/buildRoute";
import rightsRoute from "./routes/rightsRoute";
import billingRoute from "./routes/billingRoute";
import adminBillingRoute from "./routes/adminBillingRoute";

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// CORE PUBLIC API
// =========================
app.use("/auth", authRoute);
app.use("/build", buildRoute);
app.use("/rights", rightsRoute);
app.use("/billing", billingRoute);

// =========================
// ADMIN API (owner only)
// =========================
app.use("/admin/billing", adminBillingRoute);

// =========================
// ROOT HEALTH CHECK
// =========================
app.get("/", (req, res) => {
    res.json({ status: "FEAC CORE READY" });
});

// =========================
// SERVER BOOT
// =========================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`FEAC backend running on port ${PORT}`);
});
