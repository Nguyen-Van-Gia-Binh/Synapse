import { Router } from 'express';
import { itemsController } from '../controllers/items.controller';

const router = Router();

router.get('/', (req, res) => itemsController.getItems(req, res));
router.get('/:id', (req, res) => itemsController.getItemById(req, res));
router.get('/:id/facts', (req, res) => itemsController.getCulturalFact(req, res));

export default router;
