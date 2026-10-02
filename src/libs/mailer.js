import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT) {
    throw new Error("Falta configurar SMTP_HOST y SMTP_PORT.");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined,
  });

  return transporter;
}

export async function sendInvitationEmail({ to, inviteUrl, role }) {
  try {
    const from = process.env.SMTP_FROM;
    if (!from) throw new Error("Falta configurar SMTP_FROM.");

    return await getTransporter().sendMail({
      from,
      to,
      subject: "Invitacion al sistema de gestion comunal",
      text: `Has sido invitado con el rol ${role}. Completa tu registro: ${inviteUrl}`,
      html: `<p>Has sido invitado con el rol <strong>${role}</strong>.</p><p><a href="${inviteUrl}">Completar registro</a></p>`,
    });
  } catch (error) {
    throw new Error(`No se pudo enviar la invitacion: ${error.message}`);
  }
}