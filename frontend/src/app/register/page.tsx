"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle, UserRoundPlus } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/lib/api-client";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", studentId: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.registerStudent({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        studentId: form.studentId,
        password: form.password,
      });
      setSuccess("Account request submitted. You can sign in once registration is confirmed.");
      setForm({ firstName: "", lastName: "", email: "", studentId: "", password: "", confirmPassword: "" });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div>
        <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><UserRoundPlus size={22} /></div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Create a student account</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">Use your university details to get started with Tegbar.</p>
      </div>
      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First name" name="firstName" autoComplete="given-name" required value={form.firstName} onChange={(event) => update("firstName", event.target.value)} />
          <FormField label="Last name" name="lastName" autoComplete="family-name" required value={form.lastName} onChange={(event) => update("lastName", event.target.value)} />
        </div>
        <FormField label="Student ID" name="studentId" required value={form.studentId} onChange={(event) => update("studentId", event.target.value)} />
        <FormField label="University email" name="email" type="email" autoComplete="email" required value={form.email} onChange={(event) => update("email", event.target.value)} />
        <FormField label="Password" name="password" type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={(event) => update("password", event.target.value)} />
        <FormField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" required value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} />
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-3.5 py-3 text-sm text-green-700">{success}</p>}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? <><LoaderCircle size={17} className="animate-spin" /> Creating account…</> : <>Create account <ArrowRight size={17} /></>}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link href="/login" className="font-semibold text-indigo-700 hover:text-indigo-900">Sign in</Link></p>
    </AuthLayout>
  );
}
