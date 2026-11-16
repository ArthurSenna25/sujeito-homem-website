/**
 * @startingPoint section="Agendamento" subtitle="Chip de serviço selecionável" viewport="700x200"
 */
export interface ServiceChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  label: string;
  /** Detalhe secundário (duração, combo). */
  meta?: string;
  selected?: boolean;
  disabled?: boolean;
  onToggle?: (next: boolean) => void;
}
export declare function ServiceChip(props: ServiceChipProps): JSX.Element;
