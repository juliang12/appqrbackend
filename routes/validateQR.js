const express = require("express");
const router = express.Router();
const Token = require("../models/Token");

router.post("/", async (req, res) => {
  const { token } = req.body;
  console.log(token)
  if (!token) {
    return res.status(400).json({ valido: false, mensaje: "Token no enviado" });
  }

  try {
    const registro = await Token.findOne({ token });

    if (!registro) {
      return res.status(404).json({ valido: false, mensaje: "Token no encontrado" });
    }

    if (registro.usado) {
      return res.status(403).json({ valido: false, mensaje: "Token ya usado" });
    }

    // Marcar como usado
    registro.usado = true;
    await registro.save();

    return res.json({ valido: true, mensaje: "Acceso aprobado" });
  } catch (error) {
    console.error("Error en validación:", error);
    return res.status(500).json({ valido: false, mensaje: "Error del servidor" });
  }
});

module.exports = router;
