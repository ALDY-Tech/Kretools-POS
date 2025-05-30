import { jwtVerify } from "jose";

const secret = new TextEncoder().encode("RAHASIA");

export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak, bukan admin" });
    }

    req.user = payload; // bisa digunakan di route berikutnya
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};
