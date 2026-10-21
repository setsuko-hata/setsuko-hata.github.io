// Downloads the public Google calendars to public/hatha-yoga/calendars/*.ics and tags each
// event with X-HY-COLOR (Google's colorId), which the public .ics feed leaves out.
// Needs GOOGLE_CALENDAR_API_KEY for colours; without it the plain .ics is still saved.
// On any failure the committed copy is left untouched.
import { writeFileSync, existsSync } from 'node:fs';

const CALENDARS = {
  online: 'c_5bd1c0c6181ea347f12f89f738d65d0194d9da994d6203d39b0d8aa5bfd6827e',
  inperson: 'c_c18b30caf2a258b39674caeb09062f1c4bf61d6db96d43d83184767c11b1947a',
  special: 'c_f58a081ccbc0edefbc76b8609c9c4aaa852024adc1251e062e07864bc2e7b35d',
};
const key = process.env.GOOGLE_CALENDAR_API_KEY;
const enc = (id) => encodeURIComponent(`${id}@group.calendar.google.com`);

async function colorsFor(id) {
  const map = new Map();
  let pageToken = '';
  do {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${enc(id)}/events?maxResults=2500&key=${key}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Calendar API ${res.status}`);
    const data = await res.json();
    for (const ev of data.items ?? []) {
      if (!ev.colorId || !ev.iCalUID) continue;
      if (!ev.recurringEventId || !map.has(ev.iCalUID)) map.set(ev.iCalUID, ev.colorId);
    }
    pageToken = data.nextPageToken ?? '';
  } while (pageToken);
  return map;
}

for (const [name, id] of Object.entries(CALENDARS)) {
  const out = `public/hatha-yoga/calendars/${name}.ics`;
  try {
    const res = await fetch(`https://calendar.google.com/calendar/ical/${enc(id)}/public/basic.ics`);
    if (!res.ok) throw new Error(`ics ${res.status}`);
    let ics = await res.text();
    if (!ics.includes('BEGIN:VCALENDAR')) throw new Error('not an ics file');
    if (key) {
      let colors = new Map();
      try {
        colors = await colorsFor(id);
      } catch (err) {
        console.log(`no colours for ${name} (${err.message}); using plain events`);
      }
      ics = ics.replace(/\r?\n[ \t]/g, '').replace(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g, (block, body) => {
        const uid = body.match(/^UID:(.*)$/m)?.[1]?.trim();
        const c = colors.get(uid);
        return c ? `BEGIN:VEVENT\nX-HY-COLOR:${c}\n${body}END:VEVENT` : block;
      });
    }
    writeFileSync(out, ics);
    console.log(`saved ${out}`);
  } catch (err) {
    console.log(`kept committed ${out} (${err.message})`);
    if (!existsSync(out)) process.exitCode = 1;
  }
}
