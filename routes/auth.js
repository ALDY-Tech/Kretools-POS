import express from "express";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import { PrismaClient } from "@prisma/client";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import argon2 from "argon2";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username dan password wajib diisi" });
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return res.status(409).json({ message: "Username sudah terdaftar" });
  }

  // Hash password dengan argon2
  const hashedPassword = await argon2.hash(password);

  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  res.status(201).json({ message: "Registrasi berhasil", userId: newUser.id });
});


// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  const isMatch = await argon2.verify(user.password, password);
  if (!user || !isMatch) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  const accessToken = generateAccessToken({
    id: user.id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({ id: user.id });

  const decoded = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

// Refresh token
router.post("/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || new Date() > stored.expiresAt) {
      if (stored) await prisma.refreshToken.delete({ where: { token } });
      return res.status(403).json({ message: "Refresh token expired" });
    }

    const newAccessToken = generateAccessToken({ id: decoded.id });
    res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
      const exp = decoded.exp - Math.floor(Date.now() / 1000);
      await redis.set(`bl_${accessToken}`, true, "EX", exp);
    } catch {}
  }

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  res.clearCookie("refreshToken");
  res.json({ message: "Logout berhasil" });
});

export default router;
