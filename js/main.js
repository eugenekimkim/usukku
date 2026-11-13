// 우수꾸 앱: 라우팅 · 상태 저장 · 상자 열기 · 시트 · 토스트
(function () {
  const U = window.USUKKU, A = window.ART;
  const KEY = 'usukku:v2';
  const ROUTES = { splash: '00-0', intro: '00-0b', pick: '00', 'pool-pick': '00-2', home: '01', dress: '02', pool: '03', mypool: '04', 'mypool-side': '04-2', dex: '05', my: '06', menu: '07', notice: '08' };
  const MAIN = ['home', 'dress', 'pool', 'dex'];

  const clone = (o) => JSON.parse(JSON.stringify(o));
  function load() { try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(clone(U.DEFAULT_STATE), JSON.parse(raw)); } catch (e) { /* 저장소를 못 쓰면 기본값 */ } return clone(U.DEFAULT_STATE); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* 무시 */ } }
  let st = load();

  const phone = document.getElementById('phone');
  const view = document.getElementById('view');
  const layer = document.getElementById('layer');
  let route = null;
  const stack = [];

  const ctx = {
    get st() { return st; },
    live: true,
    go(r) { if (r === route) return; if (route && !MAIN.includes(r)) stack.push(route); if (MAIN.includes(r)) stack.length = 0; setHash(r); },
    back() { const r = stack.pop() || (st.onboarded ? 'home' : 'intro'); setHash(r); },
    act(name, ...args) { (ACTIONS[name] || (() => {}))(...args); },
  };
  function setHash(r) { if (location.hash.slice(1) === r) render(r); else location.hash = r; }

  function render(r, keepScroll) {
    if (!ROUTES[r]) r = 'splash';
    const prev = view.querySelector('.scroll');
    const top = keepScroll && prev ? prev.scrollTop : 0;
    route = r;
    const s = U.render(ROUTES[r], ctx);
    view.replaceChildren(s);
    const next = view.querySelector('.scroll'); if (next) next.scrollTop = top;
    phone.dataset.route = r;
    document.title = `우수꾸 · ${{ splash: '시작', intro: '시작', pick: '캐릭터 선택', 'pool-pick': '수영장 선택', home: '오늘의 상자', dress: '꾸미기', pool: '우리 수영장', mypool: 'MY POOL', 'mypool-side': 'MY POOL', dex: '바다 도감', my: '마이', menu: '전체 메뉴', notice: '공지사항' }[r]}`;
    if (r === 'splash') { clearTimeout(splashTimer); splashTimer = setTimeout(() => { if (route === 'splash') ctx.go(st.onboarded ? 'home' : 'intro'); }, 1800); }
  }
  let splashTimer;
  const refresh = () => { save(); render(route, true); };

  // ---------- 토스트 · 시트 ----------
  let toastTimer;
  function toast(msg) {
    let t = layer.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); layer.appendChild(t); }
    t.textContent = msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }
  function sheet(build, opts = {}) {
    closeSheet();
    const bd = document.createElement('div'); bd.className = 'backdrop' + (opts.center ? ' center' : '');
    const sh = document.createElement('div'); sh.className = 'sheet' + (opts.center ? ' modal' : ''); sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true');
    bd.appendChild(sh); layer.appendChild(bd);
    bd.addEventListener('click', (e) => { if (e.target === bd && !opts.sticky) closeSheet(); });
    build(sh);
    requestAnimationFrame(() => bd.classList.add('open'));
    const f = sh.querySelector('button'); if (f) f.focus();
    return sh;
  }
  function closeSheet() { layer.querySelectorAll('.backdrop').forEach((b) => b.remove()); }
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const text = (tag, cls, s) => { const e = el(tag, cls); e.textContent = s; return e; };
  function button(label, primary, fn) { const b = text('button', 'sbtn' + (primary ? ' primary' : ''), label); b.type = 'button'; b.addEventListener('click', fn); return b; }

  // ---------- 동작 ----------
  const defaultName = () => `새벽반 ${U.furName(st.fur)}${U.animalName(st.kind)}`;
  const ACTIONS = {
    toast,
    setKind(k) { st.kind = k; if (!st.nameEdited) st.name = defaultName(); refresh(); },
    setFur(c) { st.fur = c; if (!st.nameEdited) st.name = defaultName(); refresh(); },
    setName(v) { st.name = v.trim() || defaultName(); st.nameEdited = !!v.trim(); save(); },
    setPool(i) { st.pool = i; refresh(); },
    finishOnboarding() { st.onboarded = true; save(); stack.length = 0; ctx.go('home'); toast(`${st.name}, 우수꾸에 온 걸 환영해요!`); },
    openBox() {
      if (st.boxOpened) { ctx.go('dress'); return; }
      sheet((sh) => {
        sh.classList.add('box-open');
        const chest = el('div', 'art big-chest shake', window.PROPS.item.chest); sh.appendChild(chest);
        const title = text('div', 'sh-title', '두근두근…'); sh.appendChild(title);
        const sub = text('div', 'sh-sub', '오늘 기록으로 상자를 여는 중'); sh.appendChild(sub);
        const actions = el('div', 'sh-actions'); sh.appendChild(actions);
        // 오늘 기록은 자유형 위주 → 물고기 중 한 마리 (참치는 드물게)
        const r = Math.random();
        const kind = r < 0.25 ? 'tuna' : r < 0.65 ? 'mackerel' : 'clownfish';
        const isNew = !st.friends.includes(kind);
        const [name] = U.SEA[kind];
        setTimeout(() => {
          chest.remove();
          const catchEl = el('div', 'catch');
          catchEl.appendChild(el('div', 'art catch-art', A.sea(kind)));
          if (isNew) catchEl.appendChild(text('div', 'catch-new', 'NEW'));
          sh.insertBefore(catchEl, title);
          title.textContent = isNew ? `${name}를 처음 만났어요!` : `${name}를 또 만났어요!`;
          sub.textContent = isNew ? '바다 도감에 새로 등록됐어요' : '자유형 800m · 친밀도가 올라갔어요';
          actions.appendChild(button(isNew ? '도감에 넣기' : '받기', true, () => {
            st.boxOpened = true; st.lastCatch = kind;
            if (isNew) st.friends.push(kind);
            closeSheet(); refresh(); toast(isNew ? `${name}가 바다 도감에 들어왔어요` : `${name}와 더 친해졌어요`);
          }));
        }, 1100);
      }, { center: true, sticky: true });
    },
    setTab(k) { st.tab = k; refresh(); },
    equip(cat, id) {
      const it = U.ITEMS[cat].find((x) => x.id === id);
      if (!st.owned.includes(cat + ':' + id)) { toast(`🔒 ${it.name} · ${it.tag}`); return; }
      // 오리발은 한 번 더 누르면 벗기
      if (st.equip[cat] === id) { if (cat === 'fin') { st.equip.fin = null; refresh(); toast('오리발을 벗었어요'); } return; }
      st.equip[cat] = id; refresh(); toast(`${it.name} 착용!`);
    },
    toggleFollow(k) {
      const i = st.follow.indexOf(k);
      if (i >= 0) st.follow.splice(i, 1);
      else if (st.follow.length >= 3) { toast('따라오는 친구는 최대 3마리예요'); return; }
      else st.follow.push(k);
      refresh();
    },
    toggleDecorate() { st.decorate = st.decorate === false; refresh(); toast(st.decorate ? '꾸미기 모드' : '구경 모드'); },
    place(k, n) { if (!st.tray[k]) { toast(`${n}이(가) 더 없어요`); return; } st.tray[k]--; refresh(); toast(`${n}을(를) 풀에 놓았어요`); },
    guestbook() {
      st.guestbook = 0; refresh();
      sheet((sh) => {
        sh.appendChild(text('div', 'sh-title', '물방울 쪽지'));
        [['햇살반 햄스터', '킥판 졸업 축하해요! 저도 곧 따라갈게요'], ['바람결 곰', '풀 꾸민 거 너무 귀엽다 산호 어디서 받았어요?'], ['새벽반 양', '내일 새벽반에서 봬요 🫧']].forEach(([w, m]) => { const r = el('div', 'note'); r.appendChild(text('div', 'note-who', w)); r.appendChild(text('div', 'note-msg', m)); sh.appendChild(r); });
        const a = el('div', 'sh-actions'); a.appendChild(button('닫기', true, closeSheet)); sh.appendChild(a);
      });
    },
    dexFilter(c) { st.dexFilter = c; refresh(); },
    dexDetail(k) {
      const found = st.friends.includes(k);
      const [name, cat, how] = U.SEA[k];
      sheet((sh) => {
        sh.appendChild(el('div', 'art dex-art' + (found ? '' : ' unknown'), found ? A.sea(k) : A.seaSilhouette(k)));
        sh.appendChild(text('div', 'sh-title', found ? name : '아직 못 만난 친구'));
        sh.appendChild(text('div', 'sh-sub', `${cat} · ${how}`));
        const a = el('div', 'sh-actions');
        if (found) { const on = st.follow.includes(k); a.appendChild(button(on ? '그만 따라오게 하기' : '따라오게 하기', true, () => { closeSheet(); ACTIONS.toggleFollow(k); if (!on && st.follow.includes(k)) toast(`${name}이(가) 따라와요`); })); }
        a.appendChild(button('닫기', !found, closeSheet)); sh.appendChild(a);
      });
    },
    noticeFilter(c, silent) { st.noticeFilter = c; st.openNotice = -1; if (silent) save(); else refresh(); },
    openNotice(i) { st.openNotice = st.openNotice === i ? -1 : i; if (!st.read.includes(i)) st.read.push(i); refresh(); },
    about() { location.href = 'about/index.html'; },
    reset() {
      sheet((sh) => {
        sh.appendChild(text('div', 'sh-title', '처음부터 다시 할까요?'));
        sh.appendChild(text('div', 'sh-sub', '고른 캐릭터와 꾸민 아이템이 모두 초기화돼요. (데모용)'));
        const a = el('div', 'sh-actions');
        a.appendChild(button('취소', false, closeSheet));
        a.appendChild(button('다시 하기', true, () => { st = clone(U.DEFAULT_STATE); try { localStorage.removeItem(KEY); } catch (e) { /* 무시 */ } closeSheet(); stack.length = 0; setHash('splash'); }));
        sh.appendChild(a);
      }, { center: true });
    },
  };

  // ---------- 화면 맞추기 · 시작 ----------
  function fit() {
    // 390 × 844 비율을 지킨 채 창 안에 가장 크게
    const z = Math.min(window.innerWidth / 390, window.innerHeight / 844);
    document.documentElement.style.setProperty('--app-zoom', z.toFixed(4));
  }
  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => { closeSheet(); render(location.hash.slice(1)); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
  fit();
  render(ROUTES[location.hash.slice(1)] ? location.hash.slice(1) : 'splash');
})();
