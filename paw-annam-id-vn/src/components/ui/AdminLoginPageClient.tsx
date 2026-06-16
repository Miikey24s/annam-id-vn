"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { Heart, Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginPageClient() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === "auth-callback-failed" ? "Đăng nhập thất bại. Vui lòng thử lại." : null
  );

  const supabase = createClient();

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/admin`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi không xác định.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/admin`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi khi đăng nhập bằng Google.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gradient-to-b from-gradient-start to-gradient-end dark:from-gradient-start dark:to-gradient-end">
      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-lg space-y-6 relative overflow-hidden cat-ears-card">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-primary-light rounded-full text-primary">
            <Heart className="w-8 h-8 fill-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-text">{t("login")}</h1>
          <p className="text-sm text-text-secondary max-w-xs">{t("loginDesc")}</p>
        </div>

        {/* Success/Error States */}
        {success && (
          <div className="bg-secondary-light/50 border border-secondary text-secondary p-4 rounded-2xl flex items-start gap-3 text-sm">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Đã gửi link đăng nhập!</p>
              <p className="text-xs text-text-secondary mt-1">
                Hãy kiểm tra hộp thư đến của email <span className="font-semibold">{email}</span> và click vào link để đăng nhập.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Lỗi đăng nhập</p>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Email Magic Link Form */}
        <form onSubmit={handleMagicLinkLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-text">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                disabled={loading || success}
                className="w-full bg-surface-alt border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-bold rounded-xl py-3 text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {tCommon("loading")}
              </>
            ) : (
              t("sendLink")
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-text-muted text-xs uppercase tracking-wider font-semibold">Hoặc</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-border bg-surface hover:bg-surface-alt text-text font-bold rounded-xl py-3 text-sm transition-colors flex items-center justify-center gap-3.5 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.24 1 3.21 3.79 1.34 7.86l3.87 3C6.13 7.82 8.78 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.02 3.67-5 3.67-8.64z"
            />
            <path
              fill="#FBBC05"
              d="M5.21 10.86c-.25-.76-.4-1.57-.4-2.41s.15-1.65.4-2.41l-3.87-3C.5 4.63 0 6.76 0 9c0 2.24.5 4.37 1.34 6.04l3.87-3.18z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.51 1.18-4.2 1.18-3.22 0-5.87-2.78-6.79-5.82l-3.87 3C3.21 20.21 7.24 23 12 23z"
            />
          </svg>
          Đăng nhập bằng Google
        </button>
      </div>
    </div>
  );
}
