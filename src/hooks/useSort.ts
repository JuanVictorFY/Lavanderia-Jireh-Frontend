import { useState } from "react";
import type { SortConfig } from "@/types";

export function useSort<T>(initialKey: keyof T, initialDir: "asc" | "desc" = "asc") {
  const [sort, setSort] = useState<SortConfig<T>>({ key: initialKey, direction: initialDir });
  const toggle = (key: keyof T) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };
  return { sort, toggle };
}
