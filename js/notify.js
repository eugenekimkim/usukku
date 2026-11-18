// 우수꾸 알림 — 폰에서 보내는 알림(서버 없음). 앱은 @capacitor/local-notifications, 브라우저는 설정만 저장해요.
//
// 설정 alarm = { on, days: [0~6 (일~토)], time: 'HH:MM', evening }
//  - 수영 알림: 고른 요일 · 시간에 "오늘은 수영 가는 날이에요"
//  - 진주 받기 알림(evening): 고른 요일 밤 9시. 진주는 그날 받은 기록만 되니까, 잊지 않게 알려줘요.
//    그날 진주를 받으면 그날 밤 알림은 건너뛰어요(skipTonight).
(function (root) {
  'use strict';

  const cap = root.Capacitor;
  const NATIVE = !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
  const LN = NATIVE && typeof cap.registerPlugin === 'function' ? cap.registerPlugin('LocalNotifications') : null;

  const DEFAULT = { on: false, days: [1, 3, 5], time: '06:30', evening: true };
  const EVENING = { hour: 21, minute: 0 };
  const SWIM_ID = 100, EVENING_ID = 200; // + 요일(0~6)
  const ours = (id) => id >= SWIM_ID && id < EVENING_ID + 10;

  const TEXT = {
    swim: { title: '오늘은 수영 가는 날이에요', body: '물개 코치가 기다려요. 워치로 기록하고 진주 받으러 와요' },
    evening: { title: '오늘 수영 기록, 진주로 바꿨나요?', body: '진주는 그날 받은 기록만 돼요. 자정 전에 받아 가세요' },
  };

  const parseTime = (t) => { const [h, m] = String(t || DEFAULT.time).split(':').map(Number); return { hour: h || 0, minute: m || 0 }; };

  // 설정 → 예약할 알림 목록 (Capacitor weekday: 1=일요일 … 7=토요일)
  function plan(a) {
    if (!a || !a.on) return [];
    const t = parseTime(a.time);
    const out = [];
    [...new Set(a.days || [])].sort().forEach((d) => {
      out.push({ id: SWIM_ID + d, ...TEXT.swim, schedule: { on: { weekday: d + 1, hour: t.hour, minute: t.minute } } });
      if (a.evening) out.push({ id: EVENING_ID + d, ...TEXT.evening, schedule: { on: { weekday: d + 1, ...EVENING } } });
    });
    return out;
  }

  class NotifyError extends Error { constructor(code, msg) { super(msg || code); this.code = code; } } // 'denied'

  async function ensurePermission() {
    let p = await LN.checkPermissions();
    if (p.display !== 'granted') p = await LN.requestPermissions();
    if (p.display !== 'granted') throw new NotifyError('denied');
  }
  async function cancelOurs() {
    const { notifications = [] } = await LN.getPending();
    const ids = notifications.filter((n) => ours(Number(n.id))).map((n) => ({ id: Number(n.id) }));
    if (ids.length) await LN.cancel({ notifications: ids });
  }
  // 설정을 적용해요. 켤 때만 권한을 물어봐요.
  async function apply(a) {
    if (!LN) return { native: false, count: plan(a).length };
    if (a && a.on) await ensurePermission();
    await cancelOurs();
    const list = plan(a);
    if (list.length) await LN.schedule({ notifications: list });
    return { native: true, count: list.length };
  }
  // 오늘 진주를 받았으면 오늘 밤 알림은 건너뛰고, 다음 주 같은 요일부터 다시 와요
  async function skipTonight(a, now = new Date()) {
    if (!LN || !a || !a.on || !a.evening) return;
    const d = now.getDay();
    if (!(a.days || []).includes(d)) return;
    const tonight = new Date(now); tonight.setHours(EVENING.hour, EVENING.minute, 0, 0);
    if (now >= tonight) return;
    const next = new Date(tonight); next.setDate(next.getDate() + 7);
    await LN.cancel({ notifications: [{ id: EVENING_ID + d }] });
    await LN.schedule({ notifications: [{ id: EVENING_ID + d, ...TEXT.evening, schedule: { at: next, repeats: true, every: 'week' } }] });
  }

  root.Notify = { DEFAULT, EVENING, TEXT, isNative: () => NATIVE, plan, apply, skipTonight, NotifyError };
})(typeof window !== 'undefined' ? window : globalThis);
