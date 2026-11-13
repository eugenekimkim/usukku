// 우수꾸 아이콘 · 소품 · 배경 일러스트 (피그마 시안과 같은 SVG)
(function () {
  const INK = '#4A3530';
  const sv = (vb, inner) => `<svg viewBox="${vb}" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

  const tab = {
    '홈': (c) => sv('0 0 24 24', `<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`),
    '꾸미기': (c) => sv('0 0 24 24', `<path d="M8 4L3 7l2 5 2-1v9h10v-9l2 1 2-5-5-3c-1 2-2 3-4 3S9 6 8 4z" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`),
    '우리 수영장': (c) => sv('0 0 24 24', `<path d="M3 9c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M3 15c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`),
    '도감': (c) => sv('0 0 24 24', `<path d="M5 17V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v15H8a3 3 0 0 1-3-3zm0 0a3 3 0 0 1 3-3h11" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`),
  };

  const icon = {
    status: sv('0 0 66 12', `<rect x="0" y="8" width="3" height="4" rx="1" fill="#0F2A43"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#0F2A43"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#0F2A43"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#0F2A43"/><path d="M27 4.5a8 8 0 0 1 11 0M29.5 7a4.5 4.5 0 0 1 6 0" stroke="#0F2A43" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="32.5" cy="10" r="1.3" fill="#0F2A43"/><rect x="42.5" y="1" width="20" height="10" rx="3" stroke="#0F2A43" stroke-opacity=".4" fill="none"/><rect x="44.5" y="3" width="14" height="6" rx="1.5" fill="#0F2A43"/><rect x="63.5" y="4" width="1.5" height="4" rx=".75" fill="#0F2A43" fill-opacity=".4"/>`),
    wave: (c = '#1F8BFF', w = 1.8) => sv('0 0 16 16', `<path d="M2 6c1.5-1 3-1 4 0s2.5 1 4 0 2.5-1 4 0M2 10.5c1.5-1 3-1 4 0s2.5 1 4 0 2.5-1 4 0" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`),
    chev: (c = '#9DB2C7') => sv('0 0 24 24', `<path d="m9 6 6 6-6 6" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`),
    check: sv('0 0 12 12', `<path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`),
    bigCheck: (c) => sv('0 0 18 18', `<path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`),
    search: sv('0 0 24 24', `<circle cx="11" cy="11" r="7" stroke="#9DB2C7" stroke-width="2.2"/><path d="m20 20-4-4" stroke="#9DB2C7" stroke-width="2.2" stroke-linecap="round"/>`),
    locate: sv('0 0 24 24', `<circle cx="12" cy="12" r="4" fill="#1F8BFF"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="#1F8BFF" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="7.5" stroke="#1F8BFF" stroke-width="2"/>`),
    music: sv('0 0 16 16', `<path d="M6 12V3l8-1.5V10" stroke="#1F8BFF" stroke-width="1.6" stroke-linecap="round"/><circle cx="4.5" cy="12" r="2" fill="#1F8BFF"/><circle cx="12.5" cy="10.5" r="2" fill="#1F8BFF"/>`),
    play: sv('0 0 12 12', `<path d="M3 1.5v9l7.5-4.5z" fill="#456AFF"/>`),
    gearS: (c) => sv('0 0 24 24', `<circle cx="12" cy="12" r="3.4" stroke="${c}" stroke-width="2.4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/>`),
    gear: sv('0 0 24 24', `<circle cx="12" cy="12" r="3.2" stroke="#0F2A43" stroke-width="2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="#0F2A43" stroke-width="2" stroke-linecap="round"/>`),
    close: sv('0 0 24 24', `<path d="M6 6l12 12M18 6L6 18" stroke="#0F2A43" stroke-width="2.2" stroke-linecap="round"/>`),
    back: sv('0 0 24 24', `<path d="M15 5l-7 7 7 7" stroke="#0F2A43" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`),
    kakao: sv('0 0 20 20', `<path d="M10 3C5.6 3 2 5.8 2 9.2c0 2.2 1.5 4.1 3.7 5.2l-.8 3 3.4-2.2c.6.1 1.1.1 1.7.1 4.4 0 8-2.8 8-6.2S14.4 3 10 3z" fill="#191919"/>`),
    apple: sv('0 0 18 20', `<path d="M14.6 10.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.9-.9-3.1-.8C5 5.4 3.5 6.3 2.7 7.8c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8 2.1-1.2 2.9-2.4c.9-1.3 1.3-2.6 1.3-2.7 0 0-2.6-1-2.7-4.1zM12.3 3.6c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" fill="#FFFFFF"/>`),
    goal: sv('0 0 14 14', `<path d="M3 13V1.5" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><path d="M3.5 2h8l-2 3 2 3h-8z" fill="#FF9EC4" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`),
    me: sv('0 0 20 20', `<ellipse cx="7" cy="5" rx="2.4" ry="5" fill="#FFFFFF" stroke="${INK}" stroke-width="1.4"/><ellipse cx="13" cy="5" rx="2.4" ry="5" fill="#FFFFFF" stroke="${INK}" stroke-width="1.4"/><circle cx="10" cy="12" r="7" fill="#FFFFFF" stroke="${INK}" stroke-width="1.4"/><circle cx="7.6" cy="12" r=".9" fill="${INK}"/><circle cx="12.4" cy="12" r=".9" fill="${INK}"/><ellipse cx="6" cy="14.3" rx="1.6" ry="1" fill="#FF9E9E"/><ellipse cx="14" cy="14.3" rx="1.6" ry="1" fill="#FF9E9E"/>`),
  };
  const ic = (d) => sv('0 0 24 24', d.replace(/COL/g, INK));
  const menu = {
    box: ic(`<path d="M4 10h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="#FFB38A" stroke="COL" stroke-width="1.8"/><path d="M3 7c0-1 1-2 2-2h14c1 0 2 1 2 2v3H3z" fill="#FFD0B5" stroke="COL" stroke-width="1.8"/><path d="M12 5v15" stroke="#FFC94A" stroke-width="3"/>`),
    shirt: ic(`<path d="M8 4L3 7l2 5 2-1v9h10v-9l2 1 2-5-5-3c-1 2-2 3-4 3S9 6 8 4z" fill="#FFBFEC" stroke="COL" stroke-width="1.8" stroke-linejoin="round"/>`),
    pool: ic(`<rect x="3" y="5" width="18" height="14" rx="3" fill="#9FD3FF" stroke="COL" stroke-width="1.8"/><path d="M6 11c1.5-1 3-1 4 0s2.5 1 4 0 2.5-1 4 0" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>`),
    group: ic(`<circle cx="9" cy="9" r="3.5" fill="#B9C8FF" stroke="COL" stroke-width="1.8"/><circle cx="16" cy="10" r="3" fill="#FFE59A" stroke="COL" stroke-width="1.8"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5M13 18c.5-2.3 2-3.5 3.5-3.5 2 0 4 1.5 4 4" stroke="COL" stroke-width="1.8" stroke-linecap="round"/>`),
    book: ic(`<path d="M5 17V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v15H8a3 3 0 0 1-3-3zm0 0a3 3 0 0 1 3-3h11" fill="#C9F0D2" stroke="COL" stroke-width="1.8" stroke-linejoin="round"/>`),
    chart: ic(`<rect x="4" y="12" width="4" height="8" rx="1" fill="#9FD3FF" stroke="COL" stroke-width="1.6"/><rect x="10" y="7" width="4" height="13" rx="1" fill="#FFBFEC" stroke="COL" stroke-width="1.6"/><rect x="16" y="4" width="4" height="16" rx="1" fill="#FFE59A" stroke="COL" stroke-width="1.6"/>`),
  };

  const item = {
    chest: `<svg viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg"><ellipse cx="70" cy="112" rx="52" ry="6" fill="#0F2A43" fill-opacity=".08"/><rect x="18" y="52" width="104" height="56" rx="10" fill="#FF8A5B"/><path d="M18 52c0-22 20-36 52-36s52 14 52 36z" fill="#FFA779"/><rect x="18" y="48" width="104" height="10" fill="#E86A3E"/><rect x="62" y="16" width="16" height="92" fill="#FFC94A"/><rect x="58" y="50" width="24" height="22" rx="6" fill="#FFD978" stroke="#E0A92A" stroke-width="2"/><circle cx="70" cy="60" r="3" fill="#B07A1E"/><path d="M14 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#FFC94A"/><path d="M124 18l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z" fill="#3ED3C9"/><circle cx="118" cy="44" r="3" fill="#FFC94A"/><circle cx="26" cy="12" r="2.5" fill="#3ED3C9"/><circle cx="100" cy="8" r="2" fill="#FF7A6B"/></svg>`,
    sunrise: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="12" fill="#FFE7C2"/><circle cx="24" cy="30" r="10" fill="#FFB547"/><path d="M0 30h48v6a12 12 0 0 1-12 12H12A12 12 0 0 1 0 36z" fill="#7CC4FF"/><path d="M6 37c4-2 8 2 12 0s8-2 12 0 8 2 12 0" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    cap: (c, extra = '') => `<svg viewBox="0 0 48 40" xmlns="http://www.w3.org/2000/svg"><path d="M6 30C6 16 14 6 24 6s18 10 18 24z" fill="${c}"/>${extra}<rect x="4" y="28" width="40" height="6" rx="3" fill="#0F2A43" fill-opacity=".15"/></svg>`,
    capDots: '<circle cx="16" cy="18" r="2.5" fill="#FFFFFF"/><circle cx="26" cy="13" r="2.5" fill="#FFFFFF"/><circle cx="33" cy="21" r="2.5" fill="#FFFFFF"/><circle cx="21" cy="25" r="2.5" fill="#FFFFFF"/>',
    capRainbow: '<path d="M10 28c0-10 6-17 14-17s14 7 14 17" stroke="#FFC94A" stroke-width="3" fill="none"/><path d="M15 28c0-7 4-12 9-12s9 5 9 12" stroke="#3ED3C9" stroke-width="3" fill="none"/><path d="M20 28c0-3 2-6 4-6s4 3 4 6" stroke="#1F8BFF" stroke-width="3" fill="none"/>',
    capWhale: '<path d="M17 22c0-3 3-5 7-5s7 2 7 5-3 4-7 4-7-1-7-4z" fill="#FFFFFF"/><path d="M30 21c1.5-3 3.5-3.5 4-3-.5 1.5-1.5 2.5-2.5 3 1 .5 2 1.5 2.5 3-.5.5-2.5 0-4-3z" fill="#FFFFFF"/><path d="M38 10l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#FFC94A"/>',
    capTeam: '<path d="M14 22h20" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><path d="M20 15l4-4 4 4" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    capSun: '<circle cx="24" cy="24" r="6" fill="#FFFFFF"/><path d="M12 28h24" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>',
    coral: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 36V14M20 24c6-3 9-8 9-14M20 28c-6-2-9-7-9-12" stroke="#FF9EC4" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`,
    weed: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M16 36c-5-8 5-13 0-21s4-10 0-12M24 36c-4-7 4-11 0-18" stroke="#3FA65A" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`,
    shell: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M8 30c0-10 5-17 12-17s12 7 12 17z" fill="#FFD978"/><path d="M14 30v-9M20 30V15M26 30v-9" stroke="#E0A92A" stroke-width="1.6"/></svg>`,
    ball: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="13" fill="#FFFFFF" stroke="#E3EEF8"/><path d="M7 20a13 13 0 0 1 26 0z" fill="#FF7A6B"/><path d="M20 7v26" stroke="#FFC94A" stroke-width="4"/></svg>`,
    star: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 6l4 9 10 1-7.5 6.5L29 33l-9-5-9 5 2.5-10.5L6 16l10-1z" fill="#FFB547"/></svg>`,
  };

  const scene = {};
  scene.reef = `<svg viewBox="0 0 318 86" xmlns="http://www.w3.org/2000/svg"><path d="M0 70c40-6 80-6 120-2s80 6 120 2 60-4 78-2v18H0z" fill="#F6E3B4"/><path d="M44 72V36M44 52c8-4 12-10 12-20M44 58c-9-2-13-9-13-18" stroke="#FF7A6B" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M110 72c-4-12-2-22 4-30M114 52c6 0 12-6 12-14M108 60c-8-2-12-8-12-16" stroke="#FF9EC4" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="180" cy="58" r="13" fill="#FFB547"/><circle cx="174" cy="54" r="2" fill="#E0942A"/><circle cx="184" cy="60" r="2" fill="#E0942A"/><circle cx="182" cy="51" r="2" fill="#E0942A"/><path d="M236 72c-6-10 6-18 0-28s6-16 0-24M248 72c-5-9 5-15 0-24" stroke="#3FA65A" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M294 72V44M294 56c7-3 10-8 10-16" stroke="#1F8BFF" stroke-width="6" stroke-linecap="round" fill="none" stroke-dasharray="4 6" stroke-opacity=".5"/><path d="M150 22c0 3-4 5-8 5s-7-2-7-5 3-5 7-5 8 2 8 5zM149 22l6-4v8z" fill="#4DA3FF"/><path d="M78 14c0 2.5-3 4-6 4s-5-1.5-5-4 2-4 5-4 6 1.5 6 4zM77 14l5-3v6z" fill="#7BB8FF"/><circle cx="210" cy="16" r="2.5" fill="#FFFFFF"/><circle cx="216" cy="8" r="1.8" fill="#FFFFFF"/></svg>`;
  // 공동 리프 수조: 물 그라디언트 · 빛줄기 · 물결
  scene.reefWater = `<svg viewBox="0 0 318 129" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9F1FF"/><stop offset=".55" stop-color="#8FD6F5"/><stop offset="1" stop-color="#5FB8E8"/></linearGradient></defs><rect width="318" height="129" fill="url(#rw)"/><path d="M30 0l40 129h26L60 0zM150 0l30 129h22L176 0zM250 0l24 129h18L270 0z" fill="#FFFFFF" fill-opacity=".16"/><path d="M0 9c13-5 26-5 40 0s27 5 40 0 26-5 40 0 27 5 40 0 26-5 40 0 27 5 40 0 26-5 40 0 26 5 38 0" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="2" fill="none"/><circle cx="64" cy="40" r="2.5" fill="none" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="1.3"/><circle cx="70" cy="28" r="1.6" fill="#FFFFFF" fill-opacity=".8"/><circle cx="236" cy="52" r="2.8" fill="none" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="1.3"/><circle cx="242" cy="38" r="1.8" fill="#FFFFFF" fill-opacity=".8"/></svg>`;
  scene.teamCap = `<svg viewBox="0 0 48 40" xmlns="http://www.w3.org/2000/svg"><path d="M6 30C6 16 14 6 24 6s18 10 18 24z" fill="#3FA65A"/><path d="M14 22h20" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/><rect x="4" y="28" width="40" height="6" rx="3" fill="#0F2A43" fill-opacity=".15"/></svg>`;

  // MY POOL (위에서 본 수영장, 흰 토끼)
  scene.myPool = `<svg viewBox="0 0 350 290" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="175" cy="272" rx="150" ry="12" fill="#0F2A43" fill-opacity=".07"/>
<path d="M175 20 345 120 175 220 5 120z" fill="#F6E3B4"/><path d="M5 120 175 220v26L5 146z" fill="#E7CF95"/><path d="M345 120 175 220v26l170-100z" fill="#D9BE7E"/>
<path d="M175 46 301 120 175 194 49 120z" fill="#7CC4FF"/><path d="M175 46 301 120 175 194 49 120z" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
<path d="M98 116c7-4 14-4 21 0s14 4 21 0M198 146c7-4 14-4 21 0s14 4 21 0M160 76c6-3 12-3 18 0" stroke="#FFFFFF" stroke-opacity=".75" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M232 104c0 3-4 5-8 5s-7-2-7-5 3-5 7-5 8 2 8 5zM231 104l6-4v8z" fill="#2F7FE0"/><path d="M126 150c0 2.5-3 4-6 4s-5-1.5-5-4 2-4 5-4 6 1.5 6 4zM125 150l5-3v6z" fill="#2F7FE0"/>
<circle cx="250" cy="150" r="10" fill="#FFFFFF"/><path d="M240 150a10 10 0 0 1 20 0z" fill="#FF7A6B"/><path d="M250 140v20" stroke="#FFC94A" stroke-width="3"/>
<path d="M174 36c-4-8 4-14 0-22M182 38c-3-7 3-11 0-18" stroke="#3FA65A" stroke-width="4" stroke-linecap="round" fill="none"/>
<path d="M300 122V96M300 108c6-3 9-8 9-14M300 112c-6-2-9-6-9-12" stroke="#FFB547" stroke-width="5" stroke-linecap="round" fill="none"/>
<path d="M160 206c0-5 4-8 8-8s8 3 8 8z" fill="#FF9EC4"/><path d="M164 206v-6M168 206v-8M172 206v-6" stroke="#FFFFFF" stroke-width="1.2"/><path d="M184 210c0-4 3-6 6-6s6 2 6 6z" fill="#FFD978"/>
<path d="M42 124V92M42 106c7-4 10-9 10-17M42 112c-7-2-11-8-11-14" stroke="#FF7A6B" stroke-width="6" stroke-linecap="round" fill="none"/>
<rect x="22" y="76" width="40" height="54" rx="4" fill="none" stroke="#1F8BFF" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="62" cy="76" r="7" fill="#1F8BFF"/><path d="M59 73l6 6M65 73l-6 6" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>
<circle cx="22" cy="130" r="7" fill="#FFFFFF" stroke="#1F8BFF" stroke-width="1.5"/><path d="M19 130a3 3 0 1 1 3 3" stroke="#1F8BFF" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>`;

  // MY POOL 옆에서 본 레인 단면
  {
    const flags = []; for (let x = 18; x <= 372; x += 29) { const y = 24 + 48 * (x / 390) * (1 - x / 390); const cols = ['#FF9EC4', '#FFC94A', '#3ED3C9', '#456AFF']; flags.push(`<path d="M${x - 7} ${y.toFixed(1)}h14l-7 12z" fill="${cols[(x / 29 | 0) % 4]}"/>`); }
    let wave = 'M0 94'; for (let x = 0; x < 390; x += 32.5) wave += ' q16.25 -6 32.5 0';
    let rope = ''; for (let x = 6; x < 390; x += 13) rope += `<circle cx="${x}" cy="96" r="4.6" fill="${(Math.round(x / 13)) % 2 ? '#FF7A6B' : '#FFFFFF'}" fill-opacity=".85"/>`;
    const branch = (x, col, h = 30) => { const d = `M${x} 430V${430 - h}M${x} ${418 - h / 3}c7-4 10-9 10-17M${x} ${424 - h / 4}c-7-2-11-8-11-14`; return `<path d="${d}" stroke="${INK}" stroke-width="9" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${col}" stroke-width="5.6" stroke-linecap="round" fill="none"/>`; };
    const weed = (x) => { const d = `M${x} 432c-6-10 6-16 0-26s6-16 0-24M${x + 10} 432c-5-9 5-14 0-22`; return `<path d="${d}" stroke="${INK}" stroke-width="7.5" stroke-linecap="round" fill="none"/><path d="${d}" stroke="#7CC28A" stroke-width="4.2" stroke-linecap="round" fill="none"/>`; };
    const shell = (x, c) => `<path d="M${x - 9} 431c0-8 4-13 9-13s9 5 9 13z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M${x - 4} 431v-7M${x} 431v-10M${x + 4} 431v-7" stroke="${INK}" stroke-width="1.2" stroke-opacity=".5"/>`;
    const star = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -12l3.6 7.8 8.4 1.2-6 6 1.8 8.4-7.8-4.2-7.8 4.2 1.8-8.4-6-6 8.4-1.2z" fill="#FFA98A" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="-2.2" cy="-1" r="1.1" fill="${INK}"/><circle cx="2.2" cy="-1" r="1.1" fill="${INK}"/></g>`;
    scene.sideBg = `<svg viewBox="0 0 390 470" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="sideW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8DCFF"/><stop offset="1" stop-color="#5FAEF0"/></linearGradient></defs>
<rect width="390" height="470" fill="#EAF6FF"/><rect y="74" width="390" height="22" fill="#D7EBFB"/><path d="M0 74h390" stroke="#C3DCF2" stroke-width="2"/>
<path d="M0 24Q195 72 390 24" stroke="#9DB2C7" stroke-width="1.5" fill="none"/>${flags.join('')}
<path d="M58 60h274" stroke="#456AFF" stroke-width="2.4" stroke-dasharray="6 6" stroke-linecap="round" stroke-opacity=".75"/><path d="M64 54l-8 6 8 6M326 54l8 6-8 6" stroke="#456AFF" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".75"/>
${rope}<path d="${wave} V470 H0 Z" fill="url(#sideW)"/>
<path d="M40 100l50 330h40L70 100zM190 100l40 330h30l-50-330zM300 100l30 330h24l-40-330z" fill="#FFFFFF" fill-opacity=".12"/>
<rect x="0" y="94" width="12" height="376" fill="#CFE6FA"/><rect x="378" y="94" width="12" height="376" fill="#CFE6FA"/>
<path d="M0 140h12M0 190h12M0 240h12M0 290h12M0 340h12M0 390h12M378 140h12M378 190h12M378 240h12M378 290h12M378 340h12M378 390h12" stroke="#B4D3EE" stroke-width="1.5"/>
<rect x="12" y="438" width="366" height="32" fill="#CFE8FF"/><path d="M12 438h366" stroke="#B4D3EE" stroke-width="2"/><path d="M60 452h270M60 446v12M330 446v12" stroke="#2F5FBF" stroke-width="4" stroke-opacity=".55" stroke-linecap="round"/>
<path d="M14 440C70 414 130 422 196 430C258 420 318 412 376 440Z" fill="#F6E3B4"/>
<circle cx="150" cy="200" r="3" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="1.5"/><circle cx="156" cy="182" r="2" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="1.4"/><circle cx="312" cy="230" r="3.5" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="1.5"/><circle cx="318" cy="210" r="2.2" fill="none" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="1.4"/>
</svg>`;
    // 바닥 장식 (MY POOL 꾸미기): 장면 좌표 x 기준으로 놓는 조각
    const wrapD = (vb, inner) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    scene.deco = (k, c) => {
      if (k === 'weed') return { svg: wrapD('0 376 32 60', weed(10)), w: 32, top: 376, ox: 10 };
      if (k === 'coral') return { svg: wrapD('0 386 34 50', branch(14, c || '#FF9EC4', 34)), w: 34, top: 386, ox: 14 };
      if (k === 'shell') return { svg: wrapD('0 414 24 20', shell(12, c || '#FFD978')), w: 24, top: 414, ox: 12 };
      if (k === 'star') return { svg: wrapD('0 414 28 30', star(14, 428, 1)), w: 28, top: 414, ox: 14 };
      if (k === 'rock') return { svg: wrapD('0 422 32 20', `<ellipse cx="16" cy="432" rx="14" ry="8" fill="#B9C3CF" stroke="${INK}" stroke-width="2.2"/>`), w: 32, top: 422, ox: 16 };
      if (k === 'ball') return { svg: wrapD('0 72 28 28', `<g transform="translate(14 86)"><circle r="11" fill="#FFFFFF" stroke="${INK}" stroke-width="2.2"/><path d="M-11 0a11 11 0 0 1 22 0z" fill="#FF7A6B"/><path d="M0 -11v22" stroke="#FFC94A" stroke-width="3.5"/></g>`), w: 28, top: 72, ox: 14 };
      return null;
    };
    let w2 = 'M0 8'; for (let x = 0; x < 390; x += 32.5) w2 += ' q16.25 -6 32.5 0';
    scene.sideSurface = `<svg viewBox="0 0 390 34" xmlns="http://www.w3.org/2000/svg"><path d="${w2} V34 H0 Z" fill="#8CCBFA" fill-opacity=".5"/><path d="${w2}" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="1.6" fill="none"/></svg>`;
  }

  // 수영장 선택 지도
  {
    const pin = (x, y, c, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -34c-8 0-14 6-14 13 0 10 14 21 14 21s14-11 14-21c0-7-6-13-14-13z" fill="${c}" stroke="#FFFFFF" stroke-width="2.5"/><circle cx="0" cy="-21" r="4.5" fill="#FFFFFF"/></g>`;
    scene.map = `<svg viewBox="0 0 350 180" xmlns="http://www.w3.org/2000/svg"><rect width="350" height="180" fill="#EEF3F6"/><path d="M220 0h130v70c-30 10-60 6-90-6-20-8-34-30-40-64z" fill="#D7EFD9"/><path d="M0 145c60-20 110 10 170-6s110-30 180-10v51H0z" fill="#CFE6FF"/><path d="M40 0v135M180 0v62M305 0v100" stroke="#FFFFFF" stroke-width="5"/><path d="M0 60h350M120 0v180M262 72l-58 108M0 112c80 0 140-42 220-42" stroke="#FFFFFF" stroke-width="10" fill="none"/><circle cx="150" cy="96" r="20" fill="#1F8BFF" fill-opacity=".15"/><circle cx="150" cy="96" r="7" fill="#1F8BFF" stroke="#FFFFFF" stroke-width="3"/>${pin(72, 42, '#7BA7D9')}${pin(302, 126, '#7BA7D9')}${pin(212, 82, '#1F8BFF', 1.25)}</svg>`;
  }

  // 인트로 수영장 가장자리
  {
    let wave = 'M0 250'; for (let x = 0; x < 390; x += 39) wave += ' q19.5 -8 39 0';
    scene.introPool = `<svg viewBox="0 0 390 360" xmlns="http://www.w3.org/2000/svg"><rect y="214" width="390" height="40" fill="#F6E3B4"/><path d="M0 214h390" stroke="#E7CF95" stroke-width="3"/><path d="${wave} V360 H0Z" fill="#7CC4FF"/><path d="M40 290c10-5 20-5 30 0s20 5 30 0M250 312c10-5 20-5 30 0s20 5 30 0M160 334c8-4 16-4 24 0" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="330" cy="268" r="4" fill="none" stroke="#FFFFFF" stroke-width="2"/><circle cx="340" cy="254" r="2.5" fill="#FFFFFF"/></svg>`;
  }
  // 수영장 위 물결 (캐릭터 앞에 겹침)
  scene.ripple = `<svg viewBox="0 0 60 14" xmlns="http://www.w3.org/2000/svg"><path d="M4 7c8-4 15-4 23 0s15 4 23 0" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  // 꾸미기 아이템 아이콘 (수경 · 수영복 · 오리발)
  item.goggle = (c) => `<svg viewBox="0 0 48 40" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h40" stroke="${c}" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="20" r="9" fill="#3ED3C9" stroke="${c}" stroke-width="4"/><circle cx="32" cy="20" r="9" fill="#3ED3C9" stroke="${c}" stroke-width="4"/><path d="M12 16c2-2 4-2 6-1" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>`;
  item.suit = (c, s = '#FFFFFF') => `<svg viewBox="0 0 48 40" xmlns="http://www.w3.org/2000/svg"><path d="M14 4h6c0 6 2 9 4 9s4-3 4-9h6v14c0 10-6 18-10 18s-10-8-10-18z" fill="${c}"/><path d="M15 20h18M16 27h16" stroke="${s}" stroke-width="3"/></svg>`;
  item.fin = (c) => `<svg viewBox="0 0 48 40" xmlns="http://www.w3.org/2000/svg"><path d="M10 6c4-2 8-2 10 2l-2 26c-4 4-12 4-14 0z" fill="${c}"/><path d="M28 8c4-2 8-2 10 2l-2 26c-4 4-12 4-14 0z" fill="${c}" opacity=".85"/></svg>`;
  scene.bubbles =`<svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="20" r="6" fill="none" stroke="#FFFFFF" stroke-width="2.4"/><circle cx="28" cy="10" r="4" fill="none" stroke="#FFFFFF" stroke-width="2"/><circle cx="40" cy="22" r="2.6" fill="#FFFFFF"/></svg>`;

  window.PROPS = { tab, icon, menu, item, scene };
})();
