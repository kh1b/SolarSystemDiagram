import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Scene, { StarField } from "./components/Scene";
import InfoPanel from "./components/InfoPanel";
import Controls from "./components/Controls";
import { BODIES, SPEED_PRESETS, fmtElapsed, fmtSpeed } from "./data/bodies";

export default function App() {
  const [simDays, setSimDays] = useState(0);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(30);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [par, setPar] = useState({ x: 0, y: 0 });

  const runningRef = useRef(running);
  const speedRef = useRef(speed);
  runningRef.current = running;
  speedRef.current = speed;

  /* ---------- симуляционный цикл ---------- */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (runningRef.current) setSimDays((d) => d + dt * speedRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---------- клавиатура ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        setRunning((r) => !r);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setSpeed((s) => {
          const idx = SPEED_PRESETS.findIndex((p) => p.v === s);
          const cur = idx === -1 ? SPEED_PRESETS.findIndex((p) => p.v > s) : idx;
          const next =
            e.key === "ArrowRight"
              ? Math.min(SPEED_PRESETS.length - 1, Math.max(cur, 0) + (idx === -1 ? 0 : 1))
              : Math.max(0, (idx === -1 ? cur : cur) - 1);
          return SPEED_PRESETS[next].v;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onMove = useCallback((e: MouseEvent) => {
    setPar({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  }, []);

  const selected = BODIES.find((b) => b.id === selectedId) ?? null;
  const elapsed = fmtElapsed(simDays);

  return (
    <div className="fixed inset-0 select-none overflow-hidden" onMouseMove={onMove}>
      {/* ---------- фоновые слои ---------- */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 700px at 68% 18%, #0b1734 0%, #050914 58%), radial-gradient(900px 600px at 20% 85%, #0a1226 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          transform: `translate(${par.x * 22}px, ${par.y * 16}px)`,
          transition: "transform 900ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        <div
          className="absolute -left-48 -top-48 h-[880px] w-[880px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(38,92,148,0.16) 0%, transparent 64%)" }}
        />
        <div
          className="absolute -bottom-56 -right-40 h-[900px] w-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(196,104,42,0.09) 0%, transparent 62%)" }}
        />
        <div
          className="absolute left-[8%] top-[58%] h-[560px] w-[560px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(32,128,138,0.08) 0%, transparent 60%)" }}
        />
      </div>
      <StarField px={par.x} py={par.y} />

      {/* метеоры */}
      <div className="meteor-wrap" style={{ top: "12%", left: "78%", transform: "rotate(205deg)" }}>
        <div className="meteor" style={{ "--md": "12s", "--mdl": "3.5s" } as CSSProperties} />
      </div>
      <div className="meteor-wrap" style={{ top: "38%", left: "96%", transform: "rotate(196deg)" }}>
        <div className="meteor" style={{ "--md": "17s", "--mdl": "11s" } as CSSProperties} />
      </div>

      {/* ---------- сцена ---------- */}
      <Scene
        simDays={simDays}
        selectedId={selectedId}
        hoverId={hoverId}
        showOrbits={showOrbits}
        showLabels={showLabels}
        px={par.x}
        py={par.y}
        onSelect={setSelectedId}
        onHover={setHoverId}
      />

      {/* виньетка */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(2,4,10,0.55) 100%)" }}
      />

      {/* ---------- заголовок ---------- */}
      <header className="pointer-events-none absolute left-5 top-5 z-20 md:left-8 md:top-7">
        <p className="mb-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-[#8fa2c6]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f4b642] shadow-[0_0_8px_rgba(244,182,66,0.9)]" />
          Интерактивная модель
        </p>
        <h1 className="font-display text-[24px] font-extrabold leading-[1.02] text-white md:text-[34px]">
          Солнечная
          <span className="outline-text block">система</span>
        </h1>
        <p className="mt-2.5 max-w-[240px] text-[11.5px] leading-snug text-[#5d6c8e] md:max-w-[280px]">
          8 планет в движении. Масштаб расстояний и размеров условен.
        </p>
      </header>

      {/* ---------- модельное время ---------- */}
      <div className="pointer-events-none absolute right-5 top-5 z-20 text-right md:right-8 md:top-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#5d6c8e]">Модельное время</p>
        <p className="mt-1 font-display text-[26px] font-bold leading-none text-white tabular-nums md:text-[32px]">
          {elapsed.big}
        </p>
        <p className="mt-1 text-[11.5px] font-medium text-[#8fa2c6]">
          {elapsed.small} · <span className="text-[#ffd073]">{fmtSpeed(speed)}</span>
          {!running && <span className="ml-2 rounded bg-[rgba(244,182,66,0.15)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ffd073]">пауза</span>}
        </p>
      </div>

      {/* ---------- рельс планет (desktop) ---------- */}
      <nav className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-[3px] lg:flex" aria-label="Планеты">
        {BODIES.map((b, i) => {
          const active = selectedId === b.id;
          const hovered = hoverId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedId(active ? null : b.id)}
              onMouseEnter={() => setHoverId(b.id)}
              onMouseLeave={() => setHoverId(null)}
              className="group flex items-center gap-3 rounded-md border-l-2 py-[7px] pl-3 pr-4 text-left transition-all duration-200"
              style={{
                borderColor: active ? b.color : "transparent",
                background: active ? `${b.color}14` : hovered ? "rgba(255,255,255,0.03)" : "transparent",
              }}
            >
              <span className="font-display text-[10px] font-medium text-[#5d6c8e] transition group-hover:text-[#8fa2c6]">
                {String(i).padStart(2, "0")}
              </span>
              <span
                className="h-2.5 w-2.5 rounded-full transition-transform duration-200 group-hover:scale-125"
                style={{ background: b.color, boxShadow: active || hovered ? `0 0 10px ${b.color}` : "none" }}
              />
              <span
                className="text-[12.5px] font-semibold transition-colors duration-200"
                style={{ color: active ? "#ffffff" : hovered ? "#c9d7f2" : "#8fa2c6" }}
              >
                {b.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ---------- чипы планет (mobile) ---------- */}
      <nav
        className="absolute inset-x-0 bottom-[150px] z-20 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:hidden"
        aria-label="Планеты"
      >
        {BODIES.map((b) => {
          const active = selectedId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedId(active ? null : b.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition ${
                active ? "border-transparent text-white" : "border-white/10 bg-[rgba(9,14,30,0.8)] text-[#8fa2c6]"
              }`}
              style={active ? { background: `${b.color}26`, boxShadow: `inset 0 0 0 1px ${b.color}` } : undefined}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
              {b.name}
            </button>
          );
        })}
      </nav>

      {/* ---------- подсказка ---------- */}
      <div
        className={`pointer-events-none absolute bottom-[104px] left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-[rgba(9,14,30,0.85)] px-4 py-2 transition-opacity duration-700 md:flex ${
          selectedId ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="hint-dot h-2 w-2 rounded-full bg-[#f4b642]" />
        <span className="text-[12px] font-medium text-[#c9d7f2]">Нажмите на планету, чтобы узнать её характеристики</span>
      </div>

      {/* ---------- панель информации ---------- */}
      <InfoPanel body={selected} onClose={() => setSelectedId(null)} onNavigate={setSelectedId} />

      {/* ---------- управление ---------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center md:bottom-5">
        <Controls
          running={running}
          speed={speed}
          showOrbits={showOrbits}
          showLabels={showLabels}
          onToggleRun={() => setRunning((r) => !r)}
          onReset={() => setSimDays(0)}
          onSpeed={setSpeed}
          onToggleOrbits={() => setShowOrbits((v) => !v)}
          onToggleLabels={() => setShowLabels((v) => !v)}
        />
      </div>
    </div>
  );
}
