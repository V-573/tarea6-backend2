import { Router } from 'express';
import healthRouter from './health.router.js';
import eventRouter from './events.router.js';
import sessionRouter from './sessions.router.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/events', eventRouter);
router.use('/sessions', sessionRouter);

export default router;