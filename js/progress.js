// 우수꾸 혼자 모드 진행: 날짜별 기록 · 나의 바닷길 · 주간 연속 · 월간 목표 · 보상 조건
//
// history = { 'YYYY-MM-DD': { m, min, n } }   그날 진주를 받은 거리(하루 5km까지) · 시간(분) · 수영 횟수
// 서버가 붙기 전까지 모든 통계는 이 기록으로 계산해요.
(function (root) {
  'use strict';

  const ISLANDS = (root.USUKKU && root.USUKKU.ISLANDS) || ['모래섬', '산호섬', '해초섬', '등대섬', '고래섬'];
  const ISLAND_KM = [5, 15, 30, 50, 75]; // 누적 거리. 섬 사이 5 → 10 → 15 → 20 → 25km
  const ISLAND_PEARLS = 30;
  const GRADUATE_KM = 60; // 킥판 졸업
  const LAP_GOAL = 20; // MY POOL 하루 목표 왕복

  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseDay = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  // 월요일에 시작하는 주
  function weekStart(d = new Date()) { const s = new Date(d.getFullYear(), d.getMonth(), d.getDate()); s.setDate(s.getDate() - ((s.getDay() + 6) % 7)); return s; }
  const weekKey = (d) => dayKey(weekStart(d));

  const days = (history) => Object.entries(history || {}).filter(([, v]) => v && v.n > 0);
  const totalKm = (history) => days(history).reduce((t, [, v]) => t + (v.m || 0), 0) / 1000;
  const swimDays = (history) => days(history).length;

  // 나의 바닷길: 누적 km → 지도 위 위치(섬 단위), 다음 섬, 남은 거리
  function myRoute(km) {
    const passed = ISLAND_KM.filter((x) => km >= x).length;
    if (passed >= ISLAND_KM.length) return { km, at: ISLAND_KM.length, passed, done: true, next: ISLAND_KM.length, nextName: ISLANDS[ISLANDS.length - 1], left: 0, nextKm: ISLAND_KM[ISLAND_KM.length - 1] };
    const prev = passed ? ISLAND_KM[passed - 1] : 0, nextKm = ISLAND_KM[passed];
    return { km, at: passed + (km - prev) / (nextKm - prev), passed, done: false, next: passed + 1, nextName: ISLANDS[passed], left: nextKm - km, nextKm };
  }
  // 닿은 섬 번호(0부터)
  const reached = (km) => ISLAND_KM.map((x, i) => (km >= x ? i : -1)).filter((i) => i >= 0);

  // 이번 주 수영 횟수
  function weekSwims(history, now = new Date()) {
    const wk = weekKey(now);
    return days(history).filter(([k]) => weekKey(parseDay(k)) === wk).reduce((t, [, v]) => t + v.n, 0);
  }
  // 주 1번 이상 수영한 주가 몇 주 연속인지. 이번 주에 아직 안 했으면 지난주부터 세요.
  function streakWeeks(history, now = new Date()) {
    const weeks = new Set(days(history).map(([k]) => weekKey(parseDay(k))));
    const d = weekStart(now);
    if (!weeks.has(dayKey(d))) d.setDate(d.getDate() - 7);
    let n = 0;
    while (weeks.has(dayKey(d))) { n++; d.setDate(d.getDate() - 7); }
    return n;
  }
  // 이번 달 거리(m) · 수영 횟수
  function monthStats(history, now = new Date()) {
    const pre = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-`;
    return days(history).filter(([k]) => k.startsWith(pre)).reduce((t, [, v]) => ({ m: t.m + v.m, n: t.n + v.n }), { m: 0, n: 0 });
  }

  // 진주로 못 사는 아이템을 얻는 조건 (혼자 모드)
  const REWARDS = {
    'cap:sun': { label: '등대섬 도착', earned: (s) => s.km >= ISLAND_KM[3] },
    'goggle:gold': { label: '고래섬 도착', earned: (s) => s.km >= ISLAND_KM[4] },
    'cap:team': { label: '4주 연속 기록', earned: (s) => s.streak >= 4 },
    'goggle:collab': { label: '한 달 20km', earned: (s) => s.month.m >= 20000 },
    'suit:collab': { label: '한 달 12번 수영', earned: (s) => s.month.n >= 12 },
  };
  function stats(history, now = new Date()) {
    return { km: totalKm(history), days: swimDays(history), week: weekSwims(history, now), streak: streakWeeks(history, now), month: monthStats(history, now) };
  }
  const earnedRewards = (history, now = new Date()) => { const s = stats(history, now); return Object.keys(REWARDS).filter((k) => REWARDS[k].earned(s)); };

  // 진주를 받은 기록을 그날에 더해요
  function addDay(history, day, add) {
    const h = Object.assign({}, history);
    const v = h[day] || { m: 0, min: 0, n: 0 };
    h[day] = { m: v.m + (add.m || 0), min: v.min + (add.min || 0), n: v.n + (add.n || 0) };
    return h;
  }

  // 브라우저 데모: 지난 3주 + 이번 주(오늘 전까지) 월 · 수 · 금에 1.2km씩
  function demoHistory(now = new Date()) {
    const h = {};
    const start = weekStart(now); start.setDate(start.getDate() - 21);
    for (let d = new Date(start); dayKey(d) < dayKey(now); d.setDate(d.getDate() + 1)) {
      if ([1, 3, 5].includes(d.getDay())) h[dayKey(d)] = { m: 1200, min: 40, n: 1 };
    }
    return h;
  }

  root.PROGRESS = {
    ISLAND_KM, ISLAND_PEARLS, GRADUATE_KM, LAP_GOAL, REWARDS,
    dayKey, weekKey, totalKm, swimDays, myRoute, reached, weekSwims, streakWeeks, monthStats, stats, earnedRewards, addDay, demoHistory,
  };
})(typeof window !== 'undefined' ? window : globalThis);
