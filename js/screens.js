// 우수꾸 화면: 피그마 오토레이아웃 규칙을 그대로 옮긴 빌더 + 13개 화면
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
  const ALIGN = { MIN: 'flex-start', CENTER: 'center', MAX: 'flex-end', SPACE_BETWEEN: 'space-between' };
  const rgba = (h, a) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;

  // 자식이 부모 오토레이아웃 안에서 어떻게 늘어나는지 (Fixed / Hug / Fill)
  function sizing(el, parent, o) {
    el.style.flex = 'none';
    const pd = parent && parent.dataset ? parent.dataset.dir : null;
    if (o.fillW) { if (pd === 'H') { el.style.flex = '1 1 0'; el.style.minWidth = '0'; } else el.style.alignSelf = 'stretch'; }
    if (o.grow) { el.style.flex = `${o.grow === true ? 1 : o.grow} 1 0`; el.style.minWidth = '0'; el.style.minHeight = '0'; }
    if (o.fillH) el.style.alignSelf = 'stretch';
  }
  // 오토레이아웃 프레임
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
  // 텍스트 스타일 (Display / Title / Heading / Body / Caption / Label)
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
  // 벡터 일러스트 (가로 w, 비율 유지)
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

  // ---------- 공통 컴포넌트 ----------
  function screen(id, opts = {}) {
    const s = al(null, 'V', { cls: 'screen', fill: opts.fill || C.bg });
    s.id = 'screen-' + id;
    if (opts.status !== false) statusBar(s);
    return s;
  }
  function statusBar(parent, absolute) {
    const b = al(parent, 'H', { name: 'StatusBar', justify: 'SPACE_BETWEEN', align: 'CENTER', pad: [14, 24, 6, 28], w: 390, h: 44 });
    txt(b, '9:41', 'CM', C.ink);
    art(b, P.icon.status, 66);
    if (absolute) abs(parent, b, 0, 0);
    return b;
  }
  function tabBar(parent, active) {
    const t = al(parent, 'H', { name: 'TabBar', cls: 'tabbar', justify: 'SPACE_BETWEEN', pad: [10, 12, 26, 12], fill: C.card, w: 390, h: 84 });
    t.style.borderTop = `1px solid ${C.line}`;
    for (const k of Object.keys(P.tab)) {
      const col = k === active ? C.primary : C.mute;
      const it = al(t, 'V', { gap: 4, align: 'CENTER', grow: true, cls: 'tab-item' });
      it.dataset.tab = k;
      art(it, P.tab[k](col), 24);
      txt(it, k, 'L', col);
    }
    abs(parent, t, 0, 760);
    return t;
  }
  function content(parent, pad, gap) { return al(parent, 'V', { name: 'content', gap, pad, fillW: true }); }
  function progress(parent, pct, col, track) {
    const tr = al(parent, 'H', { name: 'progress', fill: track, radius: 5, fillW: true, h: 10 });
    const f = al(tr, 'H', { fill: col, radius: 5, grow: pct }); f.style.alignSelf = 'stretch';
    const r = al(tr, 'H', { grow: 100 - pct }); r.style.alignSelf = 'stretch';
    return tr;
  }
  function pill(parent, text, fill, color, k = 'L', pad = [3, 8]) { const p = al(parent, 'H', { pad, fill, radius: 999 }); txt(p, text, k, color); return p; }
  function cta(parent, label) { const b = al(parent, 'H', { name: 'cta', fill: C.btn, radius: 16, align: 'CENTER', justify: 'CENTER', fillW: true, h: 54, cls: 'btn' }); txt(b, label, 'H', '#FFFFFF'); return b; }
  function steps(parent, n) { const p = al(parent, 'H', { name: 'steps', gap: 6, fillW: true }); for (let i = 0; i < 3; i++) al(p, 'H', { fill: i < n ? C.btn : C.line, radius: 3, h: 5, grow: true }); return p; }
  function divider(row, i) { if (i > 0) row.style.borderTop = '1px solid #EEF2F8'; }

  const S = {};

  // ---------- 00-0 스플래시 ----------
  S['00-0'] = () => {
    const s = screen('00-0', { status: false, fill: G.splash });
    s.style.justifyContent = 'center'; s.style.alignItems = 'center'; s.style.gap = '10px';
    art(s, P.scene.bubbles, 60);
    txt(s, '우수꾸', 'D', C.ink, { size: 48, weight: 800 });
    txt(s, '우리 수영장 꾸미자', 'BM', C.sub);
    al(s, 'V', { h: 40 });
    const line = al(s, 'H', { gap: -8, align: 'MAX', name: 'character-lineup' });
    [['hamster', 'default', 72], ['sheep', 'default', 78], ['rabbit', 'white', 92], ['bear', 'default', 76], ['cat', 'white', 74]].forEach(([k, f, w]) => art(line, A.animal(k, f), w));
    al(s, 'V', { h: 30 });
    const ld = al(s, 'H', { gap: 6, align: 'CENTER' }); [1, 0.6, 0.3].forEach((o) => dot(ld, 7, C.btn, { opacity: o }));
    txt(s, '물과 친해지는 중…', 'CR', C.sub);
    return s;
  };

  // ---------- 00-0b 인트로 · 로그인 ----------
  S['00-0b'] = () => {
    const s = screen('00-0b');
    const ill = al(s, 'V', { name: 'intro-illustration', fill: C.sky, fillW: true, h: 360, clip: true });
    abs(ill, art(null, P.scene.introPool, 390), 0, 0);
    [['sheep', 'default', 'normal', 72, 22], ['hamster', 'default', 'puff', 70, 94], ['rabbit', 'white', 'normal', 92, 158], ['bear', 'default', 'normal', 74, 240], ['cat', 'default', 'puff', 72, 304]]
      .forEach(([k, f, e, w, x]) => abs(ill, art(null, A.animal(k, f, e), w), x, 232 - w * 1.3));
    const b = al(s, 'V', { name: 'content', gap: 10, pad: [28, 24, 34, 24], fillW: true, grow: true });
    txt(b, '물이 무서운 친구들이\n수영장에 등록했어요', 'T', C.ink, { fillW: true, size: 24 });
    txt(b, '내 수영 기록만큼 친구들도 조금씩 물과 친해져요.\n킥판을 졸업하는 그날까지, 같이 헤엄쳐요.', 'BR', C.sub, { fillW: true });
    al(b, 'V', { fillW: true, grow: true });
    const k = al(b, 'H', { gap: 8, fill: '#FEE500', radius: 16, align: 'CENTER', justify: 'CENTER', fillW: true, h: 54, cls: 'btn' }); art(k, P.icon.kakao, 20); txt(k, '카카오로 시작하기', 'BM', '#191919');
    const a = al(b, 'H', { gap: 8, fill: '#111111', radius: 16, align: 'CENTER', justify: 'CENTER', fillW: true, h: 54, cls: 'btn' }); art(a, P.icon.apple, 18); txt(a, 'Apple로 계속하기', 'BM', '#FFFFFF');
    const e = al(b, 'H', { align: 'CENTER', justify: 'CENTER', fillW: true, h: 40 }); txt(e, '이메일로 시작하기', 'CM', C.sub);
    return s;
  };

  // ---------- 00 캐릭터 선택 ----------
  S['00'] = () => {
    const s = screen('00');
    const b = al(s, 'V', { name: 'content', gap: 14, pad: [10, 20, 34, 20], fillW: true, grow: true });
    steps(b, 1);
    const tt = al(b, 'V', { gap: 6, fillW: true });
    txt(tt, '함께 수영할 친구를\n골라주세요', 'T', C.ink, { fillW: true });
    txt(tt, '수모, 수경, 수영복은 언제든 바꿀 수 있어요', 'CR', C.sub, { fillW: true });
    const pv = al(b, 'V', { name: 'preview', gap: 8, pad: [14, 16], fill: C.sky, radius: 24, align: 'CENTER', fillW: true });
    art(pv, A.animal('rabbit', 'white'), 110);
    pill(pv, '흰 토끼', C.card, C.ink, 'CM', [4, 12]);
    const pick = al(b, 'H', { name: 'animal-pick', gap: 6, fillW: true });
    [['rabbit', '토끼', 'white'], ['hamster', '햄스터'], ['bear', '곰'], ['cat', '고양이'], ['sheep', '양']].forEach(([k, l, f], i) => {
      const sel = i === 0;
      const o = al(pick, 'V', { gap: 2, pad: [8, 4], fill: '#EAF5FF', radius: 16, align: 'CENTER', grow: true, stroke: sel ? C.btn : C.line, sw: sel ? 2.5 : 1 });
      art(o, A.animal(k, f || 'default'), 50);
      txt(o, l, 'CM', sel ? C.ink : C.sub);
    });
    const fur = al(b, 'V', { gap: 10, fillW: true });
    txt(fur, '털 색', 'CM', C.ink);
    const sw = al(fur, 'H', { gap: 12 });
    [['#FFFFFF', true], ['#FFD9E0'], ['#F4E3C8'], ['#C9CED6'], ['#B98563']].forEach(([c, sel]) => dot(sw, 32, c, { stroke: sel ? C.navy : (c === '#FFFFFF' ? '#C9D6E3' : c), sw: sel ? 3 : 1 }));
    const nm = al(b, 'V', { gap: 8, fillW: true });
    txt(nm, '캐릭터 이름', 'CM', C.ink);
    const field = al(nm, 'H', { pad: [0, 16], fill: C.card, radius: 14, stroke: C.btn, sw: 1.5, align: 'CENTER', fillW: true, h: 50 });
    txt(field, '새벽반 흰토끼', 'BM', C.ink);
    txt(nm, '수영장 친구들에게 보이는 이름이에요', 'CR', C.sub);
    al(b, 'V', { fillW: true, grow: true });
    cta(b, '다음');
    return s;
  };

  // ---------- 00-2 수영장 선택 ----------
  S['00-2'] = () => {
    const s = screen('00-2');
    const b = al(s, 'V', { name: 'content', gap: 14, pad: [10, 20, 34, 20], fillW: true, grow: true });
    steps(b, 2);
    const tt = al(b, 'V', { gap: 4, fillW: true });
    txt(tt, '자주 다니는 수영장을 골라주세요', 'T', C.ink, { fillW: true });
    txt(tt, '현재 위치에서 가까운 수영장이에요.\n위치는 수영장 찾기와 체크인에만 써요.', 'CR', C.sub, { fillW: true });
    const sr = al(b, 'H', { gap: 8, pad: [0, 14], fill: C.card, radius: 14, stroke: C.line, align: 'CENTER', fillW: true, h: 46 });
    art(sr, P.icon.search, 18); txt(sr, '수영장 이름이나 동네로 검색', 'BR', C.mute);
    const map = al(b, 'V', { name: 'map', radius: 20, fillW: true, h: 180, clip: true });
    abs(map, art(null, P.scene.map, 350), 0, 0);
    abs(map, (() => { const c = al(null, 'H', { gap: 4, pad: [5, 10], fill: C.navy, radius: 999, align: 'CENTER' }); txt(c, '물빛 수영장', 'L', '#FFFFFF'); return c; })(), 228, 30);
    abs(map, (() => { const c = al(null, 'H', { fill: C.card, radius: 18, w: 36, h: 36, align: 'CENTER', justify: 'CENTER' }); art(c, P.icon.locate, 18); return c; })(), 302, 132);
    const list = al(b, 'V', { gap: 8, fillW: true });
    [['물빛 수영장', '0.6km · 25m 6레인 · 자유수영 가능', '우수꾸 멤버 128명', true], ['햇살 스포츠센터', '1.2km · 50m 8레인 · 자유수영 가능', '우수꾸 멤버 342명'], ['파랑 구민체육센터', '2.1km · 25m 5레인 · 강습 전용', '우수꾸 멤버 57명']].forEach(([n, meta, mem, sel]) => {
      const r = al(list, 'H', { gap: 12, pad: [12, 14], fill: C.card, radius: 16, align: 'CENTER', fillW: true, stroke: sel ? C.btn : C.line, sw: sel ? 2 : 1 });
      const ic = al(r, 'H', { fill: sel ? C.soft : C.paleBlue, radius: 12, w: 40, h: 40, align: 'CENTER', justify: 'CENTER' }); art(ic, P.icon.wave(sel ? C.primary : C.mute), 20);
      const col = al(r, 'V', { gap: 2, grow: true });
      const top = al(col, 'H', { gap: 6, align: 'CENTER' }); txt(top, n, 'BM', C.ink); pill(top, mem, sel ? C.soft : C.paleBlue, sel ? C.primary : C.sub, 'L', [2, 6]);
      txt(col, meta, 'CR', C.sub);
      const rd = al(r, 'H', { fill: sel ? C.btn : C.card, stroke: sel ? null : C.mute, sw: 1.5, radius: 11, w: 22, h: 22, align: 'CENTER', justify: 'CENTER' });
      if (sel) dot(rd, 8, '#FFFFFF');
    });
    const add = al(b, 'H', { gap: 4, align: 'CENTER' }); txt(add, '찾는 수영장이 없나요?', 'CR', C.sub); txt(add, '직접 등록하기', 'CM', C.primary);
    al(b, 'V', { fillW: true, grow: true });
    cta(b, '물빛 수영장으로 시작하기');
    return s;
  };

  // ---------- 01 오늘의 상자 ----------
  S['01'] = () => {
    const s = screen('01');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, '10월 22일 목요일 · 새벽 6:40', 'CR', C.sub); txt(hl, '오늘의 수영 완료!', 'T', C.ink);
    const st = al(h, 'H', { gap: 4, pad: [6, 10], fill: C.soft, radius: 999, align: 'CENTER' }); art(st, P.icon.wave(), 16); txt(st, '4주 연속', 'CM', C.primary);
    const sum = al(b, 'V', { gap: 14, pad: [18, 18], fill: C.card, radius: 20, fillW: true });
    const stats = al(sum, 'H', { justify: 'SPACE_BETWEEN', fillW: true });
    [['거리', '1,250m', C.ink], ['시간', '42분', C.ink], ['효율', '+3 향상', C.primary]].forEach(([l, v, c]) => { const x = al(stats, 'V', { gap: 2, grow: true }); txt(x, l, 'CR', C.sub); txt(x, v, 'H', c); });
    const segs = [['자유형', 800, '#4DA3FF'], ['배영', 250, '#B07A52'], ['평영', 200, '#3FA65A']];
    const bar = al(sum, 'H', { gap: 3, fillW: true, h: 10 }); segs.forEach(([, m, c]) => { const g = al(bar, 'H', { fill: c, radius: 5, grow: m }); g.style.alignSelf = 'stretch'; });
    const leg = al(sum, 'H', { gap: 14, fillW: true }); segs.forEach(([n, m, c]) => { const li = al(leg, 'H', { gap: 6, align: 'CENTER' }); dot(li, 8, c); txt(li, `${n} ${m}m`, 'CR', C.sub); });
    const hero = al(b, 'V', { name: 'today-box', gap: 8, pad: [18, 20, 20, 20], fill: G.special, radius: 24, align: 'CENTER', fillW: true });
    pill(hero, '새벽 수영 한정', C.pink, C.ink, 'L', [5, 10]);
    art(hero, P.item.chest, 130);
    txt(hero, '오늘의 상자가 도착했어요', 'H', C.ink);
    txt(hero, '오늘 기록으로 3개의 아이템이 들어 있어요', 'CR', C.sub);
    txt(b, '상자 속 미리보기', 'CM', C.sub);
    const items = al(b, 'H', { gap: 10, fillW: true });
    [[A.school(), '고등어 떼', '자유형 · 기본', C.line, C.sub], [A.sea('otter', true), '해달 수경', '배영 · 반짝이', G.shine, C.primary], [P.item.sunrise, '일출 배경', '새벽 · 한정', C.pinkL, C.coral]].forEach(([svg, n, tag, tf, tc]) => {
      const c = al(items, 'V', { gap: 6, pad: [12, 8], fill: C.card, radius: 16, align: 'CENTER', grow: true });
      art(c, svg, 44); txt(c, n, 'CM', C.ink); pill(c, tag, tf, tc);
    });
    cta(b, '상자 열기');
    tabBar(s, '홈');
    return s;
  };

  // ---------- 02 꾸미기 ----------
  S['02'] = () => {
    const s = screen('02');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(h, '꾸미기', 'T', C.ink); pill(h, '보관함 24', C.soft, C.primary, 'CM', [6, 10]);
    const stage = al(b, 'V', { name: 'stage', gap: 10, pad: [20, 16, 16, 16], fill: C.sky, radius: 24, align: 'CENTER', fillW: true });
    const row = al(stage, 'H', { gap: 6, align: 'MAX' });
    art(row, A.animal('rabbit', 'white'), 100);
    const trail = al(row, 'H', { align: 'CENTER', pad: [0, 0, 30, 0] });
    art(trail, A.sea('clownfish'), 34); art(trail, A.sea('mackerel'), 30); art(trail, A.sea('turtle'), 38);
    pill(stage, '바다 친구 3마리가 줄지어 따라와요', C.card, C.ink, 'CM', [5, 12]);
    const chips = al(b, 'H', { gap: 8, fillW: true });
    ['수모', '수경', '수영복', '오리발', '바다 친구'].forEach((c, i) => { const ch = al(chips, 'H', { pad: [7, 12], radius: 999, fill: i === 0 ? C.navy : C.card, stroke: i === 0 ? null : C.line }); txt(ch, c, 'CM', i === 0 ? '#FFFFFF' : C.sub); });
    const I = P.item;
    const data = [
      [I.cap('#1F8BFF'), '기본 수모', '착용 중', C.btn, '#FFFFFF'],
      [I.cap('#FF9EC4', I.capDots), '물방울 수모', '기본', C.line, C.sub],
      [I.cap('#3B6FD8', I.capWhale), '고래 수모', '접영 · 반짝이', G.shine, C.primary],
      [I.cap('#0F2A43', I.capRainbow), '무지개 수모', '혼영 · 무지개', G.rainbow, C.ink],
      [I.cap('#3FA65A', I.capTeam), '중급반 팀 수모', '팀 한정', C.pinkL, C.coral],
      [I.cap('#FFB547', I.capSun), '일출 수모', '새벽 10회 달성 시', C.line, C.mute, true],
    ];
    const grid = al(b, 'V', { gap: 10, fillW: true });
    for (let r = 0; r < 2; r++) {
      const rw = al(grid, 'H', { gap: 10, fillW: true });
      for (let c = 0; c < 3; c++) {
        const [svg, n, tag, tf, tc, locked] = data[r * 3 + c];
        const card = al(rw, 'V', { gap: 6, pad: [12, 6], fill: C.card, radius: 16, align: 'CENTER', grow: true, stroke: r === 0 && c === 0 ? C.btn : null, sw: 2 });
        art(card, svg, 46, { opacity: locked ? 0.35 : null });
        txt(card, n, 'CM', locked ? C.mute : C.ink);
        pill(card, tag, tf, tc);
      }
    }
    const bn = al(b, 'H', { name: 'collab-banner', gap: 12, pad: [14, 16], fill: G.banner, radius: 18, align: 'CENTER', fillW: true });
    const bt = al(bn, 'V', { gap: 2, grow: true }); txt(bt, '브랜드 콜라보 수영복 도착', 'BM', C.ink); txt(bt, '획득하면 실물 수영복 20% 할인 쿠폰', 'CR', C.sub);
    art(bn, P.icon.chev(C.coral), 24);
    tabBar(s, '꾸미기');
    return s;
  };

  // ---------- 03 우리 수영장 ----------
  S['03'] = () => {
    const s = screen('03');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, '우리 수영장', 'CR', C.sub); txt(hl, '물빛 수영장', 'T', C.ink);
    pill(h, '멤버 128명', C.soft, C.primary, 'CM', [6, 10]);
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
    [['물빛 수영장 (우리)', '312km', 100, C.btn, C.soft, C.primary], ['바람결 수영장', '287km', 92, C.pink, C.pinkL, C.coral]].forEach(([n, km, pct, col, trk, tc]) => {
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
    tabBar(s, '우리 수영장');
    return s;
  };

  // ---------- 04 MY POOL (위에서) ----------
  S['04'] = () => {
    const s = screen('04');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, 'MY POOL', 'L', C.primary); txt(hl, '새벽반 토끼의 풀', 'T', C.ink);
    const cnt = al(h, 'H', { gap: 8, pad: [6, 10], fill: C.card, radius: 10, stroke: C.line, align: 'CENTER' });
    [['TODAY', '12', C.coral], ['TOTAL', '1,024', C.ink]].forEach(([k, v, c]) => { const x = al(cnt, 'V', { align: 'CENTER' }); txt(x, k, 'L', C.mute); txt(x, v, 'CM', c); });
    const msg = al(b, 'H', { gap: 6, pad: [8, 12], fill: C.card, radius: 12, align: 'CENTER', fillW: true });
    txt(msg, '오늘의 한마디', 'L', C.primary); txt(msg, '새벽반 4주째 개근 중! 다음 목표는 접영 마스터', 'CR', C.ink, { fillW: true });
    const sc = al(b, 'V', { name: 'pool-scene', gap: 4, pad: [12, 10, 8, 10], fill: '#E4F2FF', radius: 24, align: 'CENTER', fillW: true });
    const tool = al(sc, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true, pad: [0, 4] });
    pill(tool, '꾸미기 모드', C.navy, '#FFFFFF', 'L', [5, 10]);
    const bgm = al(tool, 'H', { gap: 4, pad: [5, 10], fill: C.card, radius: 999, align: 'CENTER' }); art(bgm, P.icon.music, 14); txt(bgm, 'BGM 새벽 파도 소리', 'L', C.ink);
    art(sc, P.scene.myPool, 330);
    const th = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(th, '놓을 수 있는 아이템', 'CM', C.ink); txt(th, '전체 보기', 'CR', C.sub);
    const tray = al(b, 'H', { gap: 8, fillW: true });
    [['coral', '분홍 산호', 'x2'], ['weed', '해초', 'x1'], ['shell', '조개', 'x3'], ['ball', '비치볼', 'x1'], ['star', '불가사리', 'x2']].forEach(([k, n, c]) => {
      const t = al(tray, 'V', { gap: 2, pad: [8, 4], fill: C.card, radius: 14, align: 'CENTER', grow: true });
      art(t, P.item[k], 34); txt(t, n, 'L', C.ink); txt(t, c, 'L', C.mute);
    });
    const acts = al(b, 'H', { gap: 10, fillW: true });
    const gb = al(acts, 'H', { gap: 6, fill: C.card, radius: 16, stroke: C.line, align: 'CENTER', justify: 'CENTER', h: 52, grow: true, cls: 'btn' });
    txt(gb, '물방울 쪽지', 'BM', C.ink); pill(gb, '5', C.pink, C.ink, 'L', [2, 7]);
    const wv = al(acts, 'H', { gap: 6, fill: C.btn, radius: 16, align: 'CENTER', justify: 'CENTER', h: 52, grow: true, cls: 'btn' });
    art(wv, P.icon.wave('#FFFFFF'), 20); txt(wv, '파도타기', 'BM', '#FFFFFF');
    tabBar(s, '꾸미기');
    return s;
  };

  // ---------- 04-2 MY POOL (옆에서, 왕복 영상) ----------
  S['04-2'] = () => {
    const s = screen('04-2', { status: false });
    const scene = al(s, 'V', { name: 'pool-side-scene', fillW: true, h: 470, clip: true, cls: 'side-scene' });
    abs(scene, art(null, P.scene.sideBg, 390), 0, 0);
    abs(scene, art(null, A.swimmer(true), 104, { opacity: 0.28 }), 46, 66).classList.add('ghost');
    abs(scene, art(null, A.swimmer(false), 120), 214, 62).classList.add('swimmer');
    abs(scene, art(null, A.sea('clownfish'), 46), 70, 206).classList.add('drift');
    abs(scene, art(null, A.sea('mackerel'), 42), 262, 268).classList.add('drift', 'd2');
    abs(scene, art(null, A.sea('turtle'), 56), 160, 318).classList.add('drift', 'd3');
    abs(scene, art(null, P.scene.sideSurface, 390), 0, 104);
    const play = al(null, 'H', { gap: 6, pad: [6, 12], fill: C.card, op: 0.92, radius: 999, align: 'CENTER' }); art(play, P.icon.play, 10); txt(play, '자유형 왕복 중 · 실시간', 'L', C.ink, { size: 12 });
    abs(scene, play, 16, 384);
    const vt = al(null, 'H', { gap: 2, pad: [4, 4], fill: C.card, op: 0.92, radius: 999, align: 'CENTER' });
    const v1 = al(vt, 'H', { pad: [5, 10], radius: 999 }); txt(v1, '위에서', 'CM', C.sub, { size: 12 });
    const v2 = al(vt, 'H', { pad: [5, 10], fill: C.btn, radius: 999 }); txt(v2, '옆에서', 'L', '#FFFFFF', { size: 12 });
    abs(scene, vt, null, 384, 16);
    statusBar(s, true);
    const b = content(s, [14, 16, 100, 16], 12);
    const st = al(b, 'V', { name: 'lap-status', gap: 12, pad: [16, 18], fill: C.card, radius: 20, fillW: true });
    const sr = al(st, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(sr, '새벽반 흰토끼 · 왕복 중', 'H', C.ink); txt(sr, '25m 레인', 'CM', C.sub);
    const tr = al(st, 'H', { gap: 6, align: 'CENTER', fillW: true });
    const sd = al(tr, 'H', { fill: C.soft, radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER' }); art(sd, P.icon.wave(), 16);
    const bar = al(tr, 'H', { fill: C.soft, radius: 5, h: 10, grow: true }); const f = al(bar, 'H', { fill: C.btn, radius: 5, grow: 60 }); f.style.alignSelf = 'stretch'; const r = al(bar, 'H', { grow: 40 }); r.style.alignSelf = 'stretch';
    const me = al(tr, 'H', { fill: C.card, stroke: C.btn, sw: 2, radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER' }); art(me, P.icon.me, 20);
    const gl = al(tr, 'H', { fill: '#FFF0FA', radius: 14, w: 28, h: 28, align: 'CENTER', justify: 'CENTER' }); art(gl, P.icon.goal, 14);
    const cap = al(st, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(cap, '오늘 12 / 20 왕복 · 600m', 'CM', C.sub); txt(cap, '다음 턴까지 0:18', 'CM', C.primary, { weight: 700 });
    txt(b, '오늘 풀에 생긴 일', 'CM', C.sub);
    [[A.sea('clownfish'), '흰동가리가 레인을 따라왔어요', '자유형 800m 달성', true], [A.sea('turtle'), '바다거북이 놀러 왔어요', '평영 200m 달성', true], [A.sea('mackerel'), '고등어 떼까지 2왕복', '오래 꾸준히 수영하면 만나요', false]].forEach(([svg, t, sub, done]) => {
      const row = al(b, 'H', { gap: 12, pad: [12, 14], fill: C.card, radius: 20, align: 'CENTER', fillW: true });
      const ic = al(row, 'H', { fill: C.soft, radius: 16, w: 48, h: 48, align: 'CENTER', justify: 'CENTER' }); art(ic, svg, 40);
      const col = al(row, 'V', { gap: 2, grow: true }); txt(col, t, 'H', C.ink, { size: 15 }); txt(col, sub, 'CR', C.sub, { size: 13 });
      const ck = al(row, 'H', { fill: done ? '#E6F7EC' : '#F3F6F9', radius: 12, w: 40, h: 40, align: 'CENTER', justify: 'CENTER' }); art(ck, P.icon.bigCheck(done ? '#3FA65A' : '#C9D3DD'), 18);
    });
    tabBar(s, '꾸미기');
    return s;
  };

  // ---------- 05 바다 도감 ----------
  S['05'] = () => {
    const s = screen('05');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true });
    const hl = al(h, 'V', { gap: 2 }); txt(hl, '만난 바다 친구', 'CR', C.sub); txt(hl, '바다 도감', 'T', C.ink);
    pill(h, '12 / 120종', C.soft, C.primary, 'CM', [6, 10]);
    const pc = al(b, 'V', { gap: 8, pad: [14, 16], fill: G.dex, radius: 18, fillW: true });
    const pr = al(pc, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(pr, '다음 친구까지', 'CM', C.ink); txt(pr, '접영 120m 남음', 'CM', C.primary);
    progress(pc, 76, C.btn, '#FFFFFF');
    const chips = al(b, 'H', { gap: 8, fillW: true });
    ['전체', '물고기', '고래', '거북·해달', '기타'].forEach((c, i) => { const ch = al(chips, 'H', { pad: [7, 12], radius: 999, fill: i === 0 ? C.ink : C.card, stroke: i === 0 ? null : C.line }); txt(ch, c, 'CM', i === 0 ? '#FFFFFF' : C.sub); });
    const items = [['clownfish', '흰동가리', '자유형 · 짧게', 1], ['mackerel', '고등어', '자유형 · 오래', 1], ['tuna', '???', '자유형 빠르게', 0], ['turtle', '바다거북', '평영', 1], ['otter', '해달', '배영', 1], ['dolphin', '돌고래', '혼영 · NEW', 1], ['humpback', '???', '접영 500m', 0], ['octopus', '문어', '이벤트', 1], ['bluewhale', '???', '접영 마스터', 0]];
    const grid = al(b, 'V', { gap: 10, fillW: true });
    for (let r = 0; r < 3; r++) {
      const row = al(grid, 'H', { gap: 10, fillW: true });
      for (let c = 0; c < 3; c++) {
        const [k, name, tag, found] = items[r * 3 + c];
        const card = al(row, 'V', { gap: 6, pad: [12, 6], fill: found ? C.card : '#EEF3F8', radius: 18, align: 'CENTER', grow: true });
        const ho = al(card, 'H', { fill: found ? '#E8F4FF' : '#E2EAF2', radius: 30, w: 60, h: 60, align: 'CENTER', justify: 'CENTER' });
        art(ho, found ? A.sea(k) : A.seaSilhouette(k), 54);
        txt(card, name, 'CM', found ? C.ink : C.mute);
        const isNew = tag.includes('NEW');
        pill(card, found ? tag : '🔒 ' + tag, found ? (isNew ? C.pinkL : C.soft) : '#FFFFFF', found ? (isNew ? '#D94FAE' : C.primary) : C.mute);
      }
    }
    tabBar(s, '도감');
    return s;
  };

  // ---------- 06 마이페이지 ----------
  S['06'] = () => {
    const s = screen('06');
    const b = content(s, [6, 20, 100, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(h, '마이', 'T', C.ink); art(h, P.icon.gear, 24);
    const pf = al(b, 'H', { gap: 14, pad: [16, 16], fill: C.card, radius: 22, align: 'CENTER', fillW: true });
    const av = al(pf, 'H', { fill: C.sky, radius: 40, w: 80, h: 80, align: 'CENTER', justify: 'CENTER', clip: true }); art(av, A.animal('rabbit', 'white'), 78);
    const pi = al(pf, 'V', { gap: 3, grow: true }); txt(pi, '새벽반 흰토끼', 'H', C.ink); txt(pi, '물빛 수영장 · 새벽 6시 중급반', 'CR', C.sub); pill(pi, '킥판 졸업반', C.pinkL, '#D94FAE');
    const ed = al(pf, 'H', { pad: [6, 10], radius: 999, stroke: C.line }); txt(ed, '편집', 'CM', C.sub);
    const stats = al(b, 'H', { pad: [14, 8], fill: C.card, radius: 20, fillW: true });
    [['총 거리', '48.2km'], ['수영한 날', '36일'], ['최장 연속', '4주']].forEach(([k, v]) => { const c = al(stats, 'V', { gap: 2, align: 'CENTER', grow: true }); txt(c, v, 'H', C.ink); txt(c, k, 'CR', C.sub); });
    const gr = al(b, 'V', { name: 'graduation', gap: 8, pad: [14, 16], fill: G.soft3, radius: 20, fillW: true });
    const gt = al(gr, 'H', { justify: 'SPACE_BETWEEN', fillW: true }); txt(gt, '킥판 졸업까지', 'BM', C.ink); txt(gt, '12km 남음', 'CM', C.primary);
    progress(gr, 80, C.btn, '#FFFFFF');
    txt(gr, '졸업하면 흰토끼가 킥판 없이 헤엄쳐요', 'CR', C.sub);
    const list = al(b, 'V', { fill: C.card, radius: 20, fillW: true, pad: [4, 0] });
    [['워치 연동', 'Apple Watch 연결됨'], ['내 수영장', '물빛 수영장'], ['우리 강습반', '새벽 6시 중급반'], ['보관함', '아이템 24개'], ['알림 설정', ''], ['공지사항', '새 글 2']].forEach(([t, v], i) => {
      const r = al(list, 'H', { gap: 8, pad: [14, 16], align: 'CENTER', fillW: true }); divider(r, i);
      txt(r, t, 'BM', C.ink, { grow: true });
      if (v) { if (t === '공지사항') pill(r, v, C.pink, C.ink, 'L', [2, 7]); else txt(r, v, 'CM', t === '워치 연동' ? C.primary : C.sub); }
      art(r, P.icon.chev(), 18);
    });
    tabBar(s, '__none__');
    return s;
  };

  // ---------- 07 전체 메뉴 ----------
  S['07'] = () => {
    const s = screen('07');
    const b = content(s, [6, 20, 30, 20], 14);
    const h = al(b, 'H', { justify: 'SPACE_BETWEEN', align: 'CENTER', fillW: true }); txt(h, '전체 메뉴', 'T', C.ink); art(h, P.icon.close, 24);
    const me = al(b, 'H', { gap: 12, pad: [12, 14], fill: C.card, radius: 20, align: 'CENTER', fillW: true });
    const av = al(me, 'H', { fill: C.sky, radius: 24, w: 48, h: 48, align: 'CENTER', justify: 'CENTER', clip: true }); art(av, A.animal('rabbit', 'white'), 48);
    const mi = al(me, 'V', { gap: 2, grow: true }); txt(mi, '새벽반 흰토끼', 'BM', C.ink); txt(mi, '마이페이지 보기', 'CR', C.sub);
    art(me, P.icon.chev(), 18);
    const M = P.menu;
    const tiles = [[M.box, '오늘의 상자'], [M.shirt, '꾸미기'], [M.pool, 'MY POOL'], [M.group, '우리 수영장'], [M.book, '바다 도감'], [M.chart, '수영 기록']];
    const grid = al(b, 'V', { gap: 10, fillW: true });
    for (let r = 0; r < 2; r++) {
      const row = al(grid, 'H', { gap: 10, fillW: true });
      for (let c = 0; c < 3; c++) {
        const [svg, l] = tiles[r * 3 + c];
        const t = al(row, 'V', { gap: 8, pad: [16, 6], fill: C.card, radius: 18, align: 'CENTER', grow: true });
        const bx = al(t, 'H', { fill: '#EEF5FF', radius: 14, w: 44, h: 44, align: 'CENTER', justify: 'CENTER' }); art(bx, svg, 26);
        txt(t, l, 'CM', C.ink);
      }
    }
    const group = (title, rows) => {
      txt(b, title, 'CM', C.sub);
      const list = al(b, 'V', { fill: C.card, radius: 20, fillW: true, pad: [4, 0] });
      rows.forEach(([t, badge], i) => {
        const r = al(list, 'H', { gap: 8, pad: [14, 16], align: 'CENTER', fillW: true }); divider(r, i);
        txt(r, t, 'BM', C.ink, { grow: true }); if (badge) pill(r, badge, C.pink, C.ink, 'L', [2, 7]); art(r, P.icon.chev(), 18);
      });
    };
    group('소식', [['공지사항', 'N'], ['이벤트']]);
    group('함께', [['친구 초대하기'], ['강습반 팀 만들기']]);
    group('도움', [['설정'], ['고객센터'], ['이용약관 · 개인정보']]);
    txt(b, '버전 1.0.0', 'CR', C.mute);
    return s;
  };

  // ---------- 08 공지사항 ----------
  S['08'] = () => {
    const s = screen('08');
    const b = content(s, [6, 20, 30, 20], 14);
    const h = al(b, 'H', { gap: 8, align: 'CENTER', fillW: true }); art(h, P.icon.back, 24); txt(h, '공지사항', 'T', C.ink);
    const co = al(b, 'H', { name: 'coach-banner', gap: 12, pad: [14, 16], fill: G.soft3, radius: 22, align: 'CENTER', fillW: true });
    art(co, A.seal, 60);
    const cc = al(co, 'V', { gap: 3, grow: true }); pill(cc, '물개 코치의 알림', '#FFFFFF', C.primary, 'L', [2, 8]);
    txt(cc, '11월 수영장 대결이 시작됐어요!', 'H', C.ink); txt(cc, '우리 수영장을 응원해 주세요 · D-30', 'CR', C.sub);
    const seg = al(b, 'H', { gap: 4, pad: [4, 4], fill: '#E6EEF8', radius: 999, fillW: true });
    ['전체', '공지', '이벤트', '업데이트'].forEach((l, i) => { const x = al(seg, 'H', { pad: [8, 6], radius: 999, fill: i === 0 ? C.card : null, align: 'CENTER', justify: 'CENTER', grow: true }); txt(x, l, 'CM', i === 0 ? C.ink : C.sub); });
    const list = al(b, 'V', { fill: C.card, radius: 20, fillW: true, pad: [4, 0] });
    const tagCol = { '이벤트': [C.pinkL, '#D94FAE'], '업데이트': ['#E4E9FF', C.btn], '공지': ['#E6F3FF', C.primary] };
    [['이벤트', '11월 수영장 대결 규칙과 보상 안내', '2026.10.30', true], ['업데이트', '바다 도감에 고래 3종이 추가됐어요', '2026.10.28', true], ['공지', '갤럭시워치 연동 베타를 시작해요', '2026.10.24'], ['공지', '목록에 없는 수영장을 직접 등록할 수 있어요', '2026.10.20'], ['이벤트', '산호 꾸미기 사진 공모전 당첨자 발표', '2026.10.15'], ['업데이트', '음파 표정 스티커가 추가됐어요', '2026.10.08']].forEach(([tg, t, d, isNew], i) => {
      const r = al(list, 'V', { gap: 6, pad: [14, 16], fillW: true }); divider(r, i);
      const top = al(r, 'H', { gap: 6, align: 'CENTER', fillW: true }); pill(top, tg, tagCol[tg][0], tagCol[tg][1]); if (isNew) dot(top, 6, C.coral);
      txt(r, t, 'BM', C.ink, { fillW: true }); txt(r, d, 'CR', C.mute);
    });
    return s;
  };

  function render(id) { const s = S[id](); applyOverlaps(s); return s; }
  window.USUKKU = { render, ids: Object.keys(S), C, G, txt, al, art, applyOverlaps };
})();
