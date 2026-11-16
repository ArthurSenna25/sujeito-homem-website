import type { IconName } from './Icon';

/**
 * @startingPoint section="Ações" subtitle="Primário (ouro) e secundário (contorno)" viewport="700x200"
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** primary = ouro (1 por tela); secondary = contorno. */
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconAfter?: IconName;
  /** Linha de luz varre a base do botão; clique ignorado. */
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  /** Quadrado 44×44 só com ícone — exige aria-label. */
  iconOnly?: boolean;
  /** Renderiza <a> em vez de <button>. */
  href?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
