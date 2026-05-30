import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const inicio = (page - 1) * pageSize + 1;
  const fin    = Math.min(page * pageSize, total);

  const pageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between gap-4 px-5 py-3.5 border-t border-white/6">
        <p className="text-xs text-slate-500 whitespace-nowrap">
          Mostrando{" "}
          <span className="text-slate-300 font-medium">{inicio}–{fin}</span>
          {" "}de{" "}
          <span className="text-slate-300 font-medium">{total}</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/7 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers().map((n, i) =>
            n === "..." ? (
              <span key={`dots-${i}`} className="px-2 text-slate-600 text-sm select-none">…</span>
            ) : (
              <button
                key={n}
                onClick={() => onChange(n as number)}
                className={`min-w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  page === n
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/7"
                }`}
              >
                {n}
              </button>
            )
          )}

          <button
            onClick={() => onChange(page + 1)}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/7 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex sm:hidden items-center justify-between gap-2 mt-2">
        <Button variant="secondary" size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />} disabled={page === 1} onClick={() => onChange(page - 1)}>
          Anterior
        </Button>
        <span className="text-xs text-slate-400">
          <span className="text-white font-medium">{page}</span> / <span className="text-white font-medium">{totalPages}</span>
        </span>
        <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
          Siguiente <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </>
  );
}
