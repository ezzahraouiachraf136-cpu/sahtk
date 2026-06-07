"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { adminLogin } from "@/lib/admin-api";
import { setAdminToken } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await adminLogin(username, password);
      setAdminToken(token);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-bg via-white to-brand-light p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-brand-light bg-white p-8 shadow-xl"
      >
        <div className="mb-8 text-center">
          <p className="text-sm text-brand-muted">نما للجمال</p>
          <h1 className="font-heading text-2xl font-bold text-brand">لوحة التحكم</h1>
        </div>
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-brand-muted">اسم المستخدم</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-brand-light px-4 py-3 outline-none focus:border-brand"
            required
          />
        </label>
        <label className="mb-6 block">
          <span className="mb-1 block text-sm text-brand-muted">كلمة المرور</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-brand-light px-4 py-3 outline-none focus:border-brand"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand py-3 font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
