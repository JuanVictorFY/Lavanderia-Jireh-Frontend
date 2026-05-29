import { useState } from "react";

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch { setCopied(false); }
  };
  return { copied, copy };
}
