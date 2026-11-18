// 알림 예약(js/notify.js): 요일 · 시간 → Capacitor 예약, 오늘 밤 건너뛰기
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const J = (x) => JSON.parse(JSON.stringify(x));
const load = (globals = {}) => { const c = vm.createContext({ console, Math, JSON, Date, Promise, Set, ...globals }); c.window = c; vm.runInContext(readFileSync(new URL('../js/notify.js', import.meta.url), 'utf8'), c); return c.Notify; };

test('요일 · 시간 → 수영 알림 + 밤 9시 진주 받기 알림 (weekday 1=일요일)', () => {
  const N = load();
  assert.deepEqual(J(N.plan({ on: false, days: [1], time: '06:30', evening: true })), []);
  const p = J(N.plan({ on: true, days: [3, 1], time: '06:30', evening: true }));
  assert.deepEqual(p.map((x) => [x.id, x.schedule.on.weekday, x.schedule.on.hour, x.schedule.on.minute]), [[101, 2, 6, 30], [201, 2, 21, 0], [103, 4, 6, 30], [203, 4, 21, 0]]);
  assert.equal(J(N.plan({ on: true, days: [0], time: '19:05', evening: false })).length, 1);
});

test('앱: 켜면 권한 확인 → 우리 알림만 지우고 다시 예약, 진주 받은 날 밤은 다음 주부터', async () => {
  const calls = [];
  const LN = {
    checkPermissions: async () => ({ display: 'prompt' }),
    requestPermissions: async () => (calls.push('request'), { display: 'granted' }),
    getPending: async () => ({ notifications: [{ id: 101 }, { id: 5 }, { id: 203 }] }),
    cancel: async (o) => calls.push(['cancel', o.notifications.map((n) => n.id)]),
    schedule: async (o) => calls.push(['schedule', o.notifications.map((n) => n.id), o.notifications[0].schedule]),
  };
  const N = load({ Capacitor: { isNativePlatform: () => true, registerPlugin: () => LN } });
  const r = await N.apply({ on: true, days: [3], time: '07:00', evening: true });
  assert.equal(r.count, 2);
  assert.deepEqual(J(calls.slice(0, 3).map((c) => (Array.isArray(c) ? c.slice(0, 2) : c))), ['request', ['cancel', [101, 203]], ['schedule', [103, 203]]]);
  calls.length = 0;
  const wed = new Date(2026, 10, 18, 10, 0); // 수요일 오전
  await N.skipTonight({ on: true, days: [3], evening: true }, wed);
  assert.deepEqual(J(calls[0]), ['cancel', [203]]);
  assert.equal(calls[1][1][0], 203); assert.equal(calls[1][2].every, 'week');
  assert.equal(new Date(calls[1][2].at).getDate(), 25);
  calls.length = 0;
  await N.skipTonight({ on: true, days: [1], evening: true }, wed); // 월요일만 → 오늘은 아님
  assert.equal(calls.length, 0);
});

test('권한을 거절하면 denied', async () => {
  const LN = { checkPermissions: async () => ({ display: 'denied' }), requestPermissions: async () => ({ display: 'denied' }) };
  const N = load({ Capacitor: { isNativePlatform: () => true, registerPlugin: () => LN } });
  await assert.rejects(N.apply({ on: true, days: [1], time: '06:30' }), (e) => e.code === 'denied');
});
