import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './storage/db.js';
import { syncModels } from './storage/models/index.js';
import authRouter from './web/auth.routes.js';
import categoriesRouter from './web/categories.routes.js';
import offersRouter from './web/offers.routes.js';
import shopsRouter from './web/shops.routes.js';
import meRouter from './web/me.routes.js';
import areasRouter from './web/areas.routes.js';
import contactRouter from './web/contact.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'localoot-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/offers', offersRouter);
app.use('/api/shops', shopsRouter);
app.use('/api/me', meRouter);
app.use('/api/contact', contactRouter);
app.use('/api/areas', areasRouter);

// Ensure DB connection initializes early and sync models in dev
await sequelize.authenticate();
await syncModels();

export default app;


