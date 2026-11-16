/**
 * @startingPoint section="Equipe" subtitle="Cartão de barbeiro com foto, especialidades e agendamento" viewport="700x560"
 */
export interface BarberCardProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  /** Ex.: "Fundador", "Barbeiro". */
  role: string;
  photo: string;
  /** object-position do recorte (padrão 50% 30%). */
  photoPosition?: string;
  specialties?: string[];
  onBook?: () => void;
  bookHref?: string;
}
export declare function BarberCard(props: BarberCardProps): JSX.Element;
