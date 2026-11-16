import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function ServiceChip({ label, meta, selected = false, disabled = false, onToggle, ...rest }) {
  return (
    <button
      type="button" role="checkbox" aria-checked={selected} disabled={disabled}
      className="sh-chip" data-fio-lit={rest['data-fio-lit']}
      onClick={() => onToggle && onToggle(!selected)} {...rest}
    >
      <span className="sh-chip__tick" aria-hidden="true"><Icon name="check" size={16} strokeWidth={2.25} /></span>
      <span>{label}</span>
      {meta && <span className="sh-chip__meta">{meta}</span>}
    </button>
  );
}
