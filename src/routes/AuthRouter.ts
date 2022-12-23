import { Router } from 'express';
import AuthController from '../controllers/AuthController';
const { auth } = require('../middleware/auth');

const router = Router();

router.post('/devicelogin', AuthController.getDevice);
export default router;
