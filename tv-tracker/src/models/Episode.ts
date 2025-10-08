export class Episode {
  id: string;
  titre: string;
  numero: number;
  duree: number;
  watched?: boolean;
  constructor(id: string, titre: string, numero: number, duree: number, watched = false) {
    this.id = id; this.titre = titre; this.numero = numero; this.duree = duree; this.watched = watched;
  }
}
