import Link from "next/link";
import { Wrench } from "lucide-react";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className={`flex size-10 items-center justify-center rounded-xl ${light ? "bg-white/15 text-white" : "bg-indigo-700 text-white"}`}>
        <Wrench size={20} strokeWidth={2.2} />
      </span>
      <span>
        <span className={`block text-lg font-bold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>Tegbar</span>
        <span className={`block text-[11px] ${light ? "text-indigo-100" : "text-slate-500"}`}>Campus maintenance</span>
      </span>
    </Link>
  );
}
