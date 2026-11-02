import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><ShieldAlert size={25} /></div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">Access restricted</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">You don’t have permission</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">This workspace is not available for your account role. If you believe this is a mistake, contact your campus administrator.</p>
        <Link href="/login" className="mt-7 block"><Button fullWidth>Return to sign in</Button></Link>
      </section>
    </main>
  );
}
