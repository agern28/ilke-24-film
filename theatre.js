// Piksel tiyatro: config.js'teki karakterler ve perdelerle oynayan küçük sahne motoru
window.Theatre = (() => {
  const W = 128, H = 112, GROUND = 100;
  let cv, ctx, box, nameEl, textEl, nextEl, card, onDone;

  // ── Sprite katmanları (16 sütun × 25 satır) ─────
  const L = obj => { const a = []; for (const k in obj) a[+k] = obj[k]; return a; };
  const BASE = [
    '................',
    '................',
    '....OOOOOOOO....',
    '...OSSSSSSSSO...',
    '..OSSSSSSSSSSO..',
    '..OSSSSSSSSSSO..',
    '..OSSESSSSESSO..',
    '..OSSESSSSESSO..',
    '..OSRSSSSSSRSO..',
    '..OSSSSMMSSSSO..',
    '...OSSSSSSSSO...',
    '....OOSSSSOO....',
    '...OOTSSSSTOO...',
    '..OTTTTTTTTTTO..',
    '.OTTOTTTTTTOTTO.',
    '.OTTOTTTTTTOTTO.',
    '.OTTOTTTTTTOTTO.',
    '.OSSOTTTTTTOSSO.',
    '.OOOOBBBBBBOOOO.',
    '....OBBBBBBO....',
    '....OBBOOBBO....',
    '....OBBOOBBO....',
    '....OBBOOBBO....',
    '....OKKOOKKO....',
    '...OOKKOOKKOO...'
  ];
  const SKIRT = L({
    18: '.OOOOBBBBBBOOOO.',
    19: '...OBBBBBBBBO...',
    20: '...OBBBBBBBBO...',
    21: '....OSSOOSSO....',
    22: '....OSSOOSSO....'
  });
  const LEGS_B = L({
    22: '....OBBOOKKO....',
    23: '....OKKO.OOO....',
    24: '...OOKKO........'
  });
  const HAIR = {
    short: {
      front: L({
        1: '....hHHHHHHh....',
        2: '...HHHHHHHHHH...',
        3: '..HHHHHHHHHHHH..',
        4: '..HHHHHHHHHHHH..',
        5: '..HHH.HH....HH..',
        6: '..H..........H..',
        7: '..H..........H..'
      })
    },
    long: {
      back: L({
        2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..',
        4: '.HHHHHHHHHHHHHH.', 5: '.HHHHHHHHHHHHHH.', 6: '.HHHHHHHHHHHHHH.', 7: '.HHHHHHHHHHHHHH.',
        8: '.HHHHHHHHHHHHHH.', 9: '.HHHHHHHHHHHHHH.', 10: '.HHHHHHHHHHHHHH.', 11: '.HHHHHHHHHHHHHH.',
        12: '.HHHHHHHHHHHHHH.', 13: '.HHHHHHHHHHHHHH.', 14: '.HHHHHHHHHHHHHH.', 15: '.HHHHHHHHHHHHHH.',
        16: '.HHHHHHHHHHHHHH.', 17: '.HHHHHHHHHHHHHH.', 18: '.HHH........HHH.', 19: '.hH..........Hh.'
      }),
      front: L({
        1: '....hHHHHHHh....', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..',
        4: '.HHHHHHHHHHHHHH.', 5: '.HHHHHHH....HHH.',
        6: '.HHH........HHH.', 7: '.HHH........HHH.', 8: '.HH..........HH.', 9: '.HH..........HH.',
        10: '.HH..........HH.', 11: '.HHH........HHH.', 12: '.HHH........HHH.', 13: '.HHH........HHH.',
        14: '.HH..........HH.', 15: '.HH..........HH.', 16: '.hH..........Hh.'
      })
    },
    bob: {
      back: L({
        2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..', 4: '.HHHHHHHHHHHHHH.', 5: '.HHHHHHHHHHHHHH.',
        6: '.HHHHHHHHHHHHHH.', 7: '.HHHHHHHHHHHHHH.', 8: '.HHHHHHHHHHHHHH.', 9: '.HHHHHHHHHHHHHH.',
        10: '.HHHHHHHHHHHHHH.', 11: '.hHH........HHh.'
      }),
      front: L({
        1: '....hHHHHHHh....', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..',
        4: '.HHHHHHHHHHHHHH.', 5: '.HHHHHHHHHHHHHH.', 6: '.HHH........HHH.', 7: '.HHH........HHH.',
        8: '.HH..........HH.', 9: '.HH..........HH.', 10: '.HHH........HHH.', 11: '.hHH........HHh.'
      })
    },
    bun: {
      front: L({
        0: '.....hHHHHh.....',
        1: '....hHHHHHHh....', 2: '...HHHHHHHHHH...', 3: '..HHHHHHHHHHHH..',
        4: '..HHHHHHHHHHHH..', 5: '..HH........HH..', 6: '..H..........H..', 7: '..H..........H..'
      })
    },
    ponytail: {
      back: L({
        5: '.............HH.', 6: '............HHH.', 7: '.............HH.', 8: '.............HH.',
        9: '.............HH.', 10: '.............HH.', 11: '.............Hh.', 12: '.............Hh.',
        13: '..............h.'
      }),
      front: L({
        1: '....hHHHHHHh....', 2: '...HHHHHHHHHH...', 3: '..HHHHHhHHHHHH..',
        4: '..HHHH....HHHH..', 5: '..HH........HH..', 6: '..H..........H..', 7: '..H..........H..',
        8: '..h..........h..'
      })
    },
    curlyShort: {
      front: L({
        0: '...H.HH.HH.H....', 1: '..HHHHHHHHHHHH..', 2: '.HHHHHHHHHHHHHH.',
        3: '.HHHhHHHhHHHhHH.', 4: '..HHHHHHHHHHHH..', 5: '..HH.HH..HH.HH..',
        6: '..H..........H..', 7: '..H..........H..'
      })
    },
    curly: {
      back: L({
        1: '...H.HHHHHH.H...', 2: '..HHHHHHHHHHHH..', 3: '.HHHHHHHHHHHHHH.',
        4: 'HHHHHHHHHHHHHHHH', 5: 'HHHHHHHHHHHHHHHH', 6: 'HHHHHHHHHHHHHHHH', 7: 'HHHHHHHHHHHHHHHH',
        8: 'HHHHHHHHHHHHHHHH', 9: 'HHHHHHHHHHHHHHHH', 10: 'HHHHHHHHHHHHHHHH', 11: 'HHHHHHHHHHHHHHHH',
        12: 'HHHHHHHHHHHHHHHH', 13: '.HHHHHHHHHHHHHH.', 14: '.HHHHHHHHHHHHHH.', 15: '.HHH.HHHHHH.HHH.',
        16: '.H.H........H.H.'
      }),
      front: L({
        1: '...H.hHHHHh.H...', 2: '..HHHHHHHHHHHH..', 3: '.HHHHHHHHHHHHHH.',
        4: 'HHHHhHHhHHhHHHHH', 5: 'HHH.HH.HH.HH.HHH', 6: 'HHH..........HHH', 7: 'HH............HH',
        8: 'HHH..........HHH', 9: 'HH............HH', 10: 'HHH..........HHH', 11: '.HH..........HH.',
        12: '.HHH........HHH.', 13: '.HhH........HhH.', 14: '.HH..........HH.', 15: '.H.H........H.H.'
      })
    }
  };
  const GLASSES = L({ 5: '...GGGG..GGGG...', 6: '...G..GGGG..G...', 7: '...G..G..G..G...', 8: '...GGGG..GGGG...' });
  const BEARD = L({ 8: '..DD.DDDDDD.DD..', 9: '..DDDDD..DDDDD..', 10: '...DDDDDDDDDD...', 11: '....DDDDDDDD....' });
  const STUBBLE = L({ 9: '...d.d....d.d...', 10: '....d.d.d.d.....' });
  const HEART = ['.HH.HH.', 'HHHHHHH', 'HHHHHHH', '.HHHHH.', '..HHH..', '...H...'];
  const NOTE = ['..HHH', '..H.H', '..H.H', 'HHH.H', 'HHHHH', '.H...'];
  const FONT = {
    H: ['101', '101', '111', '101', '101'], A: ['010', '101', '111', '101', '101'],
    Z: ['111', '001', '010', '100', '111'], '!': ['1', '1', '1', '0', '1'],
    '?': ['111', '001', '010', '000', '010'], '2': ['111', '001', '111', '100', '111'], '4': ['101', '101', '111', '001', '001'],
    '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'], '3': ['111', '001', '111', '001', '111'],
    '5': ['111', '100', '111', '001', '111'], '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'],
    '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'], '.': ['0', '0', '0', '0', '1']
  };

  // ── Çizim yardımcıları ───────────────────────
  const px = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
  const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  function rows(layer, ox, oy, pal) {
    layer.forEach((row, y) => {
      if (!row) return;
      for (let x = 0; x < row.length; x++) {
        const c = pal[row[x]];
        if (c) px(ox + x, oy + y, c);
      }
    });
  }
  function disc(cx, cy, r, c) {
    ctx.fillStyle = c;
    for (let y = -r; y <= r; y++) {
      const w = Math.floor(Math.sqrt(r * r - y * y));
      ctx.fillRect(cx - w, cy + y, w * 2 + 1, 1);
    }
  }
  function text(str, x, y, c) {
    ctx.fillStyle = c;
    for (const ch of str) {
      const g = FONT[ch];
      if (!g) { x += 3; continue; }
      g.forEach((r, gy) => [...r].forEach((b, gx) => b === '1' && ctx.fillRect(x + gx, y + gy, 1, 1)));
      x += g[0].length + 1;
    }
  }
  function seeded(seed) {
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    const ch = s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)));
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  }

  function mix(a, b, f) {
    const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
    const ch = s => Math.round(((A >> s) & 255) * (1 - f) + ((B >> s) & 255) * f);
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  }

  // ── Mekânlar ─────────────────────────────────
  const BG = {
    cafe(t) {
      rect(0, 0, W, 76, '#5a3a2e');
      for (let x = 0; x < W; x += 6) rect(x, 0, 1, 60, '#523428');
      rect(0, 60, W, 16, '#3e2720');
      rect(0, 60, W, 1, '#2a1a15');
      for (let y = 76; y < H; y += 6) for (let x = 0; x < W; x += 6) rect(x, y, 6, 6, ((x + y) / 6) % 2 ? '#2b1d18' : '#3a2820');
      // pencere
      rect(42, 12, 44, 34, '#2a1d1a'); rect(44, 14, 40, 30, '#22304f');
      rect(63, 14, 2, 30, '#2a1d1a'); rect(44, 28, 40, 2, '#2a1d1a');
      [[50, 18], [74, 20], [58, 36], [80, 38]].forEach(([x, y], i) => px(x, y, (t / 400 + i) % 3 < 2 ? '#f4ead7' : '#8a8fb0'));
      for (let i = 0; i < 6; i++) { const ry = (t / 30 + i * 9) % 30; px(46 + i * 7, 14 + ry, '#6f8fa8'); px(46 + i * 7, 15 + ry, '#4d6584'); }
      // lamba
      rect(64, 0, 1, 7, '#1b1414');
      ctx.globalAlpha = .08; disc(64, 12, 22, '#ffd27a'); disc(64, 12, 14, '#ffd27a'); ctx.globalAlpha = 1;
      rect(60, 7, 9, 2, '#d4b06a'); rect(58, 9, 13, 3, '#d4b06a'); rect(62, 12, 5, 1, '#fff2c4');
      // poster
      rect(98, 16, 20, 26, '#efe3cc'); rect(100, 18, 16, 22, '#9e1b22'); rows([HEART[0], HEART[1], HEART[2], HEART[3], HEART[4], HEART[5]], 104, 25, { H: '#efe3cc' });
      // masa ve fincanlar
      rect(50, 72, 28, 3, '#7a4b35'); rect(50, 75, 28, 1, '#4a2c20'); rect(62, 76, 4, 22, '#4a2c20'); rect(58, 97, 12, 2, '#3a2219');
      [55, 69].forEach((cx, i) => {
        rect(cx, 67, 5, 5, '#f4ead7'); rect(cx + 5, 68, 1, 2, '#f4ead7'); rect(cx + 1, 67, 3, 1, '#6b4430');
        for (let k = 0; k < 3; k++) { const sy = (t / 120 + k * 4 + i * 2) % 10; px(cx + 2 + Math.round(Math.sin((t / 300) + k)), 65 - sy, `rgba(244,234,215,${.5 - sy / 22})`); }
      });
    },
    street(t) {
      const sky = ['#0b0f20', '#0f1428', '#141a34', '#1a2142', '#202850', '#28305c'];
      sky.forEach((c, i) => rect(0, i * 14, W, 14, c));
      const r = seeded(7);
      for (let i = 0; i < 40; i++) { const x = Math.floor(r() * W), y = Math.floor(r() * 50); if (((t / 500) + i) % 5 > .6) px(x, y, i % 4 ? '#c9cbe0' : '#fff'); }
      disc(102, 16, 7, '#f4ead7'); disc(105, 14, 6, '#141a34');
      const r2 = seeded(3);
      let x = 0;
      while (x < W) {
        const bw = 12 + Math.floor(r2() * 14), bh = 22 + Math.floor(r2() * 30);
        rect(x, 88 - bh, bw, bh, '#0b0e1c');
        for (let wy = 88 - bh + 4; wy < 84; wy += 6) for (let wx = x + 2; wx < x + bw - 2; wx += 4) if (r2() > .55) rect(wx, wy, 2, 3, r2() > .2 ? '#d4b06a' : '#e8a0a6');
        x += bw + 1;
      }
      rect(0, 88, W, 24, '#2a2630'); rect(0, 88, W, 2, '#3a3542');
      for (let sx = 0; sx < W; sx += 16) rect(sx, 90, 1, 22, '#221f28');
      // sokak lambası
      const fl = Math.sin(t / 90) > .97 ? .04 : .1;
      ctx.globalAlpha = fl; disc(64, 30, 26, '#ffd27a'); disc(64, 30, 16, '#ffd27a'); ctx.globalAlpha = .07;
      ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.moveTo(60, 32); ctx.lineTo(40, 100); ctx.lineTo(88, 100); ctx.lineTo(68, 32); ctx.fill(); ctx.globalAlpha = 1;
      rect(63, 30, 2, 70, '#1c1c26'); rect(60, 98, 8, 2, '#1c1c26'); rect(59, 27, 10, 3, '#1c1c26'); rect(61, 30, 6, 2, '#fff2c4');
    },
    room(t) {
      rect(0, 0, W, 80, '#3d2b45');
      for (let y = 0; y < 80; y += 8) for (let x = (y / 8) % 2 * 4; x < W; x += 8) px(x, y + 3, '#463250');
      for (let y = 80; y < H; y += 4) { rect(0, y, W, 4, y % 8 ? '#4a3226' : '#563b2c'); rect((y * 7) % W, y, 1, 4, '#3a271e'); }
      rect(0, 80, W, 1, '#2a1d1a');
      // pencere (gün batımı)
      rect(8, 14, 30, 30, '#2a1d1a');
      ['#7b4b78', '#c56a7f', '#e98b7c', '#f2b38a'].forEach((c, i) => rect(10, 16 + i * 7, 26, 7, c));
      disc(23, 40, 5, '#ffe0a8'); rect(10, 42, 26, 2, '#3d2b45'); rect(22, 16, 2, 26, '#2a1d1a');
      // ışık zinciri
      for (let i = 0; i < 16; i++) {
        const lx = 4 + i * 8, ly = 4 + Math.round(Math.sin(i * .8) * 2);
        px(lx, ly - 1, '#1b1414');
        px(lx, ly, ['#ffd27a', '#e8a0a6', '#7d9bb5', '#f4ead7'][(i + Math.floor(t / 600)) % 4]);
      }
      // poster ve plak rafı
      rect(98, 14, 18, 24, '#efe3cc'); rect(100, 16, 14, 14, '#7d9bb5'); disc(107, 23, 4, '#1b1414'); disc(107, 23, 1, '#9e1b22'); rect(100, 32, 14, 2, '#9e1b22');
      // kanepe
      rect(34, 58, 60, 14, '#7a2a32'); rect(30, 64, 6, 18, '#6a222a'); rect(92, 64, 6, 18, '#6a222a');
      rect(36, 70, 56, 10, '#8c3038'); rect(36, 70, 56, 1, '#a23c45'); rect(63, 60, 1, 10, '#5e1d24');
      rect(34, 82, 2, 3, '#2a1d1a'); rect(92, 82, 2, 3, '#2a1d1a');
      // bitki
      rect(108, 72, 10, 10, '#9a5a3c'); [[110, 64], [113, 60], [116, 65], [112, 67], [108, 68]].forEach(([x, y]) => rect(x, y, 3, 6, '#4f7a3a'));
    },
    classroom(t) {
      rect(0, 0, W, 80, '#c9cfb4'); rect(0, 56, W, 24, '#a7ae8f'); rect(0, 56, W, 1, '#8a9176');
      // tahta
      rect(24, 8, 80, 42, '#5b4a3a'); rect(26, 10, 76, 38, '#f4f4ee');
      const r = seeded(11);
      for (let i = 0; i < 7; i++) rect(30, 14 + i * 4, 10 + Math.floor(r() * 44), 1, i % 3 ? '#2a3a7a' : '#b02a2a');
      rows(HEART, 90, 36, { H: '#e0303c' });
      rect(26, 48, 76, 2, '#8a7a66'); rect(40, 47, 4, 1, '#f4f4ee'); rect(70, 47, 3, 1, '#e8a0a6');
      // saat
      disc(114, 16, 6, '#2a1d1a'); disc(114, 16, 5, '#f4f4ee');
      rect(114, 12, 1, 4, '#2a1d1a'); const a = t / 2000; px(114 + Math.round(Math.cos(a) * 3), 16 + Math.round(Math.sin(a) * 3), '#b02a2a');
      // pencere
      rect(4, 12, 14, 32, '#6f757b'); rect(5, 13, 12, 30, '#9fd0f0'); rect(10, 13, 1, 30, '#6f757b'); rect(5, 27, 12, 1, '#6f757b');
      // zemin ve sıralar
      for (let y = 80; y < H; y += 6) for (let x = 0; x < W; x += 6) rect(x, y, 6, 6, ((x + y) / 6) % 2 ? '#8e8a80' : '#9c988d');
      [6, 50, 94].forEach(x => {
        rect(x, 66, 28, 4, '#a0683f'); rect(x, 70, 28, 1, '#6e4428');
        rect(x + 2, 71, 2, 11, '#555'); rect(x + 24, 71, 2, 11, '#555');
      });
      rect(10, 63, 7, 3, '#7d9bb5'); rect(58, 62, 8, 4, '#e8a0a6'); rect(100, 63, 6, 3, '#d4b06a');
    },
    arcade(t) {
      rect(0, 0, W, 92, '#1a1028');
      for (let x = 0; x < W; x += 16) rect(x, 0, 1, 92, '#22163a');
      ctx.globalAlpha = .6 + .4 * Math.sin(t / 300); rect(0, 8, W, 2, '#ff4fa3'); rect(0, 88, W, 1, '#4fd8ff'); ctx.globalAlpha = 1;
      [[4, 30], [102, 30]].forEach(([x, y], i) => {
        rect(x, y, 22, 58, '#2b1e44'); rect(x + 3, y + 4, 16, 12, i ? '#4fd8ff' : '#ffd27a');
        ctx.globalAlpha = .25 + .2 * Math.sin(t / 200 + i); rect(x + 3, y + 4, 16, 12, '#fff'); ctx.globalAlpha = 1;
        rect(x + 5, y + 22, 4, 4, '#e0303c'); rect(x + 12, y + 22, 4, 4, '#4fd8ff');
      });
      // boks makinesi
      const mx = 50, now = performance.now();
      rect(mx, 22, 28, 70, '#b0202a'); rect(mx + 2, 24, 24, 66, '#8c1a22'); rect(mx, 90, 28, 2, '#5a0d11');
      for (let i = 0; i < 5; i++) px(mx + 4 + i * 5, 23, (Math.floor(t / 150) + i) % 2 ? '#ffe28a' : '#5a0d11');
      rect(mx + 3, 27, 22, 10, '#0b0710'); text(String(machine.shown).padStart(3, '0'), mx + 8, 29, '#ff5a5a');
      const sw = Math.max(0, 1 - (now - machine.swingAt) / 700);
      const ang = Math.round(Math.sin((now - machine.swingAt) / 55) * sw * 5);
      rect(mx + 12, 38, 4, 10, '#2a2a30');
      disc(mx + 14 + ang, 54, 7, '#e0303c'); disc(mx + 12 + ang, 52, 2, '#ff8a8a');
      rect(mx + 4, 70, 20, 3, '#ffd27a'); rect(mx + 4, 76, 20, 3, '#ffd27a');
      rect(0, 92, W, 20, '#2a1d3a'); for (let x = 0; x < W; x += 8) rect(x, 92, 4, 20, '#33244a');
    },
    bedroom(t) {
      rect(0, 0, W, 80, '#d8d4cc'); for (let x = 0; x < W; x += 10) rect(x, 0, 1, 80, '#cfcac1');
      rect(0, 80, W, 32, '#b89a78'); for (let y = 80; y < H; y += 5) rect(0, y, W, 1, '#a88a69');
      rect(8, 16, 24, 26, '#6f6a62'); rect(10, 18, 20, 22, '#2b3150'); disc(24, 24, 3, '#f4ead7'); rect(19, 18, 1, 22, '#6f6a62');
      rect(98, 18, 20, 14, '#2a1d1a'); rect(100, 20, 16, 10, '#e8a0a6'); rows(HEART, 104, 22, { H: '#9e1b22' });
      // gri yatak
      rect(36, 50, 58, 14, '#8f8f92'); for (let x = 38; x < 92; x += 3) px(x, 53 + (x % 2), '#7d7d80');
      rect(38, 62, 54, 14, '#1d1d22'); rect(40, 58, 22, 7, '#efefef'); rect(66, 58, 22, 7, '#efefef');
      rect(36, 76, 58, 4, '#7d7d80'); rect(38, 80, 3, 3, '#3a3a3a'); rect(89, 80, 3, 3, '#3a3a3a');
      // lamba
      ctx.globalAlpha = .1; disc(112, 38, 16, '#ffd27a'); ctx.globalAlpha = 1;
      rect(111, 40, 2, 40, '#3a3a40'); rect(106, 34, 12, 6, '#ffd27a'); rect(108, 80, 8, 2, '#3a3a40');
      rect(20, 96, 88, 8, '#9e1b22'); rect(22, 98, 84, 4, '#b8262e');
    },
    elevator(t) {
      for (let x = 0; x < W; x++) rect(x, 0, 1, 92, ['#8e949a', '#a3a9af', '#b9bfc5', '#a3a9af'][Math.floor(x / 6) % 4]);
      for (let x = 0; x < W; x += 24) rect(x, 0, 1, 92, '#6f757b');
      // tavan ışıkları
      rect(0, 0, W, 14, '#5d6268');
      [[4, 2], [36, 2], [68, 2], [100, 2]].forEach(([x, y]) => { rect(x, y, 26, 9, '#eef3f6'); rect(x, y + 8, 26, 1, '#cfd6db'); });
      ctx.globalAlpha = .08; rect(0, 14, W, 20, '#ffffff'); ctx.globalAlpha = 1;
      // kapı ve desen
      rect(38, 24, 52, 68, '#7d8389'); rect(40, 26, 48, 66, '#9aa0a6'); rect(63, 26, 2, 66, '#6f757b');
      for (let y = 28; y < 90; y += 4) for (let x = 42 + (y / 4 % 2) * 2; x < 86; x += 4) px(x, y, '#babfc4');
      // kat göstergesi: 24
      rect(56, 15, 16, 8, '#1b1414'); text('24', 59, 16, (Math.floor(t / 700) % 2) ? '#ff5a5a' : '#e0303c');
      // pano ve ayna parlaması
      rect(10, 30, 14, 26, '#efe3cc'); rect(12, 32, 10, 3, '#7d9bb5'); rect(12, 37, 10, 2, '#e8a0a6'); rect(12, 41, 10, 2, '#7d9bb5'); rect(12, 45, 8, 2, '#c9cbe0');
      rect(104, 30, 16, 20, '#2a2a30'); rect(106, 32, 12, 16, '#55606a');
      ctx.globalAlpha = .15; for (let i = 0; i < 3; i++) rect(14 + i * 40 + Math.round(Math.sin(t / 2000) * 6), 20, 2, 70, '#ffffff'); ctx.globalAlpha = 1;
      // tutamaklar ve zemin
      rect(0, 66, 30, 2, '#dfe4e8'); rect(98, 66, 30, 2, '#dfe4e8'); rect(0, 68, 30, 1, '#6f757b'); rect(98, 68, 30, 1, '#6f757b');
      rect(0, 92, W, 20, '#5d6268'); for (let x = 0; x < W; x += 8) rect(x, 92, 1, 20, '#52575c'); rect(0, 92, W, 1, '#3f4348');
    },
    sunset(t) {
      const sky = ['#3d2b55', '#5e3a6b', '#8a4a78', '#b85f7c', '#df7f7a', '#f2a07e', '#f7c38f'];
      sky.forEach((c, i) => rect(0, i * 10, W, 10, c));
      disc(64, 70, 14, '#ffe3a3'); disc(64, 70, 11, '#fff0c8');
      rect(0, 66, W, 14, '#6a4a7a');
      for (let i = 0; i < 14; i++) { const sx = (i * 23 + Math.floor(t / 200) * (i % 2 ? 1 : -1)) % W; rect((sx + W) % W, 68 + (i % 6) * 2, 4 + (i % 3) * 2, 1, i % 2 ? '#f7c38f' : '#ffe3a3'); }
      rect(0, 80, W, 32, '#e3b98f'); rect(0, 80, W, 2, '#f4ead7');
      for (let i = 0; i < 30; i++) px((i * 37) % W, 84 + (i * 13) % 26, '#c99e76');
      const palm = (bx, flip) => {
        for (let y = 0; y < 50; y++) rect(bx + Math.round(Math.sin(y / 14) * 4) * flip, 92 - y, 3, 1, '#2b1d2e');
        const tx = bx + Math.round(Math.sin(50 / 14) * 4) * flip, ty = 42;
        const sway = Math.round(Math.sin(t / 700) * 1);
        [[-1, 0], [1, 0], [-1, .5], [1, .5], [0, -1]].forEach(([dx, dy]) => {
          for (let k = 0; k < 14; k++) rect(tx + 1 + dx * k + sway, ty + Math.round(dy * k + (k * k) / 28), 2, 1, '#2b1d2e');
        });
      };
      palm(10, 1); palm(114, -1);
      const bird = (bx, by) => { px(bx, by, '#3d2b55'); px(bx - 1, by - 1, '#3d2b55'); px(bx + 1, by - 1, '#3d2b55'); };
      bird(40 + (t / 80) % 90, 22); bird(48 + (t / 80) % 90, 26);
    }
  };

  // ── Oyuncular ────────────────────────────────
  let chars = {}, cast = [], effects = [];
  function palette(d) {
    return {
      O: '#24181a', S: d.skin, R: mix(d.skin, '#e06a74', .3), E: d.eyes || '#24181a', M: d.lips || shade(d.skin, .7),
      T: d.top, B: d.bottom, K: d.shoes || '#1b1414', H: d.hair, h: shade(d.hair, .75),
      G: d.glassesColor || '#1b1414', D: d.beardColor || d.hair, d: shade(d.skin, .8)
    };
  }
  function drawChar(c, t) {
    const d = chars[c.key];
    if (!d) return;
    const pal = palette(d);
    pal.R = c.mood === 'blush' ? '#e06a74' : pal.R;
    const style = HAIR[d.hairStyle] || HAIR.short;
    const walking = c.walkTo != null;
    let x = Math.round(c.x);
    let y = GROUND - 25 - (walking ? Math.floor(t / 110) % 2 : Math.floor((t + c.phase) / 650) % 2);
    if (c.mood === 'laugh') x += Math.floor(t / 70) % 2;
    if (c.lungeAt && t - c.lungeAt < 160) x += c.lungeDir * 4;
    ctx.globalAlpha = .3; rect(x + 3, GROUND, 10, 1, '#000'); rect(x + 4, GROUND + 1, 8, 1, '#000'); ctx.globalAlpha = 1;
    if (style.back) rows(style.back, x, y, pal);
    rows(BASE, x, y, pal);
    if (d.skirt) rows(SKIRT, x, y, pal);
    if (d.inner) rect(x + 6, y + 13, 4, 5, d.inner);
    if (walking && Math.floor(t / 110) % 2) rows(LEGS_B, x, y, pal);
    // yüz
    const S = pal.S, dark = '#24181a';
    const blink = (t + c.phase * 3) % 3200 < 130;
    if (c.mood === 'laugh' || c.mood === 'happy') {
      [5, 10].forEach(ex => { px(x + ex, y + 6, dark); px(x + ex, y + 7, S); px(x + ex - 1, y + 7, dark); px(x + ex + 1, y + 7, dark); });
    } else if (blink) {
      [5, 10].forEach(ex => px(x + ex, y + 6, S));
    }
    if (c.mood === 'shock') { px(x + 7, y + 9, dark); px(x + 8, y + 9, dark); px(x + 7, y + 10, dark); px(x + 8, y + 10, dark); }
    else if (c.talking && Math.floor(t / 110) % 2 || c.mood === 'laugh') { px(x + 7, y + 9, '#3a1414'); px(x + 8, y + 9, '#3a1414'); px(x + 7, y + 10, pal.M); px(x + 8, y + 10, pal.M); }
    if (c.mood === 'blush') { px(x + 3, y + 8, '#e06a74'); px(x + 12, y + 8, '#e06a74'); }
    if (d.beard === 'full') rows(BEARD, x, y, pal);
    if (d.beard === 'stubble') rows(STUBBLE, x, y, pal);
    rows(style.front, x, y, pal);
    if (d.glasses) rows(GLASSES, x, y, pal);
    if (c.talking && !effects.some(e => e.who === c.key)) {
      const by = y - 5 + Math.floor(t / 300) % 2;
      rect(x + 6, by, 5, 1, '#f4ead7'); rect(x + 7, by + 1, 3, 1, '#f4ead7'); px(x + 8, by + 2, '#f4ead7');
    }
    c.drawY = y;
  }
  function drawEffects(t) {
    effects = effects.filter(e => t - e.born < 1700);
    for (const e of effects) {
      const c = cast.find(k => k.key === e.who);
      if (!c) continue;
      const age = (t - e.born) / 1700;
      const x = Math.round(c.x) + 4, y = (c.drawY ?? GROUND - 25) - 9 - Math.round(age * 10);
      ctx.globalAlpha = age > .7 ? (1 - age) / .3 : 1;
      if (e.type === 'heart') rows(HEART, x, y, { H: '#e0303c' });
      else if (e.type === 'note') rows(NOTE, x + 1, y, { H: '#f4ead7' });
      else if (e.type === 'haha') text('HAHA', x - 4, y, '#ffe28a');
      else if (e.type === 'zzz') text('ZZZ', x, y, '#c9cbe0');
      else if (e.type === '!') text('!', x + 3, y, '#ffe28a');
      else if (e.type === '?') text('?', x + 2, y, '#f4ead7');
      else if (e.type === '...') text('...', x + 1, y, '#f4ead7');
      else if (e.type === 'sweat') rows(['.B.', 'BBB', 'BBB', '.B.'], x + 9, y + 4, { B: '#7dc3ff' });
      ctx.globalAlpha = 1;
    }
  }

  // ── Mini oyunlar ─────────────────────────────
  const machine = { shown: 0, swingAt: -9999 };
  let punchTries = 0, lastScore = 0;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function walkTo(c, to, speed = 0.9) {
    return new Promise(r => {
      if (Math.abs(c.x - to) < 1) { c.x = to; return r(); }
      c.walkTo = to; c.speed = speed; c.onArrive = r;
    });
  }
  function countUp(score) {
    return new Promise(r => {
      const start = performance.now(), dur = 1300;
      (function f() {
        const k = Math.min(1, (performance.now() - start) / dur);
        machine.shown = Math.round(score * (1 - Math.pow(1 - k, 3)));
        if (Math.random() < .5) window.FilmAudio?.blip(300 + k * 900);
        if (k < 1) setTimeout(f, 40); else { jingle([784, 988, 1175]); r(); }
      })();
    });
  }
  async function doPunch(key, score) {
    const c = cast.find(x => x.key === key);
    if (!c) return;
    const home = c.x, left = c.x < 64;
    machine.shown = 0;
    await walkTo(c, left ? 38 : 74, 1.1);
    c.lungeDir = left ? 1 : -1;
    for (let i = 0; i < 2; i++) { c.lungeAt = performance.now(); window.FilmAudio?.blip(140); await wait(260); }
    machine.swingAt = performance.now();
    await countUp(score);
    await wait(700);
    await walkTo(c, home, 1.1);
  }

  function startPunchGame(s) {
    choosing = true;
    nextEl.classList.remove('show');
    nameEl.textContent = '';
    box.classList.add('narrate');
    textEl.textContent = s.prompt || 'Sıra sende! İbre ortadayken VUR!';
    choicesEl.innerHTML = '<div class="pt-meter"><b class="pt-meter-mark"></b></div><button class="pt-choice pt-action">🥊 VUR!</button>';
    const mark = choicesEl.querySelector('.pt-meter-mark');
    let pos = 0, dir = 1, last = performance.now(), live = true;
    (function anim(now) {
      if (!live) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      pos += dir * dt * 1.5;
      if (pos > 1) { pos = 1; dir = -1; }
      if (pos < 0) { pos = 0; dir = 1; }
      mark.style.left = pos * 100 + '%';
      requestAnimationFrame(anim);
    })(last);
    choicesEl.querySelector('button').addEventListener('click', async e => {
      e.stopPropagation();
      if (!live) return;
      live = false;
      let power = 1 - Math.abs(pos - .5) * 2;
      if (punchTries >= 2) power = Math.max(power, .75);
      punchTries++;
      lastScore = Math.min(999, Math.round(380 + power * 619));
      choicesEl.innerHTML = '';
      box.classList.remove('narrate');
      textEl.textContent = '';
      await doPunch(s.who || 'ilke', lastScore);
      choosing = false;
      const won = lastScore > s.vs;
      if (won) addLove(3);
      queue.unshift(...((won ? s.win : s.lose) || []));
      advance();
    });
  }

  function startChase(s) {
    choosing = true;
    nextEl.classList.remove('show');
    const me = cast.find(c => c.key === (s.who || 'ilke')), him = cast.find(c => c.key === s.target);
    const need = s.taps || 12;
    let n = 0, live = true;
    nameEl.textContent = chars[s.target]?.name || '';
    box.classList.remove('narrate');
    textEl.textContent = s.shout || '';
    choicesEl.innerHTML = `<div class="pt-meter"><i class="pt-meter-fill"></i></div><button class="pt-choice pt-action"></button>`;
    const btn = choicesEl.querySelector('button'), fill = choicesEl.querySelector('.pt-meter-fill');
    btn.textContent = s.button || 'YAKALA!';
    him.mood = 'shock';
    me.mood = 'happy';
    (function flee() {
      if (!live) return;
      if (him.walkTo == null || Math.abs(him.x - me.x) < 16) { him.walkTo = me.x < him.x ? 108 : 4; him.speed = 1.3; }
      setTimeout(flee, 120);
    })();
    const shout = setInterval(() => {
      if (!live) return;
      textEl.textContent = s.shout || '';
      window.FilmAudio?.blip(420);
      effects.push({ who: him.key, type: Math.random() < .5 ? '!' : 'sweat', born: performance.now() });
    }, 1300);
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (!live) return;
      n++;
      fill.style.width = Math.min(100, n / need * 100) + '%';
      window.FilmAudio?.blip(600 + n * 30);
      const d = him.x - me.x;
      me.x += Math.sign(d) * Math.min(8, Math.abs(d));
      if (n >= need) {
        live = false;
        clearInterval(shout);
        him.walkTo = null; me.walkTo = null;
        me.x = Math.max(2, Math.min(110, him.x + (me.x < him.x ? -13 : 13)));
        choicesEl.innerHTML = '';
        choosing = false;
        queue.unshift(...(s.then || []));
        advance();
      }
    });
  }

  // ── Senaryo akışı ────────────────────────────
  let acts = [], act = -1, queue = [], busy = true, typing = null, lineDone = true, finished = false, choosing = false, raf;
  let love = 0, choicesEl, loveEl, waitingStart = false;
  function frame(t) {
    const A = acts[act] || acts[0];
    (BG[A?.place] || BG.room)(t);
    for (const c of cast) {
      if (c.walkTo != null) {
        const dir = Math.sign(c.walkTo - c.x);
        const sp = c.speed || 0.6;
        c.x += dir * sp;
        if (Math.abs(c.walkTo - c.x) <= sp) { c.x = c.walkTo; c.walkTo = null; c.onArrive?.(); }
      }
    }
    [...cast].sort((a, b) => a.x - b.x).forEach(c => drawChar(c, t));
    drawEffects(t);
    raf = requestAnimationFrame(frame);
  }

  function placeCast(A) {
    const pos = (A && A.positions) || {};
    cast = Object.keys(chars).map((k, n) => ({ key: k, x: pos[k] ?? (n === 0 ? 26 : 86), walkTo: null, mood: null, talking: false, phase: n * 400 }));
  }

  function showCard(no, title, sub) {
    card.querySelector('.pt-card-no').textContent = no;
    card.querySelector('.pt-card-title').textContent = title;
    card.querySelector('.pt-card-sub').textContent = sub || '';
    card.classList.add('show');
  }

  function jingle(notes) {
    notes.forEach((f, i) => setTimeout(() => window.FilmAudio?.blip(f), i * 110));
  }

  function setupAct(i) {
    act = i;
    const A = acts[i];
    placeCast(A);
    queue = [...A.script];
    effects = [];
    nameEl.textContent = '';
    textEl.textContent = '';
    box.classList.remove('narrate');
    nextEl.classList.remove('show');
    showCard(`PERDE ${['I', 'II', 'III', 'IV', 'V'][i] || i + 1}`, A.title || '');
    jingle([523, 659, 784]);
    busy = true;
    setTimeout(() => {
      card.classList.remove('show');
      setTimeout(() => { busy = false; advance(); }, 600);
    }, 2300);
  }

  function typeLine(str, who) {
    lineDone = false;
    nextEl.classList.remove('show');
    let i = 0;
    const pitch = who && chars[who] ? (chars[who].voice || 600) : 420;
    return new Promise(res => {
      typing = { finish() { i = str.length - 1; } };
      (function stepT() {
        i++;
        textEl.textContent = str.slice(0, i);
        if (i % 2 && str[i - 1] !== ' ') window.FilmAudio?.blip(pitch);
        if (i >= str.length) { typing = null; lineDone = true; res(); return; }
        const ch = str[i - 1];
        setTimeout(stepT, '.!?…'.includes(ch) ? 260 : ch === ',' ? 120 : 34);
      })();
    });
  }

  function addLove(n) {
    if (!n) return;
    love += n;
    loveEl.textContent = love;
    const hud = loveEl.parentElement;
    hud.classList.remove('pop');
    void hud.offsetWidth;
    hud.classList.add('pop');
  }

  const DODGE = ['emin misin?', 'bir daha düşün 🥺', 'yanlış butona basıyorsun', 'olmaz ki…', 'kaçamazsın 😄', 'tamam pes et'];
  function showChoices(list) {
    choosing = true;
    nextEl.classList.remove('show');
    choicesEl.innerHTML = '';
    let dodges = 0;
    list.forEach(c => {
      const b = document.createElement('button');
      b.className = 'pt-choice';
      b.textContent = c.text;
      const pickIt = e => {
        e.stopPropagation();
        if (c.dodge) {
          e.preventDefault();
          dodges++;
          b.textContent = DODGE[Math.min(dodges - 1, DODGE.length - 1)];
          b.classList.add('dodging');
          const maxX = Math.max(0, choicesEl.clientWidth - b.offsetWidth);
          b.style.left = Math.random() * maxX + 'px';
          b.style.top = -40 - Math.random() * 160 + 'px';
          window.FilmAudio?.blip(900);
          return;
        }
        choosing = false;
        choicesEl.innerHTML = '';
        addLove(c.love ?? 1);
        jingle([660, 880]);
        const player = window.CONFIG.player || 'ilke';
        queue.unshift({ who: player, say: c.say ?? c.text, mood: c.mood }, ...(c.then || []));
        advance();
      };
      b.addEventListener('click', pickIt);
      if (c.dodge) {
        b.addEventListener('pointerdown', pickIt);
        b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') pickIt(e); });
      }
      choicesEl.appendChild(b);
    });
  }

  async function run(s) {
    cast.forEach(c => { c.talking = false; if (!s.keepMood) c.mood = null; });
    if (s.moods) for (const k in s.moods) { const c = cast.find(x => x.key === k); if (c) c.mood = s.moods[k]; }
    const who = s.who && cast.find(c => c.key === s.who);
    if (who && s.mood) who.mood = s.mood;
    if (s.love) addLove(s.love);
    if (s.emote) (Array.isArray(s.emote) ? s.emote : [s.emote]).forEach(em => {
      const [k, type] = em.includes(':') ? em.split(':') : [s.who, em];
      effects.push({ who: k, type, born: performance.now() });
    });
    if (who && s.mood === 'laugh' && !s.emote) effects.push({ who: who.key, type: 'haha', born: performance.now() });
    if (s.punch) { busy = true; await doPunch(s.punch, s.score); busy = false; return advance(); }
    if (s.minigame === 'punch') return startPunchGame(s);
    if (s.minigame === 'chase') return startChase(s);
    if (s.walk) {
      busy = true;
      await Promise.all(Object.entries(s.walk).map(([k, to]) => new Promise(r => {
        const c = cast.find(x => x.key === k);
        if (!c) return r();
        c.walkTo = to; c.speed = s.speed || 0.6; c.onArrive = r;
      })));
      busy = false;
      if (!s.say && !s.narrate) return advance();
    }
    if (s.say || s.narrate) {
      nameEl.textContent = s.say ? (chars[s.who]?.name || '') : '';
      box.classList.toggle('narrate', !s.say);
      if (who) who.talking = true;
      await typeLine((s.say || s.narrate).replace('{score}', lastScore), s.say ? s.who : null);
      if (who) who.talking = false;
      if (s.choices) showChoices(s.choices);
      else nextEl.classList.add('show');
    } else {
      busy = true;
      setTimeout(() => { busy = false; advance(); }, s.wait || 1300);
    }
  }

  function advance() {
    if (waitingStart) {
      waitingStart = false;
      card.classList.remove('show', 'start');
      jingle([392, 523, 659, 784, 1047]);
      setTimeout(() => setupAct(0), 700);
      return;
    }
    if (busy || finished || choosing) return;
    if (typing) { typing.finish(); return; }
    if (!lineDone) return;
    if (!queue.length) {
      if (act < acts.length - 1) setupAct(act + 1);
      else { finished = true; nextEl.classList.remove('show'); onDone && onDone(); }
      return;
    }
    run(queue.shift());
  }

  function start(scene, done) {
    onDone = done;
    cv = scene.querySelector('#ptCanvas');
    ctx = cv.getContext('2d');
    box = scene.querySelector('.pt-box');
    nameEl = scene.querySelector('.pt-name');
    textEl = scene.querySelector('.pt-text');
    nextEl = scene.querySelector('.pt-next');
    choicesEl = scene.querySelector('.pt-choices');
    loveEl = scene.querySelector('#ptLove');
    card = scene.querySelector('.pt-card');
    chars = window.CONFIG.characters || {};
    acts = window.CONFIG.acts || [];
    if (!acts.length) { done && done(); return; }
    scene.querySelector('.pt-stage').addEventListener('click', advance);
    act = -1;
    placeCast(acts[0]);
    raf = requestAnimationFrame(frame);
    showCard('★ 1 OYUNCU ★', 'İLKE: THE GAME', '▶ başlamak için dokun');
    card.classList.add('start');
    waitingStart = true;
  }

  return { start, W, H };
})();
