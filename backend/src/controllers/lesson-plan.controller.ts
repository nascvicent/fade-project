import type { FastifyRequest, FastifyReply } from "fastify";
import {
  createLessonPlanSchema,
  updateLessonPlanSchema,
  queryLessonPlansSchema,
  smartAssistSchema,
} from "../validators/lesson-plan.validator.js";
import * as lessonPlanService from "../services/lesson-plan.service.js";
import { getAIRecommendations } from "../services/ai.service.js";
import { logger } from "../config/logger.js";

export async function createHandler(req: FastifyRequest, reply: FastifyReply) {
  const parsed = createLessonPlanSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten() });
  }

  const plan = await lessonPlanService.createLessonPlan(parsed.data);
  logger.info("Lesson plan created", { id: plan.id, title: plan.title });
  return reply.status(201).send(plan);
}

export async function listHandler(req: FastifyRequest, reply: FastifyReply) {
  const parsed = queryLessonPlansSchema.safeParse(req.query);
  if (!parsed.success) {
    return reply.status(400).send({ error: "Invalid query params", details: parsed.error.flatten() });
  }

  const result = await lessonPlanService.getLessonPlans(parsed.data);
  return reply.send(result);
}

export async function getByIdHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const plan = await lessonPlanService.getLessonPlanById(req.params.id);
  if (!plan) {
    return reply.status(404).send({ error: "Plano de aula não encontrado" });
  }
  return reply.send(plan);
}

export async function updateHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const parsed = updateLessonPlanSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten() });
  }

  try {
    const plan = await lessonPlanService.updateLessonPlan(req.params.id, parsed.data);
    logger.info("Lesson plan updated", { id: plan.id, title: plan.title });
    return reply.send(plan);
  } catch {
    return reply.status(404).send({ error: "Plano de aula não encontrado" });
  }
}

export async function deleteHandler(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    await lessonPlanService.deleteLessonPlan(req.params.id);
    logger.info("Lesson plan deleted", { id: req.params.id });
    return reply.status(204).send();
  } catch {
    return reply.status(404).send({ error: "Plano de aula não encontrado" });
  }
}

export async function smartAssistHandler(req: FastifyRequest, reply: FastifyReply) {
  const parsed = smartAssistSchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: "Validation failed", details: parsed.error.flatten() });
  }

  try {
    const recommendations = await getAIRecommendations(parsed.data);
    return reply.send(recommendations);
  } catch (error) {
    logger.error("Smart Assist failed", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    return reply.status(502).send({
      error: "Falha ao consultar a IA. Tente novamente em alguns instantes.",
    });
  }
}

export async function disciplinesHandler(_req: FastifyRequest, reply: FastifyReply) {
  const disciplines = await lessonPlanService.getDisciplines();
  return reply.send(disciplines);
}

export async function tagsHandler(_req: FastifyRequest, reply: FastifyReply) {
  const tags = await lessonPlanService.getAllTags();
  return reply.send(tags);
}
