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

// const authToken = async (req: Request, res: Response) => {
//   const { accesstoken, refreshtoken } = req.headers;

//   //accesstoken 또는 refreshtoken이 없다면 Token이 비었다는 것을 반환
//   if (!accesstoken || !refreshtoken) {
//     return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.TOKEN_EMPTY));
//   }

//   let client;

//   try {
//     client = await dbConfig.connect(req);

//     //accesstoken 검증
//     const decodedToken = jwtHandler.verify(accesstoken);

//     //token이 유효하지 않다면
//     if (decodedToken === TOKEN_INVALID) {
//       return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_INVALID));
//     }

//     //token 만료 검증
//     if (decodedToken === TOKEN_EXPIRED) {
//       //accessToken 이 만료됐을 때
//       //refreshtoken 검증
//       const refresh = jwtHandler.verify(refreshtoken);

//       //refreshtoken이 유효하지 않으면
//       if (refresh === TOKEN_INVALID) {
//         return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.TOKEN_INVALID));
//       }
//       //refreshtoken이 만료됐고, decodedToken 에서의 accesstoken이 만료됐다면 모든 토큰 만료
//       if (refresh === TOKEN_EXPIRED) {
//         return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, message.ALL_TOKEN_EXPIRED));
//       }

//       //토큰 만료가 되지 않았다면, user의 refreshToken으로 유저를 조회한다.
//       const user = await AuthService.getUserByRfToken(client, refreshtoken);

//       // accesstoken 과 refreshToken을 재발급하기
//       const accesstoken = jwtHandler.sign(user);
//       const refreshToken = jwtHandler.createRefresh(user);

//       return res.status(statusCode.OK).send(
//         util.success(statusCode.OK, message.CREATE_TOKEN, {
//           accesstoken,
//           refreshToken,
//         }),
//       );
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
//   } finally {
//     client.release();
//   }
// };

// export default {
//   authToken,
// };
