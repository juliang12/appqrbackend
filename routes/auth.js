const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const adminExistente = await Admin.findOne({ email });
  if (adminExistente) return res.status(400).json({ mensaje: "Ya existe un admin con ese email" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const nuevoAdmin = new Admin({ username, email, password: hashedPassword });
  await nuevoAdmin.save();

  res.status(201).json({ mensaje: "Administrador registrado correctamente" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ mensaje: "Credenciales inválidas" });

  const passwordValido = await bcrypt.compare(password, admin.password);
  if (!passwordValido) return res.status(400).json({ mensaje: "Credenciales inválidas" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 2 * 60 * 60 * 1000, // 2 horas
  });

  res.json({ token, admin: { id: admin._id, nombre: admin.nombre, email: admin.email } });
});

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Autenticado', usuario: req.user });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax', // o 'Strict' según tu caso
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ mensaje: 'Sesión cerrada' });
});

module.exports = router;
