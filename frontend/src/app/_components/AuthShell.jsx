import Link from "next/link";
import { Utensils } from "lucide-react";

export const authInputClass =
  "w-full rounded-xl border-2 border-[#211f1c] bg-[#fffdf8] px-4 py-3 text-sm font-medium text-[#211f1c] outline-none transition placeholder:text-[#716e68]/70 focus:bg-white focus:shadow-[3px_3px_0px_0px_#211f1c]";

export const authButtonClass =
  "w-full rounded-full border-2 border-[#211f1c] bg-[#ffc72c] px-6 py-3.5 text-base font-black text-[#211f1c] shadow-[4px_4px_0px_0px_#211f1c] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#211f1c] disabled:cursor-not-allowed disabled:opacity-60";

export function AuthField({ label, children, hint }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-[#211f1c]">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs font-medium text-[#716e68]">{hint}</span> : null}
    </label>
  );
}

export function AuthAlert({ type = "error", children }) {
  if (!children) return null;
  const styles =
    type === "error"
      ? "bg-[#f7d4c9]"
      : "bg-[#dcebd3]";
  return (
    <p
      className={`rounded-xl border-2 border-[#211f1c] px-4 py-3 text-sm font-bold text-[#211f1c] ${styles}`}
      role={type === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}

export default function AuthShell({ badge, title, subtitle, accent = "#ffc72c", aside, children, footer }) {
  return (
    <div className="min-h-screen bg-[#fff9ef] font-sans text-[#211f1c] selection:bg-[#ffc72c]">
      <header className="flex items-center justify-between border-b-2 border-[#211f1c] px-6 py-4 sm:px-12">
        <Link href="/" className="flex items-center gap-3" id="auth-home-link">
          <span className="rotate-3 rounded-xl border-2 border-[#211f1c] bg-[#ffc72c] p-2 shadow-[2px_2px_0px_0px_#211f1c] transition-transform hover:rotate-0">
            <Utensils size={22} strokeWidth={2.5} />
          </span>
          <span className="text-2xl font-black tracking-tight">ReMeal</span>
        </Link>
        <Link href="/" className="text-sm font-bold underline-offset-4 hover:underline">
          ← Kembali ke beranda
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_minmax(0,480px)] lg:py-20">
        <div className="hidden lg:block">
          <span
            className="inline-block -rotate-2 rounded-full border-2 border-[#211f1c] px-4 py-1.5 text-sm font-black shadow-[2px_2px_0px_0px_#211f1c]"
            style={{ backgroundColor: accent }}
          >
            {badge}
          </span>
          <h2 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight xl:text-6xl">{title}</h2>
          <p className="mt-6 max-w-md border-l-4 border-[#ffc72c] pl-5 text-lg font-medium text-[#716e68]">{subtitle}</p>
          {aside ? <div className="mt-10">{aside}</div> : null}
        </div>

        <section className="rounded-[2rem] border-2 border-[#211f1c] bg-[#fffdf8] p-7 shadow-[8px_8px_0px_0px_#211f1c] sm:p-9">
          {children}
          {footer ? <div className="mt-7 border-t-2 border-dashed border-[#211f1c]/25 pt-6 text-center text-sm font-medium text-[#716e68]">{footer}</div> : null}
        </section>
      </main>
    </div>
  );
}
