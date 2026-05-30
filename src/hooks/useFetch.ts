import { useEffect, useState } from "react";

interface FetchState<T> { data: T | null; loading: boolean; error: string | null; }

export function useFetch<T>(url: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: false, error: null });
  useEffect(() => {
    if (!url) return;
    setState({ data: null, loading: true, error: null });
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() as Promise<T>; })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e: Error) => setState({ data: null, loading: false, error: e.message }));
  }, [url]);
  return state;
}
