import { describe, it, expect } from "vitest";
import {
  createLessonPlanSchema,
  updateLessonPlanSchema,
  queryLessonPlansSchema,
  smartAssistSchema,
} from "./lesson-plan.validator.js";

describe("createLessonPlanSchema", () => {
  it("validates a correct input", () => {
    const input = {
      title: "Introducao a Algebra",
      objective: "Ensinar conceitos basicos de algebra linear",
      summary: "Aula sobre vetores e matrizes com exercicios praticos",
      scheduledDate: "2025-06-01",
      discipline: "Matematica",
      contents: "Vetores; Matrizes; Operacoes",
      resources: "Livro didatico",
      tags: ["algebra", "matematica"],
    };
    const result = createLessonPlanSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("rejects title shorter than 3 chars", () => {
    const input = {
      title: "AB",
      objective: "Ensinar conceitos basicos de algebra",
      summary: "Aula sobre vetores e matrizes",
      scheduledDate: "2025-06-01",
      discipline: "Matematica",
      contents: "Vetores",
      tags: [],
    };
    const result = createLessonPlanSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = createLessonPlanSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("applies default values for optional fields", () => {
    const input = {
      title: "Aula de Historia",
      objective: "Entender o periodo colonial brasileiro",
      summary: "Estudo do periodo de 1500 a 1822",
      scheduledDate: "2025-07-01",
      discipline: "Historia",
      contents: "Descobrimento; Colonizacao",
    };
    const result = createLessonPlanSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.resources).toBe("");
      expect(result.data.tags).toEqual([]);
    }
  });

  it("coerces scheduledDate string to Date", () => {
    const input = {
      title: "Aula de Fisica",
      objective: "Leis de Newton e suas aplicacoes",
      summary: "Estudo das tres leis de Newton",
      scheduledDate: "2025-08-15",
      discipline: "Fisica",
      contents: "Primeira lei; Segunda lei; Terceira lei",
    };
    const result = createLessonPlanSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scheduledDate).toBeInstanceOf(Date);
    }
  });
});

describe("updateLessonPlanSchema", () => {
  it("allows partial updates", () => {
    const result = updateLessonPlanSchema.safeParse({ title: "Novo titulo aqui" });
    expect(result.success).toBe(true);
  });

  it("validates fields that are present", () => {
    const result = updateLessonPlanSchema.safeParse({ title: "AB" });
    expect(result.success).toBe(false);
  });

  it("allows empty object", () => {
    const result = updateLessonPlanSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe("queryLessonPlansSchema", () => {
  it("applies defaults for pagination", () => {
    const result = queryLessonPlansSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
      expect(result.data.sortBy).toBe("createdAt");
      expect(result.data.sortOrder).toBe("desc");
    }
  });

  it("rejects limit above 50", () => {
    const result = queryLessonPlansSchema.safeParse({ limit: 100 });
    expect(result.success).toBe(false);
  });

  it("coerces string numbers", () => {
    const result = queryLessonPlansSchema.safeParse({ page: "3", limit: "20" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(20);
    }
  });
});

describe("smartAssistSchema", () => {
  it("validates correct input", () => {
    const result = smartAssistSchema.safeParse({
      title: "Aula de Quimica",
      discipline: "Quimica",
      summary: "Estudo das reacoes quimicas organicas",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short title", () => {
    const result = smartAssistSchema.safeParse({
      title: "AB",
      discipline: "Quimica",
      summary: "Estudo das reacoes quimicas",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short summary", () => {
    const result = smartAssistSchema.safeParse({
      title: "Aula de Quimica",
      discipline: "Quimica",
      summary: "curto",
    });
    expect(result.success).toBe(false);
  });
});
