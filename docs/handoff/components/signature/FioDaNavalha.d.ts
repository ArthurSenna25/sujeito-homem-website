/**
 * @startingPoint section="Assinatura" subtitle="O fio da navalha — linha de luz desenhada pelo scroll, termina na rota até o endereço" viewport="1280x800"
 */
export interface FioDaNavalhaProps extends React.SVGAttributes<SVGSVGElement> {
  /** 0–1 fixo (specimens/diagramas). Sem isso, segue o scroll. */
  progress?: number;
  /** Largura do contêiner abaixo da qual vale o modo mobile (trilho de 12px, sem desvio de espinha). Padrão 768. */
  breakpoint?: number;
  strokeWidth?: number;
  /** Ponto da viewport (0–1 da altura) onde a ponta do fio “cai”. Padrão 0.55. */
  anchor?: number;
  /** Seletores dos pontos de passagem. Padrões: [data-fio-stop] (valores: rail | spine | route; data-fio-y = offset do nó), [data-fio-spine], [data-fio-end], [data-fio-lit]. */
  stopSelector?: string;
  spineSelector?: string;
  endSelector?: string;
  litSelector?: string;
}
export declare function FioDaNavalha(props: FioDaNavalhaProps): JSX.Element;
