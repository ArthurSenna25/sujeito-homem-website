/**
 * @startingPoint section="História" subtitle="Item de linha do tempo — o nó acende quando o fio passa" viewport="700x420"
 */
export interface TimelineItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  year: string;
  title: string;
  children?: React.ReactNode;
  /** past = ouro aceso; current = ouro + brilho; future = vazado. Sem `state`, o nó acende sozinho quando o fio da navalha o alcança (data-lit). */
  state?: 'past' | 'current' | 'future';
}
export declare function TimelineItem(props: TimelineItemProps): JSX.Element;
