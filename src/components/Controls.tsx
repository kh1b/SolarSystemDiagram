import type { ReactNode } from "react";
import { SPEED_MAX, SPEED_MIN, SPEED_PRESETS, fmtSpeed } from "../data/bodies";

const LOG = Math.log(SPEED_MAX / SPEED_MIN);
const toSlider = (v: number) => (Math.log(v / SPEED_MIN) / LOG) * 1000;
const fromSlider = (s: number) => Math.max(SPEED_MIN, Math.round(SPEED_MIN * Math.exp((s / 1000) * LOG)));

interface Props {
  running: boolean;
  speed: number;
  showOrbits: boolean;
  showLabels: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  onSpeed: (v: number) => void;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
}

function Toggle({ active, label, onClick, icon }: { active: boolean; label: string; onClick: () => void; icon: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 ${
        active
          ? "border-[rgba(244,182,66,0.5)] bg-[rgba(244,182,66,0.12)] text-[#ffd073]"
          : "border-white/10 text-[#5d6c8e] hover:border-white/25 hover:text-[#8fa2c6]"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function Controls({
  running,
  speed,
  showOrbits,
  showLabels,
  onToggleRun,
  onReset,
  onSpeed,
  onToggleOrbits,
  onToggleLabels,
}: Props) {
  return (
    <div className="pointer-events-auto flex w-[min(960px,94vw)] flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl border border-[rgba(130,155,215,0.16)] bg-[rgba(9,14,30,0.92)] px-5 py-3.5 shadow-[0_18px_60px_rgba(0,0,0,0.5)] backdrop-blur-md md:justify-between">
      {/* транспорт */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReset}
          aria-label="Сбросить время"
          title="Сбросить время"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-[#8fa2c6] transition hover:rotate-[-40deg] hover:border-white/30 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9M2.5 1.5v3h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={onToggleRun}
          aria-label={running ? "Пауза" : "Воспроизвести"}
          className="group grid h-12 w-12 place-items-center rounded-full bg-[#f4b642] text-[#0a0f1e] shadow-[0_0_26px_rgba(244,182,66,0.45)] transition-transform duration-200 hover:scale-108 hover:bg-[#ffd073] active:scale-95"
        >
          {running ? (
            <svg width="15" height="16" viewBox="0 0 15 16" fill="currentColor">
              <rect x="1.5" width="4.4" height="16" rx="1.4" />
              <rect x="9.1" width="4.4" height="16" rx="1.4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.5 1.9c0-1 1.1-1.6 2-1.1l9 5.2c.9.5.9 1.8 0 2.3l-9 5.2c-.9.5-2-.1-2-1.1V1.9z" transform="translate(0.5,1.4)" />
            </svg>
          )}
        </button>
        <div className="leading-tight">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#5d6c8e]">Скорость</p>
          <p className="font-display text-[14px] font-semibold text-[#ffd073]">{fmtSpeed(speed)}</p>
        </div>
      </div>

      {/* скорость */}
      <div className="flex min-w-[220px] flex-1 flex-col gap-1.5 md:max-w-[360px]">
        <div className="hidden flex-wrap gap-1.5 lg:flex">
          {SPEED_PRESETS.map((p) => (
            <button
              key={p.v}
              onClick={() => onSpeed(p.v)}
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
                speed === p.v
                  ? "bg-[rgba(244,182,66,0.18)] text-[#ffd073] shadow-[inset_0_0_0_1px_rgba(244,182,66,0.45)]"
                  : "text-[#5d6c8e] hover:bg-white/[0.05] hover:text-[#c9d7f2]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={toSlider(speed)}
          onChange={(e) => onSpeed(fromSlider(Number(e.target.value)))}
          className="speed-range w-full"
          aria-label="Скорость времени"
        />
      </div>

      {/* переключатели */}
      <div className="flex items-center gap-2">
        <Toggle
          active={showOrbits}
          label="Орбиты"
          onClick={onToggleOrbits}
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <ellipse cx="7" cy="7" rx="5.8" ry="2.6" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="7" cy="7" r="1.8" fill="currentColor" />
            </svg>
          }
        />
        <Toggle
          active={showLabels}
          label="Подписи"
          onClick={onToggleLabels}
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 11.5L6 3l4 8.5M3.4 8.7h5.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 6.5l2 5M10.8 9.6h2.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
