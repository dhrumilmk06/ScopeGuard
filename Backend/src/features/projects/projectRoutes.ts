import { Router } from 'express';
import { createProjectHandler } from './projectController';

const router = Router();

router.post('/', createProjectHandler);

export default router;
