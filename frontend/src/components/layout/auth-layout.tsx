import type { ReactNode } from "react";
import { ShieldCheck, Building2, ClipboardCheck } from "lucide-react";
import { Brand } from "@/components/layout/brand";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-indigo-800 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-36 -top-32 size-[520px] rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-8 size-[360px] rounded-full border border-white/10" />
        <div className="absolute -bottom-48 -left-40 size-[520px] rounded-full bg-indigo-700/70" />
        <Brand light />
        <div className="relative z-10 max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">Hawassa University · IoT Campus</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            A better campus starts with a place to report what needs care.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-indigo-100">
            Tegbar connects campus community members with the people who keep learning spaces safe, functional, and ready.
          </p>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ClipboardCheck, label: "Track every request" },
              { icon: Building2, label: "Campus-aware reporting" },
              { icon: ShieldCheck, label: "Accountable repairs" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <Icon size={19} className="text-indigo-200" />
                <p className="mt-3 text-xs font-medium leading-5 text-white">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-indigo-200">Built for Hawassa University Institute of Technology</p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-9 lg:hidden"><Brand /></div>
          {children}
          <p className="mt-10 text-center text-xs text-slate-400">Tegbar · Hawassa University IoT Campus</p>
        </div>
      </section>
    </main>
  );
}
