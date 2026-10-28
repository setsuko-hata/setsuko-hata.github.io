/* hy-calendar.js — soft, earthy schedule calendar for the Hatha Yoga pages.
 * Reads a public Google Calendar .ics snapshot (see .github/workflows/deploy.yml)
 * and renders a month grid + list view in Japanese. All times are shown in JST,
 * whatever the visitor's timezone. Mount: <div class="hy-cal" data-ics="..." data-tone="sage|clay|honey">.
 */
(function () {
  var H = 36e5, D = 864e5, JST = 9 * H;
  var WD = ['日', '月', '火', '水', '木', '金', '土'];
  var WD_KEYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  /* ---- time helpers: every instant is held as "JST wall-clock read as UTC" ---- */
  function wall(y, m, d, h, mi, s) { return Date.UTC(y, m, d, h || 0, mi || 0, s || 0); }
  function dayOf(ms) { return Math.floor(ms / D); }
  function startOfDay(ms) { return dayOf(ms) * D; }
  function nowJ() { return Date.now() + JST; }
  function parts(ms) { var d = new Date(ms); return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), w: d.getUTCDay(), h: d.getUTCHours(), mi: d.getUTCMinutes() }; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function hm(ms) { var p = parts(ms); return p.h + ':' + pad(p.mi); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* Google event colorId -> soft earthy palette (deep = accent, tint = fill, ink = text). */
  var GCOLORS = {
    1: ['#7B6B8F', '#ECE7F0', '#4F4560'], 2: ['#5E6A47', '#E9ECDA', '#46503A'], 3: ['#7A5A78', '#EFE4EE', '#5A3F58'],
    4: ['#B8706F', '#F8E4E1', '#8A4A49'], 5: ['#8A6A2C', '#F4E8CF', '#6B5020'], 6: ['#B5703A', '#F8E5D0', '#85501F'],
    7: ['#4F7F86', '#DFEDEE', '#355B61'], 8: ['#7A7468', '#ECE8E0', '#504B42'], 9: ['#5F7396', '#E3E9F2', '#41526F'],
    10: ['#4F7A4F', '#E1EDDD', '#355635'], 11: ['#A3593A', '#F6E3D5', '#7C4228']
  };
  var TONES = { sage: ['#5E6A47', '#E9ECDA', '#46503A'], clay: ['#A3593A', '#F6E3D5', '#7C4228'], honey: ['#8A6A2C', '#F4E8CF', '#6B5020'] };
  function paletteOf(e) { return GCOLORS[e.color] || (e.tone && TONES[e.tone]); }
  function colorStyle(e) {
    var c = paletteOf(e);
    return c ? ' style="--c-deep:' + c[0] + ';--c-tint:' + c[1] + ';--c-ink:' + c[2] + '"' : '';
  }

  /* ---- ICS parsing ---- */
  function parseDate(v) {
    var m = v.match(/^(\d{4})(\d\d)(\d\d)(?:T(\d\d)(\d\d)(\d\d)(Z)?)?$/);
    if (!m) return null;
    if (m[4] === undefined) return { t: wall(+m[1], m[2] - 1, +m[3]), allDay: true };
    var t = wall(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
    return { t: m[7] ? t + JST : t, allDay: false };
  }
  function unescapeText(s) {
    return s.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');
  }
  function cleanDescription(raw) {
    var s = unescapeText(raw || '')
      .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    // Drop Google Meet dial-in boilerplate that Google appends to descriptions.
    s = s.replace(/Google Meet[\s\S]*$/i, '').replace(/-::~[\s\S]*$/, '');
    // Never show Zoom invites (meeting links, ID, passcode) on the public page.
    s = s.replace(/[^\n]*(scheduled Zoom meeting|Join Zoom Meeting|zoom\.us)[\s\S]*$/i, '');
    return s.replace(/\n{3,}/g, '\n\n').trim();
  }
  function parseICS(text) {
    var lines = text.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
    var out = [], cur = null;
    lines.forEach(function (ln) {
      if (ln === 'BEGIN:VEVENT') { cur = { ex: [] }; return; }
      if (ln === 'END:VEVENT') { if (cur && cur.s && cur.status !== 'CANCELLED') out.push(cur); cur = null; return; }
      if (!cur) return;
      var i = ln.indexOf(':'); if (i < 0) return;
      var head = ln.slice(0, i).split(';'), name = head[0], v = ln.slice(i + 1);
      if (name === 'SUMMARY') cur.title = unescapeText(v).replace(/[\s\u3000]*秦[\s\u3000]*節子[\s\u3000]*/g, ' ').trim();
      else if (name === 'LOCATION') cur.loc = unescapeText(v);
      else if (name === 'DESCRIPTION') cur.desc = cleanDescription(v);
      else if (name === 'UID') cur.uid = v;
      else if (name === 'X-HY-COLOR') cur.color = +v;
      else if (name === 'STATUS') cur.status = v;
      else if (name === 'DTSTART') cur.s = parseDate(v);
      else if (name === 'DTEND') cur.e = parseDate(v);
      else if (name === 'RRULE') cur.rrule = v;
      else if (name === 'RECURRENCE-ID') { var r = parseDate(v); if (r) cur.recId = r.t; }
      else if (name === 'EXDATE') v.split(',').forEach(function (x) { var d = parseDate(x); if (d) cur.ex.push(d.t); });
    });
    return out;
  }

  /* ---- live feed (Google Apps Script) -> same shape as parsed ICS events, already expanded ---- */
  function parseFeedDate(v) {
    var m = String(v).match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)/);
    return m ? wall(+m[1], m[2] - 1, +m[3], +m[4], +m[5], +m[6]) : NaN;
  }
  function fromFeed(list) {
    return (list || []).map(function (f) {
      var s = parseFeedDate(f.start), e = parseFeedDate(f.end);
      if (isNaN(s)) return null;
      return {
        pre: true, ex: [], uid: f.id,
        title: String(f.title || '').replace(/[\s\u3000]*秦[\s\u3000]*節子[\s\u3000]*/g, ' ').trim(),
        loc: f.loc || '', desc: cleanDescription(f.desc), color: +f.color || undefined,
        s: { t: s, allDay: !!f.allDay }, e: { t: isNaN(e) ? s + H : e }
      };
    }).filter(Boolean);
  }

  /* ---- recurrence expansion into [from, to) ---- */
  function parseRule(str) {
    var r = {};
    str.split(';').forEach(function (kv) { var p = kv.split('='); r[p[0]] = p[1]; });
    return r;
  }
  function expand(vevents, from, to) {
    var overridden = {};
    vevents.forEach(function (e) { if (e.recId != null) overridden[e.uid + '|' + e.recId] = true; });
    var res = [];
    vevents.forEach(function (e) {
      var dur = e.e ? e.e.t - e.s.t : (e.s.allDay ? D : H);
      function push(start) {
        var end = start + dur;
        if (end <= from || start >= to) return;
        res.push({ src: e.src, tone: e.tone, color: e.color, title: e.title || '(無題)', loc: e.loc, desc: e.desc, start: start, end: end, allDay: e.s.allDay });
      }
      if (!e.rrule || e.recId != null || e.pre) { push(e.s.t); return; }
      var r = parseRule(e.rrule), interval = +(r.INTERVAL || 1), count = r.COUNT ? +r.COUNT : Infinity;
      var until = r.UNTIL ? parseDate(r.UNTIL).t : Infinity;
      if (r.UNTIL && /Z$/.test(r.UNTIL)) until = parseDate(r.UNTIL).t;
      var days = r.BYDAY ? r.BYDAY.split(',').map(function (x) { return WD_KEYS.indexOf(x.slice(-2)); }) : [parts(e.s.t).w];
      var sp = parts(e.s.t), tod = e.s.t - startOfDay(e.s.t), d0 = dayOf(e.s.t), n = 0;
      var weekAnchor = d0 - sp.w; // Sunday of the first week
      for (var d = d0; ; d++) {
        var t = d * D + tod;
        if (t > until || n >= count || t >= to) break;
        var p = parts(d * D), ok = false;
        if (r.FREQ === 'DAILY') ok = (d - d0) % interval === 0;
        else if (r.FREQ === 'WEEKLY') ok = days.indexOf(p.w) > -1 && Math.floor((d - weekAnchor) / 7) % interval === 0;
        else if (r.FREQ === 'MONTHLY') ok = p.d === sp.d && ((p.y - sp.y) * 12 + p.m - sp.m) % interval === 0;
        else if (r.FREQ === 'YEARLY') ok = p.d === sp.d && p.m === sp.m && (p.y - sp.y) % interval === 0;
        else break;
        if (!ok) continue;
        n++;
        if (e.ex.indexOf(t) > -1 || overridden[e.uid + '|' + t]) continue;
        push(t);
      }
    });
    return res.sort(function (a, b) { return (b.allDay - a.allDay) || (a.start - b.start); });
  }

  /* ---- component ---- */
  function init(root) {
    var sources = root.dataset.sources ? JSON.parse(root.dataset.sources) : [{ key: 'main', label: '', ics: root.dataset.ics, tone: root.dataset.tone || 'sage' }];
    var multi = sources.length > 1, tone = multi ? 'sage' : sources[0].tone;
    var feedUrl = root.dataset.feed || '';
    var srcOf = {}; sources.forEach(function (x) { srcOf[x.key] = x; });
    var label = root.dataset.label || 'カレンダー';
    var now = parts(nowJ());
    var st = { y: now.y, m: now.m, view: 'month', sel: startOfDay(nowJ()), vev: [], place: 'all', type: 'all', loaded: false, failed: false, shown: [] };
    root.classList.add('hy-cal', 'hy-cal--' + tone);
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', label);

    // Title-keyword filters (e.g. 大阪 / 東京) sit after the per-source ones: data-keywords='[{"key","label","kw"}]'.
    var kws = root.dataset.keywords ? JSON.parse(root.dataset.keywords) : [];
    var kwOf = {}; kws.forEach(function (x) { kwOf[x.key] = x; });
    // Two dropdowns that combine: 場所 (title keyword) and 種類 (calendar source).
    function vevs() {
      var k = kwOf[st.place];
      return st.vev.filter(function (e) {
        return (!k || e.title.indexOf(k.kw) >= 0) && (st.type === 'all' || e.src === st.type);
      });
    }
    function monthRange() {
      var first = wall(st.y, st.m, 1), gridStart = first - parts(first).w * D;
      return { first: first, gridStart: gridStart, gridEnd: gridStart + 42 * D };
    }
    function eventsOn(list, day) {
      return list.filter(function (e) { return e.start < day + D && e.end > day && !(e.end <= e.start && startOfDay(e.start) !== day); });
    }
    function timeText(e) { return e.allDay ? '終日' : hm(e.start) + '–' + hm(e.end); }

    function pill(e, i) {
      var past = e.end < nowJ() ? ' is-past' : '';
      return '<button type="button" class="hy-cal__ev' + past + '" data-ev="' + i + '"' + colorStyle(e) + '><span class="hy-cal__ev-t">' + (e.allDay ? '' : esc(hm(e.start) + '–' + hm(e.end))) + '</span><span class="hy-cal__ev-n">' + esc(e.title) + '</span></button>';
    }

    function renderMonth(evs) {
      var r = monthRange(), today = startOfDay(nowJ());
      var h = '<div class="hy-cal__dow" aria-hidden="true">' + WD.map(function (w, i) { return '<div class="' + (i === 0 ? 'is-sun' : i === 6 ? 'is-sat' : '') + '">' + w + '</div>'; }).join('') + '</div><div class="hy-cal__grid">';
      for (var i = 0; i < 42; i++) {
        var day = r.gridStart + i * D, p = parts(day), de = eventsOn(evs, day);
        var cls = 'hy-cal__day' + (p.m !== st.m ? ' is-out' : '') + (day === today ? ' is-today' : '') + (day === st.sel ? ' is-sel' : '') + (de.length ? ' has-ev' : '');
        h += '<div class="' + cls + '" data-day="' + day + '" tabindex="-1"><span class="hy-cal__num">' + p.d + '</span>';
        h += '<div class="hy-cal__evs">' + de.slice(0, 3).map(function (e) { return pill(e, st.shown.indexOf(e)); }).join('') + (de.length > 3 ? '<span class="hy-cal__more">ほか' + (de.length - 3) + '件</span>' : '') + '</div>';
        h += '<div class="hy-cal__dots" aria-hidden="true">' + de.slice(0, 3).map(function (e) { return '<i' + colorStyle(e) + '></i>'; }).join('') + '</div></div>';
      }
      h += '</div>';
      // Small-screen day detail
      var sel = eventsOn(evs, st.sel), sp = parts(st.sel);
      h += '<div class="hy-cal__daylist"><p class="hy-cal__daylist-h">' + (sp.m + 1) + '月' + sp.d + '日（' + WD[sp.w] + '）</p>' +
        (sel.length ? sel.map(function (e) { return '<button type="button" class="hy-cal__row" data-ev="' + st.shown.indexOf(e) + '"' + colorStyle(e) + '><span class="hy-cal__row-t">' + esc(timeText(e)) + '</span><span class="hy-cal__row-n">' + esc(e.title) + '</span></button>'; }).join('') : '<p class="hy-cal__none">この日の予定はありません</p>') + '</div>';
      return h;
    }

    function renderList(evs) {
      var h = '<div class="hy-cal__list">', last = null, n = 0;
      evs.forEach(function (e) {
        var d = startOfDay(Math.max(e.start, st.listFrom));
        if (e.end <= st.listFrom) return;
        n++;
        if (d !== last) {
          if (last !== null) h += '</div></div>';
          var p = parts(d);
          h += '<div class="hy-cal__lday"><div class="hy-cal__ldate' + (d === startOfDay(nowJ()) ? ' is-today' : '') + '"><b>' + p.d + '</b><small>' + (p.m + 1) + '月・' + WD[p.w] + '</small></div><div class="hy-cal__lcards">';
          last = d;
        }
        h += '<button type="button" class="hy-cal__card" data-ev="' + st.shown.indexOf(e) + '"' + colorStyle(e) + '><span class="hy-cal__card-t">' + esc(timeText(e)) + '</span><span class="hy-cal__card-n">' + esc(e.title) + '</span>' + (multi && srcOf[e.src] ? '<span class="hy-cal__card-l">' + esc(srcOf[e.src].label) + '</span>' : '') + (e.loc ? '<span class="hy-cal__card-l">' + esc(e.loc) + '</span>' : '') + '</button>';
      });
      if (last !== null) h += '</div></div>';
      h += '</div>';
      return n ? h : '<p class="hy-cal__empty">これからの予定は、決まり次第お知らせします。</p>';
    }

    function select(name, label, allLabel, items, value) {
      return '<label class="hy-cal__sel"><span>' + label + '</span><select data-sel="' + name + '" aria-label="' + label + '"><option value="all">' + allLabel + '</option>' +
        items.map(function (x) { return '<option value="' + esc(x.key) + '"' + (value === x.key ? ' selected' : '') + '>' + esc(x.label) + '</option>'; }).join('') + '</select></label>';
    }
    function filters() {
      if (!multi && !kws.length) return '';
      return '<div class="hy-cal__filters">' +
        (kws.length ? select('place', '場所', 'すべて', kws, st.place) : '') +
        (multi ? select('type', '種類', 'すべて', sources, st.type) : '') + '</div>';
    }

    function render() {
      var title, evs, body;
      if (st.view === 'month') {
        var r = monthRange(); evs = expand(vevs(), r.gridStart, r.gridEnd); st.shown = evs;
        title = '<span class="hy-cal__year">' + st.y + '年</span>' + (st.m + 1) + '月';
        body = st.failed ? '' : renderMonth(evs);
      } else {
        st.listFrom = startOfDay(nowJ()); evs = expand(vevs(), st.listFrom, st.listFrom + 120 * D); st.shown = evs;
        title = 'これからの予定';
        body = st.failed ? '' : renderList(evs);
      }
      if (st.failed) body = '<p class="hy-cal__empty">カレンダーを読み込めませんでした。時間をおいてもう一度お試しください。</p>';
      else if (!st.loaded) body = '<p class="hy-cal__empty">読み込み中…</p>';
      root.innerHTML =
        '<div class="hy-cal__head"><svg class="hy-cal__leaf" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 42C24 42 8 32 8 18C8 11 14 6 24 6C34 6 40 11 40 18C40 32 24 42 24 42Z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M24 38V14M24 24C20 22 17 19 16 16M24 28C28 26 31 23 32 20" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>' +
        '<h3 class="hy-cal__title" aria-live="polite">' + title + '</h3>' +
        '<div class="hy-cal__nav"><button type="button" class="hy-cal__btn" data-act="prev" aria-label="前へ">‹</button><button type="button" class="hy-cal__btn hy-cal__btn--t" data-act="today">今日</button><button type="button" class="hy-cal__btn" data-act="next" aria-label="次へ">›</button></div>' +
        '<div class="hy-cal__seg" role="group" aria-label="表示切り替え"><button type="button" data-v="month" aria-pressed="' + (st.view === 'month') + '">月</button><button type="button" data-v="list" aria-pressed="' + (st.view === 'list') + '">一覧</button></div></div>' +
        filters() +
        '<div class="hy-cal__body">' + body + '</div><p class="hy-cal__tz">時間は日本時間（JST）です</p>';
    }

    function openEvent(i) {
      var e = st.shown[i]; if (!e) return;
      var p = parts(e.start);
      var when = (p.y) + '年' + (p.m + 1) + '月' + p.d + '日（' + WD[p.w] + '）' + (e.allDay ? ' 終日' : '<br><b>' + hm(e.start) + ' – ' + hm(e.end) + '</b>');
      var desc = e.desc ? '<p class="hy-cal__m-desc">' + esc(e.desc).replace(/https?:\/\/[^\s<]+/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener noreferrer">' + u + '</a>'; }) + '</p>' : '';
      var m = document.createElement('div');
      m.className = 'hy-cal__scrim hy-cal--' + tone;
      var cs = paletteOf(e);
      if (cs) m.setAttribute('style', '--c-deep:' + cs[0] + ';--c-tint:' + cs[1] + ';--c-ink:' + cs[2]);
      m.innerHTML = '<div class="hy-cal__modal" role="dialog" aria-modal="true" aria-label="' + esc(e.title) + '"><div class="hy-cal__m-head">' + (multi && srcOf[e.src] ? '<span class="hy-cal__m-src">' + esc(srcOf[e.src].label) + '</span>' : '') + '<h4>' + esc(e.title) + '</h4><p>' + when + '</p></div><div class="hy-cal__m-body">' +
        (e.loc ? '<p class="hy-cal__m-loc">' + esc(e.loc) + '</p>' : '') + desc + '<button type="button" class="hy-cal__close">閉じる</button></div></div>';
      var prevFocus = document.activeElement;
      function close() { m.remove(); document.removeEventListener('keydown', onKey); if (prevFocus && prevFocus.focus) prevFocus.focus(); }
      function onKey(ev) { if (ev.key === 'Escape') close(); }
      m.addEventListener('click', function (ev) { if (ev.target === m || ev.target.closest('.hy-cal__close')) close(); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(m);
      m.querySelector('.hy-cal__close').focus();
    }

    root.addEventListener('click', function (ev) {
      var t = ev.target;
      var evBtn = t.closest('[data-ev]');
      if (evBtn && (evBtn.closest('.hy-cal__evs') ? matchMedia('(min-width: 720px)').matches : true)) { openEvent(+evBtn.dataset.ev); return; }
      var act = t.closest('[data-act]');
      if (act) {
        var a = act.dataset.act;
        if (a === 'today') { var n = parts(nowJ()); st.y = n.y; st.m = n.m; st.sel = startOfDay(nowJ()); }
        else if (st.view === 'month') { st.m += a === 'next' ? 1 : -1; if (st.m > 11) { st.m = 0; st.y++; } if (st.m < 0) { st.m = 11; st.y--; } st.sel = wall(st.y, st.m, 1); }
        root.classList.remove('is-in'); render(); requestAnimationFrame(function () { root.classList.add('is-in'); });
        return;
      }
      var v = t.closest('[data-v]');
      if (v) { st.view = v.dataset.v; render(); return; }
      var day = t.closest('[data-day]');
      if (day) { st.sel = +day.dataset.day; render(); }
    });

    root.addEventListener('change', function (ev) {
      var sel = ev.target.closest('[data-sel]');
      if (!sel) return;
      st[sel.dataset.sel] = sel.value; render();
      var again = root.querySelector('[data-sel="' + sel.dataset.sel + '"]'); if (again) again.focus();
    });

    render();
    // Lets a [data-cal-filter] button elsewhere on the page pick a calendar filter.
    root.__hySetFilter = function (k) {
      if (k === 'all') { st.place = 'all'; st.type = 'all'; }
      else if (kwOf[k]) { st.place = k; st.type = 'all'; }
      else if (srcOf[k]) { st.type = k; st.place = 'all'; }
      else return;
      render();
    };
    // Live feed (Apps Script). A source with an `ics` path falls back to that file if the feed fails.
    function loadFeed() {
      if (!feedUrl) return Promise.resolve(null);
      var ctrl = window.AbortController ? new AbortController() : null, timer = ctrl && setTimeout(function () { ctrl.abort(); }, 8000);
      var url = feedUrl + (feedUrl.indexOf('?') < 0 ? '?' : '&') + 'cal=' + sources.map(function (x) { return encodeURIComponent(x.key); }).join(',');
      return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (d) { return d && typeof d === 'object' ? d : null; }).catch(function () { return null; })
        .then(function (d) { if (timer) clearTimeout(timer); return d; });
    }
    loadFeed().then(function (feed) { return Promise.all(sources.map(function (x) {
      if (feed && Array.isArray(feed[x.key])) return fromFeed(feed[x.key]).map(function (e) { e.src = x.key; e.tone = x.tone; return e; });
      if (!x.ics) return null;
      return fetch(x.ics).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (txt) {
        return parseICS(txt).map(function (e) { e.src = x.key; e.tone = x.tone; return e; });
      }).catch(function () { return null; });
    })); }).then(function (lists) {
      var ok = lists.filter(Boolean);
      if (!ok.length) { st.failed = true; render(); return; }
      st.vev = [].concat.apply([], ok); st.loaded = true;
      // If this month is empty, jump to the next month that has something.
      if (!expand(st.vev, wall(st.y, st.m, 1), wall(st.y, st.m + 1, 1)).length) {
        for (var k = 1; k <= 6; k++) {
          var y = st.y, m = st.m + k; y += Math.floor(m / 12); m = m % 12;
          if (expand(st.vev, wall(y, m, 1), wall(y, m + 1, 1)).length) { st.y = y; st.m = m; st.sel = wall(y, m, 1); break; }
        }
      }
      render();
    });
  }

  function boot() {
    document.querySelectorAll('[data-hy-cal]').forEach(init);
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cal-filter]');
      var cal = document.querySelector('[data-hy-cal]');
      if (!b || !cal || !cal.__hySetFilter) return;
      e.preventDefault();
      cal.__hySetFilter(b.dataset.calFilter);
      var t = document.getElementById('calendar') || cal;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 96, behavior: 'smooth' });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
