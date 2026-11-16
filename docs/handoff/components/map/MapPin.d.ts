/**
 * @startingPoint section="Mapa" subtitle="Pin de destino: o fio da navalha termina nele" viewport="700x240"
 */
export interface MapPinProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  sublabel?: string;
  /** destination = ouro com pulso (alvo do fio); origin = vazado, ardósia. */
  variant?: 'destination' | 'origin';
  showLabel?: boolean;
}
export declare function MapPin(props: MapPinProps): JSX.Element;
