import { useMemo, type CSSProperties } from "react";
import { BODIES, CX, CY, ORBIT_RATIO, type Body } from "../data/bodies";

/* ---------- утилита: осветление/затемнение hex ---------- */
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => {
    const t = amt < 0 ? 0 : 255;
    return Math.round((t - v) * Math.abs(amt) + v);
  };
  return `rgb(${ch((n >> 16) & 255)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

/* ============================================================
   Звёздное небо (отдельный слой, на весь экран)
   ============================================================ */
export function StarField({ px, py }: { px: number; py: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 190 }, (_, i) => ({
        id: i,
        x: Math.random() * 1600,
        y: Math.random() * 1000,
        r: 0.4 + Math.random() * 1.25,
        o: 0.25 + Math.random() * 0.65,
        tw: Math.random() < 0.45,
        dur: 2.2 + Math.random() * 4.5,
        delay: Math.random() * 6,
        warm: Math.random() < 0.14,
      })),
    []
  );
  const sparks = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 80 + Math.random() * 1440,
        y: 60 + Math.random() * 880,
        s: 4 + Math.random() * 5,
      })),
    []
  );

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g
        style={{
          transform: `translate(${px * 10}px, ${py * 7}px)`,
          transition: "transform 900ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        {stars.map((s) => (
          <circle
            key={s.id}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.warm ? "#ffe6bd" : "#cfe0ff"}
            opacity={s.o}
            className={s.tw ? "tw" : undefined}
            style={s.tw ? ({ "--d": `${s.dur}s`, "--dl": `${s.delay}s` } as CSSProperties) : undefined}
          />
        ))}
        {sparks.map((s) => (
          <path
            key={s.id}
            d={`M ${s.x} ${s.y - s.s} L ${s.x} ${s.y + s.s} M ${s.x - s.s} ${s.y} L ${s.x + s.s} ${s.y}`}
            stroke="#dbe8ff"
            strokeWidth="0.8"
            opacity="0.5"
            className="tw"
            style={{ "--d": "5s", "--dl": `${s.id * 1.3}s` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

/* ============================================================
   Сцена Солнечной системы
   ============================================================ */
interface SceneProps {
  simDays: number;
  selectedId: string | null;
  hoverId: string | null;
  showOrbits: boolean;
  showLabels: boolean;
  px: number;
  py: number;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

const TAU = Math.PI * 2;

export default function Scene({
  simDays,
  selectedId,
  hoverId,
  showOrbits,
  showLabels,
  px,
  py,
  onSelect,
  onHover,
}: SceneProps) {
  const belt = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => {
        const a = 322 + Math.random() * 46;
        return {
          id: i,
          a,
          b: a * ORBIT_RATIO,
          phase: Math.random() * TAU,
          period: 1400 + Math.random() * 1700,
          r: 0.7 + Math.random() * 1.2,
          o: 0.18 + Math.random() * 0.4,
        };
      }),
    []
  );

  /* --- комета (вытянутая орбита, быстрее у перигелия) --- */
  const comet = (() => {
    const a = 440;
    const b = 135;
    const ccx = CX + 300;
    const M = 2.2 + (TAU * simDays) / 2600;
    const th = M - 0.55 * Math.sin(M);
    const x = ccx + a * Math.cos(th);
    const y = CY + b * Math.sin(th);
    const dx = x - CX;
    const dy = y - CY;
    const dist = Math.hypot(dx, dy) || 1;
    const ang = Math.atan2(dy, dx);
    const L = Math.min(150, Math.max(24, 30000 / dist));
    const w = L * 0.16;
    const tip = { x: x + Math.cos(ang) * L, y: y + Math.sin(ang) * L };
    const perp = { x: -Math.sin(ang) * w, y: Math.cos(ang) * w };
    const L2 = L * 0.55;
    const ang2 = ang + 0.22;
    const tip2 = { x: x + Math.cos(ang2) * L2, y: y + Math.sin(ang2) * L2 };
    const perp2 = { x: -Math.sin(ang2) * w * 0.8, y: Math.cos(ang2) * w * 0.8 };
    return { ccx, a, b, x, y, tip, perp, tip2, perp2, L };
  })();

  const planets = BODIES.filter((bd) => bd.id !== "sun");

  const bodyPos = (bd: Body) => {
    const th = bd.phase + (TAU * simDays) / bd.periodDays;
    return {
      x: CX + bd.orbitA * Math.cos(th),
      y: CY + bd.orbitA * ORBIT_RATIO * Math.sin(th),
      depth: (Math.sin(th) + 1) / 2,
    };
  };

  const earth = planets.find((p) => p.id === "earth")!;
  const earthPos = bodyPos(earth);
  const moonTh = 1 + (TAU * simDays) / 27.32;

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid meet"
      onClick={() => onSelect(null)}
      role="application"
      aria-label="Модель Солнечной системы"
    >
      <defs>
        <radialGradient id="sunCore">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="38%" stopColor="#ffd76a" />
          <stop offset="72%" stopColor="#ff9d3f" />
          <stop offset="100%" stopColor="#f96d24" />
        </radialGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="rgba(255,178,74,0.5)" />
          <stop offset="60%" stopColor="rgba(255,150,60,0.16)" />
          <stop offset="100%" stopColor="rgba(255,150,60,0)" />
        </radialGradient>
        <radialGradient id="sunOuter">
          <stop offset="0%" stopColor="rgba(255,120,50,0.17)" />
          <stop offset="100%" stopColor="rgba(255,120,50,0)" />
        </radialGradient>
        {planets.map((bd) => (
          <radialGradient key={bd.id} id={`grad-${bd.id}`} cx="34%" cy="30%" r="78%">
            <stop offset="0%" stopColor={shade(bd.color, 0.5)} />
            <stop offset="48%" stopColor={bd.color} />
            <stop offset="100%" stopColor={shade(bd.color, -0.46)} />
          </radialGradient>
        ))}
        <radialGradient id="grad-moon" cx="34%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#f2f4f8" />
          <stop offset="100%" stopColor="#8d95a5" />
        </radialGradient>
        <linearGradient
          id="cometTail"
          gradientUnits="userSpaceOnUse"
          x1={comet.x}
          y1={comet.y}
          x2={comet.tip.x}
          y2={comet.tip.y}
        >
          <stop offset="0%" stopColor="#eaf7ff" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#9fd4ff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#9fd4ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="cometDust"
          gradientUnits="userSpaceOnUse"
          x1={comet.x}
          y1={comet.y}
          x2={comet.tip2.x}
          y2={comet.tip2.y}
        >
          <stop offset="0%" stopColor="#ffe9c4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffe9c4" stopOpacity="0" />
        </linearGradient>
        <filter id="softBlur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <clipPath id="clip-jupiter">
          <circle cx="0" cy="0" r={20} />
        </clipPath>
      </defs>

      <g
        style={{
          transform: `translate(${px * 18}px, ${py * 12}px)`,
          transition: "transform 900ms cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        {/* ---------- орбиты ---------- */}
        {showOrbits &&
          planets.map((bd) => {
            const isSel = selectedId === bd.id;
            const isHov = hoverId === bd.id;
            return (
              <ellipse
                key={`orb-${bd.id}`}
                cx={CX}
                cy={CY}
                rx={bd.orbitA}
                ry={bd.orbitA * ORBIT_RATIO}
                fill="none"
                stroke={isSel || isHov ? bd.color : "#8aa8dc"}
                strokeOpacity={isSel ? 0.6 : isHov ? 0.4 : selectedId ? 0.07 : 0.14}
                strokeWidth={isSel ? 1.6 : 1}
                style={{ transition: "stroke-opacity 0.3s, stroke 0.3s" }}
              />
            );
          })}

        {/* ---------- пояс астероидов ---------- */}
        <g>
          {belt.map((ast) => {
            const ang = ast.phase + (TAU * simDays) / ast.period;
            return (
              <circle
                key={ast.id}
                cx={CX + ast.a * Math.cos(ang)}
                cy={CY + ast.b * Math.sin(ang)}
                r={ast.r}
                fill="#7f90ac"
                opacity={ast.o}
              />
            );
          })}
          {showLabels && (
            <text x={CX} y={CY - 322 * ORBIT_RATIO - 10} className="belt-label">
              Пояс астероидов
            </text>
          )}
        </g>

        {/* ---------- орбита кометы ---------- */}
        <ellipse
          cx={comet.ccx}
          cy={CY}
          rx={comet.a}
          ry={comet.b}
          fill="none"
          stroke="#9fc4ff"
          strokeOpacity={showOrbits ? 0.09 : 0}
          strokeDasharray="3 8"
        />

        {/* ---------- Солнце ---------- */}
        <g
          transform={`translate(${CX},${CY})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelect("sun");
          }}
          onMouseEnter={() => onHover("sun")}
          onMouseLeave={() => onHover(null)}
          tabIndex={0}
          role="button"
          aria-label="Солнце"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              onSelect("sun");
            }
          }}
        >
          <circle r={150} fill="url(#sunOuter)" />
          <circle r={92} fill="url(#sunGlow)" className="sun-pulse" />
          <circle r={54} fill="#ffb547" opacity="0.5" filter="url(#softBlur)" className="sun-pulse" />
          <circle
            r={52}
            fill="none"
            stroke="rgba(255,205,130,0.3)"
            strokeWidth="1"
            strokeDasharray="2 11"
            className="corona"
          />
          <circle r={40} fill="url(#sunCore)" />
          <circle cx={-12} cy={-13} r={13} fill="rgba(255,255,255,0.5)" filter="url(#softBlur)" />
          {selectedId === "sun" && (
            <circle r={54} fill="none" stroke="#ffb547" strokeWidth="1.2" strokeDasharray="5 8" className="reticle" />
          )}
          <circle r={56} fill="transparent" />
          {(showLabels || hoverId === "sun" || selectedId === "sun") && (
            <text y={74} className="planet-label">
              Солнце
            </text>
          )}
        </g>

        {/* ---------- планеты ---------- */}
        {planets.map((bd) => {
          const { x, y, depth } = bodyPos(bd);
          const s = 0.84 + 0.32 * depth;
          const isSel = selectedId === bd.id;
          const isHov = hoverId === bd.id;
          const labelOn = showLabels || isHov || isSel;
          return (
            <g
              key={bd.id}
              transform={`translate(${x},${y})`}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(bd.id);
              }}
              onMouseEnter={() => onHover(bd.id)}
              onMouseLeave={() => onHover(null)}
              tabIndex={0}
              role="button"
              aria-label={bd.name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  onSelect(bd.id);
                }
              }}
            >
              {/* увеличенная зона клика */}
              <circle r={Math.max(16, bd.r + 10)} fill="transparent" />

              {/* свечение при наведении/выборе */}
              <circle
                r={bd.r + 6}
                fill={bd.color}
                opacity={isSel ? 0.5 : isHov ? 0.4 : 0}
                filter="url(#softBlur)"
                style={{ transition: "opacity 0.25s" }}
              />

              {isSel && (
                <circle
                  r={bd.r + 12}
                  fill="none"
                  stroke={bd.color}
                  strokeWidth="1.2"
                  strokeDasharray="4 7"
                  className="reticle"
                />
              )}

              <g transform={`scale(${s})`} opacity={0.82 + 0.18 * depth}>
                {/* кольца Сатурна: задняя половина */}
                {bd.hasRing && (
                  <g transform="rotate(-16)">
                    <ellipse rx={bd.r * 2.1} ry={bd.r * 0.62} fill="none" stroke="#c8ab74" strokeOpacity="0.32" strokeWidth="5.5" />
                    <ellipse rx={bd.r * 1.62} ry={bd.r * 0.47} fill="none" stroke="#e8d3a0" strokeOpacity="0.5" strokeWidth="2.2" />
                  </g>
                )}
                {/* тонкое кольцо Урана */}
                {bd.id === "uranus" && (
                  <ellipse
                    rx={bd.r * 1.75}
                    ry={bd.r * 0.5}
                    transform="rotate(78)"
                    fill="none"
                    stroke="rgba(160,225,235,0.35)"
                    strokeWidth="1"
                  />
                )}

                <circle r={bd.r} fill={`url(#grad-${bd.id})`} />

                {/* полосы Юпитера */}
                {bd.id === "jupiter" && (
                  <g clipPath="url(#clip-jupiter)" opacity="0.45">
                    <rect x={-20} y={-11} width={40} height={3.4} fill="#a9713d" rx={1.7} />
                    <rect x={-20} y={-4} width={40} height={4.4} fill="#c08a52" rx={2.2} />
                    <rect x={-20} y={4} width={40} height={3} fill="#a9713d" rx={1.5} />
                    <rect x={-20} y={10} width={40} height={3.6} fill="#b57f49" rx={1.8} />
                    <ellipse cx={7} cy={7.5} rx={3.6} ry={2.3} fill="#c9542f" opacity="0.85" />
                  </g>
                )}

                {/* передняя половина колец Сатурна */}
                {bd.hasRing && (
                  <g transform="rotate(-16)">
                    <path
                      d={`M ${-bd.r * 2.1} 0 A ${bd.r * 2.1} ${bd.r * 0.62} 0 0 0 ${bd.r * 2.1} 0`}
                      fill="none"
                      stroke="#d9bf8a"
                      strokeOpacity="0.55"
                      strokeWidth="5.5"
                    />
                    <path
                      d={`M ${-bd.r * 1.62} 0 A ${bd.r * 1.62} ${bd.r * 0.47} 0 0 0 ${bd.r * 1.62} 0`}
                      fill="none"
                      stroke="#f0dcae"
                      strokeOpacity="0.6"
                      strokeWidth="2.2"
                    />
                  </g>
                )}

                {/* атмосфера Земли */}
                {bd.id === "earth" && (
                  <circle r={bd.r + 1.6} fill="none" stroke="rgba(127,196,255,0.45)" strokeWidth="1.3" />
                )}
              </g>

              {/* Луна Земли */}
              {bd.hasMoon && (
                <>
                  {showOrbits && (
                    <ellipse rx={18} ry={11} fill="none" stroke="#8aa8dc" strokeOpacity="0.18" strokeWidth="0.8" />
                  )}
                  <circle
                    cx={18 * Math.cos(moonTh)}
                    cy={11 * Math.sin(moonTh)}
                    r={2.6}
                    fill="url(#grad-moon)"
                  />
                </>
              )}

              <text
                y={bd.r + 24}
                className="planet-label"
                opacity={labelOn ? 1 : 0}
                style={{ transition: "opacity 0.3s" }}
              >
                {bd.name}
              </text>
            </g>
          );
        })}

        {/* ---------- комета ---------- */}
        <g pointerEvents="none">
          <polygon
            points={`${comet.x},${comet.y} ${comet.tip.x + comet.perp.x},${comet.tip.y + comet.perp.y} ${
              comet.tip.x - comet.perp.x
            },${comet.tip.y - comet.perp.y}`}
            fill="url(#cometTail)"
          />
          <polygon
            points={`${comet.x},${comet.y} ${comet.tip2.x + comet.perp2.x},${comet.tip2.y + comet.perp2.y} ${
              comet.tip2.x - comet.perp2.x
            },${comet.tip2.y - comet.perp2.y}`}
            fill="url(#cometDust)"
          />
          <circle cx={comet.x} cy={comet.y} r={6.5} fill="#bfe2ff" opacity="0.45" filter="url(#softBlur)" />
          <circle cx={comet.x} cy={comet.y} r={2.6} fill="#eef8ff" />
          {showLabels && (
            <text x={comet.x} y={comet.y - 12} className="planet-label" opacity={0.75} style={{ fontSize: 10 }}>
              Комета
            </text>
          )}
        </g>

        {/* маркер позиции Земли для Луны (служебный, невидимый) */}
        <circle cx={earthPos.x} cy={earthPos.y} r={0} fill="none" />
      </g>
    </svg>
  );
}
