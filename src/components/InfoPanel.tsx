import { BODIES, fmtDistance, fmtKm, type Body } from "../data/bodies";

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => {
    const t = amt < 0 ? 0 : 255;
    return Math.round((t - v) * Math.abs(amt) + v);
  };
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

function Sphere({ body }: { body: Body }) {
  const isSun = body.id === "sun";
  const r = isSun ? 34 : body.id === "jupiter" ? 44 : body.id === "saturn" ? 38 : Math.min(46, 20 + body.r * 1.6);
  return (
    <svg viewBox="0 0 150 150" className="h-[124px] w-[124px] shrink-0" aria-hidden="true">
      <defs>
        <radialGradient id={`pg-${body.id}`} cx="34%" cy="30%" r="80%">
          <stop offset="0%" stopColor={isSun ? "#fff9e6" : shade(body.color, 0.5)} />
          <stop offset={isSun ? "45%" : "48%"} stopColor={isSun ? "#ffd76a" : body.color} />
          <stop offset="100%" stopColor={isSun ? "#f96d24" : shade(body.color, -0.46)} />
        </radialGradient>
      </defs>
      {isSun && <circle cx="75" cy="75" r="52" fill={body.color} opacity="0.28" style={{ filter: "blur(10px)" }} />}
      {body.hasRing && (
        <g transform="translate(75,75) rotate(-16)">
          <ellipse rx={r * 1.9} ry={r * 0.56} fill="none" stroke="#d9bf8a" strokeOpacity="0.5" strokeWidth="7" />
          <ellipse rx={r * 1.45} ry={r * 0.42} fill="none" stroke="#f0dcae" strokeOpacity="0.55" strokeWidth="2.5" />
        </g>
      )}
      <circle cx="75" cy="75" r={r} fill={`url(#pg-${body.id})`} />
      {body.id === "earth" && <circle cx="75" cy="75" r={r + 2.4} fill="none" stroke="rgba(127,196,255,0.5)" strokeWidth="1.6" />}
      {body.hasRing && (
        <g transform="translate(75,75) rotate(-16)">
          <path d={`M ${-r * 1.9} 0 A ${r * 1.9} ${r * 0.56} 0 0 0 ${r * 1.9} 0`} fill="none" stroke="#e6cf9f" strokeOpacity="0.6" strokeWidth="7" />
        </g>
      )}
      {isSun && <circle cx="63" cy="62" r="10" fill="rgba(255,255,255,0.55)" style={{ filter: "blur(5px)" }} />}
    </svg>
  );
}

function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] py-2.5 last:border-0">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5d6c8e]">{label}</span>
      <span className="text-right">
        <span className="font-display text-[14px] font-medium text-[#e8eefc]">{value}</span>
        {sub && <span className="block text-[11px] text-[#8fa2c6]">{sub}</span>}
      </span>
    </div>
  );
}

function Bar({ label, pct, value, color }: { label: string; pct: number; value: string; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5d6c8e]">{label}</span>
        <span className="text-[11px] font-semibold text-[#c9d7f2]">{value}</span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-full bg-[rgba(138,168,220,0.12)]">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(4, pct)}%`, background: `linear-gradient(90deg, ${color}, ${shade(color, 0.25)})` }}
        />
      </div>
    </div>
  );
}

interface Props {
  body: Body | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export default function InfoPanel({ body, onClose, onNavigate }: Props) {
  const idx = body ? BODIES.findIndex((b) => b.id === body.id) : -1;
  const prev = BODIES[(idx - 1 + BODIES.length) % BODIES.length];
  const next = BODIES[(idx + 1) % BODIES.length];
  const isSun = body?.id === "sun";
  const earthRatio = body ? body.diameterKm / 12742 : 0;

  return (
    <aside
      className={`absolute z-30 flex flex-col overflow-hidden rounded-xl border border-[rgba(130,155,215,0.16)] bg-[rgba(9,14,30,0.94)] shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]
        inset-x-3 bottom-[150px] max-h-[44vh] md:inset-x-auto md:right-5 md:top-5 md:bottom-[104px] md:max-h-none md:w-[354px]
        ${body ? "translate-x-0 translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0 md:translate-y-0 md:translate-x-[130%]"}`}
      aria-hidden={!body}
    >
      {body && (
        <>
          {/* шапка */}
          <div className="relative flex items-center gap-4 border-b border-white/[0.07] p-5 pb-4">
            <span className="pointer-events-none absolute right-4 top-1 select-none font-display text-[64px] font-extrabold leading-none text-white/[0.05]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <Sphere body={body} />
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: body.color }}>
                {body.kind}
              </p>
              <h2 className="font-display text-[22px] font-bold leading-tight text-white">{body.name}</h2>
              <p className="mt-1 text-[11.5px] text-[#8fa2c6]">
                {isSun ? "Звезда · центр системы" : `Планета № ${idx} от Солнца`}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full border border-white/10 text-[#8fa2c6] transition hover:border-white/25 hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* статистика */}
          <div className="panel-scroll flex-1 overflow-y-auto px-5 py-3">
            <Row label="Диаметр" value={fmtKm(body.diameterKm)} sub={`${earthRatio.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} × диаметра Земли`} />
            <Row
              label="Расстояние"
              value={fmtDistance(body)}
              sub={isSun ? "центр системы" : `${body.au.toLocaleString("ru-RU")} а.е. от Солнца`}
            />
            <Row label="Орбит. период" value={body.periodText} sub={body.periodSub} />
            <Row label="Сутки" value={body.rotationText} sub="период вращения" />
            <Row label="Спутники" value={body.moonsText} />
            <Row label="Температура" value={body.tempText} sub="средняя" />

            {!isSun && (
              <div className="mt-4 space-y-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5d6c8e]">Сравнение с Землёй</p>
                <Bar
                  label="Диаметр"
                  pct={(earthRatio / 11) * 100}
                  value={`× ${earthRatio.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}`}
                  color={body.color}
                />
                <Bar
                  label="Дистанция"
                  pct={(Math.log(1 + body.au) / Math.log(1 + 30.05)) * 100}
                  value={`${body.au.toLocaleString("ru-RU")} а.е.`}
                  color="#8aa8dc"
                />
              </div>
            )}

            <div className="mt-4 rounded-r-lg border-l-2 py-2.5 pl-3.5 pr-2" style={{ borderColor: "#f4b642", background: "rgba(244,182,66,0.06)" }}>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4b642]">Знаете ли вы?</p>
              <p className="text-[12.5px] leading-relaxed text-[#c9d7f2]">{body.fact}</p>
            </div>
          </div>

          {/* навигация */}
          <div className="flex items-center justify-between border-t border-white/[0.07] px-5 py-3">
            <button
              onClick={() => onNavigate(prev.id)}
              className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8fa2c6] transition hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:-translate-x-0.5">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {prev.name}
            </button>
            <button
              onClick={() => onNavigate(next.id)}
              className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8fa2c6] transition hover:text-white"
            >
              {next.name}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
