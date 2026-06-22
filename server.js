const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ CONFIGURA: genera una "contraseña de aplicación" en tu cuenta de Google
//    https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // ⚠️ CAMBIA en .env
    pass: process.env.EMAIL_PASS,  // ⚠️ CAMBIA en .env
  },
});

app.post('/api/contacto', async (req, res) => {
  const { nombre, email, tipo, mensaje } = req.body;
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    await transporter.sendMail({
      from: `"Mundial ML Soporte" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,   // ⚠️ CAMBIA en .env
      replyTo: email,
      subject: `[Mundial ML] ${tipo || 'Mensaje'} de ${nombre}`,
      html: `
        <h2>Nuevo mensaje desde Mundial ML</h2>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr/>
        <p>${mensaje.replace(/\n/g, '<br/>')}</p>
      `,
    });
    res.json({ ok: true, mensaje: 'Mensaje enviado correctamente' });
  } catch (err) {
    console.error('Error enviando correo:', err);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
