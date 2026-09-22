import { Router } from 'express';
import { lookbooksController } from '../controllers/lookbooks.controller';

const router = Router();

router.post('/', (req, res) => lookbooksController.createLookbook(req, res));
router.get('/:id', (req, res) => lookbooksController.getLookbookById(req, res));

export default router;
