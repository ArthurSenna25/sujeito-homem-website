export type IconName = 'scissors' | 'map-pin' | 'clock' | 'arrow-right' | 'arrow-down' | 'message-circle' | 'phone' | 'check' | 'calendar' | 'navigation' | 'chevron-right' | 'menu' | 'x' | 'star' | 'route';
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  /** px. Padrão 20. */
  size?: number;
  strokeWidth?: number;
  /** Se informado, o ícone vira role="img" com rótulo; senão é decorativo (aria-hidden). */
  title?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
