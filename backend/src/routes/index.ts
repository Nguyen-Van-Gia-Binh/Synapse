import { Router } from 'express';
import itemsRoutes from './items.routes';
import rulesRoutes from './rules.routes';
import lookbooksRoutes from './lookbooks.routes';

const router = Router();

router.use('/items', itemsRoutes);
router.use('/rules', rulesRoutes);
router.use('/lookbooks', lookbooksRoutes);

export default router;
