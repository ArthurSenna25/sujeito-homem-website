import React from 'react';

const M = (h, m = 0) => h * 60 + m;
// Horários lidos na fachada — confirmar com o cliente. 0 = domingo.
export const SH_SCHEDULE = {
  0: null,
  1: [M(13, 40), M(19, 40)],
  2: [M(8, 40), M(20, 20)], 3: [M(8, 40), M(20, 20)], 4: [M(8, 40), M(20, 20)], 5: [M(8, 40), M(20, 20)],
  6: [M(8), M(18, 20)],
};
const DAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const fmt = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

function spNow(date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, min: +get('hour') * 60 + +get('minute') };
}

export function getOpenStatus(date = new Date(), schedule = SH_SCHEDULE) {
  const { day, min } = spNow(date);
  const today = schedule[day];
  if (today && min >= today[0] && min < today[1]) return { open: true, detail: `até ${fmt(today[1])}` };
  if (today && min < today[0]) return { open: false, detail: `abre hoje ${fmt(today[0])}` };
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (schedule[d]) return { open: false, detail: `abre ${i === 1 ? 'amanhã' : DAYS[d]} ${fmt(schedule[d][0])}` };
  }
  return { open: false, detail: '' };
}

export function OpenNowSeal({ now, schedule, forceOpen, showDetail = true, ...rest }) {
  const s = forceOpen === undefined ? getOpenStatus(now || new Date(), schedule) : { open: forceOpen, detail: forceOpen ? 'até 20:20' : 'abre amanhã 08:40' };
  return (
    <span className={`sh-seal${s.open ? '' : ' sh-seal--closed'}`} role="status" {...rest}>
      <span className="sh-seal__dot" aria-hidden="true" />
      <span>{s.open ? 'Aberto agora' : 'Fechado agora'}</span>
      {showDetail && s.detail && <span className="sh-seal__detail">· {s.detail}</span>}
    </span>
  );
}
