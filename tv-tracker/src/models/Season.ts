import { Episode } from './Episode';
export class Season {
  numero: number;
  episodes: Episode[];
  constructor(numero: number, episodes: Episode[] = []) { this.numero = numero; this.episodes = episodes; }
}
