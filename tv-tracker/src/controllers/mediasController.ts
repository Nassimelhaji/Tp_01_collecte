import { Request, Response } from 'express';
import { dbService } from '../services/dbService';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

// GET /api/medias?type=serie&genre=drama&year=2020
export async function listMedias(req: Request, res: Response) {
  const { type, genre, year } = req.query;
  let medias = await dbService.getAllMedias();
  if (type) medias = medias.filter(m => m.type === type);
  if (genre) medias = medias.filter(m => m.genre === genre);
  if (year) medias = medias.filter(m => Number(m.annee) === Number(year));
  res.json(medias);
}

export async function getMediaById(req: Request, res: Response) {
  const media = await dbService.getMediaById(req.params.id);
  if (!media) return res.status(404).json({ error: 'Media not found' });
  res.json(media);
}

export async function createMedia(req: Request, res: Response) {
  const payload = req.body;
  const id = uuidv4();
  const media = { id, ...payload };
  await dbService.addMedia(media);
  logger.info(`CREATE media ${id} by user ${(req as any).user?.id}`);
  res.status(201).json(media);
}

export async function updateMedia(req: Request, res: Response) {
  const updated = await dbService.updateMedia(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Media not found' });
  logger.info(`UPDATE media ${req.params.id} by user ${(req as any).user?.id}`);
  res.json(updated);
}

export async function deleteMedia(req: Request, res: Response) {
  const ok = await dbService.deleteMedia(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Media not found' });
  logger.info(`DELETE media ${req.params.id} by user ${(req as any).user?.id}`);
  res.json({ success: true });
}

// POST /api/seasons { serieId, numero }
export async function addSeason(req: Request, res: Response) {
  const { serieId, numero } = req.body;
  const serie = await dbService.getMediaById(serieId);
  if (!serie || serie.type !== 'serie') return res.status(404).json({ error: 'Serie not found' });
  serie.saisons = serie.saisons || [];
  // check duplicate
  if (serie.saisons.find((s: any) => s.numero === numero)) return res.status(400).json({ error: 'Saison déjà existante' });
  serie.saisons.push({ numero, episodes: [] });
  await dbService.updateMedia(serieId, serie);
  logger.info(`ADD season ${numero} to serie ${serieId}`);
  res.status(201).json(serie);
}

// POST /api/episodes { serieId, seasonNumero, titre, numero, duree }
export async function addEpisode(req: Request, res: Response) {
  const { serieId, seasonNumero, titre, numero, duree } = req.body;
  const serie = await dbService.getMediaById(serieId);
  if (!serie || serie.type !== 'serie') return res.status(404).json({ error: 'Serie not found' });
  const saison = (serie.saisons || []).find((s: any) => s.numero === seasonNumero);
  if (!saison) return res.status(404).json({ error: 'Saison non trouvée' });
  const id = uuidv4();
  const episode = { id, titre, numero, duree, watched: false };
  saison.episodes.push(episode);
  await dbService.updateMedia(serieId, serie);
  logger.info(`ADD episode ${id} to serie ${serieId} season ${seasonNumero}`);
  res.status(201).json(episode);
}

// PATCH /api/episodes/:id { watched: true }
export async function patchEpisodeWatched(req: Request, res: Response) {
  const episodeId = req.params.id;
  const { watched } = req.body;
  const medias = await dbService.getAllMedias();
  for (const m of medias) {
    if (m.type === 'serie' && Array.isArray(m.saisons)) {
      for (const s of m.saisons) {
        const ep = (s.episodes || []).find((e: any) => e.id === episodeId);
        if (ep) {
          ep.watched = !!watched;
          await dbService.updateMedia(m.id, m);
          logger.info(`PATCH episode ${episodeId} watched=${ep.watched}`);
          return res.json(ep);
        }
      }
    }
  }
  res.status(404).json({ error: 'Episode not found' });
}

export async function getEpisodesOfSeries(req: Request, res: Response) {
  const serie = await dbService.getMediaById(req.params.id);
  if (!serie || serie.type !== 'serie') return res.status(404).json({ error: 'Serie not found' });
  const episodes: any[] = [];
  for (const s of serie.saisons || []) {
    for (const e of s.episodes || []) {
      episodes.push({ season: s.numero, ...e });
    }
  }
  res.json(episodes);
}

export async function getUserMedias(req: Request, res: Response) {
  const userId = req.params.id;
  const medias = await dbService.getUserMedias(userId);
  res.json(medias);
}

export async function getLastAction(req: Request, res: Response) {
  const fs = await import('fs/promises');
  const path = await import('path');
  const logsPath = path.join(process.cwd(), 'logs', 'actions.log');
  try {
    const raw = await fs.readFile(logsPath, 'utf-8');
    const lines = raw.trim().split('\n').filter(Boolean);
    const last = lines[lines.length - 1] || null;
    res.json({ last });
  } catch (err) {
    res.status(500).json({ error: 'Unable to read logs' });
  }
}
