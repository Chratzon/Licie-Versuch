"use strict";
/* Mondruhe – Einschlaf-PWA */

const $ = (s) => document.querySelector(s);
const store = {
  get(k, d) { try { const v = localStorage.getItem("mondruhe:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("mondruhe:" + k, JSON.stringify(v)); } catch (e) {} }
};

const DEFAULTS = { name: "Lucie", voiceURI: "", rate: 0.85, pitch: 0.95, pauseFactor: 1, voiceVol: 1, ambVol: 0.5,
  showText: true, breathCues: true, chime: true, wake: true };
const settings = Object.assign({}, DEFAULTS, store.get("settings", {}));
const saveSettings = () => store.set("settings", settings);
const favs = new Set(store.get("favs", []));
const itemPrefs = store.get("itemPrefs", {}); // { id: { sound, cycles } }
const lastPlayed = store.get("last", {});

/* ================= Klänge (Web Audio, synthetisch erzeugt) ================= */
const Ambient = (() => {
  let ctx = null, master = null, cur = null;
  const bufs = {};

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = settings.ambVol;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function noise(type) {
    if (bufs[type]) return bufs[type];
    const len = ctx.sampleRate * 8, b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (type === "white") d[i] = w * 0.5;
        else if (type === "pink") {
          b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
          b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
        } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      }
      // weicher Übergang am Loop-Punkt
      const f = 2000;
      for (let i = 0; i < f; i++) { const a = i / f; d[i] = d[i] * a + d[len - f + i] * (1 - a); }
    }
    return (bufs[type] = b);
  }
  function src(type, rate = 1) { const s = ctx.createBufferSource(); s.buffer = noise(type); s.loop = true; s.playbackRate.value = rate; s.loopStart = 2000 / ctx.sampleRate; s.start(0, Math.random() * 6); return s; }
  function filt(type, f, q = 0.7) { const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; n.Q.value = q; return n; }
  function gain(v) { const g = ctx.createGain(); g.gain.value = v; return g; }
  function lfo(freq, depth, param) { const o = ctx.createOscillator(); o.frequency.value = freq; const g = gain(depth); o.connect(g); g.connect(param); o.start(); return o; }
  function chain(...n) { for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]); return n[n.length - 1]; }

  const builders = {
    regen(out, nodes, timers) {
      const a = src("pink"); nodes.push(a); chain(a, filt("highpass", 300), filt("lowpass", 5500), gain(0.9), out);
      const b = src("white", 0.9); nodes.push(b); chain(b, filt("bandpass", 3200, 0.5), gain(0.12), out);
      // einzelne Tropfen
      const drop = () => {
        const t = ctx.currentTime, s = ctx.createBufferSource(); s.buffer = noise("white");
        const g = gain(0), f = filt("bandpass", 1800 + Math.random() * 3000, 4);
        chain(s, f, g, out); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.12, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06); s.start(t, Math.random() * 6, 0.08);
        timers.push(setTimeout(drop, 40 + Math.random() * 220));
      };
      drop();
    },
    meer(out, nodes) {
      const a = src("brown"); nodes.push(a);
      const lp = filt("lowpass", 700), g = gain(0.55);
      chain(a, lp, g, out);
      nodes.push(lfo(0.085, 450, lp.frequency), lfo(0.085, 0.42, g.gain));
      const b = src("pink"); nodes.push(b);
      const hp = filt("bandpass", 2400, 0.4), g2 = gain(0.07);
      chain(b, hp, g2, out); nodes.push(lfo(0.085, 0.065, g2.gain));
    },
    wind(out, nodes) {
      const a = src("pink"); nodes.push(a);
      const bp = filt("bandpass", 550, 1.4), g = gain(0.9);
      chain(a, bp, g, out);
      nodes.push(lfo(0.045, 280, bp.frequency), lfo(0.13, 120, bp.frequency), lfo(0.06, 0.45, g.gain));
      const b = src("brown"); nodes.push(b); chain(b, filt("lowpass", 250), gain(0.35), out);
    },
    feuer(out, nodes, timers) {
      const a = src("brown"); nodes.push(a); chain(a, filt("lowpass", 380), gain(0.75), out);
      nodes.push(lfo(0.3, 0.1, out.gain));
      const crackle = () => {
        const n = Math.random() < 0.25 ? 3 : 1;
        for (let i = 0; i < n; i++) {
          const t = ctx.currentTime + i * 0.02 * Math.random(), s = ctx.createBufferSource(); s.buffer = noise("white");
          const g = gain(0), f = filt("highpass", 1200 + Math.random() * 2500);
          chain(s, f, g, out); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25 + Math.random() * 0.45, t + 0.002);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 0.01 + Math.random() * 0.04); s.start(t, Math.random() * 6, 0.06);
        }
        timers.push(setTimeout(crackle, 60 + Math.random() * (Math.random() < 0.3 ? 1200 : 350)));
      };
      crackle();
    },
    bach(out, nodes) {
      const a = src("white"); nodes.push(a);
      const bp = filt("bandpass", 1500, 0.9), g = gain(0.45);
      chain(a, bp, g, out); nodes.push(lfo(3.1, 500, bp.frequency), lfo(0.7, 300, bp.frequency));
      const b = src("pink"); nodes.push(b);
      const bp2 = filt("bandpass", 700, 1.2); chain(b, bp2, gain(0.4), out); nodes.push(lfo(5.3, 180, bp2.frequency));
      const c = src("brown"); nodes.push(c); chain(c, filt("lowpass", 300), gain(0.3), out);
    },
    nacht(out, nodes, timers) {
      const a = src("pink"); nodes.push(a);
      const bp = filt("lowpass", 600), g = gain(0.25); chain(a, bp, g, out); nodes.push(lfo(0.05, 0.12, g.gain));
      const cricket = (freq, pan) => {
        const t = ctx.currentTime, o = ctx.createOscillator(); o.frequency.value = freq;
        const am = ctx.createOscillator(); am.type = "square"; am.frequency.value = 38 + Math.random() * 8;
        const amDepth = gain(0.5), amStage = gain(0.5); am.connect(amDepth); amDepth.connect(amStage.gain);
        const env = gain(0);
        let node = env;
        if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; env.connect(p); node = p; }
        const vol = gain(0.018); o.connect(amStage); amStage.connect(env); node.connect(vol); vol.connect(out);
        const chirps = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < chirps; i++) {
          const s = t + i * 0.22; env.gain.setValueAtTime(0, s);
          env.gain.linearRampToValueAtTime(1, s + 0.03); env.gain.linearRampToValueAtTime(0, s + 0.14);
        }
        o.start(t); am.start(t); o.stop(t + chirps * 0.22 + 0.2); am.stop(t + chirps * 0.22 + 0.2);
      };
      const loop1 = () => { cricket(4300, -0.5); timers.push(setTimeout(loop1, 900 + Math.random() * 900)); };
      const loop2 = () => { cricket(4700, 0.6); timers.push(setTimeout(loop2, 1300 + Math.random() * 1500)); };
      timers.push(setTimeout(loop1, 300), setTimeout(loop2, 900));
    },
    braun(out, nodes) {
      const a = src("brown"); nodes.push(a); chain(a, filt("lowpass", 800), gain(0.9), out);
    }
  };

  function stopCur(fade = 1.5) {
    if (!cur) return;
    const c = cur; cur = null;
    c.timers.forEach(clearTimeout);
    const t = ctx.currentTime;
    c.out.gain.cancelScheduledValues(t); c.out.gain.setValueAtTime(c.out.gain.value, t);
    c.out.gain.linearRampToValueAtTime(0, t + fade);
    setTimeout(() => { c.nodes.forEach((n) => { try { n.stop(); } catch (e) {} }); try { c.out.disconnect(); } catch (e) {} }, fade * 1000 + 100);
  }

  return {
    ensure,
    get id() { return cur ? cur.id : "none"; },
    play(id) {
      if (!ensure()) return;
      if (cur && cur.id === id) return;
      stopCur();
      if (!id || id === "none" || !builders[id]) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(settings.ambVol, ctx.currentTime);
      const out = gain(0); out.connect(master);
      const c = { id, out, nodes: [], timers: [] };
      builders[id](out, c.nodes, c.timers);
      out.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
      cur = c;
    },
    stop: stopCur,
    fadeOut(secs) {
      if (!ctx || !cur) return;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + secs);
      setTimeout(() => { stopCur(0.1); master.gain.setValueAtTime(settings.ambVol, ctx.currentTime + 0.2); }, secs * 1000);
    },
    setVolume(v) { if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.1); },
    chime(kind) {
      if (!ensure()) return;
      const freqs = { in: 528, in2: 594, hold: 440, out: 396 };
      const f = freqs[kind] || 440, t = ctx.currentTime;
      [1, 2.01].forEach((m, i) => {
        const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f * m;
        const g = gain(0); o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(i ? 0.015 : 0.06, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4); o.start(t); o.stop(t + 2.5);
      });
    }
  };
})();

/* ================= Sprecher (Web Speech API) ================= */
const Narrator = (() => {
  const ok = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let voices = [], queue = [], idx = 0, playing = false, token = 0, timer = null, cb = {};

  function loadVoices() {
    if (!ok) return;
    const all = speechSynthesis.getVoices();
    voices = all.filter((v) => /^de([-_]|$)/i.test(v.lang));
    document.dispatchEvent(new Event("voiceschanged"));
  }
  if (ok) { loadVoices(); speechSynthesis.addEventListener ? speechSynthesis.addEventListener("voiceschanged", loadVoices) : (speechSynthesis.onvoiceschanged = loadVoices); }

  function voice() {
    if (!voices.length) return null;
    const chosen = voices.find((v) => v.voiceURI === settings.voiceURI);
    if (chosen) return chosen;
    const prefer = [/google.*deutsch/i, /anna/i, /petra/i, /helena/i, /katja/i, /hedda/i, /marlene/i, /vicki/i, /female/i];
    for (const re of prefer) { const v = voices.find((x) => re.test(x.name)); if (v) return v; }
    return voices.find((v) => v.localService) || voices[0];
  }

  function build(script) {
    const items = [];
    script.forEach((p) => {
      if (typeof p === "number") { items.push({ pause: p }); return; }
      const parts = p.match(/[^.!?…]+(?:[.!?…]+[“”"«»]?|$)/g) || [p];
      const sents = parts.map((s) => s.trim()).filter(Boolean);
      sents.forEach((s, i) => { items.push({ say: s }); items.push({ pause: i < sents.length - 1 ? 0.9 : 1.8 }); });
    });
    return items;
  }

  function estimate(script) {
    let s = 0;
    build(script).forEach((it) => { s += it.pause != null ? it.pause * settings.pauseFactor : it.say.length * 0.072 / settings.rate; });
    return s;
  }

  function utter(text, opts = {}) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "de-DE"; const v = voice(); if (v) u.voice = v;
    u.rate = opts.rate || settings.rate; u.pitch = settings.pitch; u.volume = settings.voiceVol;
    return u;
  }

  function step() {
    if (!playing) return;
    if (idx >= queue.length) { playing = false; cb.onDone && cb.onDone(); return; }
    const it = queue[idx], my = ++token;
    cb.onProgress && cb.onProgress(idx / queue.length);
    if (it.pause != null) {
      timer = setTimeout(() => { if (my === token) { idx++; step(); } }, it.pause * 1000 * settings.pauseFactor);
      return;
    }
    cb.onLine && cb.onLine(it.say);
    if (!ok || settings.voiceVol === 0) {
      timer = setTimeout(() => { if (my === token) { idx++; step(); } }, Math.max(2500, it.say.length * 75 / settings.rate));
      return;
    }
    let done = false;
    const next = () => { if (done || my !== token) return; done = true; clearTimeout(timer); idx++; step(); };
    const u = utter(it.say);
    u.onend = next;
    u.onerror = (e) => { if (e.error === "interrupted" || e.error === "canceled") return; next(); };
    speechSynthesis.speak(u);
    const est = (it.say.length * 0.11 / settings.rate + 4) * 1000;
    const watchdog = () => { if (my !== token || done) return; if (speechSynthesis.speaking) timer = setTimeout(watchdog, 1000); else next(); };
    timer = setTimeout(watchdog, est);
  }

  function halt() { token++; clearTimeout(timer); if (ok) speechSynthesis.cancel(); }

  return {
    ok, get voices() { return voices; }, voice, estimate,
    start(script, callbacks) { halt(); cb = callbacks || {}; queue = build(script); idx = 0; playing = true; step(); },
    pause() { playing = false; halt(); },
    resume() { if (!queue.length) return; playing = true; step(); },
    stop() { playing = false; halt(); queue = []; idx = 0; },
    say(text, rate) { if (!ok || settings.voiceVol === 0) return; speechSynthesis.cancel(); speechSynthesis.speak(utter(text, { rate })); }
  };
})();

/* ================= Atem-Taktgeber ================= */
const Breath = (() => {
  let item, cycles, cycle = 0, phase = 0, timers = [], running = false, cb = {};
  const orb = () => $("#orb");
  const clear = () => { timers.forEach(clearTimeout); timers.forEach(clearInterval); timers = []; };
  const scaleFor = { in: 1, in2: 1.1, out: 0.5 };

  function runPhase() {
    if (!running) return;
    if (phase >= item.phases.length) { phase = 0; cycle++; }
    if (cycle >= cycles) { running = false; cb.onDone && cb.onDone(); return; }
    const [label, secs, kind] = item.phases[phase];
    const o = orb();
    if (scaleFor[kind] != null) { o.style.transition = `transform ${secs}s ${kind === "out" ? "ease-in-out" : "ease-out"}`; o.style.transform = `scale(${scaleFor[kind]})`; }
    $("#phaseLabel").textContent = label;
    let left = secs; $("#phaseCount").textContent = left;
    if (settings.chime) Ambient.chime(kind);
    if (settings.breathCues) Narrator.say(label, 0.9);
    const tot = cycles * item.phases.reduce((a, p) => a + p[1], 0);
    const doneSoFar = cycle * item.phases.reduce((a, p) => a + p[1], 0) + item.phases.slice(0, phase).reduce((a, p) => a + p[1], 0);
    cb.onProgress && cb.onProgress(doneSoFar / tot, `Atemzug ${cycle + 1} von ${cycles}`);
    const iv = setInterval(() => { left--; if (left > 0) $("#phaseCount").textContent = left; }, 1000);
    timers.push(iv);
    timers.push(setTimeout(() => { clearInterval(iv); phase++; runPhase(); }, secs * 1000));
  }

  return {
    start(it, n, callbacks) { clear(); item = it; cycles = n; cycle = 0; phase = 0; cb = callbacks || {}; running = true; runPhase(); },
    pause() { running = false; clear(); },
    resume() { running = true; runPhase(); },
    stop() { running = false; clear(); const o = orb(); if (o) { o.style.transition = "transform 2s ease-in-out"; o.style.transform = ""; } $("#phaseLabel").textContent = ""; $("#phaseCount").textContent = ""; },
    get active() { return running; }
  };
})();

/* ================= Bildschirm wach halten ================= */
let wakeLock = null;
async function wakeOn() {
  if (!settings.wake || !("wakeLock" in navigator) || wakeLock) return;
  try { wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", () => { wakeLock = null; }); } catch (e) {}
}
function wakeOff() { if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; } }
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && player.state === "playing") wakeOn(); });

/* ================= Icons ================= */
const ICONS = {
  atmen: '<svg viewBox="0 0 24 24"><path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/></svg>',
  meditation: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2"/><path d="M12 8.5v5M6 11l6 2.5 6-2.5M4.5 19c2-2.4 4.6-3 7.5-3s5.5.6 7.5 3"/></svg>',
  geschichten: '<svg viewBox="0 0 24 24"><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6.5c2.5-2 5.5-2 8-1v13c-2.5-1-5.5-1-8 1-2.5-2-5.5-2-8-1v-13Z"/><path d="M12 6.5v13"/></svg>',
  klaenge: '<svg viewBox="0 0 24 24"><path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0"/></svg>'
};
const HEART = '<svg class="heart" viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z"/></svg>';

/* ================= Hilfsfunktionen ================= */
const catOf = (id) => CATEGORIES.find((c) => c.id === id);
const soundTitle = (id) => (SOUNDS.find((s) => s.id === id) || {}).title || "";
const prefOf = (it) => Object.assign({ sound: it.sound, cycles: it.cycles }, itemPrefs[it.id] || {});
function setPref(it, k, v) { itemPrefs[it.id] = Object.assign(itemPrefs[it.id] || {}, { [k]: v }); store.set("itemPrefs", itemPrefs); }
function durationOf(it) {
  if (it.type === "sound") return null;
  if (it.type === "breath") {
    const c = prefOf(it).cycles;
    return Narrator.estimate(it.intro) + c * it.phases.reduce((a, p) => a + p[1], 0) + Narrator.estimate(it.outro);
  }
  return Narrator.estimate(it.script);
}
const fmtMin = (s) => (s == null ? "endlos" : `ca. ${Math.max(1, Math.round(s / 60))} Min`);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ================= Startseite ================= */
let filter = store.get("filter", "alle");

function renderGreeting() {
  const h = new Date().getHours();
  const tod = h < 5 ? "Mitten in der Nacht" : h < 11 ? "Guten Morgen" : h < 17 ? "Hallo" : h < 21 ? "Guten Abend" : "Gute Nacht";
  $("#timeHint").textContent = tod + (settings.name ? ", " + settings.name : "");
  $("#greeting").textContent = h >= 17 || h < 5 ? "Zeit zum Ausruhen" : "Kleine Pause gefällig?";
}

function renderFilters() {
  const opts = [["alle", "Alle"], ["fav", "Favoriten"], ...CATEGORIES.map((c) => [c.id, c.title])];
  $("#filters").innerHTML = opts.map(([id, t]) => `<button class="chip ${filter === id ? "on" : ""}" data-f="${id}">${t}</button>`).join("");
}

function cardHTML(it) {
  const p = prefOf(it);
  const meta = [fmtMin(durationOf(it))];
  if (it.type !== "sound" && p.sound !== "none") meta.push("mit " + soundTitle(p.sound));
  return `<button class="card" data-id="${it.id}">
    <span class="ic ${it.cat}">${ICONS[it.cat]}</span>
    <span class="tx"><div class="tt">${esc(it.title)}</div><div class="ds">${esc(it.desc)}</div><div class="meta">${meta.join(" · ")}</div></span>
    ${favs.has(it.id) ? HEART : ""}
  </button>`;
}

function renderList() {
  let html = "";
  if (filter === "fav") {
    const list = ITEMS.filter((i) => favs.has(i.id));
    html = list.length ? list.map(cardHTML).join("") : '<p class="empty">Noch keine Favoriten.<br>Tippe im Player auf das Herz, um etwas hier zu speichern.</p>';
  } else {
    const cats = filter === "alle" ? CATEGORIES : CATEGORIES.filter((c) => c.id === filter);
    if (filter === "alle" && lastPlayed.id) {
      const last = ITEMS.find((i) => i.id === lastPlayed.id);
      if (last) html += `<h3 class="section-title">Zuletzt gehört</h3><p class="section-sub">Da weitermachen, wo du gestern eingeschlafen bist.</p>${cardHTML(last)}`;
    }
    cats.forEach((c) => {
      html += `<h3 class="section-title">${c.title}</h3><p class="section-sub">${c.sub}</p>`;
      html += ITEMS.filter((i) => i.cat === c.id).map(cardHTML).join("");
    });
  }
  $("#list").innerHTML = html;
}

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("[data-f]"); if (!b) return;
  filter = b.dataset.f; store.set("filter", filter); renderFilters(); renderList();
});
$("#list").addEventListener("click", (e) => {
  const b = e.target.closest("[data-id]"); if (!b) return;
  openPlayer(ITEMS.find((i) => i.id === b.dataset.id));
});

/* ================= Player ================= */
const player = { item: null, state: "idle", stage: 0, stages: [], timerEnd: 0, timerMin: 0, timerIv: null, afterIv: null };

function showView(id) {
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === id));
  window.scrollTo(0, 0);
}

function openPlayer(it) {
  resetPlayback(true);
  player.item = it;
  const p = prefOf(it);
  $("#pCat").textContent = catOf(it.cat).title;
  $("#pTitle").textContent = it.title;
  $("#favBtn").classList.toggle("on", favs.has(it.id));
  $("#cycleRow").classList.toggle("hidden", it.type !== "breath");
  $("#cycVal").textContent = p.cycles;
  $("#line").textContent = it.desc;
  $("#line").classList.remove("fade");
  $("#progressBar").style.width = "0";
  setStatus(it.type === "sound" ? "Läuft, bis du stoppst oder der Timer endet" : fmtMin(durationOf(it)));
  const orb = $("#orb"); orb.className = "orb " + (it.type === "sound" ? "sound" : "idle"); orb.style.transform = "";
  renderSoundChips(); renderTimerChips();
  $("#voiceVol").value = settings.voiceVol; $("#ambVol").value = settings.ambVol;
  $("#voiceVol").closest(".row").classList.toggle("hidden", it.type === "sound");
  showView("player");
  if (history.state?.v !== "player") history.pushState({ v: "player" }, "");
}

function closePlayer() {
  resetPlayback(true);
  Ambient.stop();
  wakeOff();
  renderList();
  showView("home");
}

function setStatus(t) { $("#status").textContent = t || ""; }
function setPlayBtn(on) { $("#playBtn").classList.toggle("playing", on); $("#playBtn").setAttribute("aria-label", on ? "Pausieren" : "Abspielen"); }

function setLine(t) {
  if (!settings.showText) { $("#line").textContent = ""; return; }
  const el = $("#line"); el.classList.add("fade");
  setTimeout(() => { el.textContent = t; el.classList.remove("fade"); }, 250);
}

function buildStages(it) {
  if (it.type === "breath") return [{ k: "say", s: it.intro }, { k: "breath" }, { k: "say", s: it.outro }];
  if (it.type === "voice") return [{ k: "say", s: it.script }];
  return [{ k: "ambient" }];
}

function runStage(i) {
  player.stage = i;
  const st = player.stages[i], it = player.item;
  if (!st) { finished(); return; }
  const orb = $("#orb");
  if (st.k === "say") {
    if (it.type === "breath") { orb.className = "orb"; orb.style.transition = "transform 3s ease-in-out"; orb.style.transform = "scale(.6)"; $("#phaseLabel").textContent = ""; $("#phaseCount").textContent = ""; }
    else orb.className = "orb idle";
    Narrator.start(st.s, {
      onLine: setLine,
      onProgress: (f) => {
        if (it.type !== "breath") $("#progressBar").style.width = (f * 100).toFixed(1) + "%";
      },
      onDone: () => runStage(i + 1)
    });
  } else if (st.k === "breath") {
    orb.className = "orb";
    setLine("");
    Breath.start(it, prefOf(it).cycles, {
      onProgress: (f, txt) => { $("#progressBar").style.width = (f * 100).toFixed(1) + "%"; setStatus(txt); },
      onDone: () => { Breath.stop(); $("#progressBar").style.width = "100%"; setStatus(""); runStage(i + 1); }
    });
  } else if (st.k === "ambient") {
    orb.className = "orb sound";
    setLine(settings.showText ? "Lausche einfach. Es gibt nichts zu tun." : "");
  }
}

function finished() {
  player.state = "done";
  setPlayBtn(false);
  $("#progressBar").style.width = "100%";
  $("#orb").className = "orb idle";
  if (Ambient.id !== "none") {
    if (!player.timerEnd) {
      setStatus("Der Klang läuft noch 10 Minuten nach");
      player.afterIv = setTimeout(() => { Ambient.fadeOut(30); wakeOff(); setStatus("Schlaf gut"); }, 10 * 60 * 1000);
    }
  } else { wakeOff(); setStatus("Schlaf gut"); }
}

function play() {
  const it = player.item; if (!it) return;
  Ambient.ensure();
  const p = prefOf(it);
  clearTimeout(player.afterIv);
  if (player.state === "paused") {
    player.state = "playing";
    Ambient.play(p.sound);
    const st = player.stages[player.stage];
    if (st.k === "say") Narrator.resume(); else if (st.k === "breath") Breath.resume();
  } else {
    player.state = "playing";
    player.stages = buildStages(it);
    Ambient.play(p.sound);
    runStage(0);
    lastPlayed.id = it.id; store.set("last", lastPlayed);
  }
  setPlayBtn(true); wakeOn();
  if (it.type !== "breath" && it.type !== "sound") setStatus(fmtMin(durationOf(it)));
}

function pause() {
  player.state = "paused";
  Narrator.pause(); Breath.pause();
  Ambient.stop(1);
  setPlayBtn(false); setStatus("Pausiert"); wakeOff();
}

function resetPlayback(keepAmbient) {
  Narrator.stop(); Breath.stop();
  clearTimeout(player.afterIv);
  clearSleepTimer();
  player.state = "idle"; player.stage = 0;
  setPlayBtn(false);
  if (!keepAmbient) Ambient.stop();
}

$("#playBtn").addEventListener("click", () => { player.state === "playing" ? pause() : play(); });
$("#stopBtn").addEventListener("click", () => {
  const it = player.item; resetPlayback(false); openPlayerSoft(it);
});
function openPlayerSoft(it) {
  $("#progressBar").style.width = "0"; $("#line").textContent = it.desc;
  setStatus(it.type === "sound" ? "" : fmtMin(durationOf(it)));
  $("#orb").className = "orb " + (it.type === "sound" ? "sound" : "idle");
  renderTimerChips(); wakeOff();
}
$("#backBtn").addEventListener("click", () => history.back());
window.addEventListener("popstate", () => { if ($("#player").classList.contains("active")) closePlayer(); });

$("#favBtn").addEventListener("click", () => {
  const id = player.item.id;
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set("favs", [...favs]);
  $("#favBtn").classList.toggle("on", favs.has(id));
});

$("#cycMinus").addEventListener("click", () => changeCycles(-1));
$("#cycPlus").addEventListener("click", () => changeCycles(1));
function changeCycles(d) {
  const it = player.item, c = Math.min(it.maxCycles, Math.max(it.minCycles, prefOf(it).cycles + d));
  setPref(it, "cycles", c); $("#cycVal").textContent = c;
  if (player.state === "idle") setStatus(fmtMin(durationOf(it)));
}

function renderSoundChips() {
  const it = player.item, cur = prefOf(it).sound;
  const list = it.type === "sound" ? SOUNDS.filter((s) => s.id !== "none") : SOUNDS;
  $("#soundChips").innerHTML = list.map((s) => `<button class="chip ${s.id === cur ? "on" : ""}" data-s="${s.id}">${s.title}</button>`).join("");
}
$("#soundChips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-s]"); if (!b) return;
  const it = player.item;
  setPref(it, "sound", b.dataset.s);
  if (it.type === "sound") { // Klang-Eintrag: Titel mitwechseln, Klang direkt hören
    const target = ITEMS.find((i) => i.type === "sound" && i.sound === b.dataset.s);
    if (target && target.id !== it.id) { setPref(target, "sound", target.sound); const wasPlaying = player.state === "playing"; player.item = target; $("#pTitle").textContent = target.title; $("#favBtn").classList.toggle("on", favs.has(target.id)); renderSoundChips(); if (wasPlaying) Ambient.play(target.sound); return; }
  }
  renderSoundChips();
  if (player.state === "playing" || player.state === "done") Ambient.play(b.dataset.s);
});

/* Einschlaf-Timer */
const TIMERS = [0, 15, 30, 45, 60, 90];
function renderTimerChips() {
  $("#timerChips").innerHTML = TIMERS.map((m) => `<button class="chip ${player.timerMin === m ? "on" : ""}" data-t="${m}">${m ? m + " Min" : "Aus"}</button>`).join("");
  $("#timerLeft").textContent = "";
}
function clearSleepTimer() { clearInterval(player.timerIv); player.timerEnd = 0; player.timerMin = 0; $("#timerLeft").textContent = ""; }
$("#timerChips").addEventListener("click", (e) => {
  const b = e.target.closest("[data-t]"); if (!b) return;
  const m = +b.dataset.t;
  clearSleepTimer(); player.timerMin = m;
  if (m) {
    player.timerEnd = Date.now() + m * 60000;
    const tick = () => {
      const left = player.timerEnd - Date.now();
      if (left <= 0) { sleepNow(); return; }
      const mm = Math.floor(left / 60000), ss = Math.floor((left % 60000) / 1000);
      $("#timerLeft").textContent = `noch ${mm}:${String(ss).padStart(2, "0")}`;
    };
    tick(); player.timerIv = setInterval(tick, 1000);
  }
  renderTimerChips(); if (m) $("#timerLeft").textContent = `noch ${m}:00`;
});
function sleepNow() {
  clearSleepTimer(); renderTimerChips();
  Narrator.stop(); Breath.stop();
  Ambient.fadeOut(30);
  player.state = "idle"; setPlayBtn(false); setStatus("Timer abgelaufen. Schlaf gut.");
  setTimeout(wakeOff, 30000);
}

$("#voiceVol").addEventListener("input", (e) => { settings.voiceVol = +e.target.value; saveSettings(); });
$("#ambVol").addEventListener("input", (e) => { settings.ambVol = +e.target.value; Ambient.setVolume(settings.ambVol); saveSettings(); });

/* Nachtmodus */
$("#nightBtn").addEventListener("click", () => { $("#night").classList.remove("hidden"); });
$("#night").addEventListener("click", () => { $("#night").classList.add("hidden"); });

/* ================= Einstellungen ================= */
const dlg = $("#settings");
$("#openSettings").addEventListener("click", () => { fillSettings(); dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", ""); });
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener("close", () => { renderGreeting(); renderList(); });

function fillVoices() {
  const sel = $("#sVoice"), vs = Narrator.voices;
  if (!Narrator.ok) {
    sel.innerHTML = "<option>Nicht verfügbar</option>"; sel.disabled = true;
    $("#voiceHint").textContent = "Dieser Browser unterstützt keine Sprachausgabe. Die Texte werden stattdessen langsam eingeblendet.";
    return;
  }
  const cur = Narrator.voice();
  sel.innerHTML = vs.length
    ? vs.map((v) => `<option value="${esc(v.voiceURI)}" ${cur && cur.voiceURI === v.voiceURI ? "selected" : ""}>${esc(v.name)}${v.localService ? "" : " (online)"}</option>`).join("")
    : '<option value="">Systemstimme</option>';
  $("#voiceHint").textContent = vs.length
    ? "Stimmen mit „(online)“ brauchen Internet. Für Offline-Nutzung eine Stimme ohne diesen Zusatz wählen."
    : "Keine deutsche Stimme gefunden. Auf Android: Einstellungen › Bedienungshilfen › Sprachausgabe › Google-Sprachausgabe › Deutsch installieren.";
}
document.addEventListener("voiceschanged", () => { if (dlg.open) fillVoices(); });

function fillSettings() {
  $("#sName").value = settings.name;
  fillVoices();
  $("#sRate").value = settings.rate; $("#sPitch").value = settings.pitch; $("#sPause").value = settings.pauseFactor;
  $("#sText").checked = settings.showText; $("#sCues").checked = settings.breathCues; $("#sChime").checked = settings.chime; $("#sWake").checked = settings.wake;
  outs();
}
function outs() {
  $("#oRate").textContent = Math.round(settings.rate * 100) + " %";
  $("#oPitch").textContent = Math.round(settings.pitch * 100) + " %";
  $("#oPause").textContent = settings.pauseFactor.toFixed(1).replace(".", ",") + "×";
}
$("#sName").addEventListener("input", (e) => { settings.name = e.target.value.trim(); saveSettings(); });
$("#sVoice").addEventListener("change", (e) => { settings.voiceURI = e.target.value; saveSettings(); });
$("#sRate").addEventListener("input", (e) => { settings.rate = +e.target.value; saveSettings(); outs(); });
$("#sPitch").addEventListener("input", (e) => { settings.pitch = +e.target.value; saveSettings(); outs(); });
$("#sPause").addEventListener("input", (e) => { settings.pauseFactor = +e.target.value; saveSettings(); outs(); });
$("#sText").addEventListener("change", (e) => { settings.showText = e.target.checked; saveSettings(); });
$("#sCues").addEventListener("change", (e) => { settings.breathCues = e.target.checked; saveSettings(); });
$("#sChime").addEventListener("change", (e) => { settings.chime = e.target.checked; saveSettings(); });
$("#sWake").addEventListener("change", (e) => { settings.wake = e.target.checked; saveSettings(); if (!settings.wake) wakeOff(); });
$("#testVoice").addEventListener("click", () => {
  if (!Narrator.ok) return;
  Narrator.say(`Hallo${settings.name ? " " + settings.name : ""}. So klinge ich. Atme ruhig ein, und langsam wieder aus.`);
});

/* ================= Installation ================= */
let installEvt = null;
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); installEvt = e;
  if (!store.get("installDismissed", false)) $("#installBanner").classList.remove("hidden");
  $("#installBtn").classList.remove("hidden");
});
async function doInstall() {
  if (!installEvt) return;
  installEvt.prompt();
  const r = await installEvt.userChoice.catch(() => ({}));
  installEvt = null;
  $("#installBanner").classList.add("hidden"); $("#installBtn").classList.add("hidden");
  if (r.outcome !== "accepted") store.set("installDismissed", true);
}
$("#installBanner").addEventListener("click", doInstall);
$("#installBtn").addEventListener("click", doInstall);
window.addEventListener("appinstalled", () => { $("#installBanner").classList.add("hidden"); $("#installBtn").classList.add("hidden"); });
(function installHint() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isStandalone()) $("#installHint").textContent = "Mondruhe ist installiert.";
  else if (ios) $("#installHint").textContent = "Auf dem iPhone: In Safari auf „Teilen“ tippen und „Zum Home-Bildschirm“ wählen.";
  else $("#installHint").textContent = "Falls kein Installieren-Knopf erscheint: Browsermenü › „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.";
})();

/* ================= Start ================= */
renderGreeting(); renderFilters(); renderList();
history.replaceState({ v: "home" }, "");
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
