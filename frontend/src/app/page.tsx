"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { LessonPlan, PaginatedResponse } from "@/types/lesson-plan";
import { LessonPlanTable } from "@/components/LessonPlanTable";
import { LessonPlanFilters } from "@/components/LessonPlanFilters";
import { LessonPlanForm } from "@/components/LessonPlanForm";
import { LessonPlanDetail } from "@/components/LessonPlanDetail";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";

type View = "list" | "create" | "edit" | "detail";

interface Filters {
  search: string;
  discipline: string;
  tag: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: string;
}

const defaultFilters: Filters = {
  search: "",
  discipline: "",
  tag: "",
  dateFrom: "",
  dateTo: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function Home() {
  const [view, setView] = useState<View>("list");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedResponse<LessonPlan> | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LessonPlan | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: "10",
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };
      if (filters.search) params.search = filters.search;
      if (filters.discipline) params.discipline = filters.discipline;
      if (filters.tag) params.tag = filters.tag;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const result = await api.lessonPlans.list(params);
      setData(result);
    } catch {
      toast.error("Erro ao carregar planos de aula.");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  async function handleCreate(formData: {
    title: string;
    objective: string;
    summary: string;
    scheduledDate: string;
    discipline: string;
    contents: string;
    resources: string;
    tags: string[];
  }) {
    await api.lessonPlans.create(formData);
    toast.success("Plano de aula criado com sucesso!");
    setView("list");
    fetchPlans();
  }

  async function handleUpdate(formData: {
    title: string;
    objective: string;
    summary: string;
    scheduledDate: string;
    discipline: string;
    contents: string;
    resources: string;
    tags: string[];
  }) {
    if (!selectedPlan) return;
    await api.lessonPlans.update(selectedPlan.id, formData);
    toast.success("Plano de aula atualizado com sucesso!");
    setView("list");
    setSelectedPlan(null);
    fetchPlans();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await api.lessonPlans.delete(deleteTarget.id);
    toast.success("Plano de aula excluido com sucesso!");
    setDeleteTarget(null);
    fetchPlans();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Lesson Plan Manager
          </h1>
          <p className="text-sm text-gray-500">
            Gerenciamento de Planos de Aula com Smart Assist IA
          </p>
        </div>
        {view === "list" && (
          <button
            onClick={() => {
              setSelectedPlan(null);
              setView("create");
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />
            Novo Plano
          </button>
        )}
      </div>

      {view === "list" && (
        <div className="space-y-4">
          <LessonPlanFilters filters={filters} onFiltersChange={setFilters} />

          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <TableSkeleton />
            </div>
          ) : data ? (
            <>
              <LessonPlanTable
                plans={data.data}
                onView={(plan) => {
                  setSelectedPlan(plan);
                  setView("detail");
                }}
                onEdit={(plan) => {
                  setSelectedPlan(plan);
                  setView("edit");
                }}
                onDelete={(plan) => setDeleteTarget(plan)}
              />
              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                total={data.pagination.total}
                onPageChange={setPage}
              />
            </>
          ) : null}
        </div>
      )}

      {view === "create" && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Novo Plano de Aula
          </h2>
          <LessonPlanForm
            onSubmit={handleCreate}
            onCancel={() => setView("list")}
          />
        </div>
      )}

      {view === "edit" && selectedPlan && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Editar Plano de Aula
          </h2>
          <LessonPlanForm
            plan={selectedPlan}
            onSubmit={handleUpdate}
            onCancel={() => {
              setView("list");
              setSelectedPlan(null);
            }}
          />
        </div>
      )}

      {view === "detail" && selectedPlan && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <LessonPlanDetail
            plan={selectedPlan}
            onClose={() => {
              setView("list");
              setSelectedPlan(null);
            }}
            onEdit={() => setView("edit")}
          />
        </div>
      )}

      <DeleteConfirmModal
        open={deleteTarget !== null}
        title={deleteTarget?.title ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
