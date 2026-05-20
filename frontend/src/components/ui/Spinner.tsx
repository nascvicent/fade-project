import { Loader2 } from "lucide-react";

export function Spinner({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-blue-600 ${className}`}
      aria-label="Carregando..."
    />
  );
}
