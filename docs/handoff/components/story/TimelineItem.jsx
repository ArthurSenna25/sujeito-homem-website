import React from 'react';

export function TimelineItem({ year, title, children, state, ...rest }) {
  return (
    <li className={`sh-tl-item${state ? ` is-${state}` : ''}`} data-fio-lit="" {...rest}>
      <span className="sh-tl-node" aria-hidden="true" />
      <div>
        <span className="sh-tl-year">{year}</span>
        <h3 className="sh-tl-title">{title}</h3>
        {children && <p className="sh-tl-text">{children}</p>}
      </div>
    </li>
  );
}
