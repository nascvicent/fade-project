import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { lessonPlanRoutes } from "./routes/lesson-plan.routes.js";

const app = Fastify({ logger: false });

// Plugins
await app.register(cors, { origin: env.CORS_ORIGIN });
await app.register(helmet);

// Error handler global
app.setErrorHandler(errorHandler);

// Health Check
app.get("/health", async () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
}));

// Rotas
await app.register(lessonPlanRoutes);

// Start
try {
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
  logger.info(`📋 Health check: http://localhost:${env.PORT}/health`);
} catch (err) {
  logger.error("Failed to start server", { error: err });
  process.exit(1);
}
