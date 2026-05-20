import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import { lessonPlanRoutes } from "./lesson-plan.routes.js";

vi.mock("../config/prisma.js", () => ({
  prisma: {
    lessonPlan: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    tag: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("../config/env.js", () => ({
  env: {
    PORT: 3333,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    CORS_ORIGIN: "http://localhost:3000",
    AI_PROVIDER: "openai",
    AI_API_KEY: "test-key",
    AI_MODEL: "gpt-4o-mini",
  },
}));

vi.mock("../config/logger.js", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

const { prisma } = await import("../config/prisma.js");

const app = Fastify();

beforeAll(async () => {
  await app.register(lessonPlanRoutes);
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("GET /api/lesson-plans", () => {
  it("returns paginated list", async () => {
    const mockPlans = [
      {
        id: "1",
        title: "Plano de teste",
        objective: "Testar a API",
        summary: "Teste de integracao",
        scheduledDate: new Date("2025-06-01"),
        discipline: "Testes",
        contents: "Conteudo",
        resources: "",
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(prisma.lessonPlan.findMany).mockResolvedValue(mockPlans);
    vi.mocked(prisma.lessonPlan.count).mockResolvedValue(1);

    const response = await app.inject({
      method: "GET",
      url: "/api/lesson-plans",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.data).toHaveLength(1);
    expect(body.pagination.total).toBe(1);
    expect(body.pagination.page).toBe(1);
  });

  it("rejects invalid limit parameter", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/lesson-plans?limit=100",
    });

    expect(response.statusCode).toBe(400);
  });
});

describe("POST /api/lesson-plans", () => {
  it("creates a new plan", async () => {
    const newPlan = {
      title: "Nova Aula de Matematica",
      objective: "Ensinar funcoes quadraticas aos alunos",
      summary: "Estudo aprofundado de funcoes de segundo grau",
      scheduledDate: "2025-06-15",
      discipline: "Matematica",
      contents: "Funcoes quadraticas; Graficos; Raizes",
      resources: "Calculadora grafica",
      tags: ["funcoes", "matematica"],
    };

    vi.mocked(prisma.lessonPlan.create).mockResolvedValue({
      id: "new-id",
      ...newPlan,
      scheduledDate: new Date(newPlan.scheduledDate),
      resources: newPlan.resources,
      tags: newPlan.tags.map((name, i) => ({ id: String(i), name, createdAt: new Date() })),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const response = await app.inject({
      method: "POST",
      url: "/api/lesson-plans",
      payload: newPlan,
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.id).toBe("new-id");
    expect(body.title).toBe(newPlan.title);
  });

  it("rejects invalid body", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/lesson-plans",
      payload: { title: "AB" },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe("Validation failed");
  });
});

describe("GET /api/lesson-plans/:id", () => {
  it("returns a plan by id", async () => {
    const mockPlan = {
      id: "abc123",
      title: "Plano Existente",
      objective: "Objetivo do plano existente",
      summary: "Resumo do plano existente para teste",
      scheduledDate: new Date("2025-07-01"),
      discipline: "Ciencias",
      contents: "Conteudo do plano",
      resources: "",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.lessonPlan.findUnique).mockResolvedValue(mockPlan);

    const response = await app.inject({
      method: "GET",
      url: "/api/lesson-plans/abc123",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe("abc123");
  });

  it("returns 404 for non-existent plan", async () => {
    vi.mocked(prisma.lessonPlan.findUnique).mockResolvedValue(null);

    const response = await app.inject({
      method: "GET",
      url: "/api/lesson-plans/nonexistent",
    });

    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /api/lesson-plans/:id", () => {
  it("deletes a plan", async () => {
    vi.mocked(prisma.lessonPlan.delete).mockResolvedValue({} as never);

    const response = await app.inject({
      method: "DELETE",
      url: "/api/lesson-plans/abc123",
    });

    expect(response.statusCode).toBe(204);
  });

  it("returns 404 when plan not found", async () => {
    vi.mocked(prisma.lessonPlan.delete).mockRejectedValue(
      new Error("Record not found")
    );

    const response = await app.inject({
      method: "DELETE",
      url: "/api/lesson-plans/nonexistent",
    });

    expect(response.statusCode).toBe(404);
  });
});

describe("GET /api/tags", () => {
  it("returns list of tags", async () => {
    const mockTags = [
      { id: "1", name: "algebra" },
      { id: "2", name: "geometria" },
    ];

    vi.mocked(prisma.tag.findMany).mockResolvedValue(mockTags as never);

    const response = await app.inject({
      method: "GET",
      url: "/api/tags",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveLength(2);
    expect(body[0].name).toBe("algebra");
  });
});
