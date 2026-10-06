import Link from "next/link";
import { Utensils } from "lucide-react";

/**
 * Logo ReMeal yang konsisten dengan landing page:
 * kotak kuning bergaris tebal + bayangan offset, ikon garpu-sendok, dan wordmark tebal.
 * Warna garis/bayangan memakai var(--remeal-dark) agar ikut tema terang/gelap panel.
 */
export function BrandMark({ size = "md", className = "" }) {
  const dims = size === "sm" ? "h-9 w-9 rounded-lg" : "h-10 w-10 rounded-xl";
  const icon = size === "sm" ? 18 : 20;
  return (
    <span aria-hidden="true" className={`brand-logo-mark flex shrink-0 items-center justify-center ${dims} ${className}`}>
      <Utensils size={icon} strokeWidth={2.5} />
    </span>
  );
}

export default function BrandLogo({ href = "/", subtitle, ariaLabel = "ReMeal" }) {
  return (
    <Link aria-label={ariaLabel} className="brand-logo group flex items-center gap-3 px-2" href={href}>
      <BrandMark />
      <span className="min-w-0">
        <span className="block text-[1.4rem] font-extrabold leading-none tracking-tight">ReMeal</span>
        {subtitle && <span className="brand-logo-badge mt-1.5 inline-flex">{subtitle}</span>}
      </span>
    </Link>
  );
}
