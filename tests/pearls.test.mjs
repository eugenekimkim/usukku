// 진주 규칙 · 중복 제거 · 기록 읽기(가짜 HealthKit/Health Connect)를 확인해요: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const load = (globals = {}) => {
  const ctx = vm.createContext({ ...globals, console, Date, Promise, setTimeout, Math, JSON });
  ctx.window = ctx;
  ctx.USUKKU = { PEARL_PER: 100, FIRST_BONUS: 5 };
  for (const f of ['js/pearls.js', 'js/health.js']) vm.runInContext(readFileSync(new URL('../' + f, import.meta.url), 'utf8'), ctx);
  return ctx;
};
const J = (x) => JSON.parse(JSON.stringify(x)); // vm 샌드박스의 배열을 이 쪽 배열로
const at = (h, m = 0) => { const d = new Date(); d.setHours(h, m, 0, 0); return d.toISOString(); };
const swim = (id, h1, h2, meters, minutes) => ({ id, start: at(h1), end: at(h2), meters, minutes: minutes ?? (h2 - h1) * 60, source: 'healthkit' });

test('100m마다 1개 + 첫 수영 5개', () => {
  const { PEARLS } = load();
  const L = PEARLS.ledgerFor(null);
  const p = PEARLS.pending([swim('a', 6, 7, 1250)], L);
  assert.equal(p.pearls, 12); assert.equal(p.bonus, 5); assert.equal(p.total, 17);
});

test('같은 기록으로 두 번 받을 수 없어요', () => {
  const { PEARLS } = load();
  let L = PEARLS.ledgerFor(null);
  const s = [swim('a', 6, 7, 1250)];
  L = PEARLS.apply(L, PEARLS.pending(s, L));
  const again = PEARLS.pending(s, L);
  assert.equal(again.swims.length, 0); assert.equal(again.total, 0);
});

test('같은 날 두 번째 수영은 새 거리만큼만, 보너스 없이 (하루 합계로 100m 계산)', () => {
  const { PEARLS } = load();
  let L = PEARLS.ledgerFor(null);
  L = PEARLS.apply(L, PEARLS.pending([swim('a', 6, 7, 1250)], L));
  const p = PEARLS.pending([swim('a', 6, 7, 1250), swim('b', 19, 20, 380)], L);
  assert.equal(p.bonus, 0); assert.equal(p.meters, 380); assert.equal(p.pearls, 4); // 1630 → 16, 이미 12
  L = PEARLS.apply(L, p);
  assert.equal(L.pearls, 21); assert.equal(L.meters, 1630);
});

test('하루 최대 5km에서 잘려요', () => {
  const { PEARLS } = load();
  let L = PEARLS.ledgerFor(null);
  const p1 = PEARLS.pending([swim('a', 6, 8, 4200)], L);
  L = PEARLS.apply(L, p1);
  const p2 = PEARLS.pending([swim('a', 6, 8, 4200), swim('b', 18, 20, 2000)], L);
  assert.equal(p2.meters, 800); assert.equal(p2.pearls, 8); assert.ok(p2.capped);
  L = PEARLS.apply(L, p2);
  assert.equal(L.meters, 5000); assert.equal(L.pearls, 42 + 5 + 8);
  const p3 = PEARLS.pending([swim('c', 21, 22, 1000)], L);
  assert.equal(p3.total, 0); assert.equal(p3.swims.length, 1); // 원장에는 남겨서 다시 안 뜨게
  const one = PEARLS.pending([swim('x', 6, 9, 7000)], PEARLS.ledgerFor(null));
  assert.equal(one.total, 55);
});

test('다른 ID여도 이미 받은 수영과 시간이 겹치면 받은 걸로 봐요', () => {
  const { PEARLS } = load();
  let L = PEARLS.ledgerFor(null);
  L = PEARLS.apply(L, PEARLS.pending([swim('watch', 6, 7, 1250)], L));
  assert.equal(PEARLS.pending([swim('other-app', 6, 7, 1300)], L).swims.length, 0);
});

test('거리가 없는 기록은 진주를 주지 않고, 원장에도 안 남겨요 (나중에 거리가 오면 받기)', () => {
  const { PEARLS } = load();
  const L = PEARLS.ledgerFor(null);
  const p = PEARLS.pending([swim('g', 6, 7, 0)], L);
  assert.equal(p.total, 0); assert.equal(p.swims.length, 0); assert.equal(p.noDistance.length, 1);
  assert.equal(PEARLS.pending([swim('g', 6, 7, 900)], PEARLS.apply(L, p)).pearls, 9);
});

test('날짜가 바뀌면 원장이 새로 시작해요', () => {
  const { PEARLS } = load();
  const old = { day: '2000-01-01', swims: [{ id: 'a' }], meters: 1000, pearls: 15, bonus: true };
  assert.deepEqual(J(PEARLS.ledgerFor(old).swims), []);
});

test('중복 제거: 같은 ID, 겹치는 시간', () => {
  const { Health } = load();
  const out = Health._.dedupe([swim('a', 6, 7, 1250), swim('a', 6, 7, 1250), swim('b', 6, 7, 0), swim('c', 19, 20, 500)]);
  assert.deepEqual(J(out.map((s) => s.id)), ['a', 'c']);
});

test('100m 평균 시간', () => {
  const { Health } = load();
  assert.equal(Health._.formatPace(42 * 60, 1250), `3'22"`);
  assert.equal(Health._.formatPace(600, 0), '-');
});

test('브라우저: 데모 기록 1,250m · 42분 · 3\'22"', async () => {
  const { Health } = load();
  assert.equal(Health.isNative(), false);
  const s = await Health.getTodaySummary();
  assert.equal(s.meters, 1250); assert.equal(s.minutes, 42); assert.equal(s.pace100, `3'22"`); assert.equal(s.swims[0].source, 'demo');
});

// ---------- 가짜 네이티브 ----------
function fakeCapacitor(platform, plugins) {
  return { isNativePlatform: () => true, getPlatform: () => platform, registerPlugin: (n) => plugins[n] };
}

test('iOS: 수영만, 오늘 시작한 것만, 거리 없으면 수영 거리로 보완, 중복 제거', async () => {
  const yesterday = new Date(Date.now() - 864e5); yesterday.setHours(23, 30, 0, 0);
  const calls = [];
  const Health = {
    queryWorkouts: async (o) => { calls.push(o); return { workouts: [
      { workoutType: 'swimming', duration: 2520, totalDistance: 1250, startDate: at(6), endDate: at(6, 42), platformId: 'U1' },
      { workoutType: 'swimming', duration: 2520, totalDistance: 1250, startDate: at(6), endDate: at(6, 42), platformId: 'U1' },
      { workoutType: 'swimming', duration: 1800, startDate: at(19), endDate: at(19, 30), platformId: 'U2' },
      { workoutType: 'swimming', duration: 3000, totalDistance: 900, startDate: yesterday.toISOString(), endDate: at(0, 20), platformId: 'OLD' },
    ] }; },
  };
  const UsukkuHealth = { isAvailable: async () => ({ available: true }), sumSwimDistance: async () => ({ meters: 600.4 }) };
  const ctx = load({ Capacitor: fakeCapacitor('ios', { Health, UsukkuHealth }) });
  const s = await ctx.Health.getTodaySummary();
  assert.equal(calls[0].workoutType, 'swimming');
  assert.deepEqual(J(s.swims.map((x) => [x.id, x.meters, x.source])), [['U1', 1250, 'healthkit'], ['U2', 600, 'healthkit']]);
  assert.equal(s.meters, 1850); assert.equal(s.minutes, 72); assert.equal(s.distanceMissing, false);
});

test('Android: 실내 · 실외 수영만 고르고, 거리 없으면 DistanceRecord를 겹친 만큼 더해요', async () => {
  const Health = {
    isAvailable: async () => ({ available: true }),
    checkAuthorization: async () => ({ readAuthorized: ['workouts', 'distance'], readDenied: [] }),
    queryWorkouts: async () => ({ workouts: [
      { workoutType: 'running', duration: 1200, totalDistance: 3000, startDate: at(5), endDate: at(5, 20), platformId: 'R' },
      { workoutType: 'swimmingPool', duration: 2400, startDate: at(7), endDate: at(7, 40), platformId: 'S1', sourceId: 'com.sec.android.app.shealth' },
      { workoutType: 'swimmingOpenWater', duration: 600, totalDistance: 0, startDate: at(18), endDate: at(18, 10), platformId: 'S2' },
    ] }),
    readSamples: async (o) => ({ samples: o.startDate === at(7) ? [
      { value: 1000, startDate: at(7), endDate: at(7, 40) },
      { value: 200, startDate: at(7, 30), endDate: at(7, 50) }, // 절반만 겹침 → 100
    ] : [] }),
  };
  const ctx = load({ Capacitor: fakeCapacitor('android', { Health }) });
  const s = await ctx.Health.getTodaySummary();
  assert.deepEqual(J(s.swims.map((x) => [x.id, x.meters, x.source])), [['S1', 1100, 'health-connect'], ['S2', 0, 'health-connect']]);
  assert.equal(s.distanceMissing, true); assert.equal(s.meters, 1100);
});

test('Android: 권한이 없으면 denied, Health Connect가 없으면 update-required', async () => {
  const base = { queryWorkouts: async () => ({ workouts: [] }) };
  const denied = load({ Capacitor: fakeCapacitor('android', { Health: { ...base, isAvailable: async () => ({ available: true }), checkAuthorization: async () => ({ readAuthorized: ['workouts'], readDenied: ['distance'] }) } }) });
  await assert.rejects(denied.Health.getTodaySummary(), (e) => e.code === 'denied');
  const missing = load({ Capacitor: fakeCapacitor('android', { Health: { ...base, isAvailable: async () => ({ available: false, reason: 'Health Connect needs an update.' }) } }) });
  await assert.rejects(missing.Health.getTodaySummary(), (e) => e.code === 'update-required');
});
