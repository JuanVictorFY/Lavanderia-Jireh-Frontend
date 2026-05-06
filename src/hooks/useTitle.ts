import { useEffect } from "react";

const BASE = "Lavandería Jireh";

export function useTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} — ${BASE}`;
    return () => { document.title = BASE; };
  }, [pageTitle]);
}
