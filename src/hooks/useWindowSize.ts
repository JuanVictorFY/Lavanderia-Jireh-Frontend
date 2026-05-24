import { useEffect, useState } from "react";

interface Size { width: number; height: number; }

export function useWindowSize(): Size {
  const [size, setSize] = useState<Size>({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handle = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
}
