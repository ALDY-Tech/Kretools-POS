import { jwtVerify } from "jose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
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

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak tersedia" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token tidak valid",
      status: "not valid",
      error: err.message,
    });
  }
};

export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  const blacklisted = await redis.get(`bl_${token}`);
  if (blacklisted)
    return res.status(403).json({ message: "Token tidak berlaku lagi" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Token tidak valid" });
  }
}
