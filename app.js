(() => {
  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const rand = (a, b) => a + Math.random() * (b - a);

  // ── Config'i sayfaya yerleştir ───────────────
  const photos = (C.photos || []).map(p => typeof p === 'string' ? { src: p, caption: '' } : p);
  const ageStr = String(C.age);
  $$('[data-name]').forEach(el => el.textContent = C.name);
  $$('[data-age]').forEach(el => el.textContent = ageStr);
  $$('[data-from]').forEach(el => el.textContent = C.from);
  $$('[data-initial]').forEach(el => el.textContent = C.name.charAt(0));
  $('[data-age-1]').textContent = ageStr.charAt(0);
  $('[data-age-2]').textContent = ageStr.slice(1) || '';
  $('#finaleLine').textContent = C.finaleLine || '';
  document.title = `${C.name} · ${C.age}`;

  function polaroid(photo, rot) {
    const fig = document.createElement('figure');
    fig.className = 'polaroid';
    fig.style.setProperty('--rot', `${rot ?? rand(-5, 5)}deg`);
    const ph = document.createElement('div');
    ph.className = 'ph';
    if (photo && photo.src) {
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption || '';
      img.loading = 'lazy';
      ph.appendChild(img);
    } else {
      ph.textContent = '🍒';
    }
    const cap = document.createElement('figcaption');
    cap.textContent = photo?.caption || '';
    fig.append(ph, cap);
    fig._photo = photo;
    return fig;
  }

  // ── Bölüm sahnelerini oluştur ────────────────
  const roman = n => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1] || n;
  const anchor = $('#chapters-anchor');
  const chapterIds = (C.chapters || []).map((ch, i) => {
    const sec = document.createElement('section');
    sec.className = 'scene tap chapter';
    sec.id = 'ch' + i;
    sec.innerHTML = `
      <div class="wrap">
        <p class="kicker r">Bölüm ${roman(i + 1)}</p>
        <h2 class="script chapter-title r" style="--d:.3s"></h2>
        <p class="song r" style="--d:.6s"></p>
        <div class="r pol-slot" style="--d:.9s"></div>
        <p class="typed"></p>
      </div>
      <p class="hint">dokun →</p>`;
    $('.chapter-title', sec).textContent = ch.title;
    if (ch.song) $('.song', sec).textContent = '♪ ' + ch.song;
    else $('.song', sec).remove();
    const photo = ch.photo ? photos[ch.photo - 1] : null;
    if (photo || photos.length === 0) $('.pol-slot', sec).appendChild(polaroid(photo, i % 2 ? 3 : -3));
    sec._text = ch.text;
    anchor.before(sec);
    return sec.id;
  });
  anchor.remove();

  // ── Ses: plak cızırtısı, daktilo, müzik kutusu ─
  let actx = null, master = null, crackle = null, muted = false;
  function initAudio() {
    if (actx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
    master = actx.createGain();
    master.gain.value = 1;
    master.connect(actx.destination);

    // Cızırtı: hafif hışırtı + rastgele çıtırtılar
    const len = actx.sampleRate * 6;
    const buf = actx.createBuffer(1, len, actx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.03 * w) / 1.03;
      d[i] = last * 0.5;
      if (Math.random() < 0.0006) d[i] += (Math.random() * 2 - 1) * 0.6;
      if (Math.random() < 0.00004) for (let k = 0; k < 40 && i + k < len; k++) d[i + k] += (Math.random() * 2 - 1) * 0.5 * (1 - k / 40);
    }
    const src = actx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const hp = actx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 400;
    crackle = actx.createGain();
    crackle.gain.value = 0.5;
    src.connect(hp).connect(crackle).connect(master);
    src.start();
  }

  function tick() {
    if (!actx || muted) return;
    const t = actx.currentTime;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = 'square';
    o.frequency.value = rand(1400, 2200);
    g.gain.setValueAtTime(0.012, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.04);
  }

  function musicBox(notes, beat = 0.42) {
    if (!actx) return;
    let t = actx.currentTime + 0.3;
    for (const [n, dur] of notes) {
      const f = 440 * Math.pow(2, (n - 69) / 12);
      [1, 2.01, 3.98].forEach((mult, k) => {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = 'sine';
        o.frequency.value = f * mult;
        const v = [0.09, 0.03, 0.012][k];
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(v, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 1.7);
      });
      t += dur * beat;
    }
  }
  // Happy Birthday (kamu malı melodi), MIDI notaları
  const HB = [
    [67, .75], [67, .25], [69, 1], [67, 1], [72, 1], [71, 2],
    [67, .75], [67, .25], [69, 1], [67, 1], [74, 1], [72, 2],
    [67, .75], [67, .25], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
    [77, .75], [77, .25], [76, 1], [72, 1], [74, 1], [72, 3]
  ];

  window.FilmAudio = {
    blip(freq = 600) {
      if (!actx || muted) return;
      const t = actx.currentTime;
      const o = actx.createOscillator();
      const g = actx.createGain();
      o.type = 'square';
      o.frequency.value = freq * (0.95 + Math.random() * 0.1);
      g.gain.setValueAtTime(0.025, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 0.07);
    }
  };

  const muteBtn = $('#muteBtn');
  muteBtn.addEventListener('click', () => {
    muted = !muted;
    muteBtn.classList.toggle('off', muted);
    if (master) master.gain.setTargetAtTime(muted ? 0 : 1, actx.currentTime, 0.1);
    Music.setMuted(muted);
  });

  // ── Daktilo efekti ───────────────────────────
  let typing = null;
  function typeText(el, text, speed = 36, onStep) {
    return new Promise(res => {
      let i = 0;
      el.textContent = '';
      el.classList.add('typing');
      const t = { finish() { i = text.length - 1; } };
      typing = t;
      (function step() {
        i++;
        el.textContent = text.slice(0, i);
        onStep && onStep();
        if (i >= text.length) {
          el.textContent = text;
          el.classList.remove('typing');
          typing = null;
          res();
          return;
        }
        const ch = text[i - 1];
        if (i % 2) tick();
        setTimeout(step, '.…!?'.includes(ch) ? speed * 9 : ch === '\n' ? speed * 5 : ch === ',' ? speed * 4 : speed);
      })();
    });
  }

  // ── Sahne motoru ─────────────────────────────
  const order = ['gate', 'countdown', 'title', 'vinyl', ...chapterIds, 'wall', 'cake', 'finale', 'theatre', 'letter'];
  let idx = 0;
  const enter = {};

  function show(i) {
    const prev = $('.scene.active');
    if (prev) prev.classList.remove('active');
    idx = i;
    const s = document.getElementById(order[i]);
    s.dataset.ready = '';
    s.scrollTop = 0;
    s.classList.add('active');
    (enter[order[i]] || (s.classList.contains('chapter') ? enterChapter : null))?.(s);
  }
  const next = () => idx < order.length - 1 && show(idx + 1);

  function advanceTap(e) {
    const s = $('.scene.active');
    if (!s || !s.classList.contains('tap')) return;
    if (e && e.target.closest && e.target.closest('button, a, iframe')) return;
    if (typing) { typing.finish(); return; }
    if (s.dataset.ready !== '1') return;
    next();
  }
  document.addEventListener('click', advanceTap);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); advanceTap(); }
  });
  const ready = s => { s.dataset.ready = '1'; $('.hint', s)?.classList.add('show'); };

  // ── Şarkı (YouTube) ──────────────────────────
  const Music = (() => {
    let player = null, loaded = false, ready = false, wantPlay = false, failed = false, playing = false, vol = 0, target = 0, fadeT = null, isMuted = false;
    function load() {
      if (!C.youtube || loaded) return;
      loaded = true;
      window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player('ytPlayer', {
          width: 200, height: 113, videoId: C.youtube,
          playerVars: { controls: 0, playsinline: 1, disablekb: 1, rel: 0, modestbranding: 1, start: C.youtubeStart || 0 },
          events: {
            onReady: () => { ready = true; player.setVolume(0); if (wantPlay) play(); },
            onError: e => { console.warn('yt-error', e.data); failed = true; $('#ytDock').classList.remove('show'); },
            onStateChange: e => {
              if (e.data === 0 && wantPlay) { player.seekTo(C.youtubeStart || 0); player.playVideo(); }
              playing = e.data === 1 || e.data === 3;
              if (playing) $('#ytDock').classList.remove('show');
            }
          }
        });
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    function fadeTo(v, ms = 2500, then) {
      target = v;
      clearInterval(fadeT);
      const stepV = (v - vol) / (ms / 100);
      fadeT = setInterval(() => {
        vol += stepV;
        if ((stepV >= 0 && vol >= target) || (stepV < 0 && vol <= target)) { vol = target; clearInterval(fadeT); then && then(); }
        if (ready) player.setVolume(isMuted ? 0 : Math.round(vol));
      }, 100);
    }
    function play(v = 100) {
      wantPlay = true;
      if (failed || !loaded) return;
      // iPhone bazen gizli videoyu başlatmaz: o zaman videoyu gösterip dokunmasını iste
      setTimeout(() => { if (wantPlay && !playing && !failed) $('#ytDock').classList.add('show'); }, 2500);
      if (!ready) return;
      player.playVideo();
      fadeTo(v, 3000);
      if (crackle) crackle.gain.setTargetAtTime(0.15, actx.currentTime, 1);
    }
    function stop() {
      wantPlay = false;
      if (!ready) return;
      fadeTo(0, 2500, () => player.pauseVideo());
      if (crackle) crackle.gain.setTargetAtTime(0.5, actx.currentTime, 1);
    }
    function setMuted(m) { isMuted = m; if (ready) player.setVolume(m ? 0 : Math.round(vol)); }
    return { load, play, stop, setMuted, get failed() { return failed || !C.youtube; } };
  })();

  // 0 · Açılış
  $('#startBtn').addEventListener('click', () => {
    Music.load();
    initAudio();
    actx?.resume();
    muteBtn.classList.remove('hidden');
    show(1);
  });

  // 1 · Geri sayım
  enter.countdown = async () => {
    const n = $('#cdNum');
    for (const v of [3, 2, 1]) { n.textContent = v; await sleep(1000); }
    next();
  };

  // 2 · Jenerik
  enter.title = async s => { await sleep(5600); ready(s); };

  // 3 · Plak
  const record = $('#record');
  record.addEventListener('click', () => {
    if (record.classList.contains('spin')) return;
    $('#arm').classList.add('on');
    setTimeout(() => record.classList.add('spin'), 900);
    if (C.youtube) {
      Music.play(100);
      $('#vinylHint').textContent = Music.failed ? 'İğne plağa değdi… ♪' : '♪ ' + (C.songTitle || '');
      setTimeout(() => $('#vinylNext').classList.remove('hidden'), 1600);
      return;
    }
    const m = (C.music || '').match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([A-Za-z0-9]+)/);
    if (m) {
      $('#spotify').innerHTML =
        `<iframe src="https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
      $('#vinylHint').textContent = 'Şimdi play\'e bas, sonra devam et ♪';
    } else {
      $('#vinylHint').textContent = 'İğne plağa değdi… ♪';
    }
    setTimeout(() => $('#vinylNext').classList.remove('hidden'), 1600);
  });
  $('#vinylNext').addEventListener('click', next);

  // 4 · Bölümler
  async function enterChapter(s) {
    await sleep(1900);
    if (!s.classList.contains('active')) return;
    await typeText($('.typed', s), s._text || '');
    ready(s);
  }

  // 4b · Piksel tiyatro
  enter.theatre = async s => {
    rainRate = 0;
    Music.play(40);
    await sleep(1400);
    window.Theatre.start(s, () => $('#theatreNext').classList.remove('hidden'));
  };
  $('#theatreNext').addEventListener('click', next);

  // 5 · Polaroid duvarı
  const wallBox = $('#wallBox');
  let zTop = 10;
  const wallPhotos = photos.length ? photos : Array.from({ length: 6 }, () => null);
  const wallEls = wallPhotos.map(p => {
    const el = polaroid(p);
    makeDraggable(el);
    wallBox.appendChild(el);
    return el;
  });
  enter.wall = () => {
    const W = wallBox.clientWidth, H = wallBox.clientHeight;
    wallEls.forEach((el, i) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      el.style.left = rand(0, Math.max(0, W - w)) + 'px';
      el.style.top = rand(0, Math.max(0, H - h)) + 'px';
      el.style.zIndex = i + 1;
      el.style.opacity = 0;
      el.animate([{ opacity: 0, transform: `rotate(${rand(-30, 30)}deg) scale(1.4)` }, { opacity: 1 }],
        { duration: 700, delay: 900 + i * 180, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' })
        .finished.then(a => { el.style.opacity = 1; a.cancel?.(); }).catch(() => {});
    });
    zTop = wallEls.length + 1;
  };
  function makeDraggable(el) {
    let sx, sy, ox, oy, moved = false, down = false;
    el.addEventListener('pointerdown', e => {
      down = true; moved = false;
      el.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY; ox = el.offsetLeft; oy = el.offsetTop;
      el.style.zIndex = ++zTop;
      el.classList.add('drag');
    });
    el.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      el.style.left = ox + dx + 'px';
      el.style.top = oy + dy + 'px';
    });
    const up = () => {
      if (!down) return;
      down = false;
      el.classList.remove('drag');
      if (!moved) openLightbox(el._photo);
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', () => { down = false; el.classList.remove('drag'); });
  }
  const lb = $('#lightbox');
  function openLightbox(photo) {
    if (!photo || !photo.src) return;
    $('img', lb).src = photo.src;
    $('figcaption', lb).textContent = photo.caption || '';
    lb.classList.add('open');
  }
  lb.addEventListener('click', () => lb.classList.remove('open'));
  $('#wallNext').addEventListener('click', next);

  // 6 · Pasta
  const candles = $$('.candle');
  const cakeMsg = $('#cakeMsg');
  let celebrated = false;
  enter.cake = () => { if (!muted) musicBox(HB); };
  function extinguish(c) {
    if (c.classList.contains('out')) return;
    c.classList.add('out');
    if (candles.every(x => x.classList.contains('out'))) celebrate();
  }
  candles.forEach(c => c.addEventListener('click', e => { e.stopPropagation(); extinguish(c); }));
  async function celebrate() {
    if (celebrated) return;
    celebrated = true;
    await sleep(500);
    const r = $('#cakeBox').getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 3, 160);
    if (!muted) musicBox([[72, .5], [76, .5], [79, .5], [84, 2]], 0.3);
    cakeMsg.textContent = 'Dileğin gerçek olsun ✨';
    $('#micBtn').classList.add('hidden');
    $('#tapHint').classList.add('hidden');
    await sleep(1800);
    $('#cakeNext').classList.remove('hidden');
  }
  $('#micBtn').addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      initAudio();
      await actx.resume();
      const src = actx.createMediaStreamSource(stream);
      const an = actx.createAnalyser();
      an.fftSize = 1024;
      src.connect(an);
      const data = new Uint8Array(an.fftSize);
      let hits = 0;
      cakeMsg.textContent = 'Şimdi üfle! 🌬️';
      (function poll() {
        if (celebrated) { stream.getTracks().forEach(t => t.stop()); return; }
        an.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) { const x = (v - 128) / 128; sum += x * x; }
        const rms = Math.sqrt(sum / data.length);
        if (rms > 0.12) { if (++hits > 5) { candles.forEach((c, i) => setTimeout(() => extinguish(c), i * 180)); } }
        else hits = Math.max(0, hits - 1);
        requestAnimationFrame(poll);
      })();
    } catch {
      cakeMsg.textContent = 'Mikrofon açılmadı, alevlere dokunarak söndür 🙂';
    }
  });
  $('#cakeNext').addEventListener('click', next);

  // 7 · Mektup
  enter.letter = () => Music.play(90);
  const envelope = $('#envelope');
  const letterView = $('#letterView');
  const letterPaper = $('#letterPaper');
  $('#seal').addEventListener('click', async () => {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    $('#sealHint').style.visibility = 'hidden';
    await sleep(2000);
    letterView.classList.add('show');
    await sleep(900);
    await typeText($('#letterText'), C.letter || '', 30, () => { letterPaper.scrollTop = letterPaper.scrollHeight; });
    const sig = $('#signature');
    sig.textContent = '— ' + C.from;
    sig.classList.add('show');
    letterPaper.scrollTop = letterPaper.scrollHeight;
    rainRate = 0.14;
    await sleep(1200);
    $('#letterNext').classList.remove('hidden');
  });
  letterPaper.addEventListener('click', () => typing && typing.finish());
  $('#letterNext').addEventListener('click', () => location.reload());

  // 9 · Final
  enter.finale = async () => {
    rainRate = 0.16;
    await sleep(1400);
    burst(innerWidth / 2, innerHeight * 0.35, 180);
    if (!muted) musicBox([[72, .5], [76, .5], [79, .5], [84, 1], [79, .5], [84, 3]], 0.32);
  };
  $('#toGame').addEventListener('click', () => pixelWipe(next));

  // Finalde başrolün fotoğrafları sırayla değişir
  const stars = C.starPhotos || [];
  if (stars.length) {
    const fig = polaroid(stars[0], -2);
    $('img', fig).loading = 'eager';
    stars.forEach(p => { new Image().src = p.src; });
    $('#starSlot').appendChild(fig);
    let k = 0;
    setInterval(() => {
      if (!$('#finale').classList.contains('active')) return;
      k = (k + 1) % stars.length;
      const img = $('img', fig);
      img.style.opacity = 0;
      setTimeout(() => { img.src = stars[k].src; $('figcaption', fig).textContent = stars[k].caption || ''; img.style.opacity = 1; }, 600);
    }, 2800);
  } else $('#starSlot').remove();

  // Piksel geçiş: ekran bloklarla kararır, sahne değişir, bloklar dağılır
  const wipe = $('#wipe'), wx = wipe.getContext('2d');
  function pixelWipe(mid) {
    const B = 28;
    wipe.width = innerWidth; wipe.height = innerHeight;
    const cols = Math.ceil(innerWidth / B), rowsN = Math.ceil(innerHeight / B);
    const cells = [];
    for (let y = 0; y < rowsN; y++) for (let x = 0; x < cols; x++) cells.push([x, y]);
    cells.sort(() => Math.random() - .5);
    const per = Math.ceil(cells.length / 24);
    let i = 0;
    wx.fillStyle = '#0b0710';
    (function cover() {
      for (let k = 0; k < per && i < cells.length; k++, i++) {
        const [x, y] = cells[i];
        wx.fillStyle = Math.random() < .08 ? '#9e1b22' : '#0b0710';
        wx.fillRect(x * B, y * B, B, B);
      }
      if (i < cells.length) return requestAnimationFrame(cover);
      wx.fillStyle = '#0b0710'; wx.fillRect(0, 0, wipe.width, wipe.height);
      mid();
      setTimeout(() => {
        cells.sort(() => Math.random() - .5);
        i = 0;
        (function uncover() {
          for (let k = 0; k < per && i < cells.length; k++, i++) wx.clearRect(cells[i][0] * B, cells[i][1] * B, B, B);
          if (i < cells.length) requestAnimationFrame(uncover);
        })();
      }, 900);
    })();
  }

  // ── Parçacıklar: gül yaprakları, kalpler, ışıltı ─
  const cv = $('#fx'), cx = cv.getContext('2d');
  let W, H, DPR;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  addEventListener('resize', resize);
  const colors = ['#9e1b22', '#c4414a', '#e8a0a6', '#f4ead7', '#b8262e', '#f2c6c6'];
  const P = [];
  let rainRate = 0;
  function add(o) {
    P.push(Object.assign({
      x: 0, y: 0, vx: 0, vy: 0, rot: rand(0, 6.28), vr: rand(-.08, .08),
      size: rand(5, 11), type: pick(['petal', 'petal', 'petal', 'heart', 'spark']),
      color: pick(colors), sway: rand(0, 6.28), life: 1
    }, o));
  }
  function burst(x, y, n = 100) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), s = rand(2, 9);
      add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4 });
    }
  }
  function drawHeart(s) {
    cx.beginPath();
    cx.moveTo(0, s * .3);
    cx.bezierCurveTo(-s, -s * .4, -s * .45, -s * 1.1, 0, -s * .45);
    cx.bezierCurveTo(s * .45, -s * 1.1, s, -s * .4, 0, s * .3);
    cx.fill();
  }
  function frame() {
    if (rainRate && Math.random() < rainRate) add({ x: rand(0, W), y: -20, vy: rand(.6, 1.6), vx: rand(-.4, .4) });
    cx.clearRect(0, 0, W, H);
    for (let i = P.length - 1; i >= 0; i--) {
      const p = P[i];
      p.vx *= 0.975;
      p.vy = Math.min(p.vy + 0.09, 1.2 + p.size * 0.08);
      p.sway += 0.035;
      p.x += p.vx + Math.sin(p.sway) * 0.7;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > H + 30) { P.splice(i, 1); continue; }
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      if (p.type === 'spark') {
        cx.fillStyle = `rgba(212, 176, 106, ${0.5 + 0.5 * Math.abs(Math.sin(p.sway * 3))})`;
        cx.beginPath(); cx.arc(0, 0, p.size * 0.28, 0, 6.28); cx.fill();
      } else if (p.type === 'heart') {
        cx.fillStyle = p.color; drawHeart(p.size);
      } else {
        cx.fillStyle = p.color;
        cx.scale(1, Math.abs(Math.sin(p.sway * 1.3)) * 0.6 + 0.4);
        cx.beginPath(); cx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, 6.28); cx.fill();
      }
      cx.restore();
    }
    requestAnimationFrame(frame);
  }
  frame();

  // Test için: ?sahne=cake gibi doğrudan bir sahneye atla
  const jump = new URLSearchParams(location.search).get('sahne');
  if (jump && order.includes(jump)) show(order.indexOf(jump));

  // ── Film greni ───────────────────────────────
  const g = $('#grain'), gx = g.getContext('2d');
  const img = gx.createImageData(g.width, g.height);
  setInterval(() => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 255;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    gx.putImageData(img, 0, 0);
  }, 70);
})();
