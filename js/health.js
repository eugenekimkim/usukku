// 우수꾸 수영 기록 읽기 — 화면 코드는 이 모듈(window.Health)만 불러요.
//
// - iPhone + Apple Watch: HealthKit (@capgo/capacitor-health + 앱 안의 UsukkuHealth 플러그인)
// - Android + 갤럭시워치: 삼성 헬스 → Health Connect (@capgo/capacitor-health)
// - 브라우저: 지금까지 쓰던 데모 기록 (1,250m · 42분 · 3'22")
//
// 수영 항목: { id, start, end, meters, minutes, source }   source = 'healthkit' | 'health-connect' | 'demo'
// 합계:     { meters, minutes, pace100, swims, distanceMissing }   swims = 수영 항목 목록
(function (root) {
  'use strict';

  const cap = root.Capacitor;
  const NATIVE = !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
  const PLATFORM = NATIVE && typeof cap.getPlatform === 'function' ? cap.getPlatform() : 'web';
  const plugin = (name) => (NATIVE && typeof cap.registerPlugin === 'function' ? cap.registerPlugin(name) : null);
  const HC = plugin('Health'); // @capgo/capacitor-health (HealthKit · Health Connect 공통)
  const IOS = PLATFORM === 'ios' ? plugin('UsukkuHealth') : null; // ios/App/App/UsukkuHealthPlugin.swift

  const SWIM_TYPES = ['swimming', 'swimmingPool', 'swimmingOpenWater'];
  const SAME_SWIM = 0.5; // 짧은 쪽 운동 시간의 절반 이상 겹치면 같은 수영으로 봐요
  const HC_PACKAGE = 'com.google.android.apps.healthdata';

  class HealthError extends Error {
    // code: 'denied' | 'update-required' | 'unsupported' | 'read-failed'
    constructor(code, message) { super(message || code); this.name = 'HealthError'; this.code = code; }
  }

  // ---------- 시간 · 숫자 ----------
  function startOfDay(d = new Date()) { const s = new Date(d); s.setHours(0, 0, 0, 0); return s; }
  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const ms = (iso) => new Date(iso).getTime();

  // 100m 평균 시간: 3'22"
  function formatPace(seconds, meters) {
    if (!(meters > 0) || !(seconds > 0)) return '-';
    const s = Math.round((seconds / meters) * 100);
    return `${Math.floor(s / 60)}'${pad(s % 60)}"`;
  }

  // ---------- 중복 없애기 ----------
  function overlapRatio(a, b) {
    const s = Math.max(ms(a.start), ms(b.start)), e = Math.min(ms(a.end), ms(b.end));
    const shorter = Math.min(ms(a.end) - ms(a.start), ms(b.end) - ms(b.start));
    if (e <= s || shorter <= 0) return 0;
    return (e - s) / shorter;
  }
  const sameSwim = (a, b) => a.id === b.id || overlapRatio(a, b) >= SAME_SWIM;
  // 같은 수영이 둘이면 거리가 있는 쪽, 그다음 긴 쪽을 남겨요
  const better = (a, b) => (a.meters || 0) !== (b.meters || 0) ? (a.meters || 0) > (b.meters || 0) : a.minutes > b.minutes;
  function dedupe(list) {
    const out = [];
    [...list].sort((a, b) => ms(a.start) - ms(b.start)).forEach((s) => {
      const i = out.findIndex((o) => sameSwim(o, s));
      if (i < 0) out.push(s); else if (better(s, out[i])) out[i] = s;
    });
    return out;
  }

  // 시간대가 일부만 겹치는 거리 샘플은 겹친 비율만큼만 더해요
  function sumSamplesIn(samples, start, end) {
    const s0 = ms(start), e0 = ms(end);
    return samples.reduce((sum, x) => {
      const s = ms(x.startDate), e = ms(x.endDate);
      if (!(x.value > 0)) return sum;
      if (e <= s) return s >= s0 && s <= e0 ? sum + x.value : sum;
      const ov = Math.min(e, e0) - Math.max(s, s0);
      return ov > 0 ? sum + x.value * (ov / (e - s)) : sum;
    }, 0);
  }

  function summarize(swims) {
    const withDist = swims.filter((s) => s.meters > 0);
    const meters = Math.round(withDist.reduce((t, s) => t + s.meters, 0));
    const minutes = Math.round(swims.reduce((t, s) => t + s.minutes, 0));
    const distSeconds = withDist.reduce((t, s) => t + s.minutes * 60, 0);
    return { meters, minutes, pace100: formatPace(distSeconds, meters), swims, distanceMissing: swims.some((s) => !(s.meters > 0)) };
  }

  // ---------- 데모 (브라우저) ----------
  function demoSwims(now = new Date()) {
    const end = new Date(now); end.setHours(6, 40, 0, 0);
    const start = new Date(end.getTime() - 42 * 60000);
    return [{ id: 'demo-' + dayKey(now), start: start.toISOString(), end: end.toISOString(), meters: 1250, minutes: 42, source: 'demo' }];
  }

  // ---------- 플랫폼 확인 · 권한 ----------
  async function availability() {
    if (!NATIVE) return { available: true };
    if (PLATFORM === 'ios') {
      const r = IOS ? await IOS.isAvailable() : { available: false };
      return r.available ? { available: true } : { available: false, reason: 'unsupported' };
    }
    const r = await HC.isAvailable();
    if (r.available) return { available: true };
    // Android 13 이하에서 Health Connect 앱이 없거나 오래되면 '업데이트 필요'로 와요
    return { available: false, reason: /update/i.test(r.reason || '') ? 'update-required' : 'unsupported' };
  }

  const READ = ['workouts', 'distance'];
  // 권한 요청: "워치 기록 받기"를 처음 누를 때만 불러요
  async function requestPermission() {
    if (!NATIVE) return { granted: true };
    if (PLATFORM === 'ios') {
      // 운동 + 수영 거리를 시트 한 번으로 요청. HealthKit은 읽기 거절 여부를 알려주지 않아요.
      await IOS.requestSwimAuthorization();
      return { granted: null };
    }
    const st = await HC.requestAuthorization({ read: READ });
    return { granted: READ.every((t) => (st.readAuthorized || []).includes(t)) };
  }
  // Android만 정확히 알 수 있어요. iOS는 null(알 수 없음).
  async function hasPermission() {
    if (!NATIVE) return true;
    if (PLATFORM === 'ios') return null;
    const st = await HC.checkAuthorization({ read: READ });
    return READ.every((t) => (st.readAuthorized || []).includes(t));
  }

  // ---------- 읽기 ----------
  function toSwim(w) {
    const minutes = Math.round(((w.duration > 0 ? w.duration : (ms(w.endDate) - ms(w.startDate)) / 1000) / 60) * 10) / 10;
    return {
      id: w.platformId || `${w.sourceId || 'unknown'}:${w.startDate}`,
      start: new Date(w.startDate).toISOString(),
      end: new Date(w.endDate).toISOString(),
      meters: w.totalDistance > 0 ? Math.round(w.totalDistance) : 0,
      minutes,
      source: PLATFORM === 'ios' ? 'healthkit' : 'health-connect',
    };
  }

  // 운동에 거리가 없을 때 그 시간대의 수영 거리를 따로 읽어요
  async function distanceDuring(swim) {
    try {
      if (PLATFORM === 'ios') {
        const r = await IOS.sumSwimDistance({ startDate: swim.start, endDate: swim.end });
        return Math.round(r.meters || 0);
      }
      const r = await HC.readSamples({ dataType: 'distance', startDate: swim.start, endDate: swim.end, limit: 500, ascending: true });
      return Math.round(sumSamplesIn(r.samples || [], swim.start, swim.end));
    } catch (e) {
      return 0;
    }
  }

  function readError(e) {
    if (e instanceof HealthError) return e;
    const msg = (e && (e.message || e.code)) || '';
    if (/permission|denied|not authori[sz]ed|SecurityException/i.test(msg)) return new HealthError('denied', msg);
    return new HealthError('read-failed', msg);
  }

  // 오늘(기기 시간대 0시부터 지금까지) 시작한 수영 운동
  async function getTodaySwims(now = new Date()) {
    if (!NATIVE) return demoSwims(now);
    const av = await availability();
    if (!av.available) throw new HealthError(av.reason);
    if (PLATFORM === 'android' && !(await hasPermission())) throw new HealthError('denied');
    const from = startOfDay(now);
    let workouts;
    try {
      const res = await HC.queryWorkouts({
        // iOS는 수영만 골라 읽고(HKWorkoutActivityType.swimming), Android는 실내 · 실외 수영을 아래에서 골라요
        ...(PLATFORM === 'ios' ? { workoutType: 'swimming' } : {}),
        startDate: from.toISOString(), endDate: now.toISOString(), limit: 50, ascending: true,
      });
      workouts = res.workouts || [];
    } catch (e) { throw readError(e); }
    // 어제 시작해 자정을 넘긴 수영은 어제 기록이에요 (두 날에 걸쳐 세지 않게)
    const swims = workouts.filter((w) => SWIM_TYPES.includes(w.workoutType) && ms(w.startDate) >= from.getTime()).map(toSwim);
    for (const s of swims) if (!(s.meters > 0)) s.meters = await distanceDuring(s);
    return dedupe(swims);
  }

  async function getTodaySummary(now = new Date()) {
    return summarize(await getTodaySwims(now));
  }

  // Android: 최근에 Health Connect로 들어온 운동이 하나라도 있는지 (삼성 헬스 연동 확인용)
  async function hasRecentWorkouts(days = 29) {
    if (!NATIVE || PLATFORM !== 'android') return true;
    try {
      const res = await HC.queryWorkouts({ startDate: new Date(Date.now() - days * 864e5).toISOString(), endDate: new Date().toISOString(), limit: 1 });
      return (res.workouts || []).length > 0;
    } catch (e) { return true; }
  }

  // 권한을 바꾸는 곳 열기: iOS 설정 앱 · Android Health Connect
  async function openSettings() {
    if (!NATIVE) return;
    if (PLATFORM === 'ios') return IOS.openSettings();
    return HC.openHealthConnectSettings();
  }
  // Health Connect 설치 · 업데이트 (Play 스토어)
  function openInstall() {
    if (PLATFORM !== 'android') return;
    root.location.href = `https://play.google.com/store/apps/details?id=${HC_PACKAGE}&url=healthconnect%3A%2F%2Fonboarding`;
  }

  root.Health = {
    isNative: () => NATIVE,
    platform: () => PLATFORM,
    availability, requestPermission, hasPermission,
    getTodaySwims, getTodaySummary, hasRecentWorkouts,
    openSettings, openInstall,
    HealthError,
    // 테스트용
    _: { dedupe, summarize, formatPace, sumSamplesIn, overlapRatio, sameSwim, demoSwims, dayKey, startOfDay },
  };
})(typeof window !== 'undefined' ? window : globalThis);
