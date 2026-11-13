// 갤러리: 화면 렌더링, 크게 보기, 탭 이동, 캐릭터 시트
(function () {
  const U = window.USUKKU, A = window.ART;
  const order = [];

  document.querySelectorAll('.row[data-screens]').forEach((row) => {
    row.dataset.screens.split('|').forEach((entry) => {
      const [id, name, note] = entry.split(':');
      const fig = document.createElement('figure');
      fig.className = 'shot';
      fig.id = 'shot-' + id;
      const phone = document.createElement('div');
      phone.className = 'phone';
      phone.tabIndex = 0;
      phone.setAttribute('role', 'button');
      phone.setAttribute('aria-label', `${id} ${name} 크게 보기`);
      phone.appendChild(U.render(id));
      const cap = document.createElement('figcaption');
      cap.innerHTML = `<div class="no"></div><div class="name"></div><div class="note"></div>`;
      cap.querySelector('.no').textContent = id;
      cap.querySelector('.name').textContent = name;
      cap.querySelector('.note').textContent = note || '';
      fig.append(phone, cap);
      row.appendChild(fig);
      const idx = order.length;
      order.push({ id, name });
      phone.addEventListener('click', (e) => { if (!e.target.closest('.tab-item')) openLb(idx); });
      phone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(idx); } });
    });
  });

  // 탭바를 누르면 해당 화면으로 이동
  const tabTarget = { '홈': '01', '꾸미기': '02', '우리 수영장': '03', '도감': '05' };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.tab-item');
    if (!t) return;
    e.stopPropagation();
    const id = tabTarget[t.dataset.tab];
    if (lb.classList.contains('open')) { show(order.findIndex((o) => o.id === id)); return; }
    const fig = document.getElementById('shot-' + id);
    if (!fig) return;
    fig.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    fig.classList.add('flash'); setTimeout(() => fig.classList.remove('flash'), 1200);
  }, true);

  // 크게 보기
  const lb = document.getElementById('lb'), stage = document.getElementById('lbStage'), cap = document.getElementById('lbCap');
  let cur = 0;
  function fit() { const z = Math.min(1.15, (window.innerHeight - 90) / 844, (window.innerWidth - 140) / 390); stage.style.setProperty('--lb-zoom', Math.max(0.4, z).toFixed(3)); }
  function show(i) { cur = (i + order.length) % order.length; stage.replaceChildren(U.render(order[cur].id)); cap.textContent = `${order[cur].id} ${order[cur].name}  (${cur + 1} / ${order.length})`; fit(); }
  function openLb(i) { show(i); lb.classList.add('open'); document.getElementById('lbClose').focus(); }
  function closeLb() { lb.classList.remove('open'); stage.replaceChildren(); }
  document.getElementById('lbClose').onclick = closeLb;
  document.getElementById('lbPrev').onclick = () => show(cur - 1);
  document.getElementById('lbNext').onclick = () => show(cur + 1);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  window.addEventListener('resize', () => { if (lb.classList.contains('open')) fit(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  // ---------- 캐릭터 시트 ----------
  const kinds = [['rabbit', '토끼'], ['hamster', '햄스터'], ['bear', '곰'], ['cat', '고양이'], ['sheep', '양']];
  const cell = (svg, label) => { const c = document.createElement('div'); c.className = 'cell'; const a = document.createElement('div'); a.className = 'art'; a.innerHTML = svg; const l = document.createElement('div'); l.textContent = label; c.append(a, l); return c; };
  const sheetRow = (host, title, cells) => { const lab = document.createElement('div'); lab.className = 'label'; lab.textContent = title; const line = document.createElement('div'); line.className = 'line'; cells.forEach((c) => line.appendChild(c)); host.append(lab, line); };
  const animalSheet = document.getElementById('animalSheet');
  sheetRow(animalSheet, '기본 털', kinds.map(([k, l]) => cell(A.animal(k), l)));
  sheetRow(animalSheet, '흰색 털', kinds.map(([k, l]) => cell(A.animal(k, 'white'), l)));
  sheetRow(animalSheet, '음파 표정 (숨 참기)', kinds.map(([k, l]) => cell(A.animal(k, 'default', 'puff'), l)));

  const quirks = [['rabbit', '토끼', '귀에 물 들어가는 게 제일 싫어'], ['hamster', '햄스터', '킥판 없으면 바로 가라앉을 것 같아'], ['bear', '곰', '몸이 무거워서 자꾸 가라앉아'], ['cat', '고양이', '물은 싫은데 수영장 다니는 건 비밀'], ['sheep', '양', '물 들어가면 털이 젖어서 너무 무거워']];
  const qHost = document.getElementById('quirks');
  quirks.forEach(([k, who, say]) => { const c = document.createElement('div'); c.className = 'card quirk'; c.innerHTML = `<div class="art">${A.animal(k)}</div><div><div class="who"></div><div class="say"></div></div>`; c.querySelector('.who').textContent = who; c.querySelector('.say').textContent = say; qHost.appendChild(c); });

  const seaSheet = document.getElementById('seaSheet'); seaSheet.classList.add('sea');
  sheetRow(seaSheet, '자유형 → 물고기 (짧게 · 오래 · 빠르게)', [['clownfish', '흰동가리'], ['mackerel', '고등어'], ['tuna', '참치']].map(([k, l]) => cell(A.sea(k), l)));
  sheetRow(seaSheet, '접영 → 고래 (단계별)', [['humpback', '혹등고래'], ['orca', '범고래'], ['bluewhale', '대왕고래']].map(([k, l]) => cell(A.sea(k), l)));
  sheetRow(seaSheet, '평영 · 배영 · 혼영', [['turtle', '바다거북'], ['otter', '해달'], ['dolphin', '돌고래']].map(([k, l]) => cell(A.sea(k), l)));
  sheetRow(seaSheet, '그 외 바다 친구 · 물개 코치', [...[['jellyfish', '해파리'], ['octopus', '문어'], ['puffer', '복어'], ['starfish', '불가사리']].map(([k, l]) => cell(A.sea(k), l)), cell(A.seal, '물개 코치')]);

  // ---------- 컬러 · 텍스트 스타일 ----------
  const pal = [['배경', '#F3F9FF', 'var(--ink)', 1], ['수영장 · 무대', '#CDEBFF', 'var(--ink)'], ['버튼 · 진행', '#456AFF', '#fff'], ['강조 텍스트 · 아이콘', '#1F8BFF', '#fff'], ['본문 텍스트', '#0F2A43', '#fff'], ['보조 텍스트', '#5B7590', '#fff'], ['선택 칩', '#1B22A6', '#fff'], ['연한 칩', '#DEEDFF', 'var(--ink)'], ['포인트 · 한정', '#FFBFEC', 'var(--ink)'], ['한정 태그 바탕', '#FFE3F6', 'var(--ink)']];
  const pHost = document.getElementById('palette');
  pal.forEach(([n, hex, fg, border]) => { const d = document.createElement('div'); d.className = 'sw'; d.style.background = hex; d.style.color = fg; if (border) d.style.boxShadow = 'inset 0 0 0 1px var(--line)'; d.innerHTML = `${n}<span>${hex}</span>`; pHost.appendChild(d); });
  const g = document.createElement('div'); g.className = 'sw wide'; g.style.background = 'var(--g-special)'; g.innerHTML = '스페셜 그라디언트<span>#FFD6F2 → #DDF8FF → #C9D4FF → #FFFCDE</span>'; pHost.appendChild(g);

  const ts = [['D', 'Display / 28 Bold', '우수꾸 312km'], ['T', 'Title / 22 Bold', '오늘의 수영 완료!'], ['H', 'Heading / 17 Bold', '오늘의 상자가 도착했어요'], ['BM', 'Body / 15 Medium', '브랜드 콜라보 수영복 도착'], ['BR', 'Body / 15 Regular', '내 수영 기록만큼 친구들도 물과 친해져요'], ['CM', 'Caption / 13 Medium', '다음 친구까지 접영 120m'], ['CR', 'Caption / 12 Regular', '10월 22일 목요일 · 새벽 6:40'], ['L', 'Label / 11 Bold', '새벽 수영 한정']];
  const tHost = document.getElementById('typeScale');
  ts.forEach(([k, n, s]) => { const r = document.createElement('div'); r.className = 't-row'; r.innerHTML = `<div class="t-name"></div><div class="tx ts-${k}"></div>`; r.querySelector('.t-name').textContent = n; r.querySelector(`.ts-${k}`).textContent = s; tHost.appendChild(r); });
})();
