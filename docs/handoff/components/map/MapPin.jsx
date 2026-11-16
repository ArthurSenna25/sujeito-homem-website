import React from 'react';

export function MapPin({ label, sublabel, variant = 'destination', showLabel = true, ...rest }) {
  return (
    <div className={`sh-pin sh-pin--${variant}`} {...rest}>
      {showLabel && label && (
        <div className="sh-pin__label">
          <span className="sh-pin__name">{label}</span>
          {sublabel && <span className="sh-pin__sub">{sublabel}</span>}
        </div>
      )}
      <span className="sh-pin__core" data-fio-end={variant === 'destination' ? '' : undefined} role="img" aria-label={label || 'Localização'} />
    </div>
  );
}
