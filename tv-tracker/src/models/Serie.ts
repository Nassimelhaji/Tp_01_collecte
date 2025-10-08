import { Media } from './Media';
import { Season } from './Season';
export class Serie extends Media {
  statut: 'en_attente' | 'en_cours' | 'terminee'; // enumeration(1 parmi les 3 choix)
  saisons: Season[];
  constructor(id: string, titre: string, plateforme: string, userId: string, statut: 'en_attente'|'en_cours'|'terminee', saisons: Season[] = []) {
    super(id, titre, plateforme, userId, 'serie'); this.statut = statut; this.saisons = saisons;
  }
}
