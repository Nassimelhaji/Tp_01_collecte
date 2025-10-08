import { Request, Response, NextFunction } from 'express';
const titreRe = /^[A-Za-z0-9 ]+$/;
const plateformeRe = /^[A-Za-z]+$/;

export function validateMediaPayload(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  if (!body.titre || typeof body.titre !== 'string' || !titreRe.test(body.titre))
    return res.status(400).json({ error: 'titre invalide (lettres, chiffres, espaces seulement)' });
  if (!body.plateforme || typeof body.plateforme !== 'string' || !plateformeRe.test(body.plateforme))
    return res.status(400).json({ error: 'plateforme invalide (lettres seulement)' });
  if (!body.userId || typeof body.userId !== 'string') return res.status(400).json({ error: 'userId requis' });

  if (body.type === 'film') {
    const duree = Number(body.duree);
    if (!Number.isInteger(duree) || duree <= 0) return res.status(400).json({ error: 'durée doit être entier positif' });
    const currentYear = new Date().getFullYear();
    const annee = Number(body.annee);
    if (!Number.isInteger(annee) || annee > currentYear) return res.status(400).json({ error: 'année invalide' });
  }
  if (body.type === 'serie') {
    const statut = body.statut;
    if (!['en_attente','en_cours','terminee'].includes(statut)) return res.status(400).json({ error: 'statut invalide' });
  }
  next();
}

export function validateSeasonPayload(req: Request, res: Response, next: NextFunction) {
  const { serieId, numero } = req.body;
  if (!serieId || typeof serieId !== 'string') return res.status(400).json({ error: 'serieId requis' });
  if (!Number.isInteger(numero) || numero <= 0) return res.status(400).json({ error: 'numero saison invalide' });
  next();
}

export function validateEpisodePayload(req: Request, res: Response, next: NextFunction) {
  const { seasonNumero, serieId, titre, numero, duree } = req.body;
  if (!serieId || typeof serieId !== 'string') return res.status(400).json({ error: 'serieId requis' });
  if (!Number.isInteger(numero) || numero <= 0) return res.status(400).json({ error: 'numero episode invalide' });
  if (!Number.isInteger(duree) || duree <= 0) return res.status(400).json({ error: 'duree invalide' });
  if (!titre || typeof titre !== 'string') return res.status(400).json({ error: 'titre requis' });
  next();
}
