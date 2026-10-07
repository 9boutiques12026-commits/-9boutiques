// Démarre une base PostgreSQL locale portable (aucun droit admin requis).
// Usage : node scripts/start-pg.mjs
// La base tourne tant que ce processus est vivant.
import path from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 5433;
const DB = "9boutiques";

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: path.join(__dirname, "..", ".pgdata"),
    user: "postgres",
    password: "postgres",
    port: PORT,
    persistent: true,
  });

  console.log("[pg] initialisation...");
  await pg.initialise();
  console.log("[pg] démarrage...");
  await pg.start();

  try {
    await pg.createDatabase(DB);
    console.log(`[pg] base "${DB}" créée`);
  } catch (e) {
    console.log(`[pg] base "${DB}" existe déjà (ok)`);
  }

  console.log(`[pg] PRÊTE -> postgresql://postgres:postgres@localhost:${PORT}/${DB}?schema=public`);

  setInterval(() => {}, 1 << 30);

  const shutdown = async () => {
    console.log("[pg] arrêt...");
    try { await pg.stop(); } catch {}
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error("[pg] ERREUR:", e);
  process.exit(1);
});
