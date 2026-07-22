import nodemailer from "nodemailer";

type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set in .env`);
  }

  return value;
}

export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  const fromName = process.env.MAIL_FROM_NAME || "Flex Accountant";
  const fromEmail = process.env.MAIL_FROM_EMAIL || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });
}