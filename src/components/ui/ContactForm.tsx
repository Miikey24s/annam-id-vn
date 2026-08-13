"use client";

import { FormEvent, useState } from "react";

export default function ContactForm({ locale }: { locale: string }) {
  const en = locale === "en";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("request failed");
      setStatus("success");
      setMessage(en ? "Thanks — your message is on its way." : "Cảm ơn bạn — tin nhắn đã được gửi.");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage(en ? "Something went wrong. Please email me directly." : "Có lỗi xảy ra. Bạn có thể gửi email trực tiếp cho mình.");
    }
  }
  return <form onSubmit={submit} className="neo-card bg-cream p-5 sm:p-7"><input className="hidden" name="honeypot" tabIndex={-1} autoComplete="off" /><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-extrabold">{en ? "Name" : "Tên"}<input required minLength={2} name="name" className="rounded-lg border-[3px] border-ink bg-paper px-3 py-3 font-medium outline-none focus:bg-yellow" /></label><label className="grid gap-2 text-sm font-extrabold">Email<input required type="email" name="email" className="rounded-lg border-[3px] border-ink bg-paper px-3 py-3 font-medium outline-none focus:bg-yellow" /></label></div><label className="mt-5 grid gap-2 text-sm font-extrabold">{en ? "Subject" : "Chủ đề"}<input required minLength={3} name="subject" className="rounded-lg border-[3px] border-ink bg-paper px-3 py-3 font-medium outline-none focus:bg-yellow" /></label><label className="mt-5 grid gap-2 text-sm font-extrabold">{en ? "Message" : "Tin nhắn"}<textarea required minLength={10} name="message" rows={6} className="resize-y rounded-lg border-[3px] border-ink bg-paper px-3 py-3 font-medium outline-none focus:bg-yellow" /></label><div className="mt-6 flex flex-wrap items-center gap-4"><button type="submit" disabled={status === "sending"} className="neo-button neo-button-orange disabled:cursor-wait disabled:opacity-60">{status === "sending" ? (en ? "Sending..." : "Đang gửi...") : (en ? "Send message" : "Gửi tin nhắn")}</button>{message && <p role="status" className={`font-bold ${status === "error" ? "text-red-700" : ""}`}>{message}</p>}</div></form>;
}
