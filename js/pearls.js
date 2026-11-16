// 우수꾸 진주 규칙 — 100m마다 1개 · 그날 첫 수영 +5 · 하루 최대 5km
// 같은 기록으로 두 번 받지 않게, 진주를 준 운동(ID · 시간)을 날짜별 원장(ledger)에 남겨요.
//
// ledger = { day: 'YYYY-MM-DD', swims: [{ id, start, end, meters }], meters, pearls, bonus }
(function (root) {
  'use strict';

  const U = root.USUKKU || {};
  const PER = U.PEARL_PER || 100;
  const BONUS = U.FIRST_BONUS || 5;
  const DAY_MAX = 5000;
  const SAME_SWIM = 0.5;

  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const ms = (iso) => new Date(iso).getTime();
  const empty = (day) => ({ day, swims: [], meters: 0, pearls: 0, bonus: false });

  // 오늘 원장. 날짜가 바뀌었으면 새로 시작해요.
  function ledgerFor(saved, day = dayKey()) {
    return saved && saved.day === day ? saved : empty(day);
  }

  function overlapRatio(a, b) {
    const s = Math.max(ms(a.start), ms(b.start)), e = Math.min(ms(a.end), ms(b.end));
    const shorter = Math.min(ms(a.end) - ms(a.start), ms(b.end) - ms(b.start));
    return e > s && shorter > 0 ? (e - s) / shorter : 0;
  }
  // ID가 같거나, 이미 받은 운동과 시간이 겹치면(다른 앱이 같은 수영을 한 번 더 적은 경우) 받은 걸로 봐요
  const credited = (swim, ledger) => ledger.swims.some((c) => c.id === swim.id || overlapRatio(c, swim) >= SAME_SWIM);

  // 아직 진주를 안 준 기록으로 받을 수 있는 진주
  function pending(swims, ledger) {
    const fresh = swims.filter((s) => s.meters > 0 && !credited(s, ledger));
    const noDistance = swims.filter((s) => !(s.meters > 0) && !credited(s, ledger));
    const raw = fresh.reduce((t, s) => t + s.meters, 0);
    const meters = Math.max(0, Math.min(raw, DAY_MAX - ledger.meters));
    const pearls = Math.floor((ledger.meters + meters) / PER) - Math.floor(ledger.meters / PER);
    const bonus = fresh.length && !ledger.bonus ? BONUS : 0;
    return { swims: fresh, noDistance, raw, meters, pearls, bonus, total: pearls + bonus, capped: raw > meters };
  }

  // 받은 기록을 원장에 적어요. 새 원장을 돌려줘요.
  function apply(ledger, p) {
    return {
      day: ledger.day,
      swims: ledger.swims.concat(p.swims.map(({ id, start, end, meters }) => ({ id, start, end, meters }))),
      meters: ledger.meters + p.meters,
      pearls: ledger.pearls + p.total,
      bonus: ledger.bonus || p.bonus > 0,
    };
  }

  root.PEARLS = { PER, BONUS, DAY_MAX, dayKey, ledgerFor, pending, apply, credited };
})(typeof window !== 'undefined' ? window : globalThis);
