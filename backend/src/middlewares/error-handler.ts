import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../config/logger.js";

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error("Unhandled error", {
    message: error.message,
    statusCode: error.statusCode,
    stack: error.stack,
  });

  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode === 500
      ? "Erro interno do servidor"
      : error.message;

  return reply.status(statusCode).send({ error: message });
}
