import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 8080);
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Limite 5MB
});

const hasSmtpConfig =
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS;

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  : null;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "in-genio-api" });
});

app.post("/api/contact", async (req, res) => {
  const { name, company, email, message } = req.body || {};

  if (!name || !company || !email || !message) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios."
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Correo no valido." });
  }

  try {
    if (!transporter) {
      console.log("[Contacto] Solicitud recibida (modo sin SMTP):", {
        name,
        company,
        email,
        message
      });

      return res.json({
        message: "Solicitud recibida. Configura SMTP para habilitar envio por correo real."
      });
    }

    await transporter.sendMail({
      from: process.env.CONTACT_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO || "contacto@in-genio.cl",
      replyTo: email,
      subject: `Nuevo contacto web | ${company}`,
      text: `Nombre: ${name}\nEmpresa: ${company}\nCorreo: ${email}\n\nMensaje:\n${message}`,
      html: `
        <h2>Nuevo contacto desde in-genio.cl</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Empresa:</strong> ${company}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `
    });

    return res.json({ message: "Solicitud enviada correctamente." });
  } catch (error) {
    console.error("Error en /api/contact:", error);
    return res.status(500).json({
      message: "No se pudo enviar la solicitud. Intenta nuevamente."
    });
  }
});

app.post("/api/jobs", upload.single("cv"), async (req, res) => {
  const { name, position } = req.body || {};
  const file = req.file; // multer places file here if present

  if (!name || !position) {
    return res.status(400).json({
      message: "Por favor, complete nombre y cargo."
    });
  }

  try {
    if (!transporter) {
      console.log("[Jobs] Solicitud recibida (modo sin SMTP):", {
        name,
        position,
        cv: file ? file.originalname : "No adjuntado"
      });

      return res.json({
        message: "Postulación recibida (Modo demo sin SMTP activo)."
      });
    }

    const mailOptions = {
      from: process.env.CONTACT_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO || "contacto@in-genio.cl",
      subject: `Nueva Postulación Web | ${position} | ${name}`,
      text: `Nombre: ${name}\nCargo postulado: ${position}\n\nRevisa el archivo adjunto (si aplica).`,
      html: `
        <h2>Nueva postulación de trabajo ("Trabaja con Nosotros")</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Cargo o especialidad:</strong> ${position}</p>
        <p><strong>Estado del CV:</strong> ${file ? "Adjunto en este correo" : "No adjuntado"}</p>
      `
    };

    if (file) {
      mailOptions.attachments = [
        {
          filename: file.originalname,
          content: file.buffer
        }
      ];
    }

    await transporter.sendMail(mailOptions);

    return res.json({ message: "Postulación enviada correctamente." });
  } catch (error) {
    console.error("Error en /api/jobs:", error);
    return res.status(500).json({
      message: "No se pudo enviar la postulación. Intenta nuevamente."
    });
  }
});

if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor in-genio activo en http://localhost:${PORT}`);
});
