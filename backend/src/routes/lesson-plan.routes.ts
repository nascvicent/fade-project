import type { FastifyInstance } from "fastify";
import * as controller from "../controllers/lesson-plan.controller.js";

export async function lessonPlanRoutes(app: FastifyInstance) {
  // CRUD
  app.post("/api/lesson-plans", controller.createHandler);
  app.get("/api/lesson-plans", controller.listHandler);
  app.get("/api/lesson-plans/:id", controller.getByIdHandler);
  app.put("/api/lesson-plans/:id", controller.updateHandler);
  app.delete("/api/lesson-plans/:id", controller.deleteHandler);

  // Smart Assist (IA)
  app.post("/api/lesson-plans/smart-assist", controller.smartAssistHandler);

  // Auxiliares (filtros)
  app.get("/api/disciplines", controller.disciplinesHandler);
  app.get("/api/tags", controller.tagsHandler);
}
