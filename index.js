import express from "express";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/ItemMaster.routes.js";
import additionalRoutes from "./routes/additional.routes.js";
import { verifyToken } from "./middleware/auth.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // sesuaikan dengan frontend kamu
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.get("/validate", verifyToken, (req, res) => {
  const user = req.user;

  if (user.role === "admin") {
    return res.status(200).json({ status: "valid", role: user.role });
  } else {
    return res.status(403).json({ status: "not valid", role: user.role });
  }
});

app.use("/", authRoutes);
app.use("/api", itemRoutes, additionalRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// export default app;
