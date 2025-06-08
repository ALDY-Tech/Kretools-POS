import express from "express";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/ItemMaster.routes.js";
import additionalRoutes from "./routes/additional.routes.js";
import { verifyToken } from "./middleware/auth.js";
import cors from "cors";
import { createNewTransaction } from "./service/transaction.service.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.get("/validate", verifyToken, (req, res) => {
  return res.status(200).json({ status: "valid" });
});


app.use("/", authRoutes);
app.use("/api", itemRoutes, additionalRoutes,);
app.post("/api/transaction", createNewTransaction);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// export default app;
