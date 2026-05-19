import { z } from "zod";

export const createLessonPlanSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").max(200),
  objective: z.string().min(10, "Objetivo deve ter no mínimo 10 caracteres"),
  summary: z.string().min(10, "Ementa deve ter no mínimo 10 caracteres"),
  scheduledDate: z.coerce.date(),
  discipline: z.string().min(2, "Disciplina é obrigatória"),
  contents: z.string().min(1, "Conteúdos são obrigatórios"),
  resources: z.string().default(""),
  tags: z.array(z.string()).default([]),
});

export const updateLessonPlanSchema = createLessonPlanSchema.partial();

export const queryLessonPlansSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().optional(),
  discipline: z.string().optional(),
  tag: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z.enum(["title", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const smartAssistSchema = z.object({
  title: z.string().min(3),
  discipline: z.string().min(2),
  summary: z.string().min(10),
});

export type CreateLessonPlanInput = z.infer<typeof createLessonPlanSchema>;
export type UpdateLessonPlanInput = z.infer<typeof updateLessonPlanSchema>;
export type QueryLessonPlansInput = z.infer<typeof queryLessonPlansSchema>;
export type SmartAssistInput = z.infer<typeof smartAssistSchema>;
