import React from 'react';
import { Icon } from './Icon.jsx';

export function Button({
  variant = 'primary', size = 'md', icon, iconAfter, loading = false, disabled = false,
  block = false, iconOnly = false, href, children, className = '', ...rest
}) {
  const cls = ['sh-btn', `sh-btn--${variant}`, size !== 'md' && `sh-btn--${size}`, block && 'sh-btn--block',
    iconOnly && 'sh-btn--icon', loading && 'is-loading', className].filter(Boolean).join(' ');
  const inner = (
    <>
      {icon && <Icon name={icon} size={size === 'lg' ? 22 : 18} />}
      {!iconOnly && children}
      {iconAfter && <Icon name={iconAfter} size={size === 'lg' ? 22 : 18} />}
    </>
  );
  if (href && !disabled) return <a className={cls} href={href} aria-busy={loading || undefined} {...rest}>{inner}</a>;
  return (
    <button type="button" className={cls} disabled={disabled} aria-busy={loading || undefined} {...rest}>{inner}</button>
  );
}
