import type {
  LessonPlan,
  PaginatedResponse,
  LessonPlanFormData,
  SmartAssistRequest,
  SmartAssistResponse,
  Tag,
} from "@/types/lesson-plan";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(error.error ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  lessonPlans: {
    list(params?: Record<string, string>) {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return fetcher<PaginatedResponse<LessonPlan>>(`/api/lesson-plans${query}`);
    },

    getById(id: string) {
      return fetcher<LessonPlan>(`/api/lesson-plans/${id}`);
    },

    create(data: LessonPlanFormData) {
      return fetcher<LessonPlan>("/api/lesson-plans", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update(id: string, data: Partial<LessonPlanFormData>) {
      return fetcher<LessonPlan>(`/api/lesson-plans/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete(id: string) {
      return fetcher<void>(`/api/lesson-plans/${id}`, { method: "DELETE" });
    },

    smartAssist(data: SmartAssistRequest) {
      return fetcher<SmartAssistResponse>("/api/lesson-plans/smart-assist", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  },

  disciplines() {
    return fetcher<string[]>("/api/disciplines");
  },

  tags() {
    return fetcher<Tag[]>("/api/tags");
  },
};
