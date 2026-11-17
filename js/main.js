// 우수꾸 앱: 라우팅 · 상태 저장 · 진주 받기 · 상점 · 시트 · 토스트
(function () {
  const U = window.USUKKU, A = window.ART, H = window.Health, PEARLS = window.PEARLS, PG = window.PROGRESS;
  const KEY = 'usukku:v4', OLD_KEY = 'usukku:v3';
  const NATIVE = H.isNative(), PLATFORM = H.platform();
  const ROUTES = { splash: '00-0', intro: '00-0b', pick: '00', 'pool-pick': '00-2', home: '01', dress: '02', pool: '03', mypool: '04-2', 'mypool-side': '04-2', 'pool-set': '09', dex: '05', my: '06', menu: '07', notice: '08' };
  const MAIN = ['home', 'dress', 'pool', 'dex'];

  const clone = (o) => JSON.parse(JSON.stringify(o));
  // v3 → v4: 값은 그대로 옮기고, 날짜 없던 '받음' 표시(synced)만 오늘 원장으로 바꿔요
  function migrate(o) {
    const { synced, ...rest } = o;
    if (synced && !NATIVE) { const l = PEARLS.ledgerFor(null); rest.pearlDay = PEARLS.apply(l, PEARLS.pending(H._.demoSwims(), l)); }
    return rest;
  }
  // 앱은 진주 0개에서, 브라우저는 데모 상태에서 시작해요
  const fresh = () => (NATIVE ? Object.assign(clone(U.DEFAULT_STATE), clone(U.FRESH_STATE)) : clone(U.DEFAULT_STATE));
  function load() {
    try {
      let raw = localStorage.getItem(KEY);
      if (!raw) {
        const old = localStorage.getItem(OLD_KEY);
        if (old) { raw = JSON.stringify(migrate(JSON.parse(old))); localStorage.setItem(KEY, raw); localStorage.removeItem(OLD_KEY); }
      }
      if (raw) { const o = JSON.parse(raw); return Object.assign(fresh(), o, { health: Object.assign({ asked: false }, o.health) }); }
    } catch (e) { /* 저장소를 못 쓰면 기본값 */ }
    return fresh();
  }
  // 날짜별 기록이 없으면: 브라우저는 데모 기록(지난 3주 월 · 수 · 금), 앱은 빈 기록
  function ensureHistory() {
    if (st.history) return;
    st.history = NATIVE ? {} : PG.demoHistory();
    st.islands = PG.reached(PG.totalKm(st.history));
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* 무시 */ } }
  let st = load();
  ensureHistory();

  const phone = document.getElementById('phone');
  const view = document.getElementById('view');
  const layer = document.getElementById('layer');
  let route = null;
  const stack = [];

  const ledgerNow = () => PEARLS.ledgerFor(st.pearlDay);
  // 오늘 수영 기록: { status, summary, pending } — 화면은 먼저 그리고, 값이 오면 다시 그려요
  let today = { status: 'loading' };

  const ctx = {
    get st() { return st; },
    get today() { return today; },
    get ledger() { return ledgerNow(); },
    platform: PLATFORM,
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
    document.title = `우수꾸 · ${{ splash: '시작', intro: '시작', pick: '캐릭터 선택', 'pool-pick': '수영장 선택', home: '오늘의 진주', dress: '꾸미기', pool: '우리 수영장', mypool: 'MY POOL', 'mypool-side': 'MY POOL', 'pool-set': '내 수영장 설정', dex: '바다 도감', my: '마이', menu: '전체 메뉴', notice: '공지사항' }[r]}`;
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
  // 진주로 사기
  function buy(cat, it) {
    const short = it.price - st.pearls;
    sheet((sh) => {
      sh.appendChild(el('div', 'art dex-art', it.svg));
      sh.appendChild(text('div', 'sh-title', short > 0 ? `진주 ${short}개가 더 필요해요` : `${it.name}을(를) 살까요?`));
      sh.appendChild(text('div', 'sh-sub', short > 0 ? `${it.name} · 진주 ${it.price}개 (지금 ${st.pearls}개) · 약 ${(short * 100).toLocaleString()}m 더 헤엄치면 돼요` : `진주 ${it.price}개를 써요 · 남는 진주 ${st.pearls - it.price}개`));
      const a = el('div', 'sh-actions');
      a.appendChild(button(short > 0 ? '닫기' : '취소', short > 0, closeSheet));
      if (short <= 0) a.appendChild(button('사기', true, () => { st.pearls -= it.price; st.owned.push(cat + ':' + it.id); st.equip[cat] = it.id; closeSheet(); refresh(); toast(`${it.name} 착용!`); }));
      sh.appendChild(a);
    });
  }
  // 섬 도착 · 보상 아이템 축하: 받은 것은 먼저 상태에 넣고(시트를 닫아도 남게), 차례로 보여줘요
  const ISLAND_ITEM = { 3: 'cap:sun', 4: 'goggle:gold' };
  const itemOf = (key) => { const [cat, id] = key.split(':'); return { cat, id, it: U.ITEMS[cat].find((x) => x.id === id) }; };
  function celebrate(list, thenRewards) {
    const next = list.shift();
    if (!next) {
      if (!thenRewards) return;
      const items = PG.earnedRewards(st.history).filter((k) => !st.owned.includes(k));
      if (items.length) celebrate(items.map((k) => ({ item: k })), false);
      return;
    }
    const go = () => { closeSheet(); refresh(); celebrate(list, thenRewards); };
    if (next.island != null) {
      const i = next.island, name = U.ISLANDS[i];
      const friends = Object.keys(U.SEA).filter((k) => U.SEA[k][2] === name);
      const reward = ISLAND_ITEM[i] && !st.owned.includes(ISLAND_ITEM[i]) ? itemOf(ISLAND_ITEM[i]) : null;
      st.islands.push(i); st.pearls += PG.ISLAND_PEARLS;
      friends.forEach((k) => { if (!st.friends.includes(k)) st.friends.push(k); if (st.follow.length < 3 && !st.follow.includes(k)) st.follow.push(k); });
      if (reward) st.owned.push(ISLAND_ITEM[i]);
      save();
      sheet((sh) => {
        sh.classList.add('box-open');
        sh.appendChild(el('div', 'art dex-art float', A.sea(friends[0])));
        sh.appendChild(text('div', 'sh-title', `${name}에 도착했어요!`));
        sh.appendChild(text('div', 'sh-sub', `진주 ${PG.ISLAND_PEARLS}개 · 바다 친구 ${friends.map((k) => U.SEA[k][0]).join(', ')}` + (reward ? ` · ${reward.it.name}` : '')));
        const a = el('div', 'sh-actions'); a.appendChild(button('좋아요', true, go)); sh.appendChild(a);
      }, { center: true, sticky: true });
      return;
    }
    const { cat, id, it } = itemOf(next.item);
    st.owned.push(next.item); save();
    sheet((sh) => {
      sh.classList.add('box-open');
      sh.appendChild(el('div', 'art dex-art pop', it.svg));
      sh.appendChild(text('div', 'sh-title', `${it.name}을(를) 얻었어요!`));
      sh.appendChild(text('div', 'sh-sub', `${PG.REWARDS[next.item].label} 보상이에요`));
      const a = el('div', 'sh-actions');
      a.appendChild(button('나중에', false, go));
      a.appendChild(button('착용하기', true, () => { st.equip[cat] = id; go(); toast(`${it.name} 착용!`); }));
      sh.appendChild(a);
    }, { center: true, sticky: true });
  }
  const defaultName = () => `새벽반 ${U.furName(st.fur)}${U.animalName(st.kind)}`;
  const ACTIONS = {
    toast,
    setKind(k) { st.kind = k; if (!st.nameEdited) st.name = defaultName(); refresh(); },
    setFur(c) { st.fur = c; if (!st.nameEdited) st.name = defaultName(); refresh(); },
    setName(v) { st.name = v.trim() || defaultName(); st.nameEdited = !!v.trim(); save(); },
    setPool(i) { st.pool = i; refresh(); },
    finishOnboarding() { st.onboarded = true; save(); stack.length = 0; ctx.go('home'); toast(`${st.name}, 우수꾸에 온 걸 환영해요!`); },
    // 워치 기록 받기 · 다시 확인하기: 읽는 동안은 지금의 받기 애니메이션(흔들리는 조개)
    sync() {
      const T = today;
      if (T.status === 'ok' && !(T.pending && T.pending.swims.length) && ledgerNow().swims.length) { ctx.go('dress'); return; }
      if (syncing) return;
      syncing = true;
      sheet((sh) => {
        sh.classList.add('box-open');
        const clam = el('div', 'art big-chest shake', window.PROPS.item.clam); sh.appendChild(clam);
        const title = text('div', 'sh-title', '워치에서 기록을 받는 중…'); sh.appendChild(title);
        const sm = T.summary;
        const sub = text('div', 'sh-sub', sm && sm.swims.length ? `오늘 ${sm.meters.toLocaleString()}m · ${sm.minutes}분` : '잠시만 기다려 주세요'); sh.appendChild(sub);
        const actions = el('div', 'sh-actions'); sh.appendChild(actions);
        Promise.all([refreshToday(true), new Promise((r) => setTimeout(r, 1000))]).then(([R]) => {
          syncing = false;
          const p = R.pending;
          if (R.status !== 'ok' || !p || !p.swims.length) {
            // 받을 진주가 없으면 카드에서 상황을 안내해요
            closeSheet(); render(route, true);
            if (R.status === 'none') toast('오늘은 아직 수영 기록이 없어요');
            return;
          }
          clam.classList.remove('shake'); clam.classList.add('pop');
          if (p.total > 0) {
            title.textContent = `진주 ${p.total}개를 받았어요!`;
            sub.textContent = `${p.meters.toLocaleString()}m → 진주 ${p.pearls}개` + (p.bonus ? ` · 오늘 첫 수영 보너스 ${p.bonus}개` : '') + (p.capped ? ' · 하루 최대 5km까지' : '');
          } else {
            title.textContent = '오늘은 5km를 다 채웠어요';
            sub.textContent = '하루 최대 5km까지 진주를 받아요 · 내일 또 만나요';
          }
          actions.appendChild(button('좋아요', true, () => {
            const before = PG.totalKm(st.history);
            st.pearls += p.total;
            st.pearlDay = PEARLS.apply(ledgerNow(), p);
            // 날짜별 기록: 진주를 받은 거리(하루 5km까지) · 시간 · 횟수
            st.history = PG.addDay(st.history, st.pearlDay.day, { m: p.meters, min: Math.round(p.swims.reduce((t, x) => t + x.minutes, 0)), n: p.swims.length });
            today = Object.assign({}, R, { pending: PEARLS.pending(R.summary.swims, st.pearlDay) });
            closeSheet(); refresh();
            toast(p.meters > 0 ? `내 진주 ${st.pearls}개 · 나의 바닷길에 ${(p.meters / 1000).toFixed(2)}km를 보탰어요` : `내 진주 ${st.pearls}개`);
            const islands = PG.reached(PG.totalKm(st.history)).filter((i) => !st.islands.includes(i));
            if (islands.length || PG.totalKm(st.history) !== before) setTimeout(() => celebrate(islands.map((i) => ({ island: i })), true), 900);
          }));
        });
      }, { center: true, sticky: true });
    },
    recheck() { ACTIONS.sync(); },
    openHealthSettings() { H.openSettings().catch(() => toast('설정을 열 수 없어요')); },
    installHealthConnect() { H.openInstall(); },
    setTab(k) { st.tab = k; refresh(); },
    equip(cat, id) {
      const it = U.ITEMS[cat].find((x) => x.id === id);
      if (!st.owned.includes(cat + ':' + id)) {
        if (it.reward) { const rw = PG.REWARDS[cat + ':' + id]; toast(`${it.name}은(는) ${rw ? rw.label : it.reward} 보상이에요`); return; }
        buy(cat, it); return;
      }
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
    toggleDecorate() { st.decorate = !st.decorate; refresh(); toast(st.decorate ? '꾸미기 모드 · 아이템을 골라 바닥에 놓아요' : '다 꾸몄어요!'); },
    place(k, n) {
      if (!st.tray[k]) { toast(`${n}이(가) 더 없어요`); return; }
      // 바닥(비치볼은 물 위)에서 비어 있는 자리 찾기
      const used = st.placed.filter((p) => (p[0] === 'ball') === (k === 'ball')).map((p) => p[1]);
      let best = 30, gap = -1;
      for (let x = 30; x <= 360; x += 6) { const d = Math.min(...used.map((u) => Math.abs(u - x)), 999); if (d > gap) { gap = d; best = x; } }
      const colors = { coral: ['#FF9EC4', '#FFB547', '#B79CFF'], shell: ['#FFD978', '#FFB8C8', '#C9B8FF'] };
      const c = colors[k] ? colors[k][st.placed.length % 3] : undefined;
      st.placed.push(c ? [k, best, c] : [k, best]);
      st.tray[k]--; refresh(); toast(`${n}을(를) 풀에 놓았어요`);
    },
    removeDeco(i) {
      const p = st.placed[i]; if (!p) return;
      st.placed.splice(i, 1);
      if (p[0] !== 'rock') st.tray[p[0]] = (st.tray[p[0]] || 0) + 1;
      refresh(); toast(p[0] === 'rock' ? '바위를 치웠어요' : '보관함에 다시 넣었어요');
    },
    // 내 수영장 설정
    locate() {
      // 아티팩트 안에서는 실제 위치를 쓸 수 없어 데모 위치로 대신해요
      toast('현재 위치를 확인하는 중…');
      setTimeout(() => { st.located = true; refresh(); toast('현재 위치 · 성내동 근처'); }, 700);
    },
    choosePool(i) {
      if (st.pool === i) return;
      if (st.poolChanged === U.monthKey()) { toast(`이번 달에 이미 바꿨어요 · ${U.nextMonthLabel()}부터 바꿀 수 있어요`); return; }
      const [name, , , dong] = U.POOLS[i];
      sheet((sh) => {
        sh.appendChild(text('div', 'sh-title', `${dong} ${name}으로 바꿀까요?`));
        sh.appendChild(text('div', 'sh-sub', `바꾸면 ${U.nextMonthLabel()}까지 다시 바꿀 수 없어요. 이미 헤엄친 거리는 ${U.POOLS[st.pool][0]} 바닷길에 남고, 진주와 아이템은 그대로예요.`));
        const a = el('div', 'sh-actions');
        a.appendChild(button('취소', false, closeSheet));
        a.appendChild(button('바꾸기', true, () => { st.pool = i; st.poolChanged = U.monthKey(); closeSheet(); refresh(); toast(`내 수영장이 ${name}으로 바뀌었어요`); }));
        sh.appendChild(a);
      }, { center: true });
    },
    verify() {
      const i = st.pool;
      sheet((sh) => {
        sh.classList.add('box-open');
        sh.appendChild(el('div', 'art verify-art float', A.seal));
        const t = text('div', 'sh-title', '위치를 확인하는 중…'); sh.appendChild(t);
        const sub = text('div', 'sh-sub', `${U.POOLS[i][0]} 근처에 있는지 확인하고 있어요`); sh.appendChild(sub);
        const a = el('div', 'sh-actions'); sh.appendChild(a);
        setTimeout(() => {
          t.textContent = '인증 완료!'; sub.textContent = `이제 ${U.POOLS[i][0]} 바닷길에 함께해요`;
          a.appendChild(button('좋아요', true, () => { st.verified[i] = true; closeSheet(); refresh(); }));
        }, 1000);
      }, { center: true, sticky: true });
    },
    dexFilter(c) { st.dexFilter = c; refresh(); },
    dexDetail(k) {
      const found = st.friends.includes(k);
      const [name, cat, isl] = U.SEA[k]; const how = `나의 바닷길이 ${isl}에 닿으면 만나요`;
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
    // 이용약관 · 개인정보 처리방침: 앱 안에서 바로 보기 (legal/)
    legal() {
      const show = (title, src) => sheet((sh) => {
        sh.classList.add('legal-sheet');
        sh.appendChild(text('div', 'sh-title', title));
        const f = document.createElement('iframe'); f.src = src; f.title = title; f.className = 'legal-frame'; sh.appendChild(f);
        const a = el('div', 'sh-actions'); a.appendChild(button('닫기', true, closeSheet)); sh.appendChild(a);
      });
      sheet((sh) => {
        sh.appendChild(text('div', 'sh-title', '이용약관 · 개인정보'));
        sh.appendChild(text('div', 'sh-sub', '주식회사 프로젝트서티즈 · 시행일 2026.11.17'));
        const a = el('div', 'sh-actions'); a.style.flexDirection = 'column';
        a.appendChild(button('이용약관', false, () => show('이용약관', 'legal/terms.html')));
        a.appendChild(button('개인정보 처리방침', false, () => show('개인정보 처리방침', 'legal/privacy.html')));
        a.appendChild(button('닫기', true, closeSheet));
        sh.appendChild(a);
      });
    },
    reset() {
      sheet((sh) => {
        sh.appendChild(text('div', 'sh-title', '처음부터 다시 할까요?'));
        sh.appendChild(text('div', 'sh-sub', '고른 캐릭터와 꾸민 아이템이 모두 초기화돼요. (데모용)'));
        const a = el('div', 'sh-actions');
        a.appendChild(button('취소', false, closeSheet));
        a.appendChild(button('다시 하기', true, () => { st = fresh(); ensureHistory(); try { localStorage.removeItem(KEY); } catch (e) { /* 무시 */ } closeSheet(); stack.length = 0; today = { status: 'loading' }; refreshToday(false); setHash('splash'); }));
        sh.appendChild(a);
      }, { center: true });
    },
  };

  // ---------- 수영 기록 읽기 ----------
  let syncing = false, reading = null, readingPrompt = false;
  // prompt: 권한을 아직 안 물어봤으면 지금 물어봐요 (워치 기록 받기를 누를 때만 true)
  function refreshToday(prompt) {
    if (reading && (readingPrompt || !prompt)) return reading;
    if (reading) return reading.then(() => refreshToday(prompt));
    readingPrompt = !!prompt;
    reading = readToday(prompt).then((T) => {
      today = T; reading = null;
      if (route === 'home' && !syncing) render(route, true);
      return T;
    });
    return reading;
  }
  async function readToday(prompt) {
    try {
      if (NATIVE) {
        const av = await H.availability();
        if (!av.available) return { status: av.reason };
        if (!st.health.asked) {
          if (!prompt) return { status: 'idle' };
          st.health.asked = true; save();
          await H.requestPermission();
        }
      }
      const summary = await H.getTodaySummary();
      const ledger = ledgerNow();
      const pending = PEARLS.pending(summary.swims, ledger);
      let status = 'ok';
      if (!summary.swims.length && !ledger.swims.length) status = (await H.hasRecentWorkouts()) ? 'none' : 'link-off';
      else if (!pending.swims.length && pending.noDistance.length) status = 'no-distance';
      return { status, summary, pending };
    } catch (e) {
      const code = e && e.code;
      return { status: ['denied', 'update-required', 'unsupported'].includes(code) ? code : 'error', error: e };
    }
  }

  // ---------- 화면 맞추기 · 시작 ----------
  // 안전 영역(노치 · 홈 인디케이터). Android는 Capacitor가 --safe-area-inset-*을 넣어줘요.
  function inset(side) {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed;left:0;top:0;width:0;visibility:hidden;height:var(--safe-area-inset-${side},env(safe-area-inset-${side},0px))`;
    document.body.appendChild(p); const v = p.getBoundingClientRect().height; p.remove();
    return v || 0;
  }
  function fit() {
    // 390 × 844 비율을 지킨 채 창 안에 가장 크게
    const W = window.innerWidth, Hh = window.innerHeight;
    let z = Math.min(W / 390, Hh / 844), top = 0;
    if (NATIVE) {
      // 앱: 시안의 상태바(44)와 탭바 아래 여백(26)이 실제 노치 · 홈 인디케이터 자리에 오도록
      const t = inset('top'), b = inset('bottom');
      z = Math.min(z, (Hh - t - b) / (844 - 44 - 26));
      top = Math.max((Hh - 844 * z) / 2, t - 44 * z);
    }
    document.documentElement.style.setProperty('--app-zoom', z.toFixed(4));
    document.documentElement.style.setProperty('--app-top', top.toFixed(1) + 'px');
  }
  if (NATIVE) document.body.classList.add('native', 'native-' + PLATFORM);
  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => { closeSheet(); render(location.hash.slice(1)); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
  fit();
  render(ROUTES[location.hash.slice(1)] ? location.hash.slice(1) : 'splash');
  refreshToday(false);
  // 앱으로 돌아오면(설정에서 권한을 켜고 온 경우 등) 다시 읽어요
  if (NATIVE && window.Capacitor.registerPlugin) {
    window.Capacitor.registerPlugin('App').addListener('resume', () => { fit(); if (!syncing) refreshToday(false); });
  }
})();
