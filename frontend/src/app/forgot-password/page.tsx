"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, LoaderCircle, Mail } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { getApiErrorMessage } from "@/lib/api-client";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset(email);
      setMessage("If an account exists for this address, password reset instructions will be sent.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div>
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><Mail size={22} /></div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Reset your password</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Enter the email linked to your account to request reset instructions.</p>
      </div>
      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <FormField label="University email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 text-sm text-green-700">{message}</p>}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? <><LoaderCircle size={17} className="animate-spin" /> Sending request…</> : "Send reset instructions"}
        </Button>
      </form>
      <Link href="/login" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"><ArrowLeft size={16} /> Back to sign in</Link>
    </AuthLayout>
  );
}
