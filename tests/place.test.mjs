// 수영장 찾기(js/place.js): 거리 · 가까운 순 · 검색 · 인증 거리
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const ctx = vm.createContext({ console, Math, JSON, Map, Promise });
ctx.window = ctx;
ctx.USUKKU_POOL_DATA = { updated: '2026-11-18', sources: ['테스트'], pools: [
  ['a', '잠실수영장', 37.51791, 127.08604, '', ''],
  ['b', '잠실실내수영장', 37.51647, 127.07316, '송파구', '서울특별시 송파구'],
  ['c', '안산 와스타디움 수영장', 37.3158, 126.8228, '고잔동', '경기도 안산시 단원구'],
] };
vm.runInContext(readFileSync(new URL('../js/place.js', import.meta.url), 'utf8'), ctx);
const P = ctx.Place;

test('거리 계산 (잠실 두 수영장 약 1.1km)', () => {
  const d = P.distKm({ lat: 37.51791, lng: 127.08604 }, { lat: 37.51647, lng: 127.07316 });
  assert.ok(d > 1.0 && d < 1.3, String(d));
});
test('가까운 순 · 검색 · 형식', () => {
  assert.equal(P.ready(), true); assert.equal(P.count, 3);
  assert.equal(P.nearby({ lat: 37.3, lng: 126.83 }, 1)[0].id, 'c');
  assert.deepEqual(JSON.parse(JSON.stringify(P.search('잠실 실내', { lat: 37.5, lng: 127 }).map((p) => p.id))), ['b']);
  assert.deepEqual(JSON.parse(JSON.stringify(P.search('송파').map((p) => p.id))), ['b']);
  assert.equal(P.fmtKm(0.234), '230m'); assert.equal(P.fmtKm(1.26), '1.3km');
  assert.equal(P.VERIFY_KM, 0.3);
});
