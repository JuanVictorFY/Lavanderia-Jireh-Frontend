import { useState } from "react";

export function useConfirm() {
  const [isOpen, setIsOpen]       = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const ask    = (id: number) => { setPendingId(id); setIsOpen(true); };
  const cancel = () => { setIsOpen(false); setPendingId(null); };
  const confirm = () => { setIsOpen(false); return pendingId; };
  return { isOpen, pendingId, ask, cancel, confirm };
}
