import keystoreRoute from "./routes/keystoreRoute";
import keystoreRoute from "./routes/keystoreRoute";
app.use("/v1", keystoreRoute);
app.listen(PORT, () => {
  console.log("[FEAC] Backend running on port", PORT);
});
/* aiRouter available at services/aiRouter.ts */
