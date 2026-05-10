import { useState } from "react";

interface Options { pageSize?: number; initialPage?: number; }

export function usePagination({ pageSize = 8, initialPage = 1 }: Options = {}) {
  const [page, setPage] = useState(initialPage);
  const reset = () => setPage(1);
  const next  = (totalPages: number) => setPage((p) => Math.min(p + 1, totalPages));
  const prev  = () => setPage((p) => Math.max(p - 1, 1));
  return { page, setPage, reset, next, prev, pageSize };
}
