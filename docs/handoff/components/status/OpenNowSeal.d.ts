/**
 * @startingPoint section="Status" subtitle="Selo Aberto agora, calculado pelo horário de Jales (America/Sao_Paulo)" viewport="700x120"
 */
export interface OpenNowSealProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Data de referência (padrão: agora). */
  now?: Date;
  /** Mapa dia(0=dom)→[abre,fecha] em minutos. Padrão: horários da fachada. */
  schedule?: Record<number, [number, number] | null>;
  /** Força o estado (demos/testes). */
  forceOpen?: boolean;
  showDetail?: boolean;
}
export declare function OpenNowSeal(props: OpenNowSealProps): JSX.Element;
export declare function getOpenStatus(date?: Date, schedule?: OpenNowSealProps['schedule']): { open: boolean; detail: string };
export declare const SH_SCHEDULE: NonNullable<OpenNowSealProps['schedule']>;
