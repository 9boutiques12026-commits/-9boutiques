// Teste l'envoi d'un vrai email via le SMTP configuré dans .env.
// Usage :  node scripts/test-email.mjs [email-du-destinataire]
// Sans destinataire, envoie à SMTP_USER (ta propre boîte) pour valider.
//
// Pré-requis : avoir renseigné SMTP_HOST / SMTP_USER / SMTP_PASS dans .env
// (SMTP_PASS = le mot de passe d'application Gmail à 16 caractères, sans espaces).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mini-lecteur de .env (un script Node autonome ne charge pas .env tout seul).
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.replace(/^"|"$/g, "").trim();
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnv();

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM || `9boutiques <${user}>`;
const to = process.argv[2] || user;

if (!host || !user || !pass) {
  console.error("✗ SMTP incomplet dans .env.");
  console.error("  Il manque : " + [!host && "SMTP_HOST", !user && "SMTP_USER", !pass && "SMTP_PASS"].filter(Boolean).join(", "));
  console.error("  Renseigne le mot de passe d'application Gmail (16 caractères, sans espaces) dans SMTP_PASS.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
});

async function main() {
  console.log(`→ Vérification de la connexion SMTP (${host}:${port})...`);
  await transporter.verify();
  console.log("✓ Connexion SMTP OK.");

  console.log(`→ Envoi d'un email de test à ${to}...`);
  const info = await transporter.sendMail({
    from,
    to,
    subject: "9boutiques — Test d'envoi d'email",
    text:
      "Bonjour,\n\nSi tu lis cet email, l'envoi SMTP de 9boutiques fonctionne correctement.\n\n— L'équipe 9boutiques",
    html:
      `<div style="font-family:Arial,Helvetica,sans-serif;background:#f6f5f1;padding:28px">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e6e3da">
          <div style="background:#14261d;padding:22px 28px">
            <span style="color:#c8a45c;font-size:22px;font-weight:700">9boutiques</span>
          </div>
          <div style="padding:28px;color:#4a5a51;font-size:14px;line-height:1.7">
            <p>Si tu lis cet email, <strong>l'envoi SMTP fonctionne</strong>.</p>
            <p>Les liens de réinitialisation de mot de passe pourront être envoyés à cette adresse.</p>
            <p style="color:#9aa5a0;font-size:12px">— L'équipe 9boutiques</p>
          </div>
        </div>
      </div>`,
  });
  console.log("✓ Email envoyé. Message-ID :", info.messageId);
  console.log("→ Vérifie ta boîte de réception (et les spams) pour confirmation.");
}

main().catch((error) => {
  console.error("✗ Échec :", error.message);
  if (error.response) console.error("  Détail serveur :", error.response);
  process.exit(1);
});
