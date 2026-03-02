// api/sendMail.ts en Vercel
import nodemailer from "nodemailer";

// ---------------------------------------------
// Variables de entorno en Vercel
// GMAIL_USER=tuemail@gmail.com
// GMAIL_APP_PASSWORD=xxxxxxxxxxxx
// ---------------------------------------------
const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD;

if (!gmailUser || !gmailPass) {
  throw new Error("GMAIL_USER o GMAIL_APP_PASSWORD no definidas en Vercel");
}

// ---------------------------------------------
// Transporte Nodemailer
// ---------------------------------------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: gmailUser, pass: gmailPass },
  tls: { rejectUnauthorized: false },
});

// ---------------------------------------------
// Serverless function
// ---------------------------------------------
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { to, subject, text, html } = req.body;

  try {
    const info = await transporter.sendMail({
      from: `"Tambo360" <${gmailUser}>`,
      to,
      subject,
      text,
      html,
    });
    res.status(200).json({ messageId: info.messageId });
    console.log("✅ Mail enviado a:", to, "id:", info.messageId);
  } catch (err) {
    console.error("❌ Error enviando mail:", err);
    res.status(500).json({ error: "Failed to send mail" });
  }
}