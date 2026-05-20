"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, BookOpen, Target, FileText, Package, Tag } from "lucide-react";
import type { LessonPlan } from "@/types/lesson-plan";

interface LessonPlanDetailProps {
  plan: LessonPlan;
  onClose: () => void;
  onEdit: () => void;
}

export function LessonPlanDetail({
  plan,
  onClose,
  onEdit,
}: LessonPlanDetailProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-100 p-2">
          <BookOpen size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
          <p className="text-sm text-gray-500">{plan.discipline}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          {format(new Date(plan.scheduledDate), "dd 'de' MMMM 'de' yyyy", {
            locale: ptBR,
          })}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          Criado em{" "}
          {format(new Date(plan.createdAt), "dd/MM/yyyy", { locale: ptBR })}
        </div>
      </div>

      <div>
        <h4 className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
          <Target size={14} /> Objetivo
        </h4>
        <p className="text-sm text-gray-600">{plan.objective}</p>
      </div>

      <div>
        <h4 className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
          <FileText size={14} /> Ementa
        </h4>
        <p className="text-sm text-gray-600">{plan.summary}</p>
      </div>

      <div>
        <h4 className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
          <BookOpen size={14} /> Conteudos
        </h4>
        <p className="whitespace-pre-wrap text-sm text-gray-600">
          {plan.contents}
        </p>
      </div>

      {plan.resources && (
        <div>
          <h4 className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            <Package size={14} /> Recursos
          </h4>
          <p className="whitespace-pre-wrap text-sm text-gray-600">
            {plan.resources}
          </p>
        </div>
      )}

      {plan.tags.length > 0 && (
        <div>
          <h4 className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            <Tag size={14} /> Tags
          </h4>
          <div className="flex flex-wrap gap-1">
            {plan.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Fechar
        </button>
        <button
          onClick={onEdit}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
