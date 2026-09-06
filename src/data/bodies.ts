export interface Body {
  id: string;
  name: string;
  kind: string;
  color: string;
  r: number; // отображаемый радиус (условный)
  orbitA: number; // большая полуось орбиты в svg-единицах (0 для Солнца)
  periodDays: number; // сидерический период, земные сутки
  phase: number; // начальная фаза, радианы
  diameterKm: number;
  distanceMkm: number; // млн км (0 для Солнца)
  au: number;
  periodText: string;
  periodSub: string;
  rotationText: string;
  moonsText: string;
  tempText: string;
  fact: string;
  hasRing?: boolean;
  hasMoon?: boolean;
}

export const CX = 800;
export const CY = 500;
export const ORBIT_RATIO = 0.62; // сжатие орбит для псевдоперспективы

export const BODIES: Body[] = [
  {
    id: "sun",
    name: "Солнце",
    kind: "Жёлтый карлик · G2V",
    color: "#ffb547",
    r: 40,
    orbitA: 0,
    periodDays: 0,
    phase: 0,
    diameterKm: 1392700,
    distanceMkm: 0,
    au: 0,
    periodText: "—",
    periodSub: "центр системы",
    rotationText: "25–35 сут",
    moonsText: "8 планет",
    tempText: "+5 505 °C",
    fact: "На Солнце приходится 99,86 % массы всей Солнечной системы. Каждую секунду оно превращает около 4 млн тонн вещества в свет.",
  },
  {
    id: "mercury",
    name: "Меркурий",
    kind: "Планета земной группы",
    color: "#a9998a",
    r: 5.5,
    orbitA: 120,
    periodDays: 87.97,
    phase: 0.5,
    diameterKm: 4879,
    distanceMkm: 57.9,
    au: 0.39,
    periodText: "88 сут",
    periodSub: "0,24 земного года",
    rotationText: "58,6 сут",
    moonsText: "0",
    tempText: "−173…+427 °C",
    fact: "Солнечные сутки на Меркурии длятся 176 земных суток — вдвое дольше местного года.",
  },
  {
    id: "venus",
    name: "Венера",
    kind: "Планета земной группы",
    color: "#e8c46b",
    r: 8,
    orbitA: 175,
    periodDays: 224.7,
    phase: 2.1,
    diameterKm: 12104,
    distanceMkm: 108.2,
    au: 0.72,
    periodText: "225 сут",
    periodSub: "0,62 земного года",
    rotationText: "243 сут (обратное)",
    moonsText: "0",
    tempText: "+464 °C",
    fact: "Венера вращается в обратную сторону, поэтому Солнце там восходит на западе. Это самая горячая планета — горячее Меркурия.",
  },
  {
    id: "earth",
    name: "Земля",
    kind: "Планета земной группы",
    color: "#4b8fde",
    r: 8.5,
    orbitA: 232,
    periodDays: 365.25,
    phase: 4.0,
    diameterKm: 12742,
    distanceMkm: 149.6,
    au: 1.0,
    periodText: "365,25 сут",
    periodSub: "1 земной год",
    rotationText: "23,9 ч",
    moonsText: "1 (Луна)",
    tempText: "+15 °C",
    fact: "Единственное известное место во Вселенной, где есть жизнь. 71 % поверхности покрыт океанами.",
    hasMoon: true,
  },
  {
    id: "mars",
    name: "Марс",
    kind: "Планета земной группы",
    color: "#d1603f",
    r: 6.5,
    orbitA: 292,
    periodDays: 686.98,
    phase: 5.6,
    diameterKm: 6779,
    distanceMkm: 227.9,
    au: 1.52,
    periodText: "687 сут",
    periodSub: "1,88 земного года",
    rotationText: "24,6 ч",
    moonsText: "2 (Фобос, Деймос)",
    tempText: "−63 °C",
    fact: "Здесь находится высочайшая гора Солнечной системы — потухший вулкан Олимп высотой 21,9 км.",
  },
  {
    id: "jupiter",
    name: "Юпитер",
    kind: "Газовый гигант",
    color: "#d9a066",
    r: 20,
    orbitA: 400,
    periodDays: 4332.6,
    phase: 1.2,
    diameterKm: 139820,
    distanceMkm: 778.5,
    au: 5.2,
    periodText: "11,86 года",
    periodSub: "4 333 земных суток",
    rotationText: "9,9 ч",
    moonsText: "95",
    tempText: "−108 °C",
    fact: "Большое Красное Пятно — ураган размером больше Земли, который бушует уже более 350 лет.",
  },
  {
    id: "saturn",
    name: "Сатурн",
    kind: "Газовый гигант",
    color: "#e3c78f",
    r: 17,
    orbitA: 475,
    periodDays: 10759,
    phase: 3.4,
    diameterKm: 116460,
    distanceMkm: 1434,
    au: 9.58,
    periodText: "29,4 года",
    periodSub: "10 759 земных суток",
    rotationText: "10,7 ч",
    moonsText: "146",
    tempText: "−139 °C",
    fact: "Кольца шириной 280 000 км состоят из льда и камня, но их толщина местами — всего десятки метров.",
    hasRing: true,
  },
  {
    id: "uranus",
    name: "Уран",
    kind: "Ледяной гигант",
    color: "#8fd0d8",
    r: 12,
    orbitA: 550,
    periodDays: 30687,
    phase: 0.2,
    diameterKm: 50724,
    distanceMkm: 2871,
    au: 19.2,
    periodText: "84 года",
    periodSub: "30 687 земных суток",
    rotationText: "17,2 ч (обратное)",
    moonsText: "28",
    tempText: "−197 °C",
    fact: "Уран «лежит на боку»: его ось наклонена на 98°, поэтому полюса по 42 года смотрят прямо на Солнце.",
  },
  {
    id: "neptune",
    name: "Нептун",
    kind: "Ледяной гигант",
    color: "#4a6fe0",
    r: 11.5,
    orbitA: 615,
    periodDays: 60190,
    phase: 5.0,
    diameterKm: 49244,
    distanceMkm: 4495,
    au: 30.05,
    periodText: "164,8 года",
    periodSub: "60 190 земных суток",
    rotationText: "16,1 ч",
    moonsText: "16",
    tempText: "−201 °C",
    fact: "Здесь дуют самые быстрые ветры в Солнечной системе — до 2 100 км/ч, вдвое быстрее скорости звука на Земле.",
  },
];

export const PLANETS = BODIES.filter((b) => b.id !== "sun");
export const SUN = BODIES[0];

export const SPEED_PRESETS = [
  { v: 1, label: "1 день/с" },
  { v: 7, label: "неделя/с" },
  { v: 30, label: "месяц/с" },
  { v: 365, label: "год/с" },
  { v: 3650, label: "10 лет/с" },
];

export const SPEED_MIN = 1;
export const SPEED_MAX = 7300;

/* ---------- форматирование ---------- */

export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (d === 1) return one;
  if (d >= 2 && d <= 4) return few;
  return many;
}

export function fmtKm(km: number): string {
  return `${km.toLocaleString("ru-RU")} км`;
}

export function fmtDistance(b: Body): string {
  if (b.distanceMkm === 0) return "0 км";
  return `${b.distanceMkm.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн км`;
}

export function fmtSpeed(v: number): string {
  if (v >= 365) {
    const years = v / 365.25;
    return `${years >= 10 ? Math.round(years) : years.toFixed(1).replace(".", ",")} ${plural(Math.round(years), "год", "года", "лет")}/с`;
  }
  return `${v} ${plural(v, "день", "дня", "дней")}/с`;
}

/** «N лет M дней» с корректными склонениями */
export function fmtElapsed(totalDays: number): { big: string; small: string } {
  const years = Math.floor(totalDays / 365.25);
  const days = Math.floor(totalDays - years * 365.25);
  if (years === 0) {
    return {
      big: `${days}`,
      small: plural(days, "земной день", "земных дня", "земных дней"),
    };
  }
  return {
    big: `${years.toLocaleString("ru-RU")}`,
    small: `${plural(years, "год", "года", "лет")} ${days} ${plural(days, "день", "дня", "дней")}`,
  };
}
