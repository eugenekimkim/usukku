// 우수꾸 일러스트: 피그마 시안과 같은 SVG 생성 규칙
(function () {
  const INK = '#4A3530', LINE = '#4A3530';
  const FUR = { rabbit: '#FFCFD9', hamster: '#F2C98A', bear: '#B98563', cat: '#C4CAD4', sheep: '#FFF4E3', white: '#FFFFFF' };
  const HEAD = 'M60 38C85 38 98 52 98 68C98 76 106 82 106 93C106 105 88 112 60 112C32 112 14 105 14 93C14 82 22 76 22 68C22 52 35 38 60 38Z';
  const HEAD_PUFF = 'M60 38C85 38 98 52 98 65C98 71 111 79 111 93C111 106 90 113 60 113C30 113 9 106 9 93C9 79 22 71 22 65C22 52 35 38 60 38Z';
  const TUFT = 'M56.5 41c-1.5-3.5-.5-6.5 1.5-8.5M60.5 40c.2-4.5 2-7.5 5-9M64 41c1.8-2.6 4-3.6 6.5-3.6';

  function face(puff, kind) {
    const bx = puff ? [27, 93] : [31, 89];
    const blush = `<ellipse cx="${bx[0]}" cy="94" rx="${puff ? 11 : 9}" ry="${puff ? 7 : 5.5}" fill="#FF9E9E" fill-opacity=".75"/><ellipse cx="${bx[1]}" cy="94" rx="${puff ? 11 : 9}" ry="${puff ? 7 : 5.5}" fill="#FF9E9E" fill-opacity=".75"/>`;
    const eyes = puff
      ? `<path d="M42 86c2.3-1.8 5.7-1.8 8 0M70 86c2.3-1.8 5.7-1.8 8 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="46.5" cy="85" rx="1.9" ry="2.4" fill="${INK}"/><ellipse cx="73.5" cy="85" rx="1.9" ry="2.4" fill="${INK}"/>`;
    const mouth = kind === 'bear' ? '' : (puff ? `<ellipse cx="60" cy="94" rx="2.2" ry="1.6" fill="${INK}"/>` : `<path d="M55.5 93.5c1.5 2 3 2 4.5 0 1.5 2 3 2 4.5 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`);
    return { blush, eyes, mouth };
  }
  const goggles = (c, y = 56) => `<g transform="rotate(-8 60 ${y})"><path d="M25 ${y}h70" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="49" cy="${y}" r="6" fill="#3ED3C9" stroke="${c}" stroke-width="2.5"/><circle cx="71" cy="${y}" r="6" fill="#3ED3C9" stroke="${c}" stroke-width="2.5"/></g>`;
  const drips = (x) => `<path d="M76 26c0 1.9-1.2 2.9-2.4 2.9s-2.4-1-2.4-2.9 2.4-4.7 2.4-4.7 2.4 2.8 2.4 4.7z" fill="#7FC4FF"/><path d="M${x} 62c0 2.8-1.8 4.2-3.5 4.2S${x - 7} 64.8 ${x - 7} 62s3.5-7 3.5-7S${x} 59.2 ${x} 62z" fill="#7FC4FF"/>`;
  const bubbles = `<circle cx="113" cy="66" r="3.5" fill="none" stroke="#7FC4FF" stroke-width="2"/><circle cx="118" cy="55" r="2.5" fill="none" stroke="#7FC4FF" stroke-width="1.8"/><circle cx="113" cy="47" r="1.7" fill="#7FC4FF"/>`;
  const SHADOW = `<ellipse cx="60" cy="168" rx="28" ry="4.5" fill="#0F2A43" fill-opacity=".08"/>`;
  const wrap = (inner) => `<svg viewBox="-10 -4 140 182" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

  function woolRing() {
    let s = ''; const n = 14;
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2; const cx = 60 + 43 * Math.cos(a), cy = 78 + 35 * Math.sin(a); const r = (Math.sin(a) > 0.6) ? 11 : 13.5; s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}"/>`; }
    return s + `<ellipse cx="60" cy="78" rx="44" ry="36"/>`;
  }
  function sheep(F, puff) {
    const FACE = '#FFE2CC';
    const FN = 'M60 56C77 56 86 66 86 77C86 83 92 87 92 95C92 104 79 110 60 110C41 110 28 104 28 95C28 87 34 83 34 77C34 66 43 56 60 56Z';
    const FP = 'M60 56C77 56 86 66 86 75C86 81 96 86 96 95C96 105 80 111 60 111C40 111 24 105 24 95C24 86 34 81 34 75C34 66 43 56 60 56Z';
    const legs = `<ellipse cx="49" cy="156" rx="8.5" ry="7.5"/><ellipse cx="71" cy="156" rx="8.5" ry="7.5"/>`;
    const body = `<ellipse cx="60" cy="132" rx="25" ry="25"/><circle cx="39" cy="128" r="11"/><circle cx="81" cy="128" r="11"/><circle cx="40" cy="143" r="11"/><circle cx="80" cy="143" r="11"/><circle cx="60" cy="152" r="12"/>`;
    const bridge = `<ellipse cx="60" cy="114" rx="28" ry="10"/>`;
    const arms = `<ellipse cx="37" cy="119" rx="6.5" ry="10" transform="rotate(42 37 119)"/><ellipse cx="83" cy="119" rx="6.5" ry="10" transform="rotate(-42 83 119)"/>`;
    const ears = `<ellipse cx="5" cy="90" rx="14" ry="6.5" transform="rotate(62 5 90)"/><ellipse cx="115" cy="90" rx="14" ry="6.5" transform="rotate(-62 115 90)"/>`;
    const head = woolRing();
    const floatSil = `<rect x="26" y="112" width="16" height="13" rx="6" transform="rotate(42 34 118.5)"/><rect x="78" y="112" width="16" height="13" rx="6" transform="rotate(-42 86 118.5)"/>`;
    const sil = legs + body + bridge + arms + head + ears + floatSil;
    const pass = (c, w) => `<g fill="${c}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round">${sil}</g><path d="${TUFT}" fill="none" stroke="${c}" stroke-width="${3 + w}" stroke-linecap="round"/>`;
    const fur = (s) => `<g fill="${F}">${s}</g>`;
    const bl = puff ? [30, 90, 11, 7] : [33, 87, 7.5, 5.5];
    const fill = fur(legs + body + bridge + arms) + `<path d="${TUFT}" fill="none" stroke="${F}" stroke-width="3" stroke-linecap="round"/>` + fur(head)
      + `<path d="${puff ? FP : FN}" fill="${FACE}"/>`
      + `<g fill="${FACE}">${ears}</g><ellipse cx="6" cy="92" rx="8" ry="3" fill="#FFB8B8" transform="rotate(62 6 92)"/><ellipse cx="114" cy="92" rx="8" ry="3" fill="#FFB8B8" transform="rotate(-62 114 92)"/>`
      + goggles('#FFB547', 50)
      + `<ellipse cx="${bl[0]}" cy="94" rx="${bl[2]}" ry="${bl[3]}" fill="#FF9E9E" fill-opacity=".75"/><ellipse cx="${bl[1]}" cy="94" rx="${bl[2]}" ry="${bl[3]}" fill="#FF9E9E" fill-opacity=".75"/>`
      + (puff ? `<path d="M42 86c2.3-1.8 5.7-1.8 8 0M70 86c2.3-1.8 5.7-1.8 8 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="94" rx="2.2" ry="1.6" fill="${INK}"/>`
        : `<ellipse cx="46.5" cy="85" rx="1.9" ry="2.4" fill="${INK}"/><ellipse cx="73.5" cy="85" rx="1.9" ry="2.4" fill="${INK}"/><ellipse cx="60" cy="90.5" rx="2.2" ry="1.6" fill="#FF8C8C"/><path d="M55.5 93.5c1.5 2 3 2 4.5 0 1.5 2 3 2 4.5 0" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`)
      + `<rect x="26" y="112" width="16" height="13" rx="6" fill="#FF9A5B" transform="rotate(42 34 118.5)"/><rect x="78" y="112" width="16" height="13" rx="6" fill="#FF9A5B" transform="rotate(-42 86 118.5)"/><path d="M29 116l10 5M81 121l10-5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-opacity=".8"/>`;
    const d = `<path d="M76 26c0 1.9-1.2 2.9-2.4 2.9s-2.4-1-2.4-2.9 2.4-4.7 2.4-4.7 2.4 2.8 2.4 4.7z" fill="#7FC4FF"/><path d="M-1 58c0 2.8-1.8 4.2-3.5 4.2S-8 60.8-8 58s3.5-7 3.5-7S-1 55.2-1 58z" fill="#7FC4FF"/>`;
    const b = puff ? `<circle cx="120" cy="62" r="3.5" fill="none" stroke="#7FC4FF" stroke-width="2"/><circle cx="125" cy="51" r="2.5" fill="none" stroke="#7FC4FF" stroke-width="1.8"/><circle cx="120" cy="43" r="1.7" fill="#7FC4FF"/>` : '';
    return wrap(SHADOW + pass('#FFFFFF', 11) + pass(LINE, 4.6) + fill + d + b);
  }

  // kind: rabbit | hamster | bear | cat | sheep, fur: 'default' | 'white', expr: 'normal' | 'puff'
  function animal(kind, fur = 'default', expr = 'normal') {
    const F = fur === 'white' ? FUR.white : FUR[kind];
    const puff = expr === 'puff';
    if (kind === 'sheep') return sheep(F, puff);
    const legs = `<ellipse cx="49" cy="156" rx="8.5" ry="7.5"/><ellipse cx="71" cy="156" rx="8.5" ry="7.5"/>`;
    const body = `<ellipse cx="60" cy="132" rx="24" ry="25"/>`;
    const bridge = `<ellipse cx="60" cy="114" rx="28" ry="10"/>`;
    const arms = `<ellipse cx="37" cy="119" rx="6.5" ry="10" transform="rotate(42 37 119)"/><ellipse cx="83" cy="119" rx="6.5" ry="10" transform="rotate(-42 83 119)"/>`;
    const head = `<path d="${puff ? HEAD_PUFF : HEAD}"/>`;
    let ears = '', earInner = '', strokes = [[TUFT, 3]], frontSil = '', frontFill = '', mid = '', extra = '', armsBack = false, gogC = '#FF7A6B';
    const f = face(puff, kind);
    if (kind === 'rabbit') {
      ears = `<ellipse cx="44" cy="30" rx="9" ry="20" transform="rotate(-10 44 30)"/><path d="M74 48c3-13 13-22 25-21 5 .5 3.5 6-1 8.5-8 4-14 9-17 16z"/>`;
      earInner = `<ellipse cx="44" cy="32" rx="3.6" ry="12" fill="#FF9EB5" transform="rotate(-10 44 32)"/>`;
      mid = `<path d="M38 124c0-6 5-10 11-10h22c6 0 11 4 11 10v12c0 11-10 18-22 18s-22-7-22-18z" fill="#3ED3C9"/><path d="M38 131h44M39 141h42" stroke="#FFFFFF" stroke-width="3.5"/>`;
      extra = puff ? '' : `<path d="M58 90l2 2 2-2z" fill="#FF7A8F"/>`;
    }
    if (kind === 'hamster') {
      ears = `<circle cx="31" cy="47" r="8.5"/><circle cx="89" cy="47" r="8.5"/>`;
      earInner = `<circle cx="31" cy="47" r="3.8" fill="#FF9EB5"/><circle cx="89" cy="47" r="3.8" fill="#FF9EB5"/>`;
      frontSil = `<rect x="26" y="113" width="68" height="40" rx="14"/><ellipse cx="44" cy="114" rx="7" ry="5"/><ellipse cx="76" cy="114" rx="7" ry="5"/>`;
      frontFill = `<rect x="26" y="113" width="68" height="40" rx="14" fill="#FFE59A"/><path d="M36 133c4.5-3 9-3 13.5 0s9 3 13.5 0 9-3 13.5 0" stroke="#7FC4FF" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="44" cy="114" rx="7" ry="5" fill="${F}"/><ellipse cx="76" cy="114" rx="7" ry="5" fill="${F}"/>`;
      extra = puff ? '' : `<ellipse cx="60" cy="90" rx="2.4" ry="1.8" fill="#FF7A8F"/>`;
      armsBack = true; gogC = '#1F8BFF';
    }
    if (kind === 'bear') {
      ears = `<circle cx="28" cy="48" r="11"/><circle cx="92" cy="48" r="11"/>`;
      earInner = `<circle cx="28" cy="48" r="5" fill="#E8C3A5"/><circle cx="92" cy="48" r="5" fill="#E8C3A5"/>`;
      mid = `<path d="M36 138h48c0 7-2 13-5 16H66l-6-6-6 6H41c-3-3-5-9-5-16z" fill="#1E3A8A"/>`;
      extra = `<ellipse cx="60" cy="96" rx="11" ry="7.5" fill="#F1D9C2"/><ellipse cx="60" cy="93" rx="3.6" ry="2.6" fill="${INK}"/>` + (puff ? `<ellipse cx="60" cy="99" rx="1.8" ry="1.4" fill="${INK}"/>` : `<path d="M60 95.5v2M57 99c1.8 1.2 4.2 1.2 6 0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`);
      gogC = '#1F8BFF';
    }
    if (kind === 'cat') {
      strokes.push(['M80 144c14 2 22-6 18-16-2-5 4-8 6-4', 7]);
      ears = `<path d="M24 64l5-29 22 15z"/><path d="M96 64l-5-29-22 15z"/>`;
      earInner = `<path d="M31 53l2-9 7 5z" fill="#FF9EB5"/><path d="M89 53l-2-9-7 5z" fill="#FF9EB5"/>`;
      frontSil = `<ellipse cx="60" cy="138" rx="33" ry="9.5"/>`;
      frontFill = `<ellipse cx="60" cy="138" rx="33" ry="9.5" fill="#FFC94A"/><path d="M36 136l5 8M52 129l2 11M70 129l-1 11M84 136l-5 8" stroke="#FF7A6B" stroke-width="5"/>`;
      extra = (puff ? '' : `<path d="M58 90l2 2 2-2z" fill="#FF7A8F"/>`) + `<path d="M${puff ? 17 : 22} 90l-10-2M${puff ? 17 : 22} 95l-10 1M${puff ? 103 : 98} 90l10-2M${puff ? 103 : 98} 95l10 1" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" stroke-opacity=".7"/>`;
    }
    const sil = legs + body + bridge + arms + ears + head + frontSil;
    const pass = (col, w) => `<g fill="${col}" stroke="${col}" stroke-width="${w}" stroke-linejoin="round">${sil}</g>` + strokes.map(([d, b]) => `<path d="${d}" fill="none" stroke="${col}" stroke-width="${b + w}" stroke-linecap="round"/>`).join('');
    const fur_ = (s) => `<g fill="${F}">${s}</g>`;
    const fillPass = strokes.slice(1).map(([d, b]) => `<path d="${d}" fill="none" stroke="${F}" stroke-width="${b}" stroke-linecap="round"/>`).join('')
      + fur_(legs + body + bridge) + (armsBack ? fur_(arms) : '') + mid + (armsBack ? '' : fur_(arms))
      + fur_(ears) + earInner
      + `<path d="${TUFT}" fill="none" stroke="${F}" stroke-width="3" stroke-linecap="round"/>`
      + fur_(head) + goggles(gogC) + f.blush + f.eyes + extra + f.mouth + frontFill;
    return wrap(SHADOW + pass('#FFFFFF', 11) + pass(LINE, 4.6) + fillPass + drips(16) + (puff ? bubbles : ''));
  }

  // ---------- 바다 친구 ----------
  const eye = (x, y) => `<circle cx="${x}" cy="${y}" r="1.7" fill="${INK}"/>`;
  const blushS = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.6" fill="#FF9E9E" fill-opacity=".7"/>`;
  const SEA = {
    clownfish: () => { const s = `<ellipse cx="30" cy="33" rx="18" ry="12"/><path d="M45 33l11-9v18z"/><path d="M25 22c3-6 9-7 13-4l-2 6z"/>`;
      return { sil: s, fill: `<g fill="#FF9A5B">${s}</g>`, detail: `<path d="M21 23c-3 6-3 14 0 20M35 22c2.5 6 2.5 16 0 22" stroke="#FFFFFF" stroke-width="5" fill="none"/>${eye(16, 31)}${blushS(19, 36)}` }; },
    mackerel: () => { const s = `<path d="M8 34C14 23 40 23 50 32C40 43 14 44 8 34Z"/><path d="M48 32l10-7v14z"/>`;
      return { sil: s, fill: `<g fill="#7F9CC9">${s}</g><path d="M9 35C17 41 39 41 49 33C39 38 18 39 9 35Z" fill="#E3EAF7"/>`, detail: `<path d="M21 28.5l3 2.5 3-2.5 3 2.5 3-2.5 3 2.5" stroke="#4E6CA6" stroke-width="1.5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>${eye(15, 32)}` }; },
    tuna: () => { const s = `<ellipse cx="29" cy="33" rx="20" ry="14"/><path d="M46 33l10-10-2 10 2 10z"/><path d="M25 20c4-5 10-5 12 0z"/>`;
      return { sil: s, fill: `<g fill="#3E5FA8">${s}</g><path d="M10 36c4 8 12 11 19 11s15-3 19-10c-7 3-14 4-19 4s-12-1-19-5z" fill="#E3EAF7"/>`, detail: `<circle cx="42" cy="26" r="1.5" fill="#FFD25A"/><circle cx="45" cy="29" r="1.3" fill="#FFD25A"/><circle cx="17" cy="31" r="2.6" fill="#FFFFFF"/>${eye(17, 31)}${blushS(20, 37)}` }; },
    turtle: () => { const l = `<circle cx="13" cy="32" r="7"/><ellipse cx="22" cy="45" rx="6" ry="3.5"/><ellipse cx="46" cy="45" rx="6" ry="3.5"/><ellipse cx="22" cy="21" rx="6" ry="3.5"/><ellipse cx="46" cy="21" rx="5" ry="3"/><path d="M50 33l6-2-5 5z"/>`, sh = `<ellipse cx="34" cy="33" rx="17" ry="13"/>`;
      return { sil: l + sh, fill: `<g fill="#F2E2B3">${l}</g><g fill="#7CC28A">${sh}</g>`, detail: `<path d="M34 25l6 4v7l-6 4-6-4v-7z" fill="#9AD3A6"/>${eye(11, 31)}${blushS(14, 35)}` }; },
    otter: (g) => { const s = `<ellipse cx="32" cy="43" rx="14" ry="11"/><circle cx="21" cy="15" r="3.6"/><circle cx="43" cy="15" r="3.6"/><circle cx="32" cy="26" r="13"/>`;
      const gg = g ? `<path d="M19 21h26" stroke="#1F8BFF" stroke-width="2.2" stroke-linecap="round"/><circle cx="27" cy="21" r="3.6" fill="#3ED3C9" stroke="#1F8BFF" stroke-width="1.6"/><circle cx="37" cy="21" r="3.6" fill="#3ED3C9" stroke="#1F8BFF" stroke-width="1.6"/>` : '';
      return { sil: s, fill: `<g fill="#A9785A">${s}</g><ellipse cx="32" cy="29" rx="9" ry="7" fill="#EAD7C3"/>`, detail: `${eye(28, 26.5)}${eye(36, 26.5)}<ellipse cx="32" cy="29.5" rx="1.8" ry="1.3" fill="${INK}"/><path d="M27 45c0-4 2.5-6 5-6s5 2 5 6z" fill="#FFB8C8"/><circle cx="26" cy="44" r="2.6" fill="#8C5F44"/><circle cx="38" cy="44" r="2.6" fill="#8C5F44"/>${gg}` }; },
    humpback: () => { const s = `<path d="M6 34C6 24 18 20 32 22C44 24 52 28 54 32C50 40 36 44 22 43C12 42 6 39 6 34Z"/><path d="M52 31c3-6 7-7 9-6-1 4-3 6-6 7 3 1 5 3 6 6-2 1-6 0-9-5z"/><path d="M20 40c-3 6-8 9-12 9 1-4 4-8 9-11z"/>`;
      return { sil: s, fill: `<g fill="#6E8FC2">${s}</g><path d="M8 36c8 6 24 7 38 2-12 1-26 0-38-4z" fill="#DDE6F5"/>`, detail: `<path d="M14 38.5h16M16 40.5h12" stroke="#B9C9E6" stroke-width="1.2" stroke-linecap="round"/>${eye(15, 31)}${blushS(18, 35)}` }; },
    orca: () => { const s = `<path d="M6 34C8 25 20 22 32 24C44 25 52 29 54 33C48 40 34 43 22 42C12 41 6 38 6 34Z"/><path d="M30 24c1-7 4-11 7-12-1 5-1 9 0 13z"/><path d="M52 32c3-6 7-7 9-6-1 4-3 6-6 7 3 1 5 3 6 6-2 1-6 0-9-5z"/>`;
      return { sil: s, fill: `<g fill="#3D3F55">${s}</g><path d="M9 36c6 5 18 6 30 3-8-1-16-3-22-6z" fill="#FFFFFF"/>`, detail: `<ellipse cx="19" cy="29.5" rx="4.5" ry="2.3" fill="#FFFFFF" transform="rotate(-10 19 29.5)"/>${eye(18, 29.8)}` }; },
    bluewhale: () => { const s = `<path d="M4 36C4 28 16 25 30 26C44 27 54 30 56 34C52 41 38 44 22 43C11 42 4 40 4 36Z"/><path d="M54 33c3-6 6-7 8-6-1 4-3 6-5 7 2 1 4 3 5 6-2 1-5 0-8-5z"/><path d="M39 27l3-4 1 4z"/>`;
      return { sil: s, fill: `<g fill="#8AA9E0">${s}</g><path d="M7 38c8 4 22 5 36 1-10 1-24 0-36-3z" fill="#DCE6FA"/>`, detail: `${eye(12, 33)}${blushS(15, 37)}`, extra: `<path d="M15 23c-1-4-4-6-6-6M15 23c0-4 2-7 5-8M15 23v-7" stroke="#7FC4FF" stroke-width="2" fill="none" stroke-linecap="round"/>` }; },
    dolphin: () => { const s = `<path d="M8 30C12 22 26 18 38 22C46 25 52 30 54 36C50 34 46 33 42 34C34 40 20 40 12 35L4 34Z"/><path d="M30 20c2-5 6-7 9-7-1 3-2 6-1 9z"/><path d="M52 35c4-1 7 1 8 4-3 0-5-1-6 1-1-2-2-3-2-5z"/>`;
      return { sil: s, fill: `<g fill="#8FB8F0">${s}</g><path d="M8 33c8 3 18 4 30 0-10 0-20-1-30-3z" fill="#FFFFFF"/>`, detail: `${eye(16, 28)}${blushS(18, 31.5)}` }; },
    jellyfish: () => { const s = `<path d="M14 32C14 18 22 12 32 12S50 18 50 32C46 34 42 32 38 34 34 32 30 34 26 32 22 34 18 32 14 32Z"/>`;
      return { sil: s, fill: `<g fill="#CDE6FF">${s}</g>`, detail: `${eye(27, 25)}${eye(37, 25)}`, extra: `<path d="M20 35c-2 6 2 10 0 16M28 35c-1 6 2 11 0 17M36 35c1 6-2 11 0 17M44 35c2 6-2 10 0 16" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` }; },
    octopus: () => { const s = `<ellipse cx="18" cy="42" rx="5" ry="8" transform="rotate(35 18 42)"/><ellipse cx="27" cy="45" rx="4.5" ry="8"/><ellipse cx="37" cy="45" rx="4.5" ry="8"/><ellipse cx="46" cy="42" rx="5" ry="8" transform="rotate(-35 46 42)"/><ellipse cx="32" cy="25" rx="16" ry="14"/>`;
      return { sil: s, fill: `<g fill="#FF8A70">${s}</g>`, detail: `${eye(27, 26)}${eye(37, 26)}<circle cx="32" cy="32" r="2" fill="none" stroke="${INK}" stroke-width="1.4"/>${blushS(23, 30)}${blushS(41, 30)}` }; },
    puffer: () => { const s = `<circle cx="30" cy="33" r="17"/><path d="M45 33l9-6v12z"/><path d="M26 17c3-3 7-3 9 0z"/>`;
      return { sil: s, fill: `<g fill="#F3D98A">${s}</g><path d="M14 38c4 8 12 12 16 12s12-4 16-12c-5 4-10 5-16 5s-11-1-16-5z" fill="#FFF6DC"/>`, detail: `<circle cx="25" cy="23" r="1" fill="#C9A44A"/><circle cx="33" cy="22" r="1" fill="#C9A44A"/><circle cx="38" cy="27" r="1" fill="#C9A44A"/><circle cx="29" cy="28" r="1" fill="#C9A44A"/>${eye(21, 31)}<circle cx="15.5" cy="35" r="1.6" fill="none" stroke="${INK}" stroke-width="1.3"/>${blushS(23, 36)}` }; },
    starfish: () => { const s = `<path d="M32 9l6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2z"/>`;
      return { sil: s, fill: `<g fill="#FFA98A">${s}</g>`, detail: `<circle cx="32" cy="17" r="1.2" fill="#FFE0D2"/><circle cx="44" cy="27" r="1.2" fill="#FFE0D2"/><circle cx="39" cy="42" r="1.2" fill="#FFE0D2"/><circle cx="25" cy="42" r="1.2" fill="#FFE0D2"/><circle cx="20" cy="27" r="1.2" fill="#FFE0D2"/>${eye(28.5, 29)}${eye(35.5, 29)}` }; },
  };
  const seaInner = (c) => `<g fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round">${c.sil}</g>${c.fill}${c.detail}${c.extra || ''}`;
  function sea(kind, opt) { return `<svg viewBox="-2 -2 68 68" xmlns="http://www.w3.org/2000/svg">${seaInner(SEA[kind](opt))}</svg>`; }
  function school() {
    const c = SEA.mackerel();
    const one = (tx, ty, sc) => `<g transform="translate(${tx} ${ty}) scale(${sc})">${seaInner(c)}</g>`;
    return `<svg viewBox="-2 -2 68 68" xmlns="http://www.w3.org/2000/svg">${one(16, -2, 0.72)}${one(-2, 14, 0.72)}${one(20, 26, 0.72)}</svg>`;
  }
  // 회색 실루엣 (도감에서 아직 못 만난 친구)
  function seaSilhouette(kind) {
    const c = SEA[kind]();
    const g = '#C3D2E3';
    const strip = (s) => s.replace(/fill="#[0-9A-Fa-f]{6}"/g, `fill="${g}"`).replace(/stroke="#[0-9A-Fa-f]{6}"/g, `stroke="${g}"`);
    return `<svg viewBox="-2 -2 68 68" xmlns="http://www.w3.org/2000/svg"><g fill="${g}" stroke="${g}" stroke-width="3" stroke-linejoin="round">${c.sil}</g>${strip(c.fill)}${strip(c.extra || '')}</svg>`;
  }

  // ---------- 물개 코치 ----------
  const seal = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="${INK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"><path d="M14 52C10 40 14 22 30 16C42 12 52 20 52 32C52 44 44 54 32 56C24 57 18 56 14 52Z"/><ellipse cx="14" cy="50" rx="8" ry="4" transform="rotate(-25 14 50)"/><ellipse cx="50" cy="50" rx="8" ry="4" transform="rotate(25 50 50)"/></g><path d="M14 52C10 40 14 22 30 16C42 12 52 20 52 32C52 44 44 54 32 56C24 57 18 56 14 52Z" fill="#B7C3CF"/><ellipse cx="14" cy="50" rx="8" ry="4" fill="#B7C3CF" transform="rotate(-25 14 50)"/><ellipse cx="50" cy="50" rx="8" ry="4" fill="#B7C3CF" transform="rotate(25 50 50)"/><path d="M24 18c4-6 14-7 20-2l-2 4c-5-3-11-3-16 1z" fill="#FF7A6B" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><ellipse cx="37" cy="33" rx="7" ry="5" fill="#E7EDF3"/><circle cx="29" cy="28" r="1.8" fill="${INK}"/><circle cx="43" cy="28" r="1.8" fill="${INK}"/><ellipse cx="37" cy="31" rx="2.2" ry="1.6" fill="${INK}"/><path d="M33 34l-6 1M33 36l-6 2M41 34l6 1M41 36l6 2" stroke="${INK}" stroke-width="1.1" stroke-linecap="round"/><path d="M36 38v8" stroke="#1F8BFF" stroke-width="1.6"/><rect x="33.5" y="45" width="5" height="4" rx="1.5" fill="#FFC94A" stroke="${INK}" stroke-width="1.4"/><ellipse cx="24" cy="34" rx="3.5" ry="2.2" fill="#FF9E9E" fill-opacity=".7"/></svg>`;

  // ---------- 옆에서 본 수영하는 토끼 ----------
  const swSil = `<ellipse cx="54" cy="46" rx="30" ry="12"/><ellipse cx="24" cy="44" rx="7" ry="5" transform="rotate(-20 24 44)"/><ellipse cx="20" cy="51" rx="7" ry="5" transform="rotate(20 20 51)"/><path d="M80 30c-10-4-24-2-34 4 8 1 18 1 28 0z"/><ellipse cx="70" cy="22" rx="5.5" ry="14" transform="rotate(-40 70 22)"/><circle cx="92" cy="38" r="17"/>`;
  function swimmer(flip = false) {
    return `<svg viewBox="0 0 120 72" xmlns="http://www.w3.org/2000/svg"><g ${flip ? 'transform="translate(120 0) scale(-1 1)"' : ''}>
<g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round">${swSil}</g><g fill="${INK}" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round">${swSil}</g><g fill="#FFFFFF">${swSil}</g>
<path d="M74 31c-9-2-19-1-26 3" stroke="#FF9EB5" stroke-width="2.4" stroke-linecap="round" fill="none"/>
<path d="M33 54c5-6 14-8 26-7" stroke="#3ED3C9" stroke-width="7" stroke-linecap="round" fill="none"/>
<path d="M76 34h33" stroke="#FF7A6B" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="35" r="5" fill="#3ED3C9" stroke="#FF7A6B" stroke-width="2.2"/>
<ellipse cx="96" cy="45" rx="5" ry="3.2" fill="#FF9E9E" fill-opacity=".8"/><path d="M105 44c1 1.5 2.4 1.5 3.4 0" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<circle cx="8" cy="36" r="2.4" fill="#FFFFFF"/><circle cx="4" cy="44" r="1.8" fill="#FFFFFF"/><circle cx="10" cy="52" r="2" fill="#FFFFFF"/></g></svg>`;
  }

  window.ART = { animal, sea, school, seaSilhouette, seal, swimmer, INK };
})();
