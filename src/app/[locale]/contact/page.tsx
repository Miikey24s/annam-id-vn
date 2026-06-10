"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  Code,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  honeypot: z.string().max(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (data.honeypot) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "annamnguyen204@gmail.com",
      href: "mailto:annamnguyen204@gmail.com",
    },
    {
      icon: Code,
      label: "GitHub",
      value: "Miikey24s",
      href: "https://github.com/Miikey24s",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Vietnam 🇻🇳",
      href: null,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-text md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          {t("description")}
        </p>
      </motion.div>

      <div className="grid gap-12 lg:grid-cols-5">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl font-semibold text-text">
            {t("subtitle")}
          </h2>
          <p className="mt-3 text-text-secondary">{t("description")}</p>

          <div className="mt-8 space-y-4">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-all hover:bg-surface-alt"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-text hover:text-primary"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium text-text">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8"
          >
            {/* Honeypot */}
            <input
              type="text"
              {...register("honeypot")}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
                  {t("name")}
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder={t("name_placeholder")}
                  className="w-full rounded-lg border border-border bg-bg p-3 text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder={t("email_placeholder")}
                  className="w-full rounded-lg border border-border bg-bg p-3 text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="mt-5">
              <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-text">
                {t("subject")}
              </label>
              <input
                id="subject"
                type="text"
                {...register("subject")}
                placeholder={t("subject_placeholder")}
                className="w-full rounded-lg border border-border bg-bg p-3 text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="mt-5">
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text">
                {t("message")}
              </label>
              <textarea
                id="message"
                rows={5}
                {...register("message")}
                placeholder={t("message_placeholder")}
                className="w-full resize-none rounded-lg border border-border bg-bg p-3 text-text placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 px-6 font-medium text-white transition-all hover:bg-primary-dark disabled:opacity-70"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("sending")}
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  {t("send")}
                </>
              )}
            </button>

            {/* Status messages */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 rounded-lg bg-secondary-light p-3 text-sm text-secondary"
              >
                <CheckCircle2 className="h-5 w-5" />
                {t("success")}
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400"
              >
                <AlertCircle className="h-5 w-5" />
                {t("error")}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
