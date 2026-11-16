/**
 * @startingPoint section="Mobile" subtitle="Barra fixa: Agendar + WhatsApp + Como chegar" viewport="390x240"
 */
export interface MobileCtaBarProps {
  /** Aparece após o hero; false desliza para fora (400ms, ease-corte). */
  visible?: boolean;
  bookLabel?: string;
  onBook?: () => void;
  bookHref?: string;
  whatsappHref?: string;
  routeHref?: string;
  /** Mostra também em ≥768px (previews). */
  force?: boolean;
  /** position:absolute dentro de um mock, em vez de fixed. */
  contained?: boolean;
}
export declare function MobileCtaBar(props: MobileCtaBarProps): JSX.Element;
