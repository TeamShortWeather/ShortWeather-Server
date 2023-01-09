import { NextFunction, Request, Response } from 'express';
import jwtHandler from './jwtHandler';
import util from './util';
import rm from '../modules/responseMessage';
import sc from '../modules/statusCode';
import { JwtPayload } from 'jsonwebtoken';
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../modules/jwt');

export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ").reverse()[0]; //? Bearer ~~ 에서 토큰만 파싱
  if (!token) return res.status(sc.UNAUTHORIZED).send(util.fail(sc.UNAUTHORIZED, rm.TOKEN_EMPTY));

  try {
    const decoded = jwtHandler.verify(token); //? jwtHandler에서 만들어둔 verify로 토큰 검사

    //? 토큰 에러 분기 처리
    if (decoded === TOKEN_EXPIRED)
      return res.status(sc.UNAUTHORIZED).send(util.fail(sc.UNAUTHORIZED, rm.TOKEN_EXPIRED));
    if (decoded === TOKEN_INVALID)
      return res.status(sc.UNAUTHORIZED).send(util.fail(sc.UNAUTHORIZED, rm.TOKEN_INVALID));

    //? decode한 후 담겨있는 userId를 꺼내옴
    const userId: number = (decoded as JwtPayload).userId;
    if (!userId) return res.status(sc.UNAUTHORIZED).send(util.fail(sc.UNAUTHORIZED, rm.TOKEN_INVALID));

    //? 얻어낸 userId 를 Request Body 내 userId 필드에 담고, 다음 미들웨어로 넘김( next() )
    req.body.userId = userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(util.fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};
