import { Router } from 'express';
import * as mediasCtrl from '../controllers/mediasController';
import { mockAuth, requireAdmin } from '../middlewares/auth';
import { validateMediaPayload, validateSeasonPayload, validateEpisodePayload } from '../middlewares/validate';

const router = Router();
router.use(mockAuth);

router.get('/medias', mediasCtrl.listMedias);
router.get('/medias/:id', mediasCtrl.getMediaById);
router.post('/medias', requireAdmin, validateMediaPayload, mediasCtrl.createMedia);
router.put('/medias/:id', requireAdmin, validateMediaPayload, mediasCtrl.updateMedia);
router.delete('/medias/:id', requireAdmin, mediasCtrl.deleteMedia);

router.post('/films', requireAdmin, validateMediaPayload, (req, res) => { req.body.type = 'film'; return mediasCtrl.createMedia(req, res); });
router.post('/series', requireAdmin, validateMediaPayload, (req, res) => { req.body.type = 'serie'; return mediasCtrl.createMedia(req, res); });

router.post('/seasons', requireAdmin, validateSeasonPayload, mediasCtrl.addSeason);
router.post('/episodes', requireAdmin, validateEpisodePayload, mediasCtrl.addEpisode);
router.patch('/episodes/:id', mediasCtrl.patchEpisodeWatched);

router.get('/series/:id/episodes', mediasCtrl.getEpisodesOfSeries);
router.get('/users/:id/medias', mediasCtrl.getUserMedias);

router.get('/logs', mediasCtrl.getLastAction);

export default router;
