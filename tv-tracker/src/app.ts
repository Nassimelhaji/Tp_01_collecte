import express from 'express';
import routes from './routes';
import { error } from './middlewares/error';
import { logger } from './utils/logger';

const app = express();
app.use(express.json());

app.use((req, res, next) => { logger.info(`${req.method} ${req.url}`); next(); });

app.use('/api', routes);
app.get('/', (req, res) => res.send('tv-tracker API is running'));
app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { logger.info(`Server started on port ${PORT}`); console.log(`Server started on port ${PORT}`); });

export default app;
