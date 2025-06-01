import { SignJWT } from "jose";
import dotenv from "dotenv";
dotenv.config();
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const generateToken = async (payload) => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return token;
};

export { generateToken };
