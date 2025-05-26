const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  qrToken: { type: String, required: true, unique: true },
  gimnasioId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  expiracion: { type: Date, required: true },
  activo: { type: Boolean, default: true },
});

module.exports = mongoose.model("Usuario", usuarioSchema);
