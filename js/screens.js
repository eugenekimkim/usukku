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
  const POOLS = [['물빛 수영장', '0.6km · 25m 6레인 · 자유수영 가능', 128], ['햇살 스포츠센터', '1.2km · 50m 8레인 · 자유수영 가능', 342], ['파랑 구민체육센터', '2.1km · 25m 5레인 · 강습 전용', 57]];
  const I = P.item;
  const ITEMS = {
    cap: [
      { id: 'basic', name: '기본 수모', tag: '기본', svg: I.cap('#1F8BFF'), cap: { color: '#1F8BFF' } },
      { id: 'dots', name: '물방울 수모', tag: '기본', svg: I.cap('#FF9EC4', I.capDots), cap: { color: '#FF9EC4', deco: 'dots' } },
      { id: 'whale', name: '고래 수모', tag: '접영 · 반짝이', tone: 'shine', svg: I.cap('#3B6FD8', I.capWhale), cap: { color: '#3B6FD8', deco: 'whale' } },
      { id: 'rainbow', name: '무지개 수모', tag: '혼영 · 무지개', tone: 'rainbow', svg: I.cap('#0F2A43', I.capRainbow), cap: { color: '#0F2A43', deco: 'rainbow' } },
      { id: 'team', name: '중급반 팀 수모', tag: '팀 한정', tone: 'limited', svg: I.cap('#3FA65A', I.capTeam), cap: { color: '#3FA65A', deco: 'team' } },
      { id: 'sun', name: '일출 수모', tag: '새벽 10회 달성 시', svg: I.cap('#FFB547', I.capSun), cap: { color: '#FFB547', deco: 'sun' } },
    ],
    goggle: [
      { id: 'basic', name: '기본 수경', tag: '기본', svg: I.goggle('#FF7A6B'), goggle: null },
      { id: 'otter', name: '해달 수경', tag: '배영 · 반짝이', tone: 'shine', svg: I.goggle('#1BA9A0'), goggle: '#1BA9A0' },
      { id: 'navy', name: '남색 수경', tag: '기본', svg: I.goggle('#1B22A6'), goggle: '#1B22A6' },
      { id: 'pink', name: '분홍 수경', tag: '기본', svg: I.goggle('#FF9EC4'), goggle: '#FF9EC4' },
      { id: 'gold', name: '금빛 수경', tag: '접영 1km 달성 시', svg: I.goggle('#FFB547'), goggle: '#FFB547' },
      { id: 'collab', name: '콜라보 수경', tag: '브랜드 한정', tone: 'limited', svg: I.goggle('#456AFF'), goggle: '#456AFF' },
    ],
    suit: [
      { id: 'basic', name: '줄무늬 수영복', tag: '기본', svg: I.suit('#3ED3C9') },
      { id: 'coral', name: '산호 수영복', tag: '기본', svg: I.suit('#FF7A6B') },
      { id: 'navy', name: '남색 수영복', tag: '기본', svg: I.suit('#1E3A8A', '#9EB3FF') },
      { id: 'collab', name: '콜라보 수영복', tag: '브랜드 한정', tone: 'limited', svg: I.suit('#456AFF', '#FFBFEC') },
    ],
    fin: [
      { id: 'basic', name: '노랑 오리발', tag: '기본', svg: I.fin('#FFC94A') },
      { id: 'blue', name: '파랑 오리발', tag: '기본', svg: I.fin('#4DA3FF') },
      { id: 'pink', name: '분홍 오리발', tag: '자유형 5km 달성 시', svg: I.fin('#FF9EC4') },
    ],
  };
  const SEA = {
    clownfish: ['흰동가리', '물고기', '자유형을 짧게 · 가볍게 하면 만나요'], mackerel: ['고등어', '물고기', '자유형을 오래 · 꾸준히 하면 만나요'], tuna: ['참치', '물고기', '자유형을 빠르게 하면 만나요'],
    turtle: ['바다거북', '거북·해달', '평영을 하면 만나요'], otter: ['해달', '거북·해달', '배영을 하면 만나요'], dolphin: ['돌고래', '고래', '여러 영법을 섞은 날 만나요'],
    humpback: ['혹등고래', '고래', '접영 500m를 넘기면 만나요'], octopus: ['문어', '기타', '이벤트 기간에 만나요'], bluewhale: ['대왕고래', '고래', '접영 마스터가 되면 만나요'],
  };
  const DEX_ORDER = ['clownfish', 'mackerel', 'tuna', 'turtle', 'otter', 'dolphin', 'humpback', 'octopus', 'bluewhale'];
  const NOTICES = [
    ['이벤트', '11월 수영장 대결 규칙과 보상 안내', '2026.10.30', '11월 한 달 동안 같은 수영장 멤버들의 거리를 모아 이웃 수영장과 겨뤄요. 이기면 멤버 전원에게 한정 튜브를 드려요.'],
    ['업데이트', '바다 도감에 고래 3종이 추가됐어요', '2026.10.28', '혹등고래, 범고래, 대왕고래를 접영 기록으로 만날 수 있어요.'],
    ['공지', '갤럭시워치 연동 베타를 시작해요', '2026.10.24', '마이 > 워치 연동에서 갤럭시워치를 연결할 수 있어요.'],
    ['공지', '목록에 없는 수영장을 직접 등록할 수 있어요', '2026.10.20', '수영장 선택 화면 아래 직접 등록하기를 눌러 주세요.'],
    ['이벤트', '산호 꾸미기 사진 공모전 당첨자 발표', '2026.10.15', '참여해 주신 모든 분께 감사드려요. 당첨자는 알림으로 안내드렸어요.'],
    ['업데이트', '음파 표정 스티커가 추가됐어요', '2026.10.08', '숨 참는 친구들의 음파 표정을 스티커로 쓸 수 있어요.'],
  ];

  const DEFAULT_STATE = {
    onboarded: false, kind: 'rabbit', fur: '#FFFFFF', name: '새벽반 흰토끼', nameEdited: false, pool: 0,
    equip: { cap: 'basic', goggle: 'basic', suit: 'basic', fin: 'basic' },
    owned: ['cap:basic', 'cap:dots', 'cap:whale', 'cap:rainbow', 'cap:team', 'goggle:basic', 'goggle:navy', 'goggle:pink', 'suit:basic', 'suit:coral', 'suit:navy', 'fin:basic', 'fin:blue'],
    friends: ['clownfish', 'mackerel', 'turtle', 'otter', 'dolphin', 'octopus', 'jellyfish', 'puffer', 'starfish', 'crab', 'shrimp', 'seahorse'],
    follow: ['clownfish', 'mackerel', 'turtle'],
    boxOpened: false, tab: 'cap', dexFilter: '전체', noticeFilter: '전체', openNotice: -1, read: [],
    tray: { coral: 2, weed: 1, shell: 3, ball: 1, star: 2 }, decorate: true, guestbook: 5,
  };

  const furName = (hex) => (FURS.find((f) => f[0] === hex) || [0, ''])[1];
  const animalName = (k) => ANIMALS.find((a) => a[0] === k)[1];
  const itemOf = (cat, id) => ITEMS[cat].find((x) => x.id === id);
  function me(ctx, expr = 'normal') {
    const st = ctx.st;
    if (!ctx.live) return A.animal(st.kind, st.fur, expr);
    const cap = st.equip.cap && itemOf('cap', st.equip.cap);
    const gog = st.equip.goggle && itemOf('goggle', st.equip.goggle);
    return A.animal(st.kind, st.fur, expr, { cap: cap && cap.cap, goggle: gog && gog.goggle });
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
    POOLS.forEach(([n, meta, mem], i) => {
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

  // ---------- 01 오늘의 상자 ----------
  S['01'] = (ctx) => {
    const st = ctx.st;
    const s = screen('01');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, '10월 22일 목요일 · 새벽 6:40', 'CR', C.sub); txt(hl, '오늘의 수영 완료!', 'T', C.ink);
    const hr = al(h, 'H', { gap: 8, align: 'CENTER' });
    const stc = al(hr, 'H', { gap: 4, pad: [6, 10], fill: C.soft, radius: 999, align: 'CENTER' }); art(stc, P.icon.wave(), 16); txt(stc, '4주 연속', 'CM', C.primary);
    if (ctx.live) { const av = al(hr, 'H', { fill: C.sky, radius: 18, w: 36, h: 36, align: 'CENTER', justify: 'CENTER', clip: true }); art(av, me(ctx), 38).style.marginTop = '10px'; tap(av, () => ctx.go('menu'), '전체 메뉴'); }
    const sum = al(b, 'V', { gap: 14, pad: [18, 18], fill: C.card, radius: 20, fillW: true });
    const stats = al(sum, 'H', { justify: 'SPACE_BETWEEN', fillW: true });
    [['거리', '1,250m', C.ink], ['시간', '42분', C.ink], ['효율', '+3 향상', C.primary]].forEach(([l, v, c]) => { const x = al(stats, 'V', { gap: 2, grow: true }); txt(x, l, 'CR', C.sub); txt(x, v, 'H', c); });
    const segs = [['자유형', 800, '#4DA3FF'], ['배영', 250, '#B07A52'], ['평영', 200, '#3FA65A']];
    const bar = al(sum, 'H', { gap: 3, fillW: true, h: 10 }); segs.forEach(([, m, c]) => { const g = al(bar, 'H', { fill: c, radius: 5, grow: m }); g.style.alignSelf = 'stretch'; });
    const leg = al(sum, 'H', { gap: 14, fillW: true }); segs.forEach(([n, m, c]) => { const li = al(leg, 'H', { gap: 6, align: 'CENTER' }); dot(li, 8, c); txt(li, `${n} ${m}m`, 'CR', C.sub); });
    const opened = ctx.live && st.boxOpened;
    const hero = al(b, 'V', { name: 'today-box', gap: 8, pad: [18, 20, 20, 20], fill: G.special, radius: 24, align: 'CENTER', fillW: true });
    pill(hero, '새벽 수영 한정', C.pink, C.ink, 'L', [5, 10]);
    const chest = art(hero, P.item.chest, 130); if (ctx.live && !opened) chest.classList.add('wiggle');
    if (opened) chest.style.opacity = 0.45;
    txt(hero, opened ? '오늘의 상자를 열었어요' : '오늘의 상자가 도착했어요', 'H', C.ink);
    txt(hero, opened ? '내일 수영하면 새 상자가 와요' : (ctx.live ? '오늘 기록(자유형 위주)으로 물고기 한 마리가 들어 있어요' : '오늘 기록으로 3개의 아이템이 들어 있어요'), 'CR', C.sub);
    if (ctx.live && !opened) tap(hero, () => ctx.act('openBox'), '상자 열기');
    if (opened) {
      // 오늘 만난 물고기 한 마리
      const k = st.lastCatch || 'mackerel';
      txt(b, '오늘 만난 친구', 'CM', C.sub);
      const card = al(b, 'H', { gap: 14, pad: [14, 16], fill: C.card, radius: 20, align: 'CENTER', fillW: true });
      const ho = al(card, 'H', { fill: '#E8F4FF', radius: 36, w: 72, h: 72, align: 'CENTER', justify: 'CENTER' }); art(ho, A.sea(k), 64);
      const col = al(card, 'V', { gap: 3, grow: true }); txt(col, SEA[k][0], 'H', C.ink); txt(col, SEA[k][2], 'CR', C.sub);
      art(card, P.icon.chev(), 18);
      tap(card, () => ctx.act('dexDetail', k), SEA[k][0] + ' 보기');
    } else {
      txt(b, ctx.live ? '오늘 나올 수 있는 친구' : '상자 속 미리보기', 'CM', C.sub);
      const items = al(b, 'H', { gap: 10, fillW: true });
      const preview = ctx.live
        ? [['clownfish', '자유형 · 짧게', C.soft, C.primary], ['mackerel', '자유형 · 오래', C.soft, C.primary], ['tuna', '드물게 · 빠르게', G.shine, C.primary]].map(([k, tag, tf, tc]) => [st.friends.includes(k) ? A.sea(k) : A.seaSilhouette(k), st.friends.includes(k) ? SEA[k][0] : '???', tag, tf, tc])
        : [[A.school(), '고등어 떼', '자유형 · 기본', C.line, C.sub], [A.sea('otter', true), '해달 수경', '배영 · 반짝이', G.shine, C.primary], [P.item.sunrise, '일출 배경', '새벽 · 한정', C.pinkL, C.coral]];
      preview.forEach(([svg, n, tag, tf, tc]) => {
        const c = al(items, 'V', { gap: 6, pad: [12, 8], fill: C.card, radius: 16, align: 'CENTER', grow: true });
        art(c, svg, 44); txt(c, n, 'CM', n === '???' ? C.mute : C.ink); pill(c, tag, tf, tc);
      });
    }
    cta(b, opened ? '꾸미러 가기' : '상자 열기', () => (opened ? ctx.go('dress') : ctx.act('openBox')));
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
    pill(hr, `보관함 ${ctx.live ? st.owned.length : 24}`, C.soft, C.primary, 'CM', [6, 10]);
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
        const owned = !ctx.live || st.owned.includes(tab + ':' + it.id);
        const locked = ctx.live ? !owned : it.id === 'sun';
        const on = st.equip[tab] === it.id;
        const [tf, tc] = on ? [C.btn, '#FFFFFF'] : (locked ? [C.line, C.mute] : tagTone(it.tone));
        return { svg: it.svg, name: it.name, tag: on ? '착용 중' : it.tag, tf, tc, sel: on, locked, fn: () => ctx.act('equip', tab, it.id) };
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
        pill(card, it.tag, it.tf, it.tc);
        tap(card, it.fn, it.name);
      }
    }
    const bn = al(b, 'H', { name: 'collab-banner', gap: 12, pad: [14, 16], fill: G.banner, radius: 18, align: 'CENTER', fillW: true });
    const bt = al(bn, 'V', { gap: 2, grow: true }); txt(bt, '브랜드 콜라보 수영복 도착', 'BM', C.ink); txt(bt, '획득하면 실물 수영복 20% 할인 쿠폰', 'CR', C.sub);
    art(bn, P.icon.chev(C.coral), 24);
    tap(bn, () => ctx.act('toast', '콜라보 수영복은 11월 수영장 대결 보상이에요'), '브랜드 콜라보 수영복');
    tabBar(s, '꾸미기');
    return s;
  };

  // ---------- 03 우리 수영장 ----------
  S['03'] = (ctx) => {
    const st = ctx.st;
    const s = screen('03');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, '우리 수영장', 'CR', C.sub); txt(hl, POOLS[st.pool][0], 'T', C.ink);
    pill(h, `멤버 ${POOLS[st.pool][2]}명`, C.soft, C.primary, 'CM', [6, 10]);
    const rc = al(b, 'V', { name: 'shared-reef', gap: 10, pad: [18, 18], fill: '#DDF5F2', radius: 24, fillW: true });
    const rh = al(rc, 'H', { justify: 'SPACE_BETWEEN', align: 'MAX', fillW: true });
    const rl = al(rh, 'V', { gap: 2 }); txt(rl, '이번 달 공동 리프', 'H', C.ink);
    const nums = al(rl, 'H', { gap: 4, align: 'MAX' }); txt(nums, '312', 'D', '#0E8F86'); txt(nums, '/ 500km', 'BM', C.sub);
    txt(rh, '62%', 'H', '#0E8F86');
    progress(rc, 62, '#1BB5AA', '#FFFFFF');
    art(rc, P.scene.reef, 318);
    txt(rc, '100km마다 산호가 하나씩 자라요 · 다음 산호까지 88km', 'CR', C.sub);
    const bc = al(b, 'V', { name: 'pool-battle', gap: 12, pad: [18, 18], fill: C.card, radius: 20, fillW: true });
    const bh = al(bc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(bh, '10월 수영장 대결', 'H', C.ink); pill(bh, 'D-9', C.pinkL, C.coral, 'L', [4, 8]);
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

  // 위에서 / 옆에서 토글
  function viewToggle(ctx, active) {
    const vt = al(null, 'H', { gap: 2, pad: [4, 4], fill: C.card, op: 0.92, radius: 999, align: 'CENTER' });
    [['top', '위에서', 'mypool'], ['side', '옆에서', 'mypool-side']].forEach(([k, l, r]) => {
      const on = k === active;
      const v = al(vt, 'H', { pad: [5, 10], radius: 999, fill: on ? C.btn : null }); txt(v, l, on ? 'L' : 'CM', on ? '#FFFFFF' : C.sub, { size: 12 });
      if (!on) tap(v, () => ctx.go(r), l + ' 보기');
    });
    return vt;
  }

  // ---------- 04 MY POOL (위에서) ----------
  S['04'] = (ctx) => {
    const st = ctx.st;
    const s = screen('04');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, 'MY POOL', 'L', C.primary); txt(hl, ctx.live ? `${st.name}의 풀` : '새벽반 토끼의 풀', 'T', C.ink);
    const cnt = al(h, 'H', { gap: 8, pad: [6, 10], fill: C.card, radius: 10, stroke: C.line, align: 'CENTER' });
    [['TODAY', '12', C.coral], ['TOTAL', '1,024', C.ink]].forEach(([k, v, c]) => { const x = al(cnt, 'V', { align: 'CENTER' }); txt(x, k, 'L', C.mute); txt(x, v, 'CM', c); });
    const msg = al(b, 'H', { gap: 6, pad: [8, 12], fill: C.card, radius: 12, align: 'CENTER', fillW: true });
    txt(msg, '오늘의 한마디', 'L', C.primary); txt(msg, '새벽반 4주째 개근 중! 다음 목표는 접영 마스터', 'CR', C.ink, { fillW: true });
    const sc = al(b, 'V', { name: 'pool-scene', gap: 4, pad: [12, 10, 8, 10], fill: '#E4F2FF', radius: 24, align: 'CENTER', fillW: true });
    const tool = al(sc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true, pad: [0, 4] });
    const deco = st.decorate !== false;
    tap(pill(tool, deco ? '꾸미기 모드' : '구경 모드', deco ? C.navy : C.card, deco ? '#FFFFFF' : C.ink, 'L', [5, 10]), () => ctx.act('toggleDecorate'), '꾸미기 모드 전환');
    const bgm = al(tool, 'H', { gap: 4, pad: [5, 10], fill: C.card, radius: 999, align: 'CENTER' }); art(bgm, P.icon.music, 14); txt(bgm, 'BGM 새벽 파도 소리', 'L', C.ink);
    const stage = al(sc, 'V', { w: 330, h: 273 });
    abs(stage, art(null, P.scene.myPool, 330), 0, 0);
    const swim = al(null, 'V', { w: 56, h: 44, clip: true, cls: 'float' }); art(swim, me(ctx), 56);
    abs(stage, swim, 137, 78);
    abs(stage, art(null, P.scene.ripple, 64), 133, 116);
    if (ctx.live) abs(stage, viewToggle(ctx, 'top'), null, 236, 4);
    const th = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(th, '놓을 수 있는 아이템', 'CM', C.ink); txt(th, '전체 보기', 'CR', C.sub);
    const tray = al(b, 'H', { gap: 8, fillW: true });
    [['coral', '분홍 산호'], ['weed', '해초'], ['shell', '조개'], ['ball', '비치볼'], ['star', '불가사리']].forEach(([k, n]) => {
      const left = st.tray[k];
      const t = al(tray, 'V', { gap: 2, pad: [8, 4], fill: C.card, radius: 14, align: 'CENTER', grow: true });
      art(t, P.item[k], 34, { opacity: left ? null : 0.35 }); txt(t, n, 'L', C.ink); txt(t, 'x' + left, 'L', C.mute);
      tap(t, () => ctx.act('place', k, n), n + ' 놓기');
    });
    const acts = al(b, 'H', { gap: 10, fillW: true });
    const gb = al(acts, 'H', { gap: 6, fill: C.card, radius: 16, stroke: C.line, align: 'CENTER', justify: 'CENTER', h: 52, grow: true, cls: 'btn' });
    txt(gb, '물방울 쪽지', 'BM', C.ink); if (st.guestbook) pill(gb, String(st.guestbook), C.pink, C.ink, 'L', [2, 7]);
    tap(gb, () => ctx.act('guestbook'), '물방울 쪽지');
    const wv = al(acts, 'H', { gap: 6, fill: C.btn, radius: 16, align: 'CENTER', justify: 'CENTER', h: 52, grow: true, cls: 'btn' });
    art(wv, P.icon.wave('#FFFFFF'), 20); txt(wv, '파도타기', 'BM', '#FFFFFF');
    tap(wv, () => ctx.act('toast', '옆 레인 햄스터의 풀로 파도타기는 곧 열려요'), '파도타기');
    tabBar(s, '꾸미기');
    return s;
  };

  // ---------- 04-2 MY POOL (옆에서, 왕복 영상) ----------
  S['04-2'] = (ctx) => {
    const st = ctx.st;
    const s = screen('04-2', { status: false });
    const scene = al(s, 'V', { name: 'pool-side-scene', fillW: true, h: 470, clip: true, cls: 'side-scene' });
    abs(scene, art(null, P.scene.sideBg, 390), 0, 0);
    abs(scene, art(null, A.swimmer(true), 104, { opacity: 0.28 }), 46, 66).classList.add('ghost');
    const classic = !ctx.live || (st.kind === 'rabbit' && st.fur === '#FFFFFF');
    if (classic) abs(scene, art(null, A.swimmer(false), 120), 214, 62).classList.add('swimmer');
    else { const w = al(null, 'V', { w: 90, h: 90, cls: 'swimmer' }); const a = art(w, me(ctx), 66); a.style.transform = 'rotate(84deg)'; a.style.margin = '0 auto'; abs(scene, w, 230, 64); }
    const fr = st.follow.length ? st.follow : [];
    [[70, 206, 46], [262, 268, 42], [160, 318, 56]].forEach(([x, y, w], i) => { if (fr[i]) abs(scene, art(null, A.sea(fr[i]), w), x, y).classList.add('drift', 'd' + (i + 1)); });
    abs(scene, art(null, P.scene.sideSurface, 390), 0, 104);
    const play = al(null, 'H', { gap: 6, pad: [6, 12], fill: C.card, op: 0.92, radius: 999, align: 'CENTER' }); art(play, P.icon.play, 10); txt(play, '자유형 왕복 중 · 실시간', 'L', C.ink, { size: 12 });
    abs(scene, play, 16, 384);
    abs(scene, viewToggle(ctx, 'side'), null, 384, 16);
    statusBar(s, true);
    const b = content(s, [14, 16, 100, 16], 12);
    const stc = al(b, 'V', { name: 'lap-status', gap: 12, pad: [16, 18], fill: C.card, radius: 20, fillW: true });
    const sr = al(stc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(sr, `${st.name} · 왕복 중`, 'H', C.ink); txt(sr, '25m 레인', 'CM', C.sub);
    const tr = al(stc, 'H', { gap: 6, align: 'CENTER', fillW: true });
    const sd = al(tr, 'H', { fill: C.soft, radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER' }); art(sd, P.icon.wave(), 16);
    const bar = al(tr, 'H', { fill: C.soft, radius: 5, h: 10, grow: true }); const f = al(bar, 'H', { fill: C.btn, radius: 5, grow: 60 }); f.style.alignSelf = 'stretch'; const r = al(bar, 'H', { grow: 40 }); r.style.alignSelf = 'stretch';
    const mb = al(tr, 'H', { fill: C.card, stroke: C.btn, sw: 2, radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER', clip: true });
    if (classic) art(mb, P.icon.me, 20); else art(mb, me(ctx), 30).style.marginTop = '8px';
    const gl = al(tr, 'H', { fill: '#FFF0FA', radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER' }); art(gl, P.icon.goal, 14);
    const cap = al(stc, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(cap, '오늘 12 / 20 왕복 · 600m', 'CM', C.sub); txt(cap, '다음 턴까지 0:18', 'CM', C.primary, { weight: 700 });
    txt(b, '오늘 풀에 생긴 일', 'CM', C.sub);
    [['clownfish', '흰동가리가 레인을 따라왔어요', '자유형 800m 달성', true], ['turtle', '바다거북이 놀러 왔어요', '평영 200m 달성', true], ['mackerel', '고등어 떼까지 2왕복', '오래 꾸준히 수영하면 만나요', false]].forEach(([k, t, sub, done]) => {
      const row = al(b, 'H', { gap: 12, pad: [12, 14], fill: C.card, radius: 20, align: 'CENTER', fillW: true });
      const ic = al(row, 'H', { fill: C.soft, radius: 16, w: 48, h: 48, align: 'CENTER', justify: 'CENTER' }); art(ic, A.sea(k), 40);
      const col = al(row, 'V', { gap: 2, grow: true }); txt(col, t, 'H', C.ink, { size: 15 }); txt(col, sub, 'CR', C.sub, { size: 13 });
      const ck = al(row, 'H', { fill: done ? '#E6F7EC' : '#F3F6F9', radius: 12, w: 40, h: 40, align: 'CENTER', justify: 'CENTER' }); art(ck, P.icon.bigCheck(done ? '#3FA65A' : '#C9D3DD'), 18);
    });
    tabBar(s, '꾸미기');
    return s;
  };

  // ---------- 05 바다 도감 ----------
  S['05'] = (ctx) => {
    const st = ctx.st;
    const s = screen('05');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, '만난 바다 친구', 'CR', C.sub); txt(hl, '바다 도감', 'T', C.ink);
    pill(h, `${ctx.live ? st.friends.length : 12} / 120종`, C.soft, C.primary, 'CM', [6, 10]);
    const pc = al(b, 'V', { gap: 8, pad: [14, 16], fill: G.dex, radius: 18, fillW: true });
    const pr = al(pc, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(pr, '다음 친구까지', 'CM', C.ink); txt(pr, '접영 120m 남음', 'CM', C.primary);
    progress(pc, 76, C.btn, '#FFFFFF');
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
        const isNew = k === 'dolphin';
        const tagText = { clownfish: '자유형 · 짧게', mackerel: '자유형 · 오래', tuna: '자유형 빠르게', turtle: '평영', otter: '배영', dolphin: '혼영 · NEW', humpback: '접영 500m', octopus: '이벤트', bluewhale: '접영 마스터' }[k];
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
    const pi = al(pf, 'V', { gap: 3, grow: true }); txt(pi, st.name, 'H', C.ink); txt(pi, `${POOLS[st.pool][0]} · 새벽 6시 중급반`, 'CR', C.sub); pill(pi, '킥판 졸업반', C.pinkL, '#D94FAE');
    const ed = al(pf, 'H', { pad: [6, 10], radius: 999, stroke: C.line }); txt(ed, '편집', 'CM', C.sub); tap(ed, () => ctx.go('pick'), '캐릭터 편집');
    const stats = al(b, 'H', { pad: [14, 8], fill: C.card, radius: 20, fillW: true });
    [['총 거리', '48.2km'], ['수영한 날', '36일'], ['최장 연속', '4주']].forEach(([k, v]) => { const c = al(stats, 'V', { gap: 2, align: 'CENTER', grow: true }); txt(c, v, 'H', C.ink); txt(c, k, 'CR', C.sub); });
    const gr = al(b, 'V', { name: 'graduation', gap: 8, pad: [14, 16], fill: G.soft3, radius: 20, fillW: true });
    const gt = al(gr, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(gt, '킥판 졸업까지', 'BM', C.ink); txt(gt, '12km 남음', 'CM', C.primary);
    progress(gr, 80, C.btn, '#FFFFFF');
    txt(gr, `졸업하면 ${st.name.replace('새벽반 ', '')}가 킥판 없이 헤엄쳐요`, 'CR', C.sub);
    const unread = NOTICES.length - st.read.length;
    const list = al(b, 'V', { fill: C.card, radius: 20, fillW: true, pad: [4, 0] });
    [['워치 연동', 'Apple Watch 연결됨', () => ctx.act('toast', 'Apple Watch에서 오늘 기록을 받아왔어요')], ['내 수영장', POOLS[st.pool][0], () => ctx.go('pool-pick')], ['우리 강습반', '새벽 6시 중급반', () => ctx.go('pool')], ['보관함', `아이템 ${st.owned.length}개`, () => ctx.go('dress')], ['알림 설정', '', () => ctx.act('toast', '알림 설정은 곧 열려요')], ['공지사항', unread > 0 ? `새 글 ${Math.min(2, unread)}` : '', () => ctx.go('notice')]].forEach(([t, v, fn], i) => {
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
    const tiles = [[M.box, '오늘의 상자', 'home'], [M.shirt, '꾸미기', 'dress'], [M.pool, 'MY POOL', 'mypool'], [M.group, '우리 수영장', 'pool'], [M.book, '바다 도감', 'dex'], [M.chart, '수영 기록', null]];
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
    const help = [['설정', '', soon('설정은 곧 열려요')], ['고객센터', '', soon('고객센터는 곧 열려요')], ['이용약관 · 개인정보', '', soon('이용약관은 곧 열려요')]];
    if (ctx.live) help.push(['디자인 시안 보기', '', () => ctx.act('about')], ['데모 처음부터 다시', '', () => ctx.act('reset')]);
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
    txt(cc, '11월 수영장 대결이 시작됐어요!', 'H', C.ink); txt(cc, '우리 수영장을 응원해 주세요 · D-30', 'CR', C.sub);
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

  const DEFAULT_CTX = () => ({ st: JSON.parse(JSON.stringify(DEFAULT_STATE)), go() {}, act() {}, back() {}, live: false });
  function render(id, ctx) { CTX = ctx || DEFAULT_CTX(); const s = S[id](CTX); applyOverlaps(s); return s; }
  window.USUKKU = { render, ids: Object.keys(S), C, G, DEFAULT_STATE, ANIMALS, FURS, POOLS, ITEMS, SEA, NOTICES, furName, animalName, me: (ctx, e) => me(ctx, e) };
})();
