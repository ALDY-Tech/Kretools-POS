import express from "express";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/ItemMaster.routes.js";
import additionalRoutes from "./routes/additional.routes.js";
import transactionRoutes from "./routes/Transaction.routes.js";
import midtransRoutes from "./routes/midtrans.routes.js";
import supabaseRoutes from "./routes/supabase.routes.js";
import { authMiddleware } from "./middleware/auth.js";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/midtrans-notification", bodyParser.raw({ type: "*/*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/", authRoutes);
app.use(
  "/api",
  itemRoutes,
  additionalRoutes,
  transactionRoutes,
  midtransRoutes,
  supabaseRoutes
);

app.get("/me", authMiddleware, (req, res) => {
  res.json({ message : "Akses ke endpoint /me berhasil", user: req.user });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// export default app;
