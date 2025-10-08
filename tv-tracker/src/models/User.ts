export type Role = 'admin' | 'user';
export class User { id: string; nom: string; role: Role; constructor(id: string, nom: string, role: Role = 'user') { this.id = id; this.nom = nom; this.role = role; } }
