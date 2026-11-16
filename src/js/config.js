/* Configuração central — TROCAR aqui. Nenhum segredo no código: chaves via .env (VITE_*), com restrição de domínio. */
export const BOOKING_URL = '';                 // TROCAR: link do AppBarber. Vazio → botões "Agendar" caem no WhatsApp.
export const WHATSAPP = '5517997531959';       // (17) 99753-1959
export const INSTAGRAM = 'https://www.instagram.com/shbarbearia'; // A CONFIRMAR com o cliente
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps/search/?api=1&query=Sujeito+Homem+Barbearia+Jales'; // TROCAR: link direto das avaliações
export const ADDRESS_Q = 'Rua Nova Iorque 1946 Jales SP';
export const DEST = { lat: null, lng: null }; // TROCAR: coordenadas reais; nulas → geocodifica o endereço 1x (mapa.js)
export const ROUTING = { provider: 'ors', key: import.meta.env.VITE_ORS_KEY || '', endpoint: import.meta.env.VITE_ORS_ENDPOINT || '' }; // vazio → rota ilustrativa "demo"
export const A = '/assets/';
export const HAS = { reels: false, cortes: false, historia: false, seq: false }; // TROCAR p/ true quando os arquivos existirem (evita 404)
export const SLOTS = {
  heroPlate: A + 'hero/plate-desktop.webp', heroPlateMobile: A + 'hero/plate-mobile.webp',
  heroFrames: A + 'seq/s1/manifest.json', heroFramesMobile: A + 'seq/s1/manifest.mobile.json',
  equipe: { renan: A + 'equipe/renan-limpa.webp', vitor: A + 'equipe/vitor-limpa.webp', edivaldo: A + 'equipe/edivaldo-limpa.webp' }, // TROCAR: fotos limpas
  trio: A + 'equipe/trio.webp', fachada: A + 'fachada/fachada-real.webp',
};
// HORARIOS — minutos desde 00:00, lidos da fachada. A CONFIRMAR com o cliente.
export const HR = { 0: null, 1: [820, 1180], 2: [520, 1220], 3: [520, 1220], 4: [520, 1220], 5: [520, 1220], 6: [480, 1100] };
export const HOURS = [['Segunda', 1, [820, 1180]], ['Terça a sexta', [2, 3, 4, 5], [520, 1220]], ['Sábado', 6, [480, 1100]], ['Domingo', 0, null]];
