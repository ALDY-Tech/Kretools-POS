import express from "express";
import authRoutes from "./routes/auth.js";
import { verifyAdmin } from "./middleware/auth.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // sesuaikan dengan frontend kamu
    credentials: true,
  })
);

app.use(express.json());
app.use("/", authRoutes);

app.get("/admin-only", verifyAdmin, (req, res) => {
  res.json({ message: `Halo admin, role Anda: ${req.user.role}` });
});

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// export default app;
