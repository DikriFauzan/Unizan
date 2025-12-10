import rerankRoute from './routes/rerankRoute';
import openaiRoute from './routes/openaiRoute';
import { apiKeyGuardOptional } from './middleware/apiKeyGuardOptional';
import ariesRoute from './routes/ariesRoute';
import generateRoute from './routes/generateRoute';
import ragRoute from './routes/ragRoute';
import emerAdminRoute from './routes/emerAdminRoute';
import emerRoute from './routes/emerRoute';
import { routeAI } from './services/aiRouter';
import workerBridge from './routes/workerBridge';
import buildRoute from './routes/buildRoute';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import adminMetricsRoute from './routes/adminMetricsRoute';
import buildLogRoute from './routes/buildLogRoute';
import adminSuperkeyRoute from './routes/adminSuperkeyRoute';
import adminBillingRoute from './routes/adminBillingRoute';
import billingRoute from './routes/billingRoute';
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/v1', rerankRoute);
app.use('/v1', openaiRoute);
app.use('/v1', ariesRoute);
app.use('/v1', generateRoute);
app.use('/v1', ragRoute);
app.use('/v1', emerRoute);
app.use('/v1', emerAdminRoute);
app.use('/v1', buildRoute);
app.use('/v1', workerBridge);
app.use(metricsMiddleware);
app.use('/v1', adminMetricsRoute);
app.use('/v1', buildLogRoute);
app.use('/v1', adminSuperkeyRoute);
app.use('/v1/admin/billing', adminBillingRoute);
app.use('/v1', billingRoute);

app.get("/", (req, res) =>
  res.json({ status: "FEAC Backend Online", ver: "8.0.0" })
);

app.use("/v1/ai", aiRoutes);

const PORT = process.env.PORT || 8000;
app.use(/v1, keystoreRoute);
app.listen(PORT, () => {
  console.log("[FEAC] Backend running on port", PORT);
});
/* aiRouter available at services/aiRouter.ts */
