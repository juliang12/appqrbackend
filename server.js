const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:8080', 'https://prueba-qrapp.netlify.app'],
  credentials: true,
}));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error Mongo:", err));

app.use("/api/auth", require("./routes/auth"));
// app.use("/api/validar-qr", validarQRRoute);
app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
