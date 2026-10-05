"use client";

import { useEffect, useState } from "react";

const themeStorageKey = "remeal-panel-theme";
const themeEventName = "remeal-panel-theme-change";

export function setPanelTheme(theme) {
  if (theme !== "light" && theme !== "dark") return;
  window.localStorage.setItem(themeStorageKey, theme);
  document.documentElement.dataset.remealTheme = theme;
  window.dispatchEvent(new CustomEvent(themeEventName, { detail: theme }));
}

function getPanelTheme() {
  return window.localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light";
}

export function PanelPreferences() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const applyTheme = () => {
      const nextTheme = getPanelTheme();
      document.documentElement.dataset.remealTheme = nextTheme;
      setTheme(nextTheme);
    };

    applyTheme();
    window.addEventListener(themeEventName, applyTheme);
    window.addEventListener("storage", applyTheme);
    return () => {
      window.removeEventListener(themeEventName, applyTheme);
      window.removeEventListener("storage", applyTheme);
    };
  }, []);

  return (
    <section className="rounded-xl border border-[#29261F]/[0.07] bg-[#FFF9EF] p-4 sm:p-6">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8B8172]">Preferensi</p>
        <h2 className="mt-1 text-base font-bold text-[#29261F]">Tampilan</h2>
        <p className="mt-1 text-xs leading-5 text-[#8B8172]">Tema tersimpan di browser dan berlaku untuk panel Seller/Admin.</p>
      </div>
      <div className="grid max-w-sm gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-[#29261F]">Tema aplikasi</span>
          <select
            className="mt-2 h-11 w-full min-w-0 rounded-lg border border-[#29261F]/10 bg-white px-3 text-sm text-[#29261F]"
            onChange={(event) => setPanelTheme(event.target.value)}
            value={theme}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
    </section>
  );
}

export default function PanelTheme() {
  useEffect(() => {
    document.documentElement.dataset.remealTheme = getPanelTheme();
  }, []);

  return null;
}
