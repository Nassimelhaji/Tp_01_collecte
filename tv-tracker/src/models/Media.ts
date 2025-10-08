export abstract class Media {
  id: string;
  titre: string;
  plateforme: string;
  userId: string;
  type: 'film' | 'serie' | 'mini-serie'; // énumeration(1 choix parmi les 3)

  constructor(id: string, titre: string, plateforme: string, userId: string, type: 'film' | 'serie' | 'mini-serie') {
    this.id = id;
    this.titre = titre;
    this.plateforme = plateforme;
    this.userId = userId;
    this.type = type;
  }
}
