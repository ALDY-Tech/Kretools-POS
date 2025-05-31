import { register, login } from "../usecase/auth.js";
import { generateToken } from "../utils/jwt.js";

const registerController = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Password dan konfirmasi tidak cocok" });
  }

  try {
    const role = "user"; // default role
    const newUser = await register({ username, password, role });
    res.status(201).json({
      msg: "Registrasi berhasil",
      user: { username: newUser.username, role: newUser.role },
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
  

const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const loggedUser = await login({ username, password });

    const token = await generateToken(loggedUser.role); // tambahkan role

    res.status(200).json({
      msg: "Login berhasil",
      username: loggedUser.username,
      token: token,
      role: loggedUser.role, // opsional
    });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
  

const logoutController = (req, res) => {
  // Implementasi logout jika diperlukan
  res.status(200).json({ msg: "Logout berhasil" });
};

export { registerController, loginController, logoutController };
