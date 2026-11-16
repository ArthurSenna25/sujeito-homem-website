import React from 'react';
import { Button } from '../core/Button.jsx';

export function MobileCtaBar({ visible = true, bookLabel = 'Agendar horário', onBook, bookHref, whatsappHref, routeHref, force = false, contained = false }) {
  return (
    <nav aria-label="Ações rápidas" className={`sh-cta-bar${visible ? '' : ' is-hidden'}${force ? ' sh-cta-bar--force' : ''}${contained ? ' sh-cta-bar--static' : ''}`}>
      <Button icon="calendar" onClick={onBook} href={bookHref}>{bookLabel}</Button>
      <Button variant="secondary" iconOnly icon="message-circle" href={whatsappHref} aria-label="Chamar no WhatsApp" />
      <Button variant="secondary" iconOnly icon="navigation" href={routeHref} aria-label="Como chegar" />
    </nav>
  );
}
