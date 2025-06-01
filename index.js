import express from "express";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/ItemMaster.routes.js";
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

app.use("/", authRoutes);
app.use("/api", itemRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// export default app;
