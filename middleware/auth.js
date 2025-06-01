import { jwtVerify } from "jose";
import dotenv from "dotenv";
dotenv.config();

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak tersedia" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    // console.log("Decoded payload:", payload); // 👈 DEBUG output payload

    if (!payload || payload.role !== "admin") {
      return res.status(403).json({ message: "Akses hanya untuk admin" });
    }

    req.user = payload;
    next();
  } catch (err) {
    // console.error("JWT Verify Error:", err); // 👈 DEBUG error
    return res
      .status(401)
      .json({ message: "Token tidak valid", error: err.message });
  }
};
