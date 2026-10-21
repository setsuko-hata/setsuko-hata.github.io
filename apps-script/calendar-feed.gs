/**
 * Calendar feed for the Hatha Yoga schedule (setsukohata.com/hatha-yoga/ja/offerings.html).
 *
 * Deploy as a web app owned by events@setsukohata.com (Execute as: Me, Who has access: Anyone).
 * Setup steps are in docs/hatha-yoga-calendar.md. Source of truth for this code is this file;
 * the Apps Script project only holds a pasted copy, so redeploy after changing it.
 *
 * GET <web app url>?cal=online,inperson,special
 *   -> { "online": [ { id, title, start, end, allDay, loc, desc, color }, ... ], ... }
 * start/end are Japan-time wall clock strings ("2026-10-21T17:30:00"); all-day events use
 * midnight start and an exclusive end. `color` is Google's event colour id ("1".."11") or "".
 */

// Short keys the page asks for -> calendar IDs. Add a category here and on the page.
var CALENDARS = {
  online: 'c_5bd1c0c6181ea347f12f89f738d65d0194d9da994d6203d39b0d8aa5bfd6827e@group.calendar.google.com',
  inperson: 'c_c18b30caf2a258b39674caeb09062f1c4bf61d6db96d43d83184767c11b1947a@group.calendar.google.com',
  special: 'c_f58a081ccbc0edefbc76b8609c9c4aaa852024adc1251e062e07864bc2e7b35d@group.calendar.google.com'
};
var TZ = 'Asia/Tokyo';
var DAYS_BACK = 62;      // how far back the feed reaches
var DAYS_AHEAD = 400;    // and forward
var CACHE_SECONDS = 120; // keeps the page fast; edits show up within ~2 minutes

function doGet(e) {
  var wanted = ((e && e.parameter && e.parameter.cal) || Object.keys(CALENDARS).join(',')).split(',');
  var out = {};
  wanted.forEach(function (key) {
    key = key.trim();
    if (CALENDARS.hasOwnProperty(key)) out[key] = readCalendar(key);
  });
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function readCalendar(key) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get('feed:' + key);
  if (cached) return JSON.parse(cached);

  var cal = CalendarApp.getCalendarById(CALENDARS[key]);
  if (!cal) return [];
  var now = new Date();
  var from = new Date(now.getTime() - DAYS_BACK * 864e5);
  var to = new Date(now.getTime() + DAYS_AHEAD * 864e5);

  // getEvents expands repeating events into individual occurrences.
  var events = cal.getEvents(from, to).map(function (ev) {
    var allDay = ev.isAllDayEvent();
    return {
      id: ev.getId() + '|' + ev.getStartTime().getTime(),
      title: ev.getTitle(),
      start: wall(ev.getStartTime()),
      end: wall(allDay ? ev.getEndTime() : ev.getEndTime()),
      allDay: allDay,
      loc: ev.getLocation() || '',
      desc: publicDescription(ev.getDescription()),
      color: ev.getColor() || ''
    };
  });

  try { cache.put('feed:' + key, JSON.stringify(events), CACHE_SECONDS); } catch (err) { /* too big to cache: fine */ }
  return events;
}

function wall(date) {
  return Utilities.formatDate(date, TZ, "yyyy-MM-dd'T'HH:mm:ss");
}

// The feed is public: drop meeting invites (Zoom / Google Meet links, IDs, passcodes) from descriptions.
function publicDescription(text) {
  var s = String(text || '');
  s = s.replace(/[^\n]*(scheduled Zoom meeting|Join Zoom Meeting|zoom\.us)[\s\S]*$/i, '');
  s = s.replace(/Google Meet[\s\S]*$/i, '').replace(/-::~[\s\S]*$/, '');
  return s.trim();
}
