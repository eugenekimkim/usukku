// 우수꾸 화면: 피그마 오토레이아웃 규칙을 옮긴 빌더 + 화면 13개
// render(id, ctx): ctx = { st: 상태, go(route), act(name, ...args), back(), live }
// live가 false면 피그마 시안과 똑같이 그리고(about 갤러리), true면 앱으로 동작한다.
(function () {
  const A = window.ART, P = window.PROPS;

  // ---------- 디자인 토큰 (피그마 최종 값) ----------
  const C = {
    bg: '#F3F9FF', ink: '#0F2A43', sub: '#5B7590', mute: '#9DB2C7',
    primary: '#1F8BFF', btn: '#456AFF', soft: '#DEEDFF', card: '#FFFFFF', line: '#DCE2FF',
    navy: '#1B22A6', pink: '#FFBFEC', pinkL: '#FFE3F6', coral: '#FF7A6B', sky: '#CDEBFF', paleBlue: '#EEF1FF',
  };
  const G = {
    special: 'linear-gradient(135deg,#FFD6F2 0%,#DDF8FF 45%,#C9D4FF 80%,#FFFCDE 100%)',
    splash: 'linear-gradient(135deg,#FFD6F2 0%,#DDF8FF 40%,#B9C8FF 75%,#FFFCDE 100%)',
    soft3: 'linear-gradient(135deg,#FFD6F2 0%,#DDF8FF 50%,#C9D4FF 100%)',
    shine: 'linear-gradient(135deg,#E0E8FF 0%,#DDF8FF 60%,#FFE3F6 100%)',
    rainbow: 'linear-gradient(90deg,#FFBFEC 0%,#C8F3FF 35%,#9EB3FF 70%,#FFF4B8 100%)',
    banner: 'linear-gradient(90deg,#FFD6F2 0%,#FFE9F7 60%,#FFFCDE 100%)',
    dex: 'linear-gradient(90deg,#FFE3F6 0%,#E3F6FF 50%,#E4E9FF 100%)',
  };

  // ---------- 카탈로그 ----------
  const ANIMALS = [['rabbit', '토끼'], ['hamster', '햄스터'], ['bear', '곰'], ['cat', '고양이'], ['sheep', '양']];
  const FURS = [['#FFFFFF', '흰'], ['#FFD9E0', '분홍'], ['#F4E3C8', '크림'], ['#C9CED6', '회색'], ['#B98563', '갈색']];
  // [이름, 거리 · 레인 · 운영, 우수꾸 멤버 수, 동네]
  const POOLS = [['물빛 수영장', '0.6km · 25m 6레인 · 자유수영 가능', 128, '성내동'], ['햇살 스포츠센터', '1.2km · 50m 8레인 · 자유수영 가능', 342, '천호동'], ['파랑 구민체육센터', '2.1km · 25m 5레인 · 강습 전용', 57, '길동'],
    ['바다숲 수영장', '3.4km · 25m 4레인 · 자유수영 가능', 89, '둔촌동'], ['초록 체육공원 수영장', '4.1km · 50m 10레인 · 자유수영 가능', 410, '방이동']];
  // 바닥 장식 기본 배치 (피그마 시안과 같은 자리)
  const DEFAULT_PLACED = [['weed', 40], ['coral', 78, '#FF9EC4'], ['weed', 128], ['shell', 168, '#FFD978'], ['shell', 192, '#FFB8C8'], ['shell', 212, '#C9B8FF'], ['star', 232], ['rock', 262], ['coral', 300, '#FFB547'], ['weed', 334], ['star', 358], ['ball', 46]];
  const I = P.item;
  // 꾸미기 아이템: price = 진주로 사기, reward = 진주로 못 사고 얻는 방법
  const ITEMS = {
    cap: [
      { id: 'basic', name: '기본 수모', price: 0, svg: I.cap('#1F8BFF'), cap: { color: '#1F8BFF' } },
      { id: 'dots', name: '물방울 수모', price: 80, svg: I.cap('#FF9EC4', I.capDots), cap: { color: '#FF9EC4', deco: 'dots' } },
      { id: 'whale', name: '고래 수모', price: 120, tone: 'shine', svg: I.cap('#3B6FD8', I.capWhale), cap: { color: '#3B6FD8', deco: 'whale' } },
      { id: 'rainbow', name: '무지개 수모', price: 150, tone: 'rainbow', svg: I.cap('#0F2A43', I.capRainbow), cap: { color: '#0F2A43', deco: 'rainbow' } },
      { id: 'team', name: '중급반 팀 수모', reward: '강습반 팀 목표', tone: 'limited', svg: I.cap('#3FA65A', I.capTeam), cap: { color: '#3FA65A', deco: 'team' } },
      { id: 'sun', name: '등대섬 수모', reward: '등대섬 도착', tone: 'limited', svg: I.cap('#FFB547', I.capSun), cap: { color: '#FFB547', deco: 'sun' } },
    ],
    goggle: [
      { id: 'basic', name: '기본 수경', price: 0, svg: I.goggle('#FF7A6B'), goggle: null },
      { id: 'otter', name: '청록 수경', price: 100, tone: 'shine', svg: I.goggle('#1BA9A0'), goggle: '#1BA9A0' },
      { id: 'navy', name: '남색 수경', price: 80, svg: I.goggle('#1B22A6'), goggle: '#1B22A6' },
      { id: 'pink', name: '분홍 수경', price: 80, svg: I.goggle('#FF9EC4'), goggle: '#FF9EC4' },
      { id: 'gold', name: '금빛 수경', reward: '고래섬 도착', tone: 'limited', svg: I.goggle('#FFB547'), goggle: '#FFB547' },
      { id: 'collab', name: '콜라보 수경', reward: '수영장 대결', tone: 'limited', svg: I.goggle('#456AFF'), goggle: '#456AFF' },
    ],
    suit: [
      { id: 'basic', name: '처음 옷', price: 0, svg: I.suit('#3ED3C9'), suit: null },
      { id: 'mint', name: '민트 줄무늬', price: 0, svg: I.suit('#3ED3C9'), suit: { color: '#3ED3C9' } },
      { id: 'coral', name: '산호 수영복', price: 150, svg: I.suit('#FF7A6B'), suit: { color: '#FF7A6B' } },
      { id: 'navy', name: '남색 수영복', price: 180, svg: I.suit('#1E3A8A', '#9EB3FF'), suit: { color: '#1E3A8A', stripe: '#9EB3FF' } },
      { id: 'collab', name: '콜라보 수영복', reward: '수영장 대결', tone: 'limited', svg: I.suit('#456AFF', '#FFBFEC'), suit: { color: '#456AFF', stripe: '#FFBFEC' } },
    ],
    fin: [
      { id: 'basic', name: '노랑 오리발', price: 0, svg: I.fin('#FFC94A'), fin: '#FFC94A' },
      { id: 'blue', name: '파랑 오리발', price: 120, svg: I.fin('#4DA3FF'), fin: '#4DA3FF' },
      { id: 'pink', name: '분홍 오리발', price: 200, svg: I.fin('#FF9EC4'), fin: '#FF9EC4' },
    ],
  };
  // 우리 수영장 바닷길: 섬 다섯 개. 섬 간격 = 멤버 1명당 2km
  const ISLANDS = ['모래섬', '산호섬', '해초섬', '등대섬', '고래섬'];
  const KM_PER_MEMBER = 2;
  const ROUTE_AT = 3.6; // 데모: 세 번째 섬을 지나 등대섬으로 가는 중
  function route(pi, extraKm = 0) {
    const gap = POOLS[pi][2] * KM_PER_MEMBER;
    const km = gap * ROUTE_AT + extraKm;
    const at = km / gap; const next = Math.min(ISLANDS.length, Math.floor(at) + 1);
    return { gap, km, at, next, nextName: ISLANDS[next - 1], left: next * gap - km };
  }
  // 바다 친구: [이름, 분류, 만나는 곳] — 우리 수영장이 그 섬에 닿으면 멤버 모두 만나요
  const SEA = {
    clownfish: ['흰동가리', '물고기', '모래섬'], mackerel: ['고등어', '물고기', '등대섬'], tuna: ['참치', '물고기', '고래섬'],
    turtle: ['바다거북', '거북·해달', '산호섬'], otter: ['해달', '거북·해달', '해초섬'], dolphin: ['돌고래', '고래', '등대섬'],
    humpback: ['혹등고래', '고래', '고래섬'], octopus: ['문어', '기타', '산호섬'], bluewhale: ['대왕고래', '고래', '고래섬'],
  };
  const seaHow = (k) => `우리 수영장이 ${SEA[k][2]}에 닿으면 만나요`;
  const DEX_ORDER = ['clownfish', 'mackerel', 'tuna', 'turtle', 'otter', 'dolphin', 'humpback', 'octopus', 'bluewhale'];
  const NOTICES = [
    ['업데이트', '진주 상점이 열렸어요', '2026.11.12', '워치 기록이 들어오면 100m마다 진주 1개를 받아요. 그날 첫 수영에는 진주 5개를 더 드려요. 모은 진주로 수모 · 수경 · 수영복을 살 수 있어요.'],
    ['이벤트', '11월 수영장 대결 규칙과 보상 안내', '2026.10.30', '11월 한 달 동안 같은 수영장 멤버들의 거리를 모아 이웃 수영장과 겨뤄요. 이기면 멤버 전원에게 콜라보 수경을 드려요.'],
    ['공지', '우리 수영장 바닷길 안내', '2026.10.28', '수영장 멤버가 헤엄친 거리를 모두 합쳐 섬을 향해 가요. 섬 간격은 멤버 1명당 2km예요. 섬에 닿으면 그달 인증하고 수영한 멤버 모두 진주 30개와 새 바다 친구를 만나요.'],
    ['공지', '갤럭시워치 연동 베타를 시작해요', '2026.10.24', '마이 > 워치 연동에서 갤럭시워치를 연결할 수 있어요.'],
    ['공지', '수영장은 한 달에 한 번 바꿀 수 있어요', '2026.10.20', '내 수영장은 한 곳만 등록해요. 한 번 바꾸면 그달에는 다시 바꿀 수 없어요. 이미 헤엄친 거리는 이전 수영장 바닷길에 남아요.'],
    ['업데이트', '음파 표정 스티커가 추가됐어요', '2026.10.08', '숨 참는 친구들의 음파 표정을 스티커로 쓸 수 있어요.'],
  ];

  const DEFAULT_STATE = {
    onboarded: false, kind: 'rabbit', fur: '#FFFFFF', name: '새벽반 흰토끼', nameEdited: false, pool: 0,
    equip: { cap: 'basic', goggle: 'basic', suit: 'basic', fin: null },
    owned: ['cap:basic', 'cap:dots', 'goggle:basic', 'goggle:navy', 'suit:basic', 'suit:mint', 'fin:basic'],
    pearls: 186,
    pearlDay: null, // 오늘 진주를 준 운동 원장 (js/pearls.js)
    health: { asked: false }, // 건강 데이터 권한을 물어봤는지 (워치 기록 받기를 처음 누를 때)
    friends: ['clownfish', 'turtle', 'octopus', 'otter', 'jellyfish', 'puffer', 'starfish', 'crab', 'shrimp', 'seahorse'],
    follow: ['clownfish', 'turtle'],
    tab: 'cap', dexFilter: '전체', noticeFilter: '전체', openNotice: -1, read: [],
    tray: { coral: 2, weed: 1, shell: 3, ball: 1, star: 2 }, decorate: false,
    placed: DEFAULT_PLACED.map((p) => p.slice()),
    poolChanged: null, verified: { 0: true }, located: false,
    history: null, // 날짜별 기록 { 'YYYY-MM-DD': { m, min, n } } (js/progress.js) · null이면 브라우저 데모 기록을 채워요
    islands: [], // 도착 보상을 받은 섬 번호
  };
  // 앱(iOS · Android) 첫 상태: 진주 0개, 기본 아이템, 바다 친구 없음
  const FRESH_STATE = {
    pearls: 0, history: {}, islands: [], verified: {},
    owned: ['cap:basic', 'goggle:basic', 'suit:basic', 'suit:mint', 'fin:basic'],
    equip: { cap: 'basic', goggle: 'basic', suit: 'basic', fin: null },
    friends: [], follow: [],
  };
  // 오늘 수영 기록 (데모) · 진주 계산
  const TODAY = { m: 1250, min: 42, pace: "3'22\"" };
  const PEARL_PER = 100, FIRST_BONUS = 5;
  const todayPearls = () => Math.floor(TODAY.m / PEARL_PER) + FIRST_BONUS;
  const monthKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}`;
  const nextMonthLabel = (d = new Date()) => `${d.getMonth() === 11 ? 1 : d.getMonth() + 2}월 1일`;
  // 앱에서는 오늘 날짜로, 시안(갤러리)에서는 피그마 값 그대로
  const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
  const dateLabel = (d = new Date()) => `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEK[d.getDay()]}요일`;
  const timeLabel = (d) => { const h = d.getHours(); const part = h < 7 ? '새벽' : h < 12 ? '오전' : h < 18 ? '오후' : '저녁'; return `${part} ${h > 12 ? h - 12 : h}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const daysLeft = (d = new Date()) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() - d.getDate();
  const dday = (n) => (n > 0 ? `D-${n}` : 'D-DAY');
  // 오늘 진주를 받으며 우리 수영장 바닷길에 보탠 거리(km)
  const todayKm = (ctx) => (ctx.live && ctx.ledger ? ctx.ledger.meters / 1000 : 0);
  // 혼자 모드 통계 · 나의 바닷길 (js/progress.js)
  const PR = () => window.PROGRESS;
  const myStats = (ctx) => PR().stats(ctx.st.history || {});
  const myRoute = (ctx) => PR().myRoute(myStats(ctx).km);
  const km1 = (n) => (Math.round(n * 10) / 10).toLocaleString();
  const rewardLabel = (ctx, cat, it) => (ctx.live && PR().REWARDS[cat + ':' + it.id] ? PR().REWARDS[cat + ':' + it.id].label : it.reward);

  const furName = (hex) => (FURS.find((f) => f[0] === hex) || [0, ''])[1];
  const animalName = (k) => ANIMALS.find((a) => a[0] === k)[1];
  const itemOf = (cat, id) => ITEMS[cat].find((x) => x.id === id);
  function me(ctx, expr = 'normal') {
    const st = ctx.st;
    if (!ctx.live) return A.animal(st.kind, st.fur, expr);
    const cap = st.equip.cap && itemOf('cap', st.equip.cap);
    const gog = st.equip.goggle && itemOf('goggle', st.equip.goggle);
    const suit = st.equip.suit && itemOf('suit', st.equip.suit);
    const fin = st.equip.fin && itemOf('fin', st.equip.fin);
    return A.animal(st.kind, st.fur, expr, { cap: cap && cap.cap, goggle: gog && gog.goggle, suit: suit && suit.suit, fin: fin && fin.fin });
  }

  function swim(ctx) {
    const st = ctx.st;
    const g = (cat, key) => { const it = st.equip[cat] && itemOf(cat, st.equip[cat]); return it ? it[key] : null; };
    return A.floater(st.kind, st.fur, { cap: g('cap', 'cap'), goggle: g('goggle', 'goggle'), suit: g('suit', 'suit'), fin: g('fin', 'fin') });
  }

  // ---------- 빌더: 피그마 오토레이아웃 → CSS flex ----------
  const ALIGN = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', SPACE_BETWEEN: 'space-between' };
  const rgba = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
  function sizing(el, parent, o) {
    el.style.flex = 'none';
    const pd = parent && parent.dataset ? parent.dataset.dir : null;
    if (o.fillW) { if (pd === 'H') { el.style.flex = '1 1 0'; el.style.minWidth = '0'; } else el.style.alignSelf = 'stretch'; }
    if (o.grow) { el.style.flex = `${o.grow === true ? 1 : o.grow} 1 0`; el.style.minWidth = '0'; el.style.minHeight = '0'; }
  }
  function al(parent, dir, o = {}) {
    const d = document.createElement('div');
    d.className = 'al' + (o.cls ? ' ' + o.cls : '');
    d.dataset.dir = dir;
    if (o.name) d.dataset.name = o.name;
    const s = d.style;
    s.flexDirection = dir === 'V' ? 'column' : 'row';
    s.alignItems = ALIGN[o.align || 'MIN'];
    s.justifyContent = ALIGN[o.justify || 'MIN'];
    if (o.gap > 0) s.gap = o.gap + 'px';
    if (o.pad) { const p = o.pad; const [t, r, b, l] = p.length === 2 ? [p[0], p[1], p[0], p[1]] : p; s.padding = `${t}px ${r}px ${b}px ${l}px`; }
    if (o.fill) s.background = o.fill.startsWith('linear') ? o.fill : (o.op != null ? rgba(o.fill, o.op) : o.fill);
    if (o.radius) s.borderRadius = o.radius + 'px';
    if (o.stroke) s.boxShadow = `inset 0 0 0 ${o.sw || 1}px ${o.stroke}`;
    if (o.w) s.width = o.w + 'px';
    if (o.h) s.height = o.h + 'px';
    if (o.clip) s.overflow = 'hidden';
    if (parent) { parent.appendChild(d); sizing(d, parent, o); }
    if (o.gap < 0) d.dataset.overlap = o.gap;
    return d;
  }
  function txt(parent, s, k, color, o = {}) {
    const t = document.createElement('div');
    t.className = 'tx ts-' + k;
    t.textContent = s;
    t.style.color = color;
    if (o.size) { t.style.fontSize = o.size + 'px'; t.style.lineHeight = Math.round(o.size * 1.3) + 'px'; }
    if (o.weight) t.style.fontWeight = o.weight;
    if (o.align) t.style.textAlign = o.align;
    parent.appendChild(t);
    sizing(t, parent, o);
    t.style.whiteSpace = o.fillW ? 'pre-wrap' : 'pre';
    return t;
  }
  function art(parent, svg, w, o = {}) {
    const d = document.createElement('div');
    d.className = 'art';
    d.style.width = w + 'px';
    if (o.opacity != null) d.style.opacity = o.opacity;
    d.innerHTML = svg;
    if (parent) { parent.appendChild(d); sizing(d, parent, o); }
    return d;
  }
  function abs(parent, child, x, y, right) {
    child.style.position = 'absolute';
    if (right != null) child.style.right = right + 'px'; else child.style.left = x + 'px';
    child.style.top = y + 'px';
    if (child.parentNode !== parent) parent.appendChild(child);
    return child;
  }
  function dot(parent, size, color, o = {}) {
    const e = document.createElement('div');
    e.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;background:${color};flex:none;${o.stroke ? `box-shadow:inset 0 0 0 ${o.sw || 1}px ${o.stroke};` : ''}${o.opacity != null ? `opacity:${o.opacity};` : ''}`;
    parent.appendChild(e);
    return e;
  }
  function applyOverlaps(root) {
    root.querySelectorAll('[data-overlap]').forEach((el) => {
      const g = +el.dataset.overlap; const horiz = el.dataset.dir === 'H';
      [...el.children].forEach((c, i) => { if (i > 0) c.style[horiz ? 'marginLeft' : 'marginTop'] = g + 'px'; });
    });
  }
  // 앱에서만 누를 수 있게
  let CTX = null;
  function tap(el, fn, label) {
    if (!CTX || !CTX.live) return el;
    el.classList.add('tappable');
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    if (label) el.setAttribute('aria-label', label);
    el.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
    return el;
  }

  // ---------- 공통 컴포넌트 ----------
  function screen(id, opts = {}) {
    const s = al(null, 'V', { cls: 'screen', fill: opts.fill || C.bg });
    s.id = 'screen-' + id;
    if (opts.status !== false) statusBar(s);
    return s;
  }
  function statusBar(parent, absolute) {
    const b = al(parent, 'H', { name: 'StatusBar', justify: 'SPACE_BETWEEN', align: 'CENTER', pad: [14, 24, 6, 28], w: 390, h: 44, cls: 'statusbar' });
    txt(b, '9:41', 'CM', C.ink);
    art(b, P.icon.status, 66);
    if (absolute) abs(parent, b, 0, 0);
    return b;
  }
  const TAB_ROUTE = { '홈': 'home', '꾸미기': 'dress', '우리 수영장': 'pool', '도감': 'dex' };
  function tabBar(parent, active) {
    const t = al(parent, 'H', { name: 'TabBar', cls: 'tabbar', justify: 'SPACE_BETWEEN', pad: [10, 12, 26, 12], fill: C.card, w: 390, h: 84 });
    t.style.borderTop = `1px solid ${C.line}`;
    for (const k of Object.keys(P.tab)) {
      const col = k === active ? C.primary : C.mute;
      const it = al(t, 'V', { gap: 4, align: 'CENTER', grow: true, cls: 'tab-item' });
      it.dataset.tab = k;
      art(it, P.tab[k](col), 24);
      txt(it, k, 'L', col);
      tap(it, () => CTX.go(TAB_ROUTE[k]), k);
    }
    abs(parent, t, 0, 760);
    return t;
  }
  // 콘텐츠 영역: 앱에서는 세로 스크롤
  function content(parent, pad, gap) {
    const c = al(parent, 'V', { name: 'content', gap, pad, fillW: true });
    if (CTX && CTX.live) { c.style.flex = '1 1 0'; c.style.minHeight = '0'; c.style.overflowY = 'auto'; c.classList.add('scroll'); }
    return c;
  }
  function progress(parent, pct, col, track) {
    const tr = al(parent, 'H', { name: 'progress', fill: track, radius: 5, fillW: true, h: 10 });
    const f = al(tr, 'H', { fill: col, radius: 5, grow: pct }); f.style.alignSelf = 'stretch';
    const r = al(tr, 'H', { grow: 100 - pct }); r.style.alignSelf = 'stretch';
    return tr;
  }
  function pill(parent, text, fill, color, k = 'L', pad = [3, 8]) { const p = al(parent, 'H', { pad, fill, radius: 999 }); txt(p, text, k, color); return p; }
  function cta(parent, label, fn) { const b = al(parent, 'H', { name: 'cta', fill: C.btn, radius: 16, align: 'CENTER', justify: 'CENTER', fillW: true, h: 54, cls: 'btn' }); txt(b, label, 'H', '#FFFFFF'); if (fn) tap(b, fn, label); return b; }
  function steps(parent, n) { const p = al(parent, 'H', { name: 'steps', gap: 6, fillW: true }); for (let i = 0; i < 3; i++) al(p, 'H', { fill: i < n ? C.btn : C.line, radius: 3, h: 5, grow: true }); return p; }
  function divider(row, i) { if (i > 0) row.style.borderTop = '1px solid #EEF2F8'; }
  function iconBtn(parent, svg, w, fn, label) { const b = art(parent, svg, w); tap(b, fn, label); return b; }
  const tagTone = (tone) => ({ shine: [G.shine, C.primary], rainbow: [G.rainbow, C.ink], limited: [C.pinkL, C.coral] }[tone] || [C.line, C.sub]);

  // 진주 수 표시 (아이콘 + 숫자)
  function pearlTag(parent, n, o = {}) {
    const p = al(parent, 'H', { gap: 3, pad: o.pad || [3, 8], fill: o.fill || C.paleBlue, radius: 999, align: 'CENTER' });
    art(p, P.icon.pearl, o.icon || 12); txt(p, typeof n === 'number' ? n.toLocaleString() : n, o.k || 'L', o.color || C.ink);
    return p;
  }
  // 우리 수영장 바닷길: 왼쪽 출발 → 오른쪽 고래섬, 지나온 섬은 진하게
  function routeSvg(at, w = 318) {
    const x0 = 16, step = (w - 34) / ISLANDS.length, y = 34;
    const px = x0 + step * Math.min(at, ISLANDS.length);
    let g = `<rect x="0" y="12" width="${w}" height="46" rx="14" fill="#BFE6FF"/><path d="M8 22c10-4 20 4 30 0s20-4 30 0 20 4 30 0 20-4 30 0 20 4 30 0 20-4 30 0 20 4 30 0 20-4 30 0 20 4 30 0 20-4 30 0" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="2" fill="none"/>`;
    g += `<path d="M${x0} ${y}H${w - 18}" stroke="#7FB6E8" stroke-width="2.5" stroke-dasharray="2 6" stroke-linecap="round"/><path d="M${x0} ${y}H${px}" stroke="#456AFF" stroke-width="3.5" stroke-linecap="round"/>`;
    g += `<circle cx="${x0}" cy="${y}" r="5" fill="#FFFFFF" stroke="#456AFF" stroke-width="2.5"/>`;
    ISLANDS.forEach((n, i) => {
      const x = x0 + step * (i + 1), done = at >= i + 1;
      g += `<path d="M${x - 15} ${y + 6}c3-12 9-17 15-17s12 5 15 17z" fill="${done ? '#F4D58A' : '#E9F2FA'}" stroke="${done ? '#D8AE52' : '#B9CCE0'}" stroke-width="1.5"/>`;
      g += `<path d="M${x - 2} ${y - 9}v-9" stroke="${done ? '#3FA65A' : '#B9CCE0'}" stroke-width="2" stroke-linecap="round"/><path d="M${x - 2} ${y - 18}c-5-1-8 1-9 4M${x - 2} ${y - 18}c5-1 8 1 9 4" stroke="${done ? '#3FA65A' : '#B9CCE0'}" stroke-width="2" stroke-linecap="round" fill="none"/>`;
      g += `<text x="${x}" y="${y + 38}" text-anchor="middle" font-size="11" font-weight="700" fill="${done ? '#0F2A43' : '#9DB2C7'}">${n}</text>`;
    });
    g += `<g transform="translate(${px - 9} ${y - 22})"><path d="M9 0v16" stroke="#0F2A43" stroke-width="2"/><path d="M9 1h11l-4 4 4 4H9z" fill="#FF7A6B"/><circle cx="9" cy="20" r="5" fill="#456AFF" stroke="#FFFFFF" stroke-width="2"/></g>`;
    return `<svg viewBox="0 0 ${w} 78" xmlns="http://www.w3.org/2000/svg" font-family="inherit">${g}</svg>`;
  }

  const S = {};

  // ---------- 00-0 스플래시 ----------
  S['00-0'] = (ctx) => {
    const s = screen('00-0', { status: false, fill: G.splash });
    s.style.justifyContent = 'center'; s.style.alignItems = 'center'; s.style.gap = '10px';
    art(s, P.scene.bubbles, 60);
    txt(s, '우수꾸', 'D', C.ink, { size: 48, weight: 800 });
    txt(s, '우리 수영장 꾸미자', 'BM', C.sub);
    al(s, 'V', { h: 40 });
    const line = al(s, 'H', { gap: -8, align: 'MAX', name: 'character-lineup', cls: 'lineup' });
    [['hamster', 'default', 72], ['sheep', 'default', 78], ['rabbit', 'white', 92], ['bear', 'default', 76], ['cat', 'white', 74]].forEach(([k, f, w]) => art(line, A.animal(k, f), w));
    al(s, 'V', { h: 30 });
    const ld = al(s, 'H', { gap: 6, align: 'CENTER', cls: 'loader' }); [1, 0.6, 0.3].forEach((o) => dot(ld, 7, C.btn, { opacity: o }));
    txt(s, '물과 친해지는 중…', 'CR', C.sub);
    tap(s, () => ctx.go(ctx.st.onboarded ? 'home' : 'intro'), '시작하기');
    return s;
  };

  // ---------- 00-0b 인트로 · 로그인 ----------
  S['00-0b'] = (ctx) => {
    const s = screen('00-0b');
    const ill = al(s, 'V', { name: 'intro-illustration', fill: C.sky, fillW: true, h: 360, clip: true });
    abs(ill, art(null, P.scene.introPool, 390), 0, 0);
    [['sheep', 'default', 'normal', 72, 22], ['hamster', 'default', 'puff', 70, 94], ['rabbit', 'white', 'normal', 92, 158], ['bear', 'default', 'normal', 74, 240], ['cat', 'default', 'puff', 72, 304]]
      .forEach(([k, f, e, w, x], i) => abs(ill, art(null, A.animal(k, f, e), w), x, 232 - w * 1.3).classList.add('bob', 'b' + i));
    const b = al(s, 'V', { name: 'content', gap: 10, pad: [28, 24, 34, 24], fillW: true, grow: true });
    txt(b, '물이 무서운 친구들이\n수영장에 등록했어요', 'T', C.ink, { fillW: true, size: 24 });
    txt(b, '내 수영 기록만큼 친구들도 조금씩 물과 친해져요.\n킥판을 졸업하는 그날까지, 같이 헤엄쳐요.', 'BR', C.sub, { fillW: true });
    al(b, 'V', { fillW: true, grow: true });
    const start = () => ctx.go('pick');
    if (ctx.live) {
      // 혼자 모드: 로그인 없이 시작해요. 로그인은 친구와 함께하기를 열 때 붙여요.
      cta(b, '시작하기', start);
      const e = al(b, 'H', { align: 'CENTER', justify: 'CENTER', fillW: true, h: 40 }); txt(e, '기록과 꾸미기는 이 폰에 저장돼요', 'CM', C.sub);
      return s;
    }
    const k = al(b, 'H', { gap: 8, fill: '#FEE500', radius: 16, align: 'CENTER', justify: 'CENTER', fillW: true, h: 54, cls: 'btn' }); art(k, P.icon.kakao, 20); txt(k, '카카오로 시작하기', 'BM', '#191919'); tap(k, start, '카카오로 시작하기');
    const a = al(b, 'H', { gap: 8, fill: '#111111', radius: 16, align: 'CENTER', justify: 'CENTER', fillW: true, h: 54, cls: 'btn' }); art(a, P.icon.apple, 18); txt(a, 'Apple로 계속하기', 'BM', '#FFFFFF'); tap(a, start, 'Apple로 계속하기');
    const e = al(b, 'H', { align: 'CENTER', justify: 'CENTER', fillW: true, h: 40 }); txt(e, '이메일로 시작하기', 'CM', C.sub); tap(e, start, '이메일로 시작하기');
    return s;
  };

  // ---------- 00 캐릭터 선택 ----------
  S['00'] = (ctx) => {
    const st = ctx.st;
    const s = screen('00');
    const b = al(s, 'V', { name: 'content', gap: 14, pad: [10, 20, 34, 20], fillW: true, grow: true });
    steps(b, 1);
    const tt = al(b, 'V', { gap: 6, fillW: true });
    txt(tt, '함께 수영할 친구를\n골라주세요', 'T', C.ink, { fillW: true });
    txt(tt, '수모, 수경, 수영복은 언제든 바꿀 수 있어요', 'CR', C.sub, { fillW: true });
    const pv = al(b, 'V', { name: 'preview', gap: 8, pad: [14, 16], fill: C.sky, radius: 24, align: 'CENTER', fillW: true });
    art(pv, A.animal(st.kind, st.fur), 110).classList.add('pop');
    pill(pv, `${furName(st.fur)} ${animalName(st.kind)}`.trim(), C.card, C.ink, 'CM', [4, 12]);
    const pick = al(b, 'H', { name: 'animal-pick', gap: 6, fillW: true });
    ANIMALS.forEach(([k, l]) => {
      const sel = k === st.kind;
      const o = al(pick, 'V', { gap: 2, pad: [8, 4], fill: '#EAF5FF', radius: 16, align: 'CENTER', grow: true, stroke: sel ? C.btn : C.line, sw: sel ? 2.5 : 1 });
      art(o, A.animal(k, ctx.live ? st.fur : (sel ? 'white' : 'default')), 50);
      txt(o, l, 'CM', sel ? C.ink : C.sub);
      tap(o, () => ctx.act('setKind', k), l);
    });
    const fur = al(b, 'V', { gap: 10, fillW: true });
    txt(fur, '털 색', 'CM', C.ink);
    const sw = al(fur, 'H', { gap: 12 });
    FURS.forEach(([c, n]) => { const sel = c === st.fur; const d = dot(sw, 32, c, { stroke: sel ? C.navy : (c === '#FFFFFF' ? '#C9D6E3' : c), sw: sel ? 3 : 1 }); tap(d, () => ctx.act('setFur', c), n + ' 털'); });
    const nm = al(b, 'V', { gap: 8, fillW: true });
    txt(nm, '캐릭터 이름', 'CM', C.ink);
    const field = al(nm, 'H', { pad: [0, 16], fill: C.card, radius: 14, stroke: C.btn, sw: 1.5, align: 'CENTER', fillW: true, h: 50 });
    if (ctx.live) {
      const inp = document.createElement('input');
      inp.className = 'tx ts-BM name-input'; inp.value = st.name; inp.maxLength = 12; inp.setAttribute('aria-label', '캐릭터 이름');
      inp.addEventListener('input', () => ctx.act('setName', inp.value, true));
      field.appendChild(inp); inp.style.flex = '1 1 0';
    } else txt(field, st.name, 'BM', C.ink);
    txt(nm, '수영장 친구들에게 보이는 이름이에요', 'CR', C.sub);
    al(b, 'V', { fillW: true, grow: true });
    cta(b, '다음', () => ctx.go('pool-pick'));
    return s;
  };

  // ---------- 00-2 수영장 선택 ----------
  S['00-2'] = (ctx) => {
    const st = ctx.st;
    const s = screen('00-2');
    const b = al(s, 'V', { name: 'content', gap: 14, pad: [10, 20, 34, 20], fillW: true, grow: true });
    const top = al(b, 'H', { gap: 8, align: 'CENTER', fillW: true });
    if (ctx.live) iconBtn(top, P.icon.back, 22, () => ctx.go('pick'), '뒤로');
    steps(top, 2).style.flex = '1 1 0';
    const tt = al(b, 'V', { gap: 4, fillW: true });
    txt(tt, '자주 다니는 수영장을 골라주세요', 'T', C.ink, { fillW: true });
    txt(tt, '현재 위치에서 가까운 수영장이에요.\n위치는 수영장 찾기와 체크인에만 써요.', 'CR', C.sub, { fillW: true });
    const sr = al(b, 'H', { gap: 8, pad: [0, 14], fill: C.card, radius: 14, stroke: C.line, align: 'CENTER', fillW: true, h: 46 });
    art(sr, P.icon.search, 18); txt(sr, '수영장 이름이나 동네로 검색', 'BR', C.mute);
    const map = al(b, 'V', { name: 'map', radius: 20, fillW: true, h: 180, clip: true });
    abs(map, art(null, P.scene.map, 350), 0, 0);
    abs(map, (() => { const c = al(null, 'H', { gap: 4, pad: [5, 10], fill: C.navy, radius: 999, align: 'CENTER' }); txt(c, POOLS[st.pool][0], 'L', '#FFFFFF'); return c; })(), 228, 30);
    abs(map, (() => { const c = al(null, 'H', { fill: C.card, radius: 18, w: 36, h: 36, align: 'CENTER', justify: 'CENTER' }); art(c, P.icon.locate, 18); return c; })(), 302, 132);
    const list = al(b, 'V', { gap: 8, fillW: true });
    POOLS.slice(0, 3).forEach(([n, meta, mem], i) => {
      const sel = i === st.pool;
      const r = al(list, 'H', { gap: 12, pad: [12, 14], fill: C.card, radius: 16, align: 'CENTER', fillW: true, stroke: sel ? C.btn : C.line, sw: sel ? 2 : 1 });
      const ic = al(r, 'H', { fill: sel ? C.soft : C.paleBlue, radius: 12, w: 40, h: 40, align: 'CENTER', justify: 'CENTER' }); art(ic, P.icon.wave(sel ? C.primary : C.mute), 20);
      const col = al(r, 'V', { gap: 2, grow: true });
      const t = al(col, 'H', { gap: 6, align: 'CENTER' }); txt(t, n, 'BM', C.ink); pill(t, `우수꾸 멤버 ${mem}명`, sel ? C.soft : C.paleBlue, sel ? C.primary : C.sub, 'L', [2, 6]);
      txt(col, meta, 'CR', C.sub);
      const rd = al(r, 'H', { fill: sel ? C.btn : C.card, stroke: sel ? null : C.mute, sw: 1.5, radius: 11, w: 22, h: 22, align: 'CENTER', justify: 'CENTER' });
      if (sel) dot(rd, 8, '#FFFFFF');
      tap(r, () => ctx.act('setPool', i), n);
    });
    const add = al(b, 'H', { gap: 4, align: 'CENTER' }); txt(add, '찾는 수영장이 없나요?', 'CR', C.sub); const reg = txt(add, '직접 등록하기', 'CM', C.primary); tap(reg, () => ctx.act('toast', '수영장 직접 등록은 곧 열려요'), '직접 등록하기');
    al(b, 'V', { fillW: true, grow: true });
    cta(b, `${POOLS[st.pool][0]}으로 시작하기`, () => ctx.act('finishOnboarding'));
    return s;
  };

  // ---------- 01 오늘의 진주 ----------
  // 앱에서 '오늘의 진주' 카드에 보일 내용. ctx.today = { status, summary, pending } (js/main.js)
  // 홈 요약 줄: 이번 주 N번째 수영 · M주 연속 기록 중
  function weekLine(ctx) {
    const s = myStats(ctx);
    if (!s.week) return s.streak ? `이번 주 첫 수영을 기다려요 · ${s.streak}주 연속 기록 중` : '이번 주 첫 수영을 기다려요';
    return s.streak >= 2 ? `이번 주 ${s.week}번째 수영 · ${s.streak}주 연속 기록 중` : `이번 주 ${s.week}번째 수영`;
  }
  function todayView(ctx) {
    const t = ctx.today || { status: 'loading' };
    const L = ctx.ledger || { swims: [], meters: 0, pearls: 0, bonus: false };
    const sum = t.summary, p = t.pending;
    const android = ctx.platform === 'android', ios = ctx.platform === 'ios';
    const swims = sum ? sum.swims : [];
    const last = swims.length ? new Date(swims[swims.length - 1].end) : null;
    const go = (name) => () => ctx.act(name);
    const recheck = ['다시 확인하기', go('recheck')];
    const settings = ['설정 열기', go('openHealthSettings')];
    const v = {
      date: dateLabel() + (last ? ` · ${timeLabel(last)}` : ''),
      headline: swims.length ? '오늘의 수영 완료!' : '오늘의 수영',
      stats: [
        ['거리', sum && sum.meters > 0 ? sum.meters.toLocaleString() + 'm' : '-', C.ink],
        ['시간', swims.length ? sum.minutes + '분' : '-', C.ink],
        ['100m 평균', sum && sum.meters > 0 ? sum.pace100 : '-', C.primary],
      ],
      badge: android ? '갤럭시워치 기록' : 'Apple Watch 기록',
      tags: [], actions: [], wiggle: false, heroTap: null,
    };
    const set = (o) => Object.assign(v, o);
    switch (t.status) {
      case 'ok':
        if (p && p.swims.length) {
          const again = L.swims.length > 0;
          const sync = go('sync');
          set({ title: again ? '새 수영 기록이 도착했어요' : '오늘 기록이 도착했어요', wiggle: true, heroTap: sync, cta: ['진주 받기', sync] });
          v.tags.push([`${p.raw.toLocaleString()}m → ${again ? '+' : ''}${p.pearls}`, C.ink]);
          if (p.bonus) v.tags.push([`첫 수영 +${p.bonus}`, C.coral]);
          v.sub = p.capped ? '하루 최대 5km까지 진주를 받아요' : p.noDistance.length ? `거리가 없는 기록 ${p.noDistance.length}개는 빼고 받아요` : '100m마다 진주 1개 · 그날 첫 수영은 보너스';
        } else {
          set({ title: `진주 ${L.pearls}개를 받았어요`, sub: L.meters >= 5000 ? '오늘은 5km를 다 채웠어요 · 내일 또 만나요' : '내일 또 헤엄치면 진주가 쌓여요', cta: ['진주 쓰러 가기', () => ctx.go('dress')] });
          v.tags.push([`${L.meters.toLocaleString()}m → ${Math.floor(L.meters / PEARL_PER)}`, C.ink]);
          if (L.bonus) v.tags.push([`첫 수영 +${FIRST_BONUS}`, C.coral]);
        }
        break;
      case 'idle': {
        const sync = go('sync');
        set({ title: '워치 기록을 받아 볼까요?', sub: android ? '갤럭시워치 기록을 Health Connect에서 읽어 와요' : 'Apple Watch 기록을 건강 앱에서 읽어 와요', wiggle: true, heroTap: sync, cta: ['워치 기록 받기', sync] });
        break;
      }
      case 'loading':
        set({ title: '기록을 확인하는 중…', sub: '잠시만 기다려 주세요', wiggle: true, cta: ['워치 기록 받기', go('sync')] });
        break;
      case 'none':
        set({ title: '오늘은 아직 수영 기록이 없어요', sub: ios ? '워치로 수영을 기록하면 여기로 들어와요\n기록했는데 안 보이면 건강 앱 권한을 확인해 주세요' : '워치로 수영을 기록하면 여기로 들어와요', actions: ios ? [recheck, ['권한 확인', go('openHealthSettings')]] : [recheck], cta: recheck });
        break;
      case 'no-distance': {
        const n = (p && p.noDistance.length) || swims.filter((x) => !(x.meters > 0)).length;
        const min = Math.round((p ? p.noDistance : swims).reduce((s, x) => s + x.minutes, 0));
        v.stats[0][1] = sum && sum.meters > 0 ? v.stats[0][1] : '-';
        set({ title: '거리를 받지 못했어요', sub: `수영 ${n}번 · ${min}분은 받았지만 거리가 없어서\n진주는 드리지 못해요. 워치에 거리가 기록됐는지 확인해 주세요`, actions: [recheck], cta: recheck });
        break;
      }
      case 'denied':
        set({ title: '건강 기록을 읽을 수 없어요', sub: android ? 'Health Connect > 앱 권한 > 우수꾸에서\n운동 · 거리 읽기를 허용해 주세요' : '설정 > 개인정보 보호 및 보안 > 건강 > 우수꾸에서\n운동 · 수영 거리를 켜 주세요', actions: [settings], cta: settings });
        break;
      case 'update-required': {
        const install = ['설치하러 가기', go('installHealthConnect')];
        set({ title: 'Health Connect가 필요해요', sub: '갤럭시워치 기록은 삼성 헬스 → Health Connect로 들어와요\nHealth Connect를 설치하거나 업데이트해 주세요', actions: [install], cta: install });
        break;
      }
      case 'unsupported':
        set({ title: '이 기기에서는 수영 기록을 못 읽어요', sub: android ? 'Health Connect를 쓸 수 없는 기기예요' : '건강 앱을 쓸 수 없는 기기예요', cta: recheck });
        break;
      case 'link-off':
        set({ title: '삼성 헬스 연동을 켜 주세요', sub: '삼성 헬스 > 설정 > Health Connect에서 연동을 켜고\n삼성 계정 동기화도 켜 주세요', actions: [recheck, ['Health Connect 열기', go('openHealthSettings')]], cta: recheck });
        break;
      default:
        set({ title: '기록을 읽지 못했어요', sub: '잠시 뒤에 다시 확인해 주세요', actions: [recheck], cta: recheck });
    }
    return v;
  }
  S['01'] = (ctx) => {
    const st = ctx.st;
    const s = screen('01');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const v = ctx.live ? todayView(ctx) : null;
    const hl = al(h, 'V', { gap: 2 }); txt(hl, v ? v.date : '10월 22일 목요일 · 새벽 6:40', 'CR', C.sub); txt(hl, v ? v.headline : '오늘의 수영 완료!', 'T', C.ink);
    const hr = al(h, 'H', { gap: 8, align: 'CENTER' });
    pearlTag(hr, st.pearls, { k: 'CM', icon: 16, pad: [6, 10], fill: C.card });
    if (ctx.live) { const av = al(hr, 'H', { fill: C.sky, radius: 18, w: 36, h: 36, align: 'CENTER', justify: 'CENTER', clip: true }); art(av, me(ctx), 38).style.marginTop = '10px'; tap(av, () => ctx.go('menu'), '전체 메뉴'); }
    const sum = al(b, 'V', { gap: 12, pad: [18, 18], fill: C.card, radius: 20, fillW: true });
    const stats = al(sum, 'H', { justify: 'SPACE_BETWEEN', fillW: true });
    (v ? v.stats : [['거리', TODAY.m.toLocaleString() + 'm', C.ink], ['시간', TODAY.min + '분', C.ink], ['100m 평균', TODAY.pace, C.primary]]).forEach(([l, v, c]) => { const x = al(stats, 'V', { gap: 2, grow: true }); txt(x, l, 'CR', C.sub); txt(x, v, 'H', c); });
    const wk = al(sum, 'H', { gap: 6, align: 'CENTER', fillW: true }); art(wk, P.icon.wave(), 16); txt(wk, ctx.live ? weekLine(ctx) : '이번 주 3번째 수영 · 4주 연속 기록 중', 'CM', C.primary);
    // 오늘의 진주 카드: 시안은 '기록 도착' 그대로, 앱은 상황(todayView)에 맞춰
    const hv = v || { badge: 'Apple Watch 기록', title: '오늘 기록이 도착했어요', tags: [[`${TODAY.m.toLocaleString()}m → ${Math.floor(TODAY.m / PEARL_PER)}`, C.ink], [`첫 수영 +${FIRST_BONUS}`, C.coral]], sub: '100m마다 진주 1개 · 그날 첫 수영은 보너스', actions: [] };
    const hero = al(b, 'V', { name: 'today-pearl', gap: 8, pad: [18, 20, 20, 20], fill: G.special, radius: 24, align: 'CENTER', fillW: true });
    pill(hero, hv.badge, '#FFFFFF', C.primary, 'L', [5, 10]);
    const clam = art(hero, P.item.clam, 130); if (hv.wiggle) clam.classList.add('wiggle');
    txt(hero, hv.title, 'H', C.ink, { align: 'center' });
    if (hv.tags.length) { const br = al(hero, 'H', { gap: 6, align: 'CENTER' }); hv.tags.forEach(([t, c]) => pearlTag(br, t, { fill: '#FFFFFF', color: c })); }
    txt(hero, hv.sub, 'CR', C.sub, { align: 'center' });
    if (hv.actions.length) {
      const ar = al(hero, 'H', { gap: 6, align: 'CENTER', name: 'today-actions' });
      hv.actions.forEach(([l, fn], i) => tap(pill(ar, l, i ? '#FFFFFF' : C.btn, i ? C.primary : '#FFFFFF', 'CM', [7, 12]), fn, l));
    }
    if (hv.heroTap) tap(hero, hv.heroTap, '진주 받기');
    // 우리 수영장 바닷길에 보탠 거리
    const km = todayKm(ctx);
    const r = ctx.live ? myRoute(ctx) : route(st.pool, km);
    const rc = al(b, 'V', { gap: 8, pad: [14, 16], fill: C.card, radius: 20, fillW: true });
    const rt = al(rc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    txt(rt, ctx.live ? (km > 0 ? `나의 바닷길에 ${km.toFixed(2)}km를 보탰어요` : '나의 바닷길') : '우리 수영장 바닷길', 'BM', C.ink); art(rt, P.icon.chev(), 18);
    art(rc, routeSvg(r.at, 310), 310);
    txt(rc, ctx.live ? (r.done ? '고래섬까지 모두 왔어요 · 다음 바다는 곧 열려요' : `${r.nextName}까지 ${km1(r.left)}km · 섬에 닿으면 진주 30개`) : `${r.nextName}까지 ${Math.ceil(r.left)}km · 섬에 닿으면 모두 진주 30개`, 'CR', C.sub);
    tap(rc, () => ctx.go('pool'), ctx.live ? '나의 바닷길' : '우리 수영장 바닷길');
    // 진주로 살 수 있는 것
    txt(b, '진주로 살 수 있어요', 'CM', C.sub);
    const items = al(b, 'H', { gap: 10, fillW: true });
    [['cap', 'whale'], ['goggle', 'otter'], ['fin', 'blue']].forEach(([cat, id]) => {
      const it = itemOf(cat, id); const own = st.owned.includes(cat + ':' + id);
      const c = al(items, 'V', { gap: 6, pad: [12, 8], fill: C.card, radius: 16, align: 'CENTER', grow: true });
      art(c, it.svg, 44); txt(c, it.name, 'CM', C.ink);
      if (own) pill(c, '보유', C.soft, C.primary); else pearlTag(c, it.price, { fill: st.pearls >= it.price ? C.soft : '#F3F6F9', color: st.pearls >= it.price ? C.primary : C.mute });
      tap(c, () => { ctx.act('setTab', cat); ctx.go('dress'); }, it.name);
    });
    if (v) cta(b, v.cta[0], v.cta[1]); else cta(b, '진주 받기');
    tabBar(s, '홈');
    return s;
  };

  // ---------- 02 꾸미기 ----------
  const CAT_TABS = [['cap', '수모'], ['goggle', '수경'], ['suit', '수영복'], ['fin', '오리발'], ['friend', '바다 친구']];
  S['02'] = (ctx) => {
    const st = ctx.st;
    const s = screen('02');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(h, '꾸미기', 'T', C.ink);
    const hr = al(h, 'H', { gap: 6, align: 'CENTER' });
    if (ctx.live) tap(pill(hr, 'MY POOL', C.navy, '#FFFFFF', 'CM', [6, 10]), () => ctx.go('mypool'), 'MY POOL로 가기');
    pearlTag(hr, st.pearls, { k: 'CM', icon: 16, pad: [6, 10], fill: C.card });
    const stage = al(b, 'V', { name: 'stage', gap: 10, pad: [20, 16, 16, 16], fill: C.sky, radius: 24, align: 'CENTER', fillW: true });
    const row = al(stage, 'H', { gap: 6, align: 'MAX' });
    art(row, me(ctx), 100).classList.add('pop');
    const trail = al(row, 'H', { align: 'CENTER', pad: [0, 0, 30, 0], cls: 'trail' });
    const sizes = [34, 30, 38];
    st.follow.forEach((k, i) => art(trail, A.sea(k), sizes[i] || 32));
    pill(stage, st.follow.length ? `바다 친구 ${st.follow.length}마리가 줄지어 따라와요` : '따라올 바다 친구를 골라주세요', C.card, C.ink, 'CM', [5, 12]);
    const tab = ctx.live ? st.tab : 'cap';
    const chips = al(b, 'H', { gap: 8, fillW: true });
    CAT_TABS.forEach(([k, c]) => { const on = k === tab; const ch = al(chips, 'H', { pad: [7, 12], radius: 999, fill: on ? C.navy : C.card, stroke: on ? null : C.line }); txt(ch, c, 'CM', on ? '#FFFFFF' : C.sub); tap(ch, () => ctx.act('setTab', k), c); });
    // 카드 목록
    let cards;
    if (tab === 'friend') {
      cards = Object.keys(SEA).filter((k) => st.friends.includes(k)).map((k) => {
        const on = st.follow.includes(k);
        return { svg: A.sea(k), name: SEA[k][0], tag: on ? '따라오는 중' : '쉬는 중', tf: on ? C.btn : C.line, tc: on ? '#FFFFFF' : C.sub, sel: on, fn: () => ctx.act('toggleFollow', k) };
      });
    } else {
      cards = ITEMS[tab].map((it) => {
        const owned = st.owned.includes(tab + ':' + it.id);
        const on = st.equip[tab] === it.id;
        const base = { svg: it.svg, name: it.name, sel: on, fn: () => ctx.act('equip', tab, it.id) };
        if (on) return { ...base, tag: '착용 중', tf: C.btn, tc: '#FFFFFF' };
        if (owned) return { ...base, tag: '보유', tf: C.soft, tc: C.primary };
        if (it.reward) { const [tf, tc] = tagTone(it.tone); return { ...base, locked: true, tag: rewardLabel(ctx, tab, it), tf, tc }; }
        return { ...base, price: it.price, afford: st.pearls >= it.price };
      });
    }
    const grid = al(b, 'V', { gap: 10, fillW: true });
    for (let r = 0; r < Math.ceil(cards.length / 3); r++) {
      const rw = al(grid, 'H', { gap: 10, fillW: true });
      for (let c = 0; c < 3; c++) {
        const it = cards[r * 3 + c];
        if (!it) { al(rw, 'V', { grow: true }); continue; }
        const card = al(rw, 'V', { gap: 6, pad: [12, 6], fill: C.card, radius: 16, align: 'CENTER', grow: true, stroke: it.sel ? C.btn : null, sw: 2 });
        art(card, it.svg, 46, { opacity: it.locked ? 0.35 : null });
        txt(card, it.name, 'CM', it.locked ? C.mute : C.ink);
        if (it.price != null) pearlTag(card, it.price, { fill: it.afford ? C.soft : '#F3F6F9', color: it.afford ? C.primary : C.mute });
        else pill(card, it.tag, it.tf, it.tc);
        tap(card, it.fn, it.name);
      }
    }
    const bn = al(b, 'H', { name: 'collab-banner', gap: 12, pad: [14, 16], fill: G.banner, radius: 18, align: 'CENTER', fillW: true });
    const bt = al(bn, 'V', { gap: 2, grow: true }); txt(bt, '진주로 못 사는 아이템도 있어요', 'BM', C.ink); txt(bt, ctx.live ? '섬 도착 · 연속 기록 · 이번 달 목표 보상' : '섬 도착 · 수영장 대결 · 강습반 목표 보상', 'CR', C.sub);
    art(bn, P.icon.chev(C.coral), 24);
    tap(bn, () => ctx.go('pool'), '우리 수영장 보상 보기');
    tabBar(s, '꾸미기');
    return s;
  };

  // ---------- 03 우리 수영장 ----------
  S['03'] = (ctx) => {
    const st = ctx.st;
    const s = screen('03');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 });
    const lab = al(hl, 'H', { gap: 3, align: 'CENTER' }); txt(lab, '우리 수영장', 'CR', C.sub);
    if (ctx.live) { const g = iconBtn(lab, P.icon.gearS(C.sub), 14, () => ctx.go('pool-set'), '내 수영장 설정'); g.classList.add('hit'); }
    const nm = al(hl, 'H', { gap: 6, align: 'CENTER' }); txt(nm, POOLS[st.pool][0], 'T', C.ink);
    if (ctx.live && st.verified[st.pool]) pill(nm, '인증', C.soft, C.primary, 'L', [2, 6]);
    pill(h, ctx.live ? POOLS[st.pool][1].split(' · ')[1] : `멤버 ${POOLS[st.pool][2]}명`, C.soft, C.primary, 'CM', [6, 10]);
    if (ctx.live) { poolSolo(ctx, b); tabBar(s, '우리 수영장'); return s; }
    const r = route(st.pool, todayKm(ctx));
    const rc = al(b, 'V', { name: 'sea-route', gap: 10, pad: [18, 18], fill: '#DDF5F2', radius: 24, fillW: true });
    const rh = al(rc, 'H', { justify: 'SPACE_BETWEEN', align: 'MAX', fillW: true });
    const rl = al(rh, 'V', { gap: 2 }); txt(rl, '우리 수영장 바닷길', 'H', C.ink);
    const nums = al(rl, 'H', { gap: 4, align: 'MAX' }); txt(nums, Math.floor(r.km).toLocaleString(), 'D', '#0E8F86'); txt(nums, 'km 함께 헤엄쳤어요', 'BM', C.sub);
    const nx = al(rh, 'V', { gap: 0, align: 'MAX' }); txt(nx, `${r.nextName}까지`, 'CR', C.sub); txt(nx, `${Math.ceil(r.left)}km`, 'H', '#0E8F86');
    art(rc, routeSvg(r.at), 318);
    txt(rc, `멤버 ${POOLS[st.pool][2]}명 · 섬 간격 ${r.gap}km (멤버 1명당 ${KM_PER_MEMBER}km)`, 'CR', C.sub);
    const rw0 = al(rc, 'H', { gap: 8, pad: [10, 12], fill: '#FFFFFF', radius: 12, align: 'CENTER', fillW: true });
    art(rw0, P.icon.pearl, 22); txt(rw0, `${r.nextName}에 닿으면 이번 달 인증하고 수영한 멤버 모두 진주 30개 + 새 바다 친구`, 'CR', C.ink, { fillW: true });
    const bc = al(b, 'V', { name: 'pool-battle', gap: 12, pad: [18, 18], fill: C.card, radius: 20, fillW: true });
    const bh = al(bc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(bh, `${ctx.live ? new Date().getMonth() + 1 : 10}월 수영장 대결`, 'H', C.ink); pill(bh, ctx.live ? dday(daysLeft()) : 'D-9', C.pinkL, C.coral, 'L', [4, 8]);
    [[`${POOLS[st.pool][0]} (우리)`, '312km', 100, C.btn, C.soft, C.primary], ['바람결 수영장', '287km', 92, C.pink, C.pinkL, C.coral]].forEach(([n, km, pct, col, trk, tc]) => {
      const r = al(bc, 'V', { gap: 6, fillW: true });
      const t = al(r, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(t, n, 'CM', C.ink); txt(t, km, 'CM', tc);
      progress(r, pct, col, trk);
    });
    txt(bc, '이기면 수영장 멤버 전원에게 한정 튜브를 드려요', 'CR', C.sub);
    const cc = al(b, 'V', { name: 'my-class', gap: 12, pad: [18, 18], fill: C.card, radius: 20, fillW: true });
    const ch = al(cc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const cl = al(ch, 'V', { gap: 2 }); txt(cl, '우리 강습반', 'CR', C.sub); txt(cl, '새벽 6시 중급반', 'H', C.ink);
    const av = al(ch, 'H', { gap: -8, align: 'CENTER' });
    ['#FFB547', '#4DA3FF', '#FF9EC4', '#3FA65A', '#B07A52'].forEach((c) => { const d = dot(av, 28, c); d.style.boxShadow = '0 0 0 2px #FFFFFF'; });
    const more = al(av, 'H', { fill: C.soft, radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER' }); txt(more, '+3', 'L', C.primary);
    const g = al(cc, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(g, '이번 주 팀 목표', 'CM', C.ink); txt(g, '14.2 / 20km', 'CM', C.primary);
    progress(cc, 71, C.btn, C.soft);
    const rw = al(cc, 'H', { gap: 8, pad: [10, 12], fill: C.bg, radius: 12, align: 'CENTER', fillW: true });
    art(rw, P.scene.teamCap, 28); txt(rw, '달성하면 팀원 모두 중급반 팀 수모 획득', 'CR', C.ink, { fillW: true });
    tap(bc, () => ctx.act('toast', '대결 기록은 매일 새벽 0시에 갱신돼요'), '수영장 대결');
    tabBar(s, '우리 수영장');
    return s;
  };

  // 혼자 모드의 우리 수영장 탭: 나의 바닷길 · 이번 달 목표 · 함께하기는 곧 열려요
  function poolSolo(ctx, b) {
    const st = ctx.st, S2 = myStats(ctx), r = PR().myRoute(S2.km), K = PR().ISLAND_KM;
    const rc = al(b, 'V', { name: 'sea-route', gap: 10, pad: [18, 18], fill: '#DDF5F2', radius: 24, fillW: true });
    const rh = al(rc, 'H', { justify: 'SPACE_BETWEEN', align: 'MAX', fillW: true });
    const rl = al(rh, 'V', { gap: 2 }); txt(rl, '나의 바닷길', 'H', C.ink);
    const nums = al(rl, 'H', { gap: 4, align: 'MAX' }); txt(nums, km1(S2.km), 'D', '#0E8F86'); txt(nums, 'km 헤엄쳤어요', 'BM', C.sub);
    const nx = al(rh, 'V', { gap: 0, align: 'MAX' });
    if (r.done) txt(nx, '모든 섬 도착', 'CR', C.sub); else { txt(nx, `${r.nextName}까지`, 'CR', C.sub); txt(nx, `${km1(r.left)}km`, 'H', '#0E8F86'); }
    art(rc, routeSvg(r.at), 318);
    txt(rc, `섬 간격 ${K.map((x, i) => x - (K[i - 1] || 0)).join(' → ')}km · 고래섬까지 ${K[K.length - 1]}km`, 'CR', C.sub);
    const rw0 = al(rc, 'H', { gap: 8, pad: [10, 12], fill: '#FFFFFF', radius: 12, align: 'CENTER', fillW: true });
    art(rw0, P.icon.pearl, 22); txt(rw0, r.done ? '다섯 섬을 모두 지났어요. 다음 바다는 곧 열려요' : `${r.nextName}에 닿으면 진주 ${PR().ISLAND_PEARLS}개 + 새 바다 친구`, 'CR', C.ink, { fillW: true });
    // 이번 달 목표 (보상 아이템 조건)
    const gc = al(b, 'V', { name: 'my-goals', gap: 12, pad: [18, 18], fill: C.card, radius: 20, fillW: true });
    const gh = al(gc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(gh, `${new Date().getMonth() + 1}월 나의 목표`, 'H', C.ink); pill(gh, dday(daysLeft()), C.pinkL, C.coral, 'L', [4, 8]);
    [['한 달 20km', S2.month.m / 1000, 20, 'km', 'goggle:collab'], ['한 달 12번 수영', S2.month.n, 12, '번', 'suit:collab'], ['4주 연속 기록', S2.streak, 4, '주', 'cap:team']].forEach(([l, v, goal, unit, id]) => {
      const row = al(gc, 'V', { gap: 6, fillW: true });
      const t = al(row, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(t, l, 'CM', C.ink);
      const got = st.owned.includes(id);
      txt(t, got ? '보상 받음' : `${unit === 'km' ? km1(v) : v} / ${goal}${unit}`, 'CM', got ? C.coral : C.primary);
      progress(row, Math.max(0, Math.min(100, Math.round((v / goal) * 100))), C.btn, C.soft);
    });
    txt(gc, '채우면 콜라보 수경 · 콜라보 수영복 · 중급반 팀 수모를 받아요', 'CR', C.sub);
    tap(gc, () => { ctx.act('setTab', 'goggle'); ctx.go('dress'); }, '보상 아이템 보기');
    // 함께하기: 서버가 붙으면 열려요
    [[`${new Date().getMonth() + 1}월 수영장 대결`, '같은 수영장 친구들과 거리를 겨뤄요'], ['우리 강습반', '강습반 친구들과 팀 목표를 함께 채워요']].forEach(([t, sub]) => {
      const c = al(b, 'V', { name: 'soon', gap: 6, pad: [16, 18], fill: C.card, radius: 20, fillW: true }); c.style.opacity = '.72';
      const ch = al(c, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(ch, t, 'H', C.ink); pill(ch, '곧 열려요', C.paleBlue, C.sub, 'L', [4, 8]);
      txt(c, sub, 'CR', C.sub, { fillW: true });
      tap(c, () => ctx.act('toast', '친구와 함께하기는 곧 열려요'), t);
    });
  }

  // ---------- 04-2 MY POOL (옆에서 · 왕복 영상 · 바닥 꾸미기) ----------
  const TRAY = [['coral', '분홍 산호'], ['weed', '해초'], ['shell', '조개'], ['ball', '비치볼'], ['star', '불가사리']];
  S['04-2'] = (ctx) => {
    const st = ctx.st;
    const deco = ctx.live && st.decorate;
    const s = screen('04-2', { status: false });
    const scene = al(s, 'V', { name: 'pool-side-scene', fillW: true, h: 356, clip: true, cls: 'side-scene' + (deco ? ' decorating' : '') });
    abs(scene, art(null, P.scene.sideBg, 390), 0, 0);
    // 바닥 장식 (상태에서 그림)
    (st.placed || DEFAULT_PLACED).forEach(([k, x, c], i) => {
      const d = P.scene.deco(k, c); if (!d) return;
      const el = abs(scene, art(null, d.svg, d.w), x - d.ox, d.top);
      el.classList.add('deco');
      if (deco) tap(el, () => ctx.act('removeDeco', i), '장식 치우기');
    });
    abs(scene, art(null, swim(ctx), 130), 205, 75).classList.add('swimmer');
    const fr = st.follow.length ? st.follow : [];
    [[70, 196, 44], [262, 232, 40], [150, 258, 40]].forEach(([x, y, w], i) => { if (fr[i]) abs(scene, art(null, A.sea(fr[i]), w), x, y).classList.add('drift', 'd' + (i + 1)); });
    abs(scene, art(null, P.scene.sideSurface, 390), 0, 140);
    const dz = al(null, 'H', { gap: 4, pad: [7, 12], fill: deco ? C.navy : C.card, op: deco ? null : 0.92, radius: 999, align: 'CENTER' });
    txt(dz, deco ? '꾸미는 중' : '바닥 꾸미기', 'L', deco ? '#FFFFFF' : C.ink, { size: 12 });
    tap(dz, () => ctx.act('toggleDecorate'), '바닥 꾸미기');
    abs(scene, dz, null, 158, 16);
    statusBar(s, true);
    const b = content(s, [14, 16, 100, 16], 12);
    if (ctx.live) {
      const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true, pad: [0, 4] });
      const hl = al(h, 'V', { gap: 1 }); txt(hl, 'MY POOL', 'L', C.primary); txt(hl, `${st.name}의 풀`, 'H', C.ink);
      const cnt = al(h, 'H', { gap: 8, pad: [6, 10], fill: C.card, radius: 10, stroke: C.line, align: 'CENTER' });
      const lane = laneOf(st), todayLaps = Math.floor(((ctx.ledger && ctx.ledger.meters) || 0) / (lane * 2)), totalLaps = Math.floor((myStats(ctx).km * 1000) / (lane * 2));
      [['TODAY', todayLaps.toLocaleString(), C.coral], ['TOTAL', totalLaps.toLocaleString(), C.ink]].forEach(([k, v, c]) => { const x = al(cnt, 'V', { align: 'CENTER' }); txt(x, k, 'L', C.mute); txt(x, v, 'CM', c); });
    }
    if (deco) {
      const dc = al(b, 'V', { name: 'decorate', gap: 10, pad: [14, 14], fill: C.card, radius: 20, fillW: true, stroke: C.btn, sw: 1.5 });
      const dh = al(dc, 'V', { gap: 2, fillW: true }); txt(dh, '바닥 꾸미기', 'H', C.ink, { size: 15 });
      txt(dh, '아이템을 누르면 풀 바닥에 놓여요 · 놓인 장식을 누르면 다시 넣어요', 'CR', C.sub, { fillW: true });
      const tray = al(dc, 'H', { gap: 8, fillW: true });
      TRAY.forEach(([k, n]) => {
        const left = st.tray[k];
        const t = al(tray, 'V', { gap: 2, pad: [8, 4], fill: C.bg, radius: 14, align: 'CENTER', grow: true });
        art(t, P.item[k], 34, { opacity: left ? null : 0.35 }); txt(t, n, 'L', C.ink); txt(t, 'x' + left, 'L', C.mute);
        tap(t, () => ctx.act('place', k, n), n + ' 놓기');
      });
      const done = al(dc, 'H', { fill: C.btn, radius: 14, align: 'CENTER', justify: 'CENTER', fillW: true, h: 44, cls: 'btn' }); txt(done, '다 꾸몄어요', 'BM', '#FFFFFF');
      tap(done, () => ctx.act('toggleDecorate'), '다 꾸몄어요');
    }
    const stc = al(b, 'V', { name: 'lap-status', gap: 12, pad: [16, 18], fill: C.card, radius: 20, fillW: true });
    const lane = laneOf(st), todayM = ctx.live ? ((ctx.ledger && ctx.ledger.meters) || 0) : 600, laps = Math.floor(todayM / (lane * 2)), goal = PR() ? PR().LAP_GOAL : 20;
    const pct = ctx.live ? Math.min(100, Math.round((laps / goal) * 100)) : 60;
    const sr = al(stc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(sr, `${st.name} · 왕복 중`, 'H', C.ink); txt(sr, `${ctx.live ? lane : 25}m 레인`, 'CM', C.sub);
    const tr = al(stc, 'H', { gap: 6, align: 'CENTER', fillW: true });
    const sd = al(tr, 'H', { fill: C.soft, radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER' }); art(sd, P.icon.wave(), 16);
    const bar = al(tr, 'H', { fill: C.soft, radius: 5, h: 10, grow: true }); const f = al(bar, 'H', { fill: C.btn, radius: 5, grow: Math.max(pct, 0.01) }); f.style.alignSelf = 'stretch'; const r = al(bar, 'H', { grow: Math.max(100 - pct, 0.01) }); r.style.alignSelf = 'stretch';
    const mb = al(tr, 'H', { fill: C.card, stroke: C.btn, sw: 2, radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER', clip: true });
    if (ctx.live) art(mb, me(ctx), 30).style.marginTop = '8px'; else art(mb, P.icon.me, 20);
    const gl = al(tr, 'H', { fill: '#FFF0FA', radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER' }); art(gl, P.icon.goal, 14);
    const cap = al(stc, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(cap, `오늘 ${laps} / ${goal} 왕복 · ${todayM.toLocaleString()}m`, 'CM', C.sub); txt(cap, '다음 턴까지 0:18', 'CM', C.primary, { weight: 700 });
    txt(b, '오늘 풀에 생긴 일', 'CM', C.sub);
    (ctx.live ? poolEvents(ctx) : [['clownfish', '흰동가리가 레인을 따라와요', '따라오는 바다 친구', true], ['turtle', '바다거북이 놀러 왔어요', '우리 수영장이 산호섬에 닿았어요', true], ['mackerel', '고등어 떼가 기다려요', '우리 수영장이 등대섬에 닿으면 만나요', false]]).forEach(([k, t, sub, done]) => {
      const row = al(b, 'H', { gap: 12, pad: [12, 14], fill: C.card, radius: 20, align: 'CENTER', fillW: true });
      const ic = al(row, 'H', { fill: C.soft, radius: 16, w: 48, h: 48, align: 'CENTER', justify: 'CENTER' }); art(ic, A.sea(k), 40);
      const col = al(row, 'V', { gap: 2, grow: true }); txt(col, t, 'H', C.ink, { size: 15 }); txt(col, sub, 'CR', C.sub, { size: 13 });
      const ck = al(row, 'H', { fill: done ? '#E6F7EC' : '#F3F6F9', radius: 12, w: 40, h: 40, align: 'CENTER', justify: 'CENTER' }); art(ck, P.icon.bigCheck(done ? '#3FA65A' : '#C9D3DD'), 18);
    });
    if (ctx.live) {
      const wv = al(b, 'H', { gap: 6, fill: C.btn, radius: 16, align: 'CENTER', justify: 'CENTER', h: 52, fillW: true, cls: 'btn' });
      art(wv, P.icon.wave('#FFFFFF'), 20); txt(wv, '파도타기 · 다른 친구 풀 구경', 'BM', '#FFFFFF');
      tap(wv, () => ctx.act('toast', '옆 레인 햄스터의 풀로 파도타기는 곧 열려요'), '파도타기');
    }
    tabBar(s, '꾸미기');
    return s;
  };

  // 수영장 레인 길이(m): 수영장 정보의 '25m 6레인'에서
  const laneOf = (st) => { const m = /(\d+)m/.exec((POOLS[st.pool] || [])[1] || ''); return m ? +m[1] : 25; };
  const josa = (w, a, b) => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c >= 0 && c <= 11171 && c % 28 ? a : b; };
  // MY POOL '오늘 풀에 생긴 일': 따라오는 친구 · 닿은 섬 · 다음 섬
  function poolEvents(ctx) {
    const st = ctx.st, r = myRoute(ctx), ev = [];
    const islandFriend = (name) => Object.keys(SEA).find((k) => SEA[k][2] === name);
    if (st.follow[0] && SEA[st.follow[0]]) { const n = SEA[st.follow[0]][0]; ev.push([st.follow[0], `${n}${josa(n, '이', '가')} 레인을 따라와요`, '따라오는 바다 친구', true]); }
    if (r.passed > 0) { const isl = ISLANDS[r.passed - 1], k = islandFriend(isl); ev.push([k, `${isl}에서 ${SEA[k][0]}${josa(SEA[k][0], '을', '를')} 만났어요`, `나의 바닷길이 ${isl}에 닿았어요`, true]); }
    if (!r.done) { const k = islandFriend(r.nextName); ev.push([k, `${SEA[k][0]}${josa(SEA[k][0], '이', '가')} 기다려요`, `${r.nextName}까지 ${km1(r.left)}km 남았어요`, false]); }
    return ev;
  }

  // ---------- 05 바다 도감 ----------
  S['05'] = (ctx) => {
    const st = ctx.st;
    const s = screen('05');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, '만난 바다 친구', 'CR', C.sub); txt(hl, '바다 도감', 'T', C.ink);
    pill(h, `${ctx.live ? st.friends.length : 12} / 120종`, C.soft, C.primary, 'CM', [6, 10]);
    const pc = al(b, 'V', { gap: 8, pad: [14, 16], fill: G.dex, radius: 18, fillW: true });
    const rr = ctx.live ? myRoute(ctx) : route(st.pool, todayKm(ctx));
    const pr = al(pc, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(pr, rr.done && ctx.live ? '다섯 섬의 친구를 모두 만났어요' : `다음 친구는 ${rr.nextName}에서`, 'CM', C.ink); txt(pr, ctx.live ? (rr.done ? '' : `${km1(rr.left)}km 남음`) : `우리 수영장 ${Math.ceil(rr.left)}km 남음`, 'CM', C.primary);
    progress(pc, rr.done ? 100 : Math.round((rr.at % 1) * 100), C.btn, '#FFFFFF');
    txt(pc, ctx.live ? '나의 바닷길이 섬에 닿으면 그 섬의 친구를 만나요' : '우리 수영장이 섬에 닿으면 멤버 모두 그 섬의 친구를 만나요', 'CR', C.sub);
    const filter = ctx.live ? st.dexFilter : '전체';
    const chips = al(b, 'H', { gap: 8, fillW: true });
    ['전체', '물고기', '고래', '거북·해달', '기타'].forEach((c) => { const on = c === filter; const ch = al(chips, 'H', { pad: [7, 12], radius: 999, fill: on ? C.ink : C.card, stroke: on ? null : C.line }); txt(ch, c, 'CM', on ? '#FFFFFF' : C.sub); tap(ch, () => ctx.act('dexFilter', c), c); });
    const keys = DEX_ORDER.filter((k) => filter === '전체' || SEA[k][1] === filter);
    const grid = al(b, 'V', { gap: 10, fillW: true });
    for (let r = 0; r < Math.ceil(keys.length / 3); r++) {
      const row = al(grid, 'H', { gap: 10, fillW: true });
      for (let c = 0; c < 3; c++) {
        const k = keys[r * 3 + c];
        if (!k) { al(row, 'V', { grow: true }); continue; }
        const found = st.friends.includes(k);
        const isNew = ctx.live ? false : k === 'otter';
        const tagText = SEA[k][2] + (isNew && !ctx.live ? ' · NEW' : '');
        const card = al(row, 'V', { gap: 6, pad: [12, 6], fill: found ? C.card : '#EEF3F8', radius: 18, align: 'CENTER', grow: true });
        const ho = al(card, 'H', { fill: found ? '#E8F4FF' : '#E2EAF2', radius: 30, w: 60, h: 60, align: 'CENTER', justify: 'CENTER' });
        art(ho, found ? A.sea(k) : A.seaSilhouette(k), 54);
        txt(card, found ? SEA[k][0] : '???', 'CM', found ? C.ink : C.mute);
        pill(card, found ? tagText : '🔒 ' + tagText, found ? (isNew ? C.pinkL : C.soft) : '#FFFFFF', found ? (isNew ? '#D94FAE' : C.primary) : C.mute);
        tap(card, () => ctx.act('dexDetail', k), found ? SEA[k][0] : '아직 못 만난 친구');
      }
    }
    tabBar(s, '도감');
    return s;
  };

  // ---------- 06 마이페이지 ----------
  S['06'] = (ctx) => {
    const st = ctx.st;
    const s = screen('06');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'H', { gap: 8, align: 'CENTER' });
    if (ctx.live) iconBtn(hl, P.icon.back, 24, () => ctx.back(), '뒤로');
    txt(hl, '마이', 'T', C.ink);
    iconBtn(h, P.icon.gear, 24, () => ctx.act('toast', '설정은 곧 열려요'), '설정');
    const pf = al(b, 'H', { gap: 14, pad: [16, 16], fill: C.card, radius: 22, align: 'CENTER', fillW: true });
    const av = al(pf, 'H', { fill: C.sky, radius: 40, w: 80, h: 80, align: 'CENTER', justify: 'CENTER', clip: true }); art(av, me(ctx), 78);
    const pi = al(pf, 'V', { gap: 3, grow: true }); txt(pi, st.name, 'H', C.ink); txt(pi, ctx.live ? POOLS[st.pool][0] : `${POOLS[st.pool][0]} · 새벽 6시 중급반`, 'CR', C.sub); const ms = ctx.live ? myStats(ctx) : null; pill(pi, ms && ms.km >= PR().GRADUATE_KM ? '킥판 졸업' : '킥판 졸업반', C.pinkL, '#D94FAE');
    const ed = al(pf, 'H', { pad: [6, 10], radius: 999, stroke: C.line }); txt(ed, '편집', 'CM', C.sub); tap(ed, () => ctx.go('pick'), '캐릭터 편집');
    const stats = al(b, 'H', { pad: [14, 8], fill: C.card, radius: 20, fillW: true });
    [['총 거리', ms ? km1(ms.km) + 'km' : '48.2km'], ['수영한 날', ms ? ms.days + '일' : '36일'], ['내 진주', st.pearls.toLocaleString()]].forEach(([k, v]) => { const c = al(stats, 'V', { gap: 2, align: 'CENTER', grow: true }); txt(c, v, 'H', C.ink); txt(c, k, 'CR', C.sub); });
    const gr = al(b, 'V', { name: 'graduation', gap: 8, pad: [14, 16], fill: G.soft3, radius: 20, fillW: true });
    const G0 = PR() ? PR().GRADUATE_KM : 60, left = ms ? Math.max(0, G0 - ms.km) : 12, grad = ms && left <= 0;
    const gt = al(gr, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(gt, grad ? '킥판을 졸업했어요!' : '킥판 졸업까지', 'BM', C.ink); txt(gt, grad ? `${G0}km 달성` : `${ms ? km1(left) : 12}km 남음`, 'CM', C.primary);
    progress(gr, ms ? Math.min(100, Math.round((ms.km / G0) * 100)) : 80, C.btn, '#FFFFFF');
    const nm = st.name.replace('새벽반 ', '');
    txt(gr, grad ? `${nm}${josa(nm, '이', '가')} 이제 킥판 없이 헤엄쳐요` : `졸업하면 ${nm}${ctx.live ? josa(nm, '이', '가') : '가'} 킥판 없이 헤엄쳐요`, 'CR', C.sub);
    const unread = NOTICES.length - st.read.length;
    const list = al(b, 'V', { fill: C.card, radius: 20, fillW: true, pad: [4, 0] });
    [['워치 연동', ctx.platform === 'android' ? '갤럭시워치 연결됨' : 'Apple Watch 연결됨', () => (ctx.platform && ctx.platform !== 'web' ? ctx.go('home') : ctx.act('toast', 'Apple Watch에서 오늘 기록을 받아왔어요'))], ['내 수영장', POOLS[st.pool][0], () => ctx.go('pool-set')], ['우리 강습반', ctx.live ? '곧 열려요' : '새벽 6시 중급반', () => ctx.go('pool')], ['보관함', `아이템 ${st.owned.length}개 · 진주 ${st.pearls}`, () => ctx.go('dress')], ['알림 설정', '', () => ctx.act('toast', '알림 설정은 곧 열려요')], ['공지사항', unread > 0 ? `새 글 ${Math.min(2, unread)}` : '', () => ctx.go('notice')]].forEach(([t, v, fn], i) => {
      const r = al(list, 'H', { gap: 8, pad: [14, 16], align: 'CENTER', fillW: true }); divider(r, i);
      txt(r, t, 'BM', C.ink, { grow: true });
      if (v) { if (t === '공지사항') pill(r, v, C.pink, C.ink, 'L', [2, 7]); else txt(r, v, 'CM', t === '워치 연동' ? C.primary : C.sub); }
      art(r, P.icon.chev(), 18);
      tap(r, fn, t);
    });
    tabBar(s, '__none__');
    return s;
  };

  // ---------- 07 전체 메뉴 ----------
  S['07'] = (ctx) => {
    const st = ctx.st;
    const s = screen('07');
    const b = content(s, [6, 20, 30, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(h, '전체 메뉴', 'T', C.ink); iconBtn(h, P.icon.close, 24, () => ctx.back(), '닫기');
    const meRow = al(b, 'H', { gap: 12, pad: [12, 14], fill: C.card, radius: 20, align: 'CENTER', fillW: true });
    const av = al(meRow, 'H', { fill: C.sky, radius: 24, w: 48, h: 48, align: 'CENTER', justify: 'CENTER', clip: true }); art(av, me(ctx), 48);
    const mi = al(meRow, 'V', { gap: 2, grow: true }); txt(mi, st.name, 'BM', C.ink); txt(mi, '마이페이지 보기', 'CR', C.sub);
    art(meRow, P.icon.chev(), 18);
    tap(meRow, () => ctx.go('my'), '마이페이지');
    const M = P.menu;
    const tiles = [[M.box, '오늘의 진주', 'home'], [M.shirt, '꾸미기', 'dress'], [M.pool, 'MY POOL', 'mypool'], [M.group, '우리 수영장', 'pool'], [M.book, '바다 도감', 'dex'], [M.chart, '수영 기록', null]];
    const grid = al(b, 'V', { gap: 10, fillW: true });
    for (let r = 0; r < 2; r++) {
      const row = al(grid, 'H', { gap: 10, fillW: true });
      for (let c = 0; c < 3; c++) {
        const [svg, l, route] = tiles[r * 3 + c];
        const t = al(row, 'V', { gap: 8, pad: [16, 6], fill: C.card, radius: 18, align: 'CENTER', grow: true });
        const bx = al(t, 'H', { fill: '#EEF5FF', radius: 14, w: 44, h: 44, align: 'CENTER', justify: 'CENTER' }); art(bx, svg, 26);
        txt(t, l, 'CM', C.ink);
        tap(t, () => (route ? ctx.go(route) : ctx.act('toast', '수영 기록 통계는 곧 열려요')), l);
      }
    }
    const unread = NOTICES.length - st.read.length;
    const group = (title, rows) => {
      txt(b, title, 'CM', C.sub);
      const list = al(b, 'V', { fill: C.card, radius: 20, fillW: true, pad: [4, 0] });
      rows.forEach(([t, badge, fn], i) => {
        const r = al(list, 'H', { gap: 8, pad: [14, 16], align: 'CENTER', fillW: true }); divider(r, i);
        txt(r, t, 'BM', C.ink, { grow: true }); if (badge) pill(r, badge, C.pink, C.ink, 'L', [2, 7]); art(r, P.icon.chev(), 18);
        tap(r, fn || (() => ctx.act('toast', `${t}은(는) 곧 열려요`)), t);
      });
    };
    const soon = (t) => () => ctx.act('toast', t);
    group('소식', [['공지사항', ctx.live ? (unread > 0 ? 'N' : '') : 'N', () => { ctx.act('noticeFilter', '전체', true); ctx.go('notice'); }], ['이벤트', '', () => { ctx.act('noticeFilter', '이벤트', true); ctx.go('notice'); }]]);
    group('함께', [['친구 초대하기', '', soon('초대 링크를 복사했다고 가정할게요 · 데모')], ['강습반 팀 만들기', '', soon('강습반 팀 만들기는 곧 열려요')]]);
    const help = [['설정', '', soon('설정은 곧 열려요')], ['고객센터', '', soon('고객센터는 곧 열려요')], ['이용약관 · 개인정보', '', ctx.live ? () => ctx.act('legal') : soon('이용약관은 곧 열려요')]];
    if (ctx.live && (!ctx.platform || ctx.platform === 'web')) help.push(['디자인 시안 보기', '', () => ctx.act('about')]);
    if (ctx.live) help.push(['데모 처음부터 다시', '', () => ctx.act('reset')]);
    group('도움', help);
    txt(b, '버전 1.0.0', 'CR', C.mute);
    return s;
  };

  // ---------- 08 공지사항 ----------
  S['08'] = (ctx) => {
    const st = ctx.st;
    const s = screen('08');
    const b = content(s, [6, 20, 30, 20], 14);
    const h = al(b, 'H', { gap: 8, align: 'CENTER', fillW: true }); iconBtn(h, P.icon.back, 24, () => ctx.back(), '뒤로'); txt(h, '공지사항', 'T', C.ink);
    const co = al(b, 'H', { name: 'coach-banner', gap: 12, pad: [14, 16], fill: G.soft3, radius: 22, align: 'CENTER', fillW: true });
    art(co, A.seal, 60).classList.add('float');
    const cc = al(co, 'V', { gap: 3, grow: true }); pill(cc, '물개 코치의 알림', '#FFFFFF', C.primary, 'L', [2, 8]);
    txt(cc, `${ctx.live ? new Date().getMonth() + 1 : 11}월 수영장 대결이 시작됐어요!`, 'H', C.ink); txt(cc, `우리 수영장을 응원해 주세요 · ${ctx.live ? dday(daysLeft()) : 'D-30'}`, 'CR', C.sub);
    tap(co, () => ctx.go('pool'), '우리 수영장 보기');
    const filter = ctx.live ? st.noticeFilter : '전체';
    const seg = al(b, 'H', { gap: 4, pad: [4, 4], fill: '#E6EEF8', radius: 999, fillW: true });
    ['전체', '공지', '이벤트', '업데이트'].forEach((l) => { const on = l === filter; const x = al(seg, 'H', { pad: [8, 6], radius: 999, fill: on ? C.card : null, align: 'CENTER', justify: 'CENTER', grow: true }); txt(x, l, 'CM', on ? C.ink : C.sub); tap(x, () => ctx.act('noticeFilter', l), l); });
    const list = al(b, 'V', { fill: C.card, radius: 20, fillW: true, pad: [4, 0] });
    const tagCol = { '이벤트': [C.pinkL, '#D94FAE'], '업데이트': ['#E4E9FF', C.btn], '공지': ['#E6F3FF', C.primary] };
    const rows = NOTICES.map((n, i) => [n, i]).filter(([n]) => filter === '전체' || n[0] === filter);
    rows.forEach(([[tg, t, d, body], idx], i) => {
      const isNew = idx < 2 && !(ctx.live && st.read.includes(idx));
      const open = ctx.live && st.openNotice === idx;
      const r = al(list, 'V', { gap: 6, pad: [14, 16], fillW: true }); divider(r, i);
      const top = al(r, 'H', { gap: 6, align: 'CENTER', fillW: true }); pill(top, tg, tagCol[tg][0], tagCol[tg][1]); if (isNew) dot(top, 6, C.coral);
      txt(r, t, 'BM', C.ink, { fillW: true }); txt(r, d, 'CR', C.mute);
      if (open) { const bx = al(r, 'V', { pad: [12, 14], fill: C.bg, radius: 12, fillW: true }); txt(bx, body, 'CR', C.ink, { fillW: true, size: 13 }); }
      tap(r, () => ctx.act('openNotice', idx), t);
    });
    return s;
  };

  // ---------- 09 내 수영장 설정 (이사 · 한 달에 한 번 변경) ----------
  S['09'] = (ctx) => {
    const st = ctx.st;
    const cur = st.pool;
    const locked = ctx.live && st.poolChanged === monthKey();
    const s = screen('09');
    const b = content(s, [6, 20, 34, 20], 14);
    const h = al(b, 'H', { gap: 8, align: 'CENTER', fillW: true }); iconBtn(h, P.icon.back, 24, () => ctx.back(), '뒤로'); txt(h, '내 수영장 설정', 'T', C.ink);
    txt(b, '이사했거나 다니는 수영장이 바뀌었다면 여기서 바꿔요.\n내 수영장은 한 곳이고, 한 번 바꾸면 그달에는 다시 못 바꿔요.', 'CR', C.sub, { fillW: true });
    // 지금 내 수영장
    const ok = st.verified && st.verified[cur];
    const now = al(b, 'H', { gap: 12, pad: [14, 16], fill: C.navy, radius: 18, align: 'CENTER', fillW: true });
    const ic = al(now, 'H', { fill: '#2E37B8', radius: 12, w: 40, h: 40, align: 'CENTER', justify: 'CENTER' }); art(ic, P.icon.wave('#FFFFFF'), 20);
    const nc = al(now, 'V', { gap: 2, grow: true });
    txt(nc, '지금 내 수영장', 'L', '#BFD4FF');
    const nt = al(nc, 'H', { gap: 6, align: 'CENTER' }); txt(nt, POOLS[cur][0], 'BM', '#FFFFFF'); if (ok) pill(nt, '인증', '#FFFFFF', C.primary, 'L', [2, 6]);
    txt(nc, `${POOLS[cur][3]} · 멤버 ${POOLS[cur][2]}명`, 'CR', '#BFD4FF', { size: 12 });
    if (locked) {
      const lk = al(b, 'H', { gap: 10, pad: [12, 14], fill: C.pinkL, radius: 14, align: 'CENTER', fillW: true });
      txt(lk, '이번 달에 이미 바꿨어요', 'CM', C.coral, { weight: 700 });
      txt(lk, `${nextMonthLabel()}부터 다시 바꿀 수 있어요`, 'CR', C.ink, { grow: true });
    }
    // 지도 + 내 위치
    const map = al(b, 'V', { name: 'map', radius: 20, fillW: true, h: 170, clip: true });
    abs(map, art(null, P.scene.map, 350), 0, 0);
    abs(map, (() => { const c = al(null, 'H', { gap: 4, pad: [5, 10], fill: C.navy, radius: 999, align: 'CENTER' }); txt(c, POOLS[cur][0], 'L', '#FFFFFF'); return c; })(), 210, 30);
    const loc = al(null, 'H', { gap: 6, pad: [8, 12], fill: C.card, radius: 999, align: 'CENTER' }); art(loc, P.icon.locate, 16);
    txt(loc, ctx.live && st.located ? '현재 위치 · 성내동 근처' : '현재 위치로 찾기', 'CM', C.primary, { weight: 700 });
    tap(loc, () => ctx.act('locate'), '현재 위치로 찾기');
    abs(map, loc, 12, 122);
    txt(b, ctx.live && st.located ? '내 위치에서 가까운 순' : '근처 수영장', 'CM', C.sub);
    const list = al(b, 'V', { fill: C.card, radius: 20, fillW: true, pad: [4, 0] });
    POOLS.forEach(([n, meta, mem, dong], i) => {
      const sel = i === cur;
      const r = al(list, 'H', { gap: 12, pad: [12, 16], align: 'CENTER', fillW: true }); divider(r, i);
      const col = al(r, 'V', { gap: 2, grow: true });
      const t = al(col, 'H', { gap: 6, align: 'CENTER' }); txt(t, n, 'BM', locked && !sel ? C.mute : C.ink); pill(t, dong, sel ? C.soft : C.paleBlue, sel ? C.primary : C.sub, 'L', [2, 6]);
      txt(col, `${meta} · 멤버 ${mem}명`, 'CR', C.sub, { size: 12 });
      const rd = al(r, 'H', { fill: sel ? C.btn : C.card, stroke: sel ? null : C.mute, sw: 1.5, radius: 11, w: 22, h: 22, align: 'CENTER', justify: 'CENTER' }); if (sel) dot(rd, 8, '#FFFFFF');
      tap(r, () => ctx.act('choosePool', i), n);
    });
    // 인증
    const v = al(b, 'H', { gap: 12, pad: [14, 16], fill: ok ? '#E6F7EC' : G.soft3, radius: 20, align: 'CENTER', fillW: true });
    art(v, A.seal, 46);
    const vc = al(v, 'V', { gap: 2, grow: true });
    txt(vc, ok ? `${POOLS[cur][0]} 인증 완료` : '수영장에서 인증해 주세요', 'BM', C.ink);
    txt(vc, ok ? '내 거리가 우리 수영장 바닷길과 대결에 들어가요' : '수영장 근처에서 위치를 확인하면 바닷길에 함께해요', 'CR', C.sub, { fillW: true, size: 12 });
    if (!ok) { const vb = al(v, 'H', { pad: [8, 12], fill: C.btn, radius: 12, cls: 'btn' }); txt(vb, '인증하기', 'CM', '#FFFFFF', { weight: 700 }); tap(vb, () => ctx.act('verify'), '수영장 인증하기'); }
    const note = al(b, 'V', { gap: 4, pad: [12, 14], fill: '#EEF3F9', radius: 14, fillW: true });
    ['수영장은 한 달에 한 번 바꿀 수 있어요. 처음 고른 건 횟수에 넣지 않아요.', '이미 헤엄친 거리는 이전 수영장 바닷길에 그대로 남아요.', '모은 진주와 아이템, MY POOL 꾸미기는 그대로예요.', '다른 수영장에서 헤엄친 날도 진주는 받아요.'].forEach((l) => txt(note, '· ' + l, 'CR', C.sub, { fillW: true, size: 12 }));
    return s;
  };

  const DEFAULT_CTX = () => ({ st: JSON.parse(JSON.stringify(DEFAULT_STATE)), go() {}, act() {}, back() {}, live: false });
  function render(id, ctx) { CTX = ctx || DEFAULT_CTX(); const s = S[id](CTX); applyOverlaps(s); return s; }
  window.USUKKU = { render, ids: Object.keys(S), C, G, DEFAULT_STATE, ANIMALS, FURS, POOLS, ITEMS, SEA, NOTICES, ISLANDS, TODAY, todayPearls, PEARL_PER, FIRST_BONUS, FRESH_STATE, seaHow, route, monthKey, nextMonthLabel, furName, animalName, me: (ctx, e) => me(ctx, e) };
})();
