import nodemailer from "nodemailer";
import { getEnv } from "@desafio/config";
import { prisma } from "@desafio/database";

export async function sendVerificationEmail(recipient: string, token: string) {
  const env = getEnv();
  const verificationUrl = new URL("/auth/verify", env.APP_URL);
  verificationUrl.searchParams.set("token", token);

  const outbox = await prisma.emailOutbox.create({
    data: {
      template: "VERIFY_EMAIL",
      recipient,
      subject: "Confirma o teu email — Desafio Volta à Vela",
      payload: { verificationUrl: verificationUrl.toString() },
    },
  });

  const transportOptions: Parameters<typeof nodemailer.createTransport>[0] = {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
  };
  if (env.SMTP_USER && env.SMTP_PASSWORD) {
    Object.assign(transportOptions, { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } });
  }
  const transport = nodemailer.createTransport(transportOptions);

  try {
    await transport.sendMail({
      from: env.SMTP_FROM,
      to: recipient,
      subject: outbox.subject,
      text: `Confirma o teu email: ${verificationUrl.toString()}`,
      html: `<p>Confirma o teu email para ativar a conta.</p><p><a href="${verificationUrl.toString()}">Confirmar email</a></p>`,
    });
    await prisma.emailOutbox.update({ where: { id: outbox.id }, data: { status: "SENT", sentAt: new Date(), attempts: 1 } });
  } catch (error) {
    await prisma.emailOutbox.update({
      where: { id: outbox.id },
      data: { status: "FAILED", attempts: 1, lastError: error instanceof Error ? error.message : "Erro desconhecido" },
    });
    throw error;
  }
}
