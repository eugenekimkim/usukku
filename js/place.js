// 우수꾸 수영장 찾기 — 현재 위치와 전국 수영장 목록(js/pools-data.js)
//
// 현재 위치는 이 폰 안에서 가까운 수영장 정렬과 수영장 인증에만 쓰고, 저장하거나 밖으로 보내지 않아요.
// 앱은 @capacitor/geolocation, 브라우저는 navigator.geolocation을 써요.
(function (root) {
  'use strict';

  const cap = root.Capacitor;
  const NATIVE = !!(cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform());
  const Geo = NATIVE && typeof cap.registerPlugin === 'function' ? cap.registerPlugin('Geolocation') : null;

  const DATA = root.USUKKU_POOL_DATA || { pools: [] };
  const POOLS = (DATA.pools || []).map(([id, name, lat, lng, dong, addr]) => ({ id, name, lat, lng, dong: dong || '', addr: addr || '' }));
  const BY_ID = new Map(POOLS.map((p) => [p.id, p]));
  const DEMO = { lat: 37.5301, lng: 127.1238, demo: true }; // 위치를 못 쓸 때: 서울 강동구 성내동 근처
  const VERIFY_KM = 0.3; // 수영장 인증: 300m 안

  function distKm(a, b) {
    const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(s));
  }
  const withDist = (at) => (p) => Object.assign({}, p, { km: at ? distKm(at, p) : null });
  const byDist = (a, b) => a.km - b.km;

  function nearby(at, n = 20) {
    return POOLS.map(withDist(at || DEMO)).sort(byDist).slice(0, n);
  }
  const norm = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
  function search(q, at, n = 30) {
    const k = norm(q);
    if (!k) return nearby(at, n);
    return POOLS.filter((p) => norm(p.name + p.dong + p.addr).includes(k)).map(withDist(at || DEMO)).sort(byDist).slice(0, n);
  }
  const byId = (id) => BY_ID.get(id) || null;

  class PlaceError extends Error { constructor(code, msg) { super(msg || code); this.code = code; } } // 'denied' | 'unavailable'

  // fresh: 수영장 인증처럼 지금 위치가 꼭 필요할 때 (저장된 위치를 쓰지 않아요)
  async function locate(fresh) {
    const maximumAge = fresh ? 0 : 60000;
    if (Geo) {
      let perm = await Geo.checkPermissions();
      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') perm = await Geo.requestPermissions({ permissions: ['location', 'coarseLocation'] });
      if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') throw new PlaceError('denied');
      try {
        const p = await Geo.getCurrentPosition({ enableHighAccuracy: true, timeout: 12000, maximumAge });
        return { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy };
      } catch (e) { throw new PlaceError(/denied|permission/i.test(e.message || '') ? 'denied' : 'unavailable', e.message); }
    }
    if (!root.navigator || !root.navigator.geolocation) throw new PlaceError('unavailable');
    return new Promise((resolve, reject) => root.navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      (e) => reject(new PlaceError(e.code === 1 ? 'denied' : 'unavailable', e.message)),
      { enableHighAccuracy: true, timeout: 12000, maximumAge }
    ));
  }

  root.Place = {
    ready: () => POOLS.length > 0,
    count: POOLS.length, updated: DATA.updated || null, sources: DATA.sources || [],
    DEMO, VERIFY_KM, distKm, nearby, search, byId, locate, PlaceError,
    fmtKm: (km) => (km == null ? '' : km < 1 ? `${Math.round(km * 1000 / 10) * 10}m` : `${(Math.round(km * 10) / 10).toLocaleString()}km`),
  };
})(typeof window !== 'undefined' ? window : globalThis);
