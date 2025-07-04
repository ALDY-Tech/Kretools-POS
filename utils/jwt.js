import jwt from "jsonwebtoken";

export function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
    expiresIn: process.env.ACCESS_TOKEN_EXP,
  });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
    expiresIn: process.env.REFRESH_TOKEN_EXP,
  });
}
