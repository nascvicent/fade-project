"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";

interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  open,
  title,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Confirmar Exclusao">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-red-100 p-2">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <div>
          <p className="text-sm text-gray-700">
            Tem certeza que deseja excluir o plano de aula{" "}
            <strong>&quot;{title}&quot;</strong>? Esta acao nao pode ser
            desfeita.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading && <Spinner size={16} className="text-white" />}
          Excluir
        </button>
      </div>
    </Modal>
  );
}
