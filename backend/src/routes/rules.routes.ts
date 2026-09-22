import { Router } from 'express';
import { rulesController } from '../controllers/rules.controller';

const router = Router();

router.post('/evaluate', (req, res) => rulesController.evaluateRules(req, res));

export default router;
