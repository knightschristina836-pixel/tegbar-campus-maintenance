import { createServer } from "node:http";
import { app } from "./app";
import { env } from "./config/env";
import { pool } from "./database/pool";

async function startServer(): Promise<void> {
  await pool.query("SELECT 1");

  const server = createServer(app);
  server.listen(env.PORT, () => {
    console.info(`Tegbar API listening on port ${env.PORT}`);
  });

  const shutdown = (): void => {
    server.close(() => {
      void pool.end().then(() => process.exit(0));
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error: unknown) => {
  console.error("Failed to start Tegbar API", error);
  process.exitCode = 1;
});
