"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, X } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import type { LessonPlan, SmartAssistResponse } from "@/types/lesson-plan";

const formSchema = z.object({
  title: z.string().min(3, "Titulo deve ter no minimo 3 caracteres").max(200),
  objective: z.string().min(10, "Objetivo deve ter no minimo 10 caracteres"),
  summary: z.string().min(10, "Ementa deve ter no minimo 10 caracteres"),
  scheduledDate: z.string().min(1, "Data e obrigatoria"),
  discipline: z.string().min(2, "Disciplina e obrigatoria"),
  contents: z.string().min(1, "Conteudos sao obrigatorios"),
  resources: z.string(),
  tags: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface LessonPlanFormProps {
  plan?: LessonPlan | null;
  onSubmit: (data: {
    title: string;
    objective: string;
    summary: string;
    scheduledDate: string;
    discipline: string;
    contents: string;
    resources: string;
    tags: string[];
  }) => Promise<void>;
  onCancel: () => void;
}

export function LessonPlanForm({
  plan,
  onSubmit,
  onCancel,
}: LessonPlanFormProps) {
  const [smartAssistLoading, setSmartAssistLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartAssistResponse | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: plan?.title ?? "",
      objective: plan?.objective ?? "",
      summary: plan?.summary ?? "",
      scheduledDate: plan?.scheduledDate
        ? new Date(plan.scheduledDate).toISOString().split("T")[0]
        : "",
      discipline: plan?.discipline ?? "",
      contents: plan?.contents ?? "",
      resources: plan?.resources ?? "",
      tags: plan?.tags.map((t) => t.name).join(", ") ?? "",
    },
  });

  async function handleSmartAssist() {
    const title = watch("title");
    const discipline = watch("discipline");
    const summary = watch("summary");

    if (!title || !discipline || !summary) return;

    setSmartAssistLoading(true);
    setSuggestions(null);
    try {
      const result = await api.lessonPlans.smartAssist({
        title,
        discipline,
        summary,
      });
      setSuggestions(result);
    } catch {
      setSuggestions(null);
    } finally {
      setSmartAssistLoading(false);
    }
  }

  function applySuggestion(field: "contents" | "tags", value: string) {
    const current = watch(field);
    if (current) {
      setValue(field, `${current}; ${value}`);
    } else {
      setValue(field, value);
    }
  }

  async function onFormSubmit(data: FormValues) {
    setSubmitting(true);
    try {
      await onSubmit({
        ...data,
        tags: data.tags
          ? data.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      });
    } finally {
      setSubmitting(false);
    }
  }

  const canSmartAssist =
    watch("title")?.length >= 3 &&
    watch("discipline")?.length >= 2 &&
    watch("summary")?.length >= 10;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Titulo *
          </label>
          <input
            {...register("title")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Ex: Introducao a Algebra Linear"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Disciplina *
          </label>
          <input
            {...register("discipline")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Ex: Matematica"
          />
          {errors.discipline && (
            <p className="mt-1 text-xs text-red-600">
              {errors.discipline.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Data Agendada *
          </label>
          <input
            type="date"
            {...register("scheduledDate")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.scheduledDate && (
            <p className="mt-1 text-xs text-red-600">
              {errors.scheduledDate.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Objetivo *
          </label>
          <textarea
            {...register("objective")}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Descreva o objetivo da aula..."
          />
          {errors.objective && (
            <p className="mt-1 text-xs text-red-600">
              {errors.objective.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Ementa / Resumo *
          </label>
          <textarea
            {...register("summary")}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Resumo do conteudo da aula..."
          />
          {errors.summary && (
            <p className="mt-1 text-xs text-red-600">
              {errors.summary.message}
            </p>
          )}
        </div>

        {/* Smart Assist Button */}
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={handleSmartAssist}
            disabled={!canSmartAssist || smartAssistLoading}
            className="flex items-center gap-2 rounded-lg border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 disabled:opacity-50 disabled:hover:bg-purple-50"
          >
            {smartAssistLoading ? (
              <Spinner size={16} className="text-purple-600" />
            ) : (
              <Sparkles size={16} />
            )}
            {smartAssistLoading ? "Gerando sugestoes..." : "Smart Assist IA"}
          </button>
          {!canSmartAssist && (
            <p className="mt-1 text-xs text-gray-500">
              Preencha titulo, disciplina e ementa para usar o Smart Assist.
            </p>
          )}
        </div>

        {/* Smart Assist Results */}
        {suggestions && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 sm:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="flex items-center gap-1 text-sm font-medium text-purple-800">
                <Sparkles size={14} /> Sugestoes da IA
              </h4>
              <button
                type="button"
                onClick={() => setSuggestions(null)}
                className="text-purple-400 hover:text-purple-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-medium text-purple-700">
                  Conteudos sugeridos:
                </p>
                <p className="text-sm text-gray-700">{suggestions.contents}</p>
                <button
                  type="button"
                  onClick={() => applySuggestion("contents", suggestions.contents)}
                  className="mt-1 text-xs font-medium text-purple-600 hover:text-purple-800"
                >
                  + Aplicar nos conteudos
                </button>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-purple-700">
                  Topicos relacionados:
                </p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.relatedTopics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-purple-700">
                  Tags sugeridas:
                </p>
                <div className="flex flex-wrap gap-1">
                  {suggestions.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => applySuggestion("tags", tag)}
                      className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-200"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Conteudos *
          </label>
          <textarea
            {...register("contents")}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Liste os conteudos da aula..."
          />
          {errors.contents && (
            <p className="mt-1 text-xs text-red-600">
              {errors.contents.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Recursos
          </label>
          <textarea
            {...register("resources")}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Recursos necessarios (livros, slides, etc)..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            {...register("tags")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Separadas por virgula (ex: algebra, linear, matrizes)"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting && <Spinner size={16} className="text-white" />}
          {plan ? "Salvar Alteracoes" : "Criar Plano"}
        </button>
      </div>
    </form>
  );
}
