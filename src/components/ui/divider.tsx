interface DividerProps { label?: string; className?: string; }

export function Divider({ label, className = "" }: DividerProps) {
  if (!label) return <hr className={`border-white/8 ${className}`} />;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <hr className="flex-1 border-white/8" />
      <span className="text-xs text-slate-500 whitespace-nowrap">{label}</span>
      <hr className="flex-1 border-white/8" />
    </div>
  );
}
