"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/context/auth-context";
import { getApiErrorMessage } from "@/lib/api-client";
import { getRoleHome } from "@/utils/role-routing";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const user = await signIn({ email, password });
      window.location.assign(getRoleHome(user.role));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div>
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
          <LockKeyhole size={22} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue to your campus workspace.</p>
      </div>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <FormField label="University email" name="email" type="email" autoComplete="email" placeholder="name@hu.edu.et" required value={email} onChange={(event) => setEmail(event.target.value)} />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-indigo-700 hover:text-indigo-900">Forgot password?</Link>
          </div>
          <FormField label="" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? <><LoaderCircle size={17} className="animate-spin" /> Signing in…</> : <>Sign in <ArrowRight size={17} /></>}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">
        New to Tegbar? <Link href="/register" className="font-semibold text-indigo-700 hover:text-indigo-900">Create a student account</Link>
      </p>
    </AuthLayout>
  );
}
