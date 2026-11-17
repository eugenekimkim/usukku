// 혼자 모드 진행(나의 바닷길 · 주간 연속 · 월간 목표 · 보상 조건): npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = vm.createContext({ console, Date, Math, JSON });
ctx.window = ctx;
vm.runInContext(readFileSync(new URL('../js/progress.js', import.meta.url), 'utf8'), ctx);
const P = ctx.PROGRESS;
const J = (x) => JSON.parse(JSON.stringify(x));
const NOW = new Date(2026, 10, 18, 9, 0); // 2026-11-18 수요일
const day = (y, m, d, meters = 1200, n = 1) => [`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, { m: meters, min: 40, n }];

test('나의 바닷길: 섬 5 · 15 · 30 · 50 · 75km', () => {
  assert.equal(P.myRoute(0).nextName, '모래섬');
  assert.equal(P.myRoute(2.5).at, 0.5);
  const r = P.myRoute(12);
  assert.equal(r.passed, 1); assert.equal(r.nextName, '산호섬'); assert.equal(r.left, 3); assert.equal(r.at, 1.7);
  assert.equal(P.myRoute(75).done, true);
  assert.deepEqual(J(P.reached(30)), [0, 1, 2]);
});

test('이번 주 수영 횟수 · 주간 연속 (월요일 시작, 이번 주에 아직 없으면 지난주부터)', () => {
  const h = Object.fromEntries([day(2026, 11, 17), day(2026, 11, 16), day(2026, 11, 12), day(2026, 11, 3), day(2026, 10, 27)]);
  assert.equal(P.weekSwims(h, NOW), 2);
  assert.equal(P.streakWeeks(h, NOW), 4);
  const lastWeekOnly = Object.fromEntries([day(2026, 11, 12), day(2026, 11, 5)]);
  assert.equal(P.weekSwims(lastWeekOnly, NOW), 0);
  assert.equal(P.streakWeeks(lastWeekOnly, NOW), 2);
  const gap = Object.fromEntries([day(2026, 11, 17), day(2026, 11, 3)]);
  assert.equal(P.streakWeeks(gap, NOW), 1);
});

test('이번 달 목표 · 보상 조건', () => {
  const h = {};
  for (let d = 1; d <= 12; d++) h[`2026-11-${String(d).padStart(2, '0')}`] = { m: 1700, min: 50, n: 1 };
  h['2026-10-30'] = { m: 3000, min: 90, n: 1 };
  h['2026-10-22'] = { m: 1000, min: 30, n: 1 }; // 4주 연속이 되게
  const m = P.monthStats(h, NOW);
  assert.equal(m.n, 12); assert.equal(m.m, 20400);
  const got = J(P.earnedRewards(h, NOW));
  assert.ok(got.includes('goggle:collab')); assert.ok(got.includes('suit:collab')); assert.ok(got.includes('cap:team'));
  assert.ok(!got.includes('cap:sun')); // 23.4km < 50km
});

test('기록 더하기 · 총 거리 · 수영한 날', () => {
  let h = P.addDay({}, '2026-11-18', { m: 1250, min: 42, n: 1 });
  h = P.addDay(h, '2026-11-18', { m: 380, min: 12, n: 1 });
  assert.deepEqual(J(h['2026-11-18']), { m: 1630, min: 54, n: 2 });
  assert.equal(P.totalKm(h), 1.63); assert.equal(P.swimDays(h), 1);
});

test('브라우저 데모 기록: 오늘 전까지만, 월 · 수 · 금', () => {
  const h = P.demoHistory(NOW);
  assert.ok(!h['2026-11-18']); assert.ok(h['2026-11-16']); assert.ok(!h['2026-11-17']);
  assert.equal(P.streakWeeks(h, NOW), 4);
});
