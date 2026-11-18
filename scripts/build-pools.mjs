// 전국 수영장 목록 만들기 → js/pools-data.js
//
// 앱은 이 파일 하나로 가까운 수영장을 찾아요. 현재 위치는 휴대폰 안에서만 쓰고 어디에도 보내지 않아요.
// 이 스크립트는 인터넷이 되는 곳(GitHub Actions)에서 돌려요: .github/workflows/pools-data.yml
//
// 출처
//  1. OpenStreetMap (Overpass API) — 키 없음. 구민 · 국민체육센터 같은 공공 수영장을 포함해요. © OpenStreetMap 기여자, ODbL
//  2. 행정안전부_생활_수영장업 조회서비스 (공공데이터포털 15155038) — 환경변수 DATA_GO_KR_KEY가 있을 때만. 영업 중인 수영장업
//  3. 행정안전부_생활_종합체육시설업 조회서비스 (공공데이터포털 15155071) — 같은 키. 종합체육시설업은 법상 실내 수영장을 갖춰야 해요
//
// 출력 형식: window.USUKKU_POOL_DATA = { updated, sources, pools: [[id, 이름, 위도, 경도, 동네, 주소], ...] }
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import proj4 from 'proj4';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'js', 'pools-data.js');
const SAMPLE = join(root, 'scripts', 'pools-sample.json'); // 출처별 원본 필드 확인용 (작은 표본)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- 1. OpenStreetMap ----------
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
const QUERY = `[out:json][timeout:240];
area["ISO3166-1"="KR"][admin_level=2]->.kr;
(
  nwr["leisure"="sports_centre"]["sport"~"swimming"](area.kr);
  nwr["leisure"="swimming_pool"]["name"](area.kr);
  nwr["leisure"="water_park"]["name"~"수영"](area.kr);
);
out center tags;`;
const NAME_OK = /수영|아쿠아|aqua|swim|풀|체육센터|스포츠센터|체육관|레포츠|스포츠타운|생활체육/i;
const NAME_BAD = /유아|어린이풀|키즈|호텔|리조트|펜션|빌라|아파트|캠핑|글램핑|워터파크|물놀이/i;
// 어른이 다니기 어려운 아동 전용 수영장(키즈풀 · 아기 수영)은 빼요
const KIDS = /키즈|kids|kid's|어린이|유아|베이비|baby|아기|키드|토들러|꼬마|리틀/i;
// 사업장명 앞뒤의 회사 표기 정리: '주식회사 OO', '(주)OO', 'OO(주)'
const cleanName = (n) => n.replace(/^\s*(주식회사|㈜|\(주\)|유한회사|\(유\))\s*/, '').replace(/\s*(주식회사|㈜|\(주\))\s*$/, '').replace(/\s{2,}/g, ' ').trim();

async function fromOsm() {
  for (const url of OVERPASS) {
    try {
      const res = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(QUERY), headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'usukku-pools/1.0 (github.com/eugenekimkim/usukku)' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      const out = [];
      for (const e of json.elements || []) {
        const t = e.tags || {};
        const name = cleanName((t['name:ko'] || t.name || '').trim());
        if (KIDS.test(name)) continue;
        const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
        if (!name || lat == null) continue;
        if (t.access && /private|no|customers/.test(t.access)) continue;
        if (t.leisure === 'swimming_pool' && (!NAME_OK.test(name) || NAME_BAD.test(name))) continue;
        const dong = t['addr:suburb'] || t['addr:quarter'] || t['addr:neighbourhood'] || t['addr:district'] || '';
        const addr = [t['addr:province'], t['addr:city'], t['addr:district'], t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ') || t['addr:full'] || '';
        out.push({ id: `osm:${e.type[0]}${e.id}`, name, lat, lng, dong, addr, src: 'osm' });
      }
      console.log(`OSM ${url}: ${json.elements?.length || 0}개 받음 → ${out.length}개 사용`);
      return { pools: out, sample: (json.elements || []).slice(0, 3) };
    } catch (e) {
      console.warn(`OSM ${url} 실패: ${e.message}`);
      await sleep(5000);
    }
  }
  // 모든 서버가 응답하지 않으면 지난번 목록의 OSM 항목을 그대로 써요
  const prev = previousOsm();
  console.warn(`OSM 서버가 모두 실패 → 지난 목록의 OSM ${prev.length}개를 그대로 써요`);
  return { pools: prev, sample: [], stale: true };
}
function previousOsm() {
  try {
    if (!existsSync(OUT)) return [];
    const m = /window\.USUKKU_POOL_DATA = (\{.*\});/s.exec(readFileSync(OUT, 'utf8'));
    return m ? JSON.parse(m[1]).pools.filter((p) => String(p[0]).startsWith('osm:')).map(([id, name, lat, lng, dong, addr]) => ({ id, name, lat, lng, dong, addr, src: 'osm' })) : [];
  } catch (e) { return []; }
}

// ---------- 2. 공공데이터포털: 행정안전부_생활_수영장업 ----------
// 좌표계: 보정계수 없는 Bessel 중부원점 TM (EPSG:5174)
proj4.defs('EPSG:5174', '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
const pick = (o, keys) => { for (const k of keys) if (o[k] != null && String(o[k]).trim() !== '') return String(o[k]).trim(); return ''; };
// 응답 필드 이름이 문서에 없어서 여러 후보로 찾아요
const F = {
  name: ['BPLC_NM', 'bplcNm', 'BPLCNM', '사업장명'],
  status: ['SALS_STTS_NM', 'salsSttsNm', 'DTL_SALS_STTS_NM', 'SALS_STTS_CD', 'salsSttsCd', '영업상태명'],
  road: ['ROAD_NM_ADDR', 'roadNmAddr', 'RDNWHLADDR', '도로명주소'],
  lot: ['LOTNO_ADDR', 'lotnoAddr', 'SITEWHLADDR', '지번주소'],
  x: ['CRD_INFO_X', 'crdInfoX', 'X', 'x', '좌표정보X'],
  y: ['CRD_INFO_Y', 'crdInfoY', 'Y', 'y', '좌표정보Y'],
  id: ['MNG_NO', 'mngNo', 'MGTNO', '관리번호'],
};
async function fromDataGoKr(key, { base, label, prefix }) {
  if (!key) { console.log(`DATA_GO_KR_KEY 없음 → 공공데이터포털 ${label}은 건너뛰어요`); return { pools: [], sample: [] }; }
  const out = [], sample = [], stats = { total: 0, closed: 0, kids: 0, noCoord: 0 };
  // 포털에는 기본 주소만 있어서, 첫 쪽에서 실제 경로를 찾아요
  const BASE = base;
  let path = null;
  for (const cand of ['', '/info', '/getInfo', '/list']) {
    try {
      const res = await fetch(`${BASE}${cand}?serviceKey=${encodeURIComponent(key)}&pageNo=1&numOfRows=1&returnType=json`);
      const body = await res.text();
      console.log(`${label} 경로 '${cand || '/'}': HTTP ${res.status} ${body.slice(0, 160).replace(/\s+/g, ' ')}`);
      if (res.ok && findItems(JSON.parse(body)).length) { path = cand; break; }
    } catch (e) { console.warn(`${label} 경로 '${cand}' 실패: ${e.message}`); }
  }
  if (path == null) { console.warn(`${label} API 경로를 찾지 못했어요 (위 응답을 확인해 주세요)`); return { pools: [], sample }; }
  for (let page = 1; page <= 200; page++) {
    const url = `${BASE}${path}?serviceKey=${encodeURIComponent(key)}&pageNo=${page}&numOfRows=100&returnType=json`;
    let json;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      json = await res.json();
    } catch (e) { console.warn(`${label} ${page}쪽 실패: ${e.message}`); break; }
    // 응답 모양도 문서에 없어서, 객체 배열을 찾아 내려가요
    const items = findItems(json);
    if (page === 1) sample.push(trimSample(json));
    if (!items.length) break;
    for (const it of items) {
      stats.total++;
      const status = pick(it, F.status);
      if (status && !/영업|정상|^0?1$/.test(status)) { stats.closed++; continue; } // 폐업 · 휴업 제외
      const name = cleanName(pick(it, F.name));
      if (!name || KIDS.test(name)) { stats.kids++; continue; }
      const x = parseFloat(pick(it, F.x)), y = parseFloat(pick(it, F.y));
      if (!isFinite(x) || !isFinite(y)) { stats.noCoord++; continue; }
      const [lng, lat] = proj4('EPSG:5174', 'WGS84', [x, y]);
      if (!(lat > 33 && lat < 39 && lng > 124 && lng < 132)) continue;
      const lot = pick(it, F.lot), road = pick(it, F.road);
      const dong = (/\s([가-힣0-9]+[동읍면리가])(\s|$)/.exec(lot) || [])[1] || '';
      out.push({ id: `${prefix}:${pick(it, F.id) || `${x},${y}`}`, name, lat, lng, dong, addr: road || lot, src: prefix });
    }
    if (items.length < 100) break;
    await sleep(200);
  }
  console.log(`공공데이터포털 ${label}: 받은 ${stats.total}개 → 폐업 · 휴업 ${stats.closed}, 아동 전용 ${stats.kids}, 좌표 없음 ${stats.noCoord} 빼고 ${out.length}개`);
  noCoordCount += stats.noCoord;
  return { pools: out, sample };
}
function findItems(o) {
  if (Array.isArray(o)) return o.length && typeof o[0] === 'object' ? o : [];
  if (o && typeof o === 'object') { for (const v of Object.values(o)) { const r = findItems(v); if (r.length) return r; } }
  return [];
}
function trimSample(json) { const items = findItems(json); return { keys: items[0] ? Object.keys(items[0]) : [], first: items[0] || null, top: Object.keys(json) }; }

// ---------- 합치기: 150m 안에 비슷한 이름이면 하나로 ----------
const R = 6371;
const dist = (a, b) => { const dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180; const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(s)); };
const norm = (s) => s.replace(/\s|\(.*?\)|수영장|스포츠센터|체육센터|국민|구민|시민/g, '');
function merge(lists) {
  const all = lists.flat().filter((p) => p.name);
  const out = [];
  for (const p of all) {
    const dup = out.find((q) => dist(p, q) < 0.15 && (norm(p.name) === norm(q.name) || norm(p.name).includes(norm(q.name)) || norm(q.name).includes(norm(p.name)) || dist(p, q) < 0.04));
    if (dup) { if (!dup.dong && p.dong) dup.dong = p.dong; if (!dup.addr && p.addr) dup.addr = p.addr; continue; }
    out.push({ ...p });
  }
  return out.sort((a, b) => a.lat - b.lat || a.lng - b.lng);
}

let noCoordCount = 0;
const KEY = process.env.DATA_GO_KR_KEY;
const [osm, go, comp] = await Promise.all([
  fromOsm(),
  fromDataGoKr(KEY, { base: 'https://apis.data.go.kr/1741000/swimming_pools', label: '수영장업', prefix: 'go' }),
  fromDataGoKr(KEY, { base: 'https://apis.data.go.kr/1741000/comprehensive_sports_facilities', label: '종합체육시설업', prefix: 'gc' }),
]);
const pools = merge([go.pools, comp.pools, osm.pools]);
if (pools.length < 50) { console.error(`수영장이 ${pools.length}개뿐이라 파일을 바꾸지 않아요`); process.exit(1); }
const r5 = (n) => Math.round(n * 1e5) / 1e5;
const data = {
  updated: new Date().toISOString().slice(0, 10),
  sources: [osm.pools.length && '© OpenStreetMap 기여자 (ODbL)', go.pools.length && '행정안전부 생활_수영장업', comp.pools.length && '행정안전부 생활_종합체육시설업'].filter(Boolean),
  counts: { osm: osm.pools.length, go: go.pools.length, comp: comp.pools.length, merged: pools.length, noCoord: noCoordCount },
  pools: pools.map((p) => [p.id, p.name, r5(p.lat), r5(p.lng), p.dong, p.addr]),
};
writeFileSync(OUT, `// 자동 생성 파일 — scripts/build-pools.mjs (직접 고치지 마세요)\n// OpenStreetMap에서 온 항목: © OpenStreetMap 기여자, ODbL 1.0 (https://www.openstreetmap.org/copyright) · 이 목록도 ODbL로 제공해요\nwindow.USUKKU_POOL_DATA = ${JSON.stringify(data)};\n`);
writeFileSync(SAMPLE, JSON.stringify({ osm: osm.sample, go: go.sample, comp: comp.sample }, null, 2));
console.log(`js/pools-data.js: ${pools.length}개 (OSM ${osm.pools.length}, 수영장업 ${go.pools.length}, 종합체육시설업 ${comp.pools.length})`);
