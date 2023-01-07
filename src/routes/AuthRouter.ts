import { Router } from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/AuthController';

const router = Router();

//* [POST] 유저 정보 입력
router.post('/',
    [body("gender").notEmpty(), body("age").notEmpty(), body("tempSens").notEmpty(),
    body("wakeUpTime").notEmpty(), body("goOutTime").notEmpty(),
    body("goHomeTime").notEmpty(), body("deviceToken").notEmpty()],
    AuthController.createUser);

export default router;
