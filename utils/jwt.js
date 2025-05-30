//  untuk hash password
// jwt

import { SignJWT } from "jose";
const secret = new TextEncoder().encode("RAHASIA");

const generateToken = async (role) => {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return token;
};

export { generateToken };
