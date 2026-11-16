import React from 'react';
import { Button } from '../core/Button.jsx';

export function BarberCard({ name, role, photo, photoPosition = '50% 30%', specialties = [], onBook, bookHref, ...rest }) {
  const first = name.split(' ')[0];
  return (
    <article className="sh-barber" {...rest}>
      <div className="sh-barber__photo">
        <img src={photo} alt={`${name}, barbeiro da Sujeito Homem`} loading="lazy" style={{ objectPosition: photoPosition }} />
        <div className="sh-barber__id">
          <span className="sh-overline sh-barber__role">{role}</span>
          <h3 className="sh-barber__name">{name}</h3>
        </div>
      </div>
      <div className="sh-barber__body">
        {specialties.length > 0 && <ul className="sh-barber__tags">{specialties.map((s) => <li key={s}>{s}</li>)}</ul>}
        <Button variant="secondary" block icon="calendar" onClick={onBook} href={bookHref}>Agendar com {first}</Button>
      </div>
    </article>
  );
}
