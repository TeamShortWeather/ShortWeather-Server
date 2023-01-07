import { Router } from 'express';
import { body, header } from 'express-validator';
import AuthController from '../controllers/AuthController';

const router = Router();

//* [GET] 유저 등록 조회 /auth/login
router.get('/login', [header("deviceToken").notEmpty()], AuthController.getUserByDevice);

//* [POST] 유저 정보 입력 /auth
router.post('/',
    [body("gender").notEmpty(), body("age").notEmpty(), body("tempSens").notEmpty(),
    body("wakeUpTime").notEmpty(), body("goOutTime").notEmpty(),
    body("goHomeTime").notEmpty(), body("deviceToken").notEmpty()],
    AuthController.createUser);

export default router;
