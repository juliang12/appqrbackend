const express = require("express");
const Usuario = require("../models/Usuario");
const auth = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();


router.get("/:gimnasioId", async (req, res) => {
    try {
    const usuarios = await Usuario.find({ gimnasioId: req.params.gimnasioId });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
})

// Ruta protegida: solo admins logueados pueden acceder
router.post("/", auth, async (req, res) => {
  const { name, email } = req.body;
  console.log(req.user);
  const nuevoUsuario = new Usuario({
    name,
    email,
    qrToken: uuidv4(), // generamos un token único
    gimnasioId: req.user.id, // lo sacamos del token JWT decodificado
    registrationDate: new Date(),
    expiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    activo: true,
  });

  await nuevoUsuario.save();

  res.status(201).json({ mensaje: "Usuario creado con éxito", usuario: nuevoUsuario });
});


router.delete("/:id", async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Extender la expiración actual 30 días más
    usuario.expiracion = new Date(usuario.expiracion.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Aplicar el resto de los datos que vengan en el body, si corresponde
    Object.assign(usuario, req.body);

    const usuarioActualizado = await usuario.save();

    res.json({ mensaje: "Usuario actualizado con éxito", usuario: usuarioActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
});

router.get("/member/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuarios = await Usuario.findById({ _id: id });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
});


module.exports = router;
