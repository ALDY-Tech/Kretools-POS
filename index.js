import express from "express";
import authRoutes from "./routes/auth.js";
import { verifyAdmin } from "./middleware/auth.js";

const app = express();

app.use(express.json());
app.use("/", authRoutes);

app.get("/admin-only", verifyAdmin, (req, res) => {
  res.json({ message: `Halo admin, role Anda: ${req.user.role}` });
});

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
