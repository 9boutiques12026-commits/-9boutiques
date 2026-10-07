import nodemailer from "nodemailer";

import { SITE } from "@/lib/site";

// Le transport SMTP n'est actif que si les variables d'environnement sont
// renseignées. Sans elles (ex. en local), on journalise le lien pour pouvoir
// tester le flux sans service d'email — mais rien n'est envoyé pour de vrai.
function smtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true",
    auth: { user, pass },
  };
}

export function isEmailConfigured() {
  return smtpConfig() !== null;
}

function baseUrl() {
  return (process.env.APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function appUrl(path: string) {
  return `${baseUrl()}${path}`;
}

type SendResult = { delivered: boolean; reason?: string };

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<SendResult> {
  const config = smtpConfig();

  if (!config) {
    // Repli local : on affiche le lien dans les journaux du serveur.
    console.warn(
      `[email] SMTP non configuré. Lien de réinitialisation pour ${to} :\n  ${resetUrl}`,
    );
    return { delivered: false, reason: "smtp_not_configured" };
  }

  const transporter = nodemailer.createTransport(config);
  const from = process.env.EMAIL_FROM || `9boutiques <${config.auth.user}>`;

  await transporter.sendMail({
    from,
    to,
    subject: `${SITE.nom} — Réinitialiser votre mot de passe`,
    text: `Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe ${SITE.nom}.\n\nOuvrez ce lien (valable 30 minutes) :\n${resetUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\n— L'équipe ${SITE.nom}`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;background:#f6f5f1;padding:28px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e6e3da">
    <div style="background:#14261d;padding:22px 28px">
      <span style="color:#c8a45c;font-size:22px;font-weight:700;letter-spacing:-0.5px">${SITE.nom}</span>
      <span style="display:block;color:#c8a45c;font-size:9px;letter-spacing:3px;text-transform:uppercase;margin-top:4px">${SITE.slogan}</span>
    </div>
    <div style="padding:28px">
      <p style="color:#243b2f;font-size:15px;line-height:1.7;margin:0 0 18px">Bonjour,</p>
      <p style="color:#4a5a51;font-size:14px;line-height:1.7;margin:0 0 22px">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous (lien valable 30 minutes) :</p>
      <a href="${resetUrl}" style="display:inline-block;background:#14261d;color:#fff;text-decoration:none;padding:13px 26px;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:0.5px">Réinitialiser mon mot de passe</a>
      <p style="color:#7c8a82;font-size:12px;line-height:1.7;margin:24px 0 0">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre mot de passe restera inchangé.</p>
      <p style="color:#9aa5a0;font-size:11px;margin:18px 0 0">Lien manuel : <a href="${resetUrl}" style="color:#1f5c3d">${resetUrl}</a></p>
    </div>
  </div>
</div>`,
  });

  return { delivered: true };
}
