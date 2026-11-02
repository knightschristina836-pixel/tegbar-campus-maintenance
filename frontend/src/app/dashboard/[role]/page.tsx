"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { ClipboardList, Construction } from "lucide-react";

const roleTitles: Record<string, string> = {
  student: "Student workspace",
  proctor: "Proctor workspace",
  technician: "Technician workspace",
  admin: "Administration",
};

function DashboardHomeContent() {
  const params = useParams<{ role: string }>();
  const title = roleTitles[params.role] ?? "Workspace";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-700">IoT Campus</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">Your Tegbar workspace is ready to connect to campus services.</p>
        </div>
      </div>
      <section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 sm:p-12">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <Construction size={25} />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-slate-900">Workspace foundation</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Role-aware access and the shared dashboard shell are in place. Complaint, assignment, and analytics views will be added when their API endpoints are available.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-600">
            <ClipboardList size={15} /> No development sample data is shown
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">Loading dashboard…</div>}>
      <DashboardHomeContent />
    </Suspense>
  );
}
