"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { LessonPlan } from "@/types/lesson-plan";

interface LessonPlanTableProps {
  plans: LessonPlan[];
  onView: (plan: LessonPlan) => void;
  onEdit: (plan: LessonPlan) => void;
  onDelete: (plan: LessonPlan) => void;
}

export function LessonPlanTable({
  plans,
  onView,
  onEdit,
  onDelete,
}: LessonPlanTableProps) {
  if (plans.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">Nenhum plano de aula encontrado.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Titulo</th>
              <th className="px-4 py-3 font-medium text-gray-700">
                Disciplina
              </th>
              <th className="px-4 py-3 font-medium text-gray-700">
                Data Agendada
              </th>
              <th className="px-4 py-3 font-medium text-gray-700">Tags</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">
                Acoes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {plans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <button
                    onClick={() => onView(plan)}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {plan.title}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-600">{plan.discipline}</td>
                <td className="px-4 py-3 text-gray-600">
                  {format(new Date(plan.scheduledDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {plan.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onView(plan)}
                      title="Visualizar"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(plan)}
                      title="Editar"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-yellow-600"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(plan)}
                      title="Excluir"
                      className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="mb-2 flex items-start justify-between">
              <button
                onClick={() => onView(plan)}
                className="text-left font-medium text-gray-900 hover:text-blue-600"
              >
                {plan.title}
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => onEdit(plan)}
                  className="rounded p-1 text-gray-400 hover:text-yellow-600"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(plan)}
                  className="rounded p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="mb-1 text-sm text-gray-600">{plan.discipline}</p>
            <p className="mb-2 text-sm text-gray-500">
              {format(new Date(plan.scheduledDate), "dd/MM/yyyy", {
                locale: ptBR,
              })}
            </p>
            <div className="flex flex-wrap gap-1">
              {plan.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
